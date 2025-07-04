'use client';

import dynamic from 'next/dynamic';

const CredentialsSignIn = dynamic(() => import('./CredentialsSignIn'), {
  ssr: false,
});

export default CredentialsSignIn;