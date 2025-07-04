'use client';

import dynamic from 'next/dynamic';

const AuthSignUpBox = dynamic(() => import('./AuthSignUpBox'), {
  ssr: false,
});

export default AuthSignUpBox;