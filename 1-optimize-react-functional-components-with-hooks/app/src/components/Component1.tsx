import React from 'react';

interface Props {
  name: string;
}

function Component1({ name }: Props) {
  console.log('Component1 :: render', { name });

  return (
    <div>
      <label>Component1: </label>
      <p>Name: {name}</p>
    </div>
  );
}

export default React.memo(Component1);
