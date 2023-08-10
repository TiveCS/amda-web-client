import { axiosGuestApi } from "@api/helpers";
import { APP_PING_URL } from "@api/routes";
import { showNotification } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";

export default function usePing() {
  const [isPinged, setIsPinged] = useState(false);

  useQuery({
    enabled: !isPinged,
    refetchInterval: false,
    queryKey: ["ping"],
    queryFn: async () => {
      return axiosGuestApi.get(APP_PING_URL);
    },
    onSuccess: (res) => {
      setIsPinged(res.status === 200);
      if (res.status === 200) {
        showNotification({
          title: "Success",
          message: "Connected to the server",
          color: "green",
          icon: <IconCheck />,
        });
      } else {
        showNotification({
          title: "Error",
          message: "Failed to connect to the server",
          color: "red",
          icon: <IconX />,
        });
      }
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        showNotification({
          title: "Error",
          message: "Failed to connect to the server",
          color: "red",
          icon: <IconX />,
        });
        return;
      }
      showNotification({
        title: "Error",
        message: "Internal server error",
        color: "red",
        icon: <IconX />,
      });
      throw err;
    },
  });
}
