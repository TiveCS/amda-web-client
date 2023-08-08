import { getListMitra } from "@api/mitra";
import { getListUser } from "@api/users";
import { Badge, Card, Flex, Group, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getListTickets } from "@api/tickets";
import { useMemo } from "react";
import { useProfileStore } from "@zustand/profileStore";
import { RoleType } from "../types";
import { checkRoleAllowed } from "../utils";

function Dashboard() {
  const { profile } = useProfileStore();
  const role = profile?.role.slug as unknown as RoleType;

  const isAllowShowUser = useMemo(() => {
    return checkRoleAllowed(role, {
      whiteListedRoles: ["admin-ta"],
    });
  }, [role]);

  const isAllowShowTicket = useMemo(() => {
    return checkRoleAllowed(role, {
      whiteListedRoles: ["ta-maintenance", "ta-uji-terima"],
    });
  }, [role]);

  // List User
  const getListUserQuery = useQuery({
    enabled: isAllowShowUser,
    queryKey: ["list_user_dashboard"],
    queryFn: async () => getListUser({ limit: 30 }),
  });

  // List Mitra
  const getListMitraQuery = useQuery({
    enabled: isAllowShowUser,
    queryKey: ["list_mitra_dashboard"],
    queryFn: async () => getListMitra({ limit: 20 }),
  });

  // List Tiket
  const getListTicketQuery = useQuery({
    enabled: isAllowShowTicket,
    queryKey: ["list_tiket_dashboard"],
    queryFn: async () => {
      const result = await getListTickets({ take: 50 });
      return result;
    },
  });

  const ticketAccepted = useMemo(() => {
    return getListTicketQuery.data?.data.filter(
      (r) => r.acceptStatus === "ACCEPTED"
    );
  }, [getListTicketQuery.data]);

  const ticketRejected = useMemo(() => {
    return getListTicketQuery.data?.data.filter(
      (r) => r.acceptStatus === "REJECTED"
    );
  }, [getListTicketQuery.data]);

  const ticketPending = useMemo(() => {
    return getListTicketQuery.data?.data.filter(
      (r) => r.acceptStatus === "PENDING"
    );
  }, [getListTicketQuery.data]);

  return (
    <div>
      <Flex
        gap="md"
        justify="flex-start"
        align="flex-start"
        direction="row"
        wrap="wrap"
        className="mt-8"
      >
        {isAllowShowUser && (
          <>
            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group position="apart" mt="bs" mb="bs">
                <Text weight={500} className="font-poppins">
                  Total User
                </Text>
                <Badge
                  color="blue"
                  variant="light"
                  className="font-poppins text-base"
                >
                  {getListUserQuery.data?.data.length}
                </Badge>
              </Group>
            </Card>

            <Card shadow="sm" padding="lg" radius="md" withBorder>
              <Group position="apart" mt="bs" mb="bs">
                <Text weight={500} className="font-poppins">
                  Total Mitra
                </Text>
                <Badge
                  color="blue"
                  variant="light"
                  className="font-poppins text-base"
                >
                  {getListMitraQuery.data?.data.length}
                </Badge>
              </Group>
            </Card>
          </>
        )}

        {isAllowShowTicket && (
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group position="apart" mt="bs" mb="xs">
              <Text weight={500} className="font-poppins">
                Total Tiket
              </Text>
              <Badge
                color="blue"
                variant="light"
                className="font-poppins text-base"
              >
                {getListTicketQuery.data?.data.length}
              </Badge>
            </Group>
            <Group position="apart" mt="bs" mb="bs">
              <Text size="sm" className="font-poppins">
                Sudah Acc
              </Text>
              <Badge
                color="green"
                variant="light"
                className="font-poppins text-sm"
              >
                {ticketAccepted !== undefined ? ticketAccepted.length : "??"}
              </Badge>
            </Group>
            <Group position="apart" mt="bs" mb="bs">
              <Text size="sm" className="font-poppins">
                Belum Acc
              </Text>
              <Badge
                color="yellow"
                variant="light"
                className="font-poppins text-sm"
              >
                {ticketRejected !== undefined ? ticketRejected.length : "??"}
              </Badge>
            </Group>
            <Group position="apart" mt="bs" mb="bs">
              <Text size="sm" className="font-poppins">
                Belum Lengkap
              </Text>
              <Badge
                color="red"
                variant="light"
                className="font-poppins text-sm"
              >
                {ticketPending !== undefined ? ticketPending.length : "??"}
              </Badge>
            </Group>
          </Card>
        )}
      </Flex>
    </div>
  );
}

export default Dashboard;
