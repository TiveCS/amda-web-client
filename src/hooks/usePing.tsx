import { APP_PING_URL } from "@api/routes";
import axios, { AxiosError } from "axios";
import { useEffect } from "react";

export default function usePing() {
  useEffect(() => {
    const ping = () => {
      const req = axios.get(APP_PING_URL);

      req
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          if (err instanceof AxiosError) {
            if (err.response?.status === 404) {
              console.log("OK");
              return;
            }
          }
          throw err;
        });
    };

    void ping();
  }, []);
}
