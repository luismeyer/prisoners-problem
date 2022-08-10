import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiMessage, Simulation } from "../api";
import { configAtom } from "../store/config";

export const useApi = () => {
  const config = useAtomValue(configAtom);

  const client = useRef<WebSocket>();

  const [data, setData] = useState<Simulation>({
    closedBoxes: [],
    openBoxes: [],
    currentBox: undefined,
    currentInmate: undefined,
  });

  const [status, setStatus] = useState<"setup" | "running">("setup");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!client.current) {
      client.current = new WebSocket("ws://localhost:8080");
    }

    client.current.onmessage = (message) => {
      const { type, data }: ApiMessage = JSON.parse(message.data.toString());

      if (type === "update") {
        setData(data);
      }

      if (type === "done") {
        setStatus("setup");
      }
    };

    client.current.onopen = () => {
      setLoading(false);
    };
  }, [client.current]);

  const start = useCallback(() => {
    setStatus("running");

    client.current?.send(JSON.stringify(config));
  }, [client.current, config]);

  const stop = useCallback(() => {
    setStatus("setup");

    client.current?.send("STOP");
  }, [client.current]);

  return {
    loading,
    start,
    stop,
    simulation: data,
    status,
  };
};
