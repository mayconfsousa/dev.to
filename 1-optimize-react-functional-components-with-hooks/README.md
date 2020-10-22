# Optimize React functional components with Hooks

`react`, `javascript`, `typescript`, `webdev`

There's no doubt that [Hooks](https://reactjs.org/docs/hooks-reference.html) are one of the most exciting features of the last [React](https://reactjs.org) updates. They let we work in a project without writing class-based components, allowing use of state and other features.

One important concern that we have to do when developing applications, in general, is performance.

React already has a ["diffing"](https://reactjs.org/docs/reconciliation.html) algorithm to avoid unnecessary DOM render, but in some cases, we want to avoid unnecessary executions of the component's `render function` to increase performance. In the case of functional components, `render function` is itself.

I created the following project to demonstrate how we can optimize React functional components with Hooks:

## 1. The application

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/4xr7vj9uhtlv57xyw4rz.png)

This application is simple!

* `Home` is the root component;
* `Component1` displays the current `name`;
* `Component2` displays the current `surname`;
* The root component has a input field for `name` and another for `surname`;
* The root component stores the `name` and `surname` in a local state (using `useState` hook);
* The root component pass down the property `name` to `Component1` and `surname` to `Component2`;

> Code:

```tsx
// ./src/pages/index.tsx

import React, { useState } from 'react';

import { Component1, Component2 } from '../components';

export default function Home() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  return (
    <div className="container">
      <label>Name: </label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>Surname: </label>
      <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
      <Component1 name={name} />
      <Component2 surname={surname} />
    </div>
  );
}
```

```tsx
// ./src/components/Component1.tsx

import React from 'react';

interface Props {
  name: string;
}

export default function Component1({ name }: Props) {
  console.log('Component1 :: render', { name });

  return (
    <div>
      <label>Component1: </label>
      <p>Name: {name}</p>
    </div>
  );
}
```

```tsx
// ./src/components/Component2.tsx

import React from 'react';

interface Props {
  surname: string;
}

export default function Component2({ surname }: Props) {
  console.log('Component2 :: render', { surname });

  return (
    <div>
      <label>Component2: </label>
      <p>Surname: {surname}</p>
    </div>
  );
}
```

## 2. The first problem

I put a `console.log` in the `Component1` and `Component2` to print the properties on them.

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/f5045w7lk1wosspvxb8p.png)

So, after typing my name, see what happened!

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/25b4sce5pffre4ban434.png)

`Component2` prints the `console.log` message indicating that it was executed unnecessary. The `surname` property value is empty all the time.

### 2.1. Solution

To resolve this problem, we just need to use [React.memo](https://reactjs.org/docs/react-api.html#reactmemo)!

`React.memo` is a [higher-order component](https://reactjs.org/docs/higher-order-components.html) and it allows a component to be rendered only if the properties are changed.

```tsx
// ./src/components/Component2.tsx

...

function Component2({ surname }: Props) {
  ...
}

export default React.memo(Component2);
```

So, after the change...

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/anax0kjgbeg91hho8qoc.png)

## 3. The second problem

See what happened when I added a property `data` of the type `object` in the `Component2`.

```tsx
// ./src/components/Component2.tsx

import React from 'react';

interface Props {
  surname: string;
  data: Record<string, unknown>;
}

function Component2({ surname, data }: Props) {
  console.log('Component2 :: render', { surname, data });

  return (
    <div>
      <label>Component2: </label>
      <p>Surname: {surname}</p>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}

export default React.memo(Component2);
```

```tsx
// ./src/pages/index.tsx

...

<Component2 surname={surname} data={{}} />
```

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/o063v7qfrkw8hc2q1mqv.png)

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/t4rlohfjirjlf4nz052g.png)

`Component2` prints the `console.log` message indicating that it was executed unnecessary.

AGAIN !!!

Even if I declare the following way, same problem occurs...

```tsx
// ./src/pages/index.tsx

...

const data = {};

...

<Component2 surname={surname} data={data} />
```

Why ???

How to resolve this?

### 3.1. Solution

One thing about `React.memo` is that, by default, it will only shallowly compare complex objects in the props object.

Well, every time that the root component renders because state changes, a new instance of object `{}` was created and pass down to `Component2`. The shallow comparison of the `React.memo` detects that the object is different and re-render the `Component2`.

To resolve this problem, React provides a hook called [useMemo](https://reactjs.org/docs/hooks-reference.html#usememo). This function receives two arguments, a "create" function and an array of dependencies. `useMemo` will only execute the "create" function to return a new instance of the data when one of the dependencies has changed.

Let's update the code...

```tsx
// ./src/pages/index.tsx

import React, { useMemo, useState } from 'react';

...

const data = useMemo(() => ({ surname }), [surname]);

...

<Component2 surname={surname} data={data} />
```

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/anax0kjgbeg91hho8qoc.png)

It's all OK now!

## 4. The last problem

See what happened when I added a property `func` of the type `function` in the `Component2`.

```tsx
// ./src/components/Component2.tsx

import React from 'react';

interface Props {
  surname: string;
  data: Record<string, unknown>;
  func: () => void;
}

function Component2({ surname, data, func }: Props) {
  console.log('Component2 :: render', { surname, data, func });

  return (
    <div>
      <label>Component2: </label>
      <p>Surname: {surname}</p>
      <p>Data: {JSON.stringify(data)}</p>
    </div>
  );
}

export default React.memo(Component2);
```

```tsx
// ./src/pages/index.tsx

...

<Component2 surname={surname} data={data} func={() => undefined} />
```

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/o063v7qfrkw8hc2q1mqv.png)

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/wmudnjovlriiyi9tztiz.png)

`Component2` still prints the `console.log` message...

The reason is the same as the previous topic. A new instance of the passed function is created every time that the state changes.

### 4.1. Solution

To resolve this problem, React provides a hook called [useCallback](https://reactjs.org/docs/hooks-reference.html#usecallback). This function receives two arguments, a function and an array of dependencies. The operation is similiar to `useMemo`. `useCallback` will only create a new instance of the function when one of the dependencies has changed.

The final code...

```tsx
import React, { useCallback, useMemo, useState } from 'react';

import { Component1, Component2 } from '../components';

export default function Home() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  const data = useMemo(() => ({ surname }), [surname]);

  const func = useCallback(() => undefined, []);

  return (
    <div className="container">
      <label>Name: </label>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <label>Surname: </label>
      <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} />
      <Component1 name={name} />
      <Component2 surname={surname} data={data} func={func} />
    </div>
  );
}
```

![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/anax0kjgbeg91hho8qoc.png)

That's all folks!