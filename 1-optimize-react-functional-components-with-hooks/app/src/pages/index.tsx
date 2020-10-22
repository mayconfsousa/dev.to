import React, { useState } from 'react';

import { Component1, Component2 } from '../components';

export default function Home() {
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');

  // const data = useMemo(() => ({ surname }), [surname]);

  // const func = useCallback(() => undefined, []);

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
