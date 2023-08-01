import { getListMitra } from "@api/mitra";
import { getListUser } from "@api/users";
import { Badge, Card, Flex, Group, Text } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { getListTickets } from "@api/tickets";

function Dashboard() {
  // List User
  const getListUserQuery = useQuery({
    queryKey: ["list_user_dashboard"],
    queryFn: async ({}) => getListUser({}),
  });

  // List Mitra
  const getListMitraQuery = useQuery({
    queryKey: ["list_mitra_dashboard"],
    queryFn: async ({}) => getListMitra({}),
  });

  // List Tiket
  // const getListTicketQuery = useQuery({
  //   queryKey: ["list_tiket_dashboard"],
  //   queryFn: async ({}) => {
  //     const result = await getListTickets({});

  //     return result.data.map((tickets) => ({
  //       value: tickets.
  //       label: tickets.name,
  //     }));
  //   },
  // });

  // const tiketAccepted = getListTicketQuery.data?.filter(
  //   (r) => parseInt(r.value) === user.mitraId
  // );

  if (getListUserQuery.isLoading) return <p>Loading...</p>;
  if (getListMitraQuery.isLoading) return <p>Loading...</p>;
  // if (getListTicketQuery.isLoading) return <p>Loading...</p>;

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
              {getListTicketQuery.data?.data.length}
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
              {getListTicketQuery.data?.data.length}
            </Badge>
          </Group>
        </Card>
      </Flex>
    </div>
  );
}

export default Dashboard;
