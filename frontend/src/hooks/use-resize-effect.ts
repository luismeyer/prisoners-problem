import { useCallback, useEffect } from "react";

export const useResizeEffect = (callback: () => void) => {
  const handler = useCallback(() => {
    callback();
  }, [callback]);

  useEffect(() => {
    window.addEventListener("resize", handler);

    return () => window.removeEventListener("resize", handler);
  }, [callback]);
};
