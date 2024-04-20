import type { ReactNode } from "react";
import { createContext, useContext } from "react";

export const NonceContext = createContext("");

export function useNonce() {
  return useContext(NonceContext);
}

export function NonceProvider(props: { nonce: string; children: ReactNode }) {
  const { nonce, children } = props;
  return <NonceContext.Provider value={nonce}>{children}</NonceContext.Provider>;
}
