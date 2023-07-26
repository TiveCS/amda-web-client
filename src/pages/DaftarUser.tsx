import { getListUser } from "@api/users";
import { UserResponsePayload } from "@api/types/users";
import ButtonAMDA from "@components/ButtonAMDA";
import AddUserModal from "@components/pages/DaftarUser/AddUserModal";
import EditUserModal from "@components/pages/DaftarUser/EditUserModal";
import UserItemTable from "@components/pages/DaftarUser/UserItemTable";
import RemoveUserModal from "@components/pages/DaftarUser/RemoveUserModal";
import { Container, Flex, Grid, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";

const DaftarUser: React.FC = () => {
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const [isOpenAddUserModal, { open: openAddUser, close: closeAddUser }] =
    useDisclosure(false);

  const [
    isOpenRemoveUserModal,
    { open: openRemoveUser, close: closeRemoveUser },
  ] = useDisclosure(false);

  const [isOpenEditUserModal, { open: openEditUser, close: closeEditUser }] =
    useDisclosure(false);

  const [removeUser, setRemoveUser] = useState<UserResponsePayload | null>(
    null
  );

  const [editUser, setEditUser] = useState<UserResponsePayload | null>(null);
  const editUserForm = useForm({
    initialValues: {
      name: "",
      mitraId: -1,
      roleId: -1,
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : "Nama wajib diisi"),
    },
  });

  const getListUserQuery = useInfiniteQuery({
    queryKey: ["user"],
    queryFn: async ({ pageParam = 0 }) =>
      getListUser({
        search: searchDebounced,
        cursor: pageParam as number,
        limit: 5,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    void getListUserQuery.refetch();
  }, [searchDebounced, getListUserQuery]);

  if (getListUserQuery.isLoading) return <p>Loading...</p>;

  return (
    <>
      <AddUserModal isOpen={isOpenAddUserModal} closeModal={closeAddUser} />

      <RemoveUserModal
        isOpen={isOpenRemoveUserModal}
        closeModal={closeRemoveUser}
        user={removeUser}
        setRemoveUser={setRemoveUser}
      />

      <EditUserModal
        isOpen={isOpenEditUserModal}
        closeModal={closeEditUser}
        user={editUser}
        setUser={setEditUser}
        editForm={editUserForm}
      />

      <Container className="mt-8 font-poppins" fluid>
        <Flex direction={"column"} gap={12}>
          <p className="font-semibold text-left text-xl text-black">
            Daftar User
          </p>

          <Grid justify="space-between" align="flex-start" columns={12}>
            <Grid.Col span={7}>
              <SearchBar searchForm={searchForm} />
            </Grid.Col>
            <Grid.Col span={4}>
              <Flex
                gap={"md"}
                direction={"row"}
                align={"center"}
                justify={"flex-end"}
              >
                <ButtonAMDA onClick={openAddUser} leftIcon={<IconCirclePlus />}>
                  Add User
                </ButtonAMDA>
              </Flex>
            </Grid.Col>
          </Grid>
        </Flex>
      </Container>

      <Container fluid mt={24} className="max-h-3/4 overflow-y-scroll">
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Role</th>
              <th>Username</th>
              <th>Nama</th>
              <th>Mitra</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {getListUserQuery.data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.data.map((user) => (
                  <UserItemTable
                    key={user.id}
                    user={user}
                    editUserForm={editUserForm}
                    setRemoveUser={setRemoveUser}
                    setEditUser={setEditUser}
                    openRemoveUserModal={openRemoveUser}
                    openEditUserModal={openEditUser}
                  />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Container>

      <ButtonAMDA
        className="mt-4 ml-4"
        disabled={!getListUserQuery.hasNextPage}
        onClick={() => getListUserQuery.fetchNextPage()}
      >
        Load More
      </ButtonAMDA>
    </>
  );
};

export default DaftarUser;
