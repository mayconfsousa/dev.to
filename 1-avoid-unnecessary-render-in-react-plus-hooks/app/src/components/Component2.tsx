import React, { memo } from 'react';

interface Component2Props {
  surname: string;
  data: Record<string, unknown>;
  func: () => void;
}

function Component2({ surname, data, func }: Component2Props) {
  console.log('Component2 :: render', { surname, data, func });

  return (
    <>
      <label>Component2: </label>
      <p>Surname: {surname}</p>
      <p>Data: {JSON.stringify(data)}</p>
    </>
  );
}

export default memo(Component2);
