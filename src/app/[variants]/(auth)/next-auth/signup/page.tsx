import { Suspense } from 'react';
import { App } from 'antd';

import Loading from '@/components/Loading/BrandTextLoading';

import AuthSignUpBoxClient from './AuthSignUpBoxClient';

export default () => (
  <App>
    <Suspense fallback={<Loading />}>
      <AuthSignUpBoxClient />
    </Suspense>
  </App>
);