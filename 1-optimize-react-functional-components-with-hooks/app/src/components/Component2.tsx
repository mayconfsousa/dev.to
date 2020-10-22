import React from 'react';

interface Props {
  surname: string;
}

function Component2({ surname }: Props) {
  console.log('Component2 :: render', { surname });

  return (
    <div>
      <label>Component2: </label>
      <p>Surname: {surname}</p>
    </div>
  );
}

export default React.memo(Component2);

// import React, { memo } from 'react';

// interface Component2Props {
//   surname: string;
//   data: Record<string, unknown>;
//   func: () => void;
// }

// function Component2({ surname, data, func }: Component2Props) {
//   console.log('Component2 :: render', { surname, data, func });

//   return (
//     <>
//       <label>Component2: </label>
//       <p>Surname: {surname}</p>
//       <p>Data: {JSON.stringify(data)}</p>
//     </>
//   );
// }

// export default memo(Component2);
