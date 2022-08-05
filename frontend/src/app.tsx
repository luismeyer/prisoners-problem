import { FC, useEffect } from "react";

import { useWebSocket } from "./hooks/use-websocket";

export const App: FC = () => {
  const { start, loading } = useWebSocket();

  useEffect(() => {
    if (loading) {
      return;
    }

    start();
  }, [loading]);

  return (
    <>
      {/* <Config />

      <div>
        <button onClick={() => start(randomStrategy)}>start</button>
        <span>{currentInmate?.number}</span>
      </div>

      {config.ui && <Room />} */}
    </>
  );
};
