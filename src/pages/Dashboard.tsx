import { getMitraCounts } from "@api/mitra";
import { getTicketCounts } from "@api/tickets";
import { getUserCounts } from "@api/users";
import { Badge, Card, Flex, Group, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";
import { useMemo } from "react";
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
    queryFn: async () => getUserCounts({}),
  });

  // List Mitra
  const getListMitraQuery = useQuery({
    enabled: isAllowShowUser,
    queryKey: ["list_mitra_dashboard"],
    queryFn: async () => getMitraCounts(),
  });

  // List Tiket
  const getListTicketQuery = useQuery({
    enabled: isAllowShowTicket,
    queryKey: ["list_tiket_dashboard"],
    queryFn: async () => {
      const result = await getTicketCounts();
      return result;
    },
  });

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
                  {getListUserQuery.data?.data._count}
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
                  {getListMitraQuery.data?.data._count}
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
                {getListTicketQuery.data?.data.total}
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
                {getListTicketQuery.data?.data.accepted}
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
                {getListTicketQuery.data?.data.rejected}
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
                {getListTicketQuery.data?.data.pending}
              </Badge>
            </Group>
          </Card>
        )}
      </Flex>
    </div>
  );
}

export default Dashboard;
