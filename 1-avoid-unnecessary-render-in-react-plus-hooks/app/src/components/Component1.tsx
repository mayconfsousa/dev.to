import React, { memo } from 'react';

interface Component1Props {
  name: string;
}

function Component1({ name }: Component1Props) {
  console.log('Component1 :: render', { name });

  return (
    <>
      <label>Component1: </label>
      <p>Name: {name}</p>
    </>
  );
}

export default memo(Component1);
