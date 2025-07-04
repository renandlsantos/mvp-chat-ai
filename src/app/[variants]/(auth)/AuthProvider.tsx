'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

const AuthPageContext = createContext(true);

export const useIsAuthPage = () => {
  return useContext(AuthPageContext);
};

export const AuthPageProvider = ({ children }: PropsWithChildren) => {
  return <AuthPageContext.Provider value={true}>{children}</AuthPageContext.Provider>;
};