import { Suspense } from 'react';
import { App } from 'antd';

import Loading from '@/components/Loading/BrandTextLoading';

import CredentialsSignInClient from './CredentialsSignInClient';

export default () => (
  <App>
    <Suspense fallback={<Loading />}>
      <CredentialsSignInClient />
    </Suspense>
  </App>
);
