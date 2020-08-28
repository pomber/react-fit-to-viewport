import React from 'react';
import { FitToViewport } from '.';

export default {
  title: 'Basic',
};

export const Default = () => (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%',
    }}
  >
    <FitToViewport
      style={{ background: 'salmon' }}
      width={300}
      height={200}
      maxZoom={2}
      autoRotateAt={750}
    >
      <div
        style={{
          border: '50px solid red',
          height: '100%',
          boxSizing: 'border-box',
        }}
      ></div>
    </FitToViewport>
  </div>
);
