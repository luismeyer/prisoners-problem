import { useCallback, useEffect, useRef, useState } from "react";
import { ApiMessage } from "../api";

export const useWebSocket = () => {
  const client = useRef(new WebSocket("ws://localhost:8080"));

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client.current.onmessage = (message) => {
      const { type, data }: ApiMessage = JSON.parse(message.data.toString());

      if (type === "update") {
        console.log(data.currentInmate);
      }

      if (type === "done") {
        console.log(data);
      }
    };

    client.current.onopen = () => {
      setLoading(false);
    };
  }, [client.current]);

  const start = useCallback(() => {
    client.current.send("START");
  }, []);

  return {
    loading,
    start,
  };
};
