import { useAtomValue } from "jotai";
import { useCallback, useEffect, useRef, useState } from "react";
import { ApiSimulation, ApiResponse, ApiRequest } from "@prisoners-problem/api";

import { configAtom } from "../store/config";

export const useApi = () => {
  const config = useAtomValue(configAtom);

  const client = useRef<WebSocket>();

  const [data, setData] = useState<ApiSimulation>({
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
      const { type, data }: ApiResponse = JSON.parse(message.data.toString());

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

  const sendApiRequest = useCallback(
    (request: ApiRequest) => {
      client.current?.send(JSON.stringify(request));
    },
    [client.current]
  );

  const start = useCallback(() => {
    setStatus("running");

    sendApiRequest({ type: "start", ...config });
  }, [sendApiRequest, config]);

  const stop = useCallback(() => {
    setStatus("setup");

    sendApiRequest({ type: "stop" });
  }, [sendApiRequest]);

  return {
    loading,
    start,
    stop,
    simulation: data,
    status,
  };
};
