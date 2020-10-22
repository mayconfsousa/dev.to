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
