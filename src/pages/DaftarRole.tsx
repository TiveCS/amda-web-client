import { getListRole } from "@api/role";
import RoleItemTable from "@components/pages/DaftarRole/RoleItemTable";
import { Container, Flex, Table } from "@mantine/core";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";

const DaftarRole: React.FC = () => {
  const getListRoleQuery = useInfiniteQuery({
    queryKey: ["role"],
    queryFn: async () => getListRole(),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  if (getListRoleQuery.isLoading) return <p>Loading...</p>;

  return (
    <>
      <Container className="mt-5 font-poppins" fluid>
        <Flex direction={"column"} gap={12}>
          <p className="font-semibold text-left text-xl text-black">
            Daftar Role
          </p>
        </Flex>
      </Container>

      <Container fluid mt={24} className="max-h-3/4 overflow-y-scroll">
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th className="max-w-lg">Nama Role</th>
            </tr>
          </thead>
          <tbody>
            {getListRoleQuery.data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((role) => (
                  <RoleItemTable key={role.id} role={role} />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
};

export default DaftarRole;
