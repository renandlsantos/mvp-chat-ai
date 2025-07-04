'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ 
      alignItems: 'center', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '1rem', 
      height: '100vh',
      justifyContent: 'center'
    }}>
      <h2>Algo deu errado!</h2>
      <button
        onClick={() => reset()}
        style={{
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: '0.25rem',
          cursor: 'pointer',
          padding: '0.5rem 1rem'
        }}
      >
        Tentar novamente
      </button>
    </div>
  );
}