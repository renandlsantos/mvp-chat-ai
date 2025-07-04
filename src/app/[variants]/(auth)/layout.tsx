import { PropsWithChildren } from 'react';
import { Center, Flexbox } from 'react-layout-kit';

// Forçar renderização dinâmica para todas as páginas de autenticação
export const dynamic = 'force-dynamic';
export const revalidate = 0;

const Page = ({ children }: PropsWithChildren) => {
  return (
    <Flexbox height={'100%'} width={'100%'}>
      <Center height={'100%'} width={'100%'}>
        {children}
      </Center>
    </Flexbox>
  );
};

export default Page;
