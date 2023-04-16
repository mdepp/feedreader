import createEmotionCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import type { PropsWithChildren } from "react";
import { createContext, useCallback, useContext, useState } from "react";

function createCache() {
  return createEmotionCache({ key: "css" });
}

const ResetCacheContext = createContext(() => {});

export function EmotionCacheProvider({ children }: PropsWithChildren) {
  const [cache, setCache] = useState(createCache());
  const reset = useCallback(() => setCache(createCache()), []);
  return (
    <ResetCacheContext.Provider value={reset}>
      <CacheProvider value={cache}>{children}</CacheProvider>
    </ResetCacheContext.Provider>
  );
}

export function useResetEmotionCache() {
  return useContext(ResetCacheContext);
}
