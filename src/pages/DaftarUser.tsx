import { UserResponsePayload } from "@api/types/users";
import { getListUser } from "@api/users";
import ButtonAMDA from "@components/ButtonAMDA";
import AddUserModal from "@components/pages/DaftarUser/AddUserModal";
import EditUserModal from "@components/pages/DaftarUser/EditUserModal";
import RemoveUserModal from "@components/pages/DaftarUser/RemoveUserModal";
import UserItemTable from "@components/pages/DaftarUser/UserItemTable";
import useUserEditForm from "@hooks/useUserEditForm";
import {
  Container,
  Flex,
  Grid,
  ScrollArea,
  Skeleton,
  Table,
  Text,
  createStyles,
  rem,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import { IconCirclePlus } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useProfileStore } from "@zustand/profileStore";
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import { RoleType } from "../types";

const useStyles = createStyles((theme) => ({
  header: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "box-shadow 150ms ease",

    "&::after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === "dark"
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },

  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}));

const DaftarUser: React.FC = () => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const { profile } = useProfileStore();
  const role: RoleType = profile?.role.slug as unknown as RoleType;
  const isAdminMitra = useMemo(() => {
    return role === "admin-mitra";
  }, [role]);

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
  const editUserForm = useUserEditForm({
    mitraId: profile?.mitra.id,
    roleId: profile?.role.id,
  });

  const { refetch: refetchListUsers, ...getListUserQuery } = useInfiniteQuery({
    queryKey: ["user"],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await getListUser({
        mitraId: isAdminMitra ? profile?.mitra.id : undefined,
        search: searchDebounced,
        cursor: pageParam as number,
        limit: 10,
      });

      return result;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    void refetchListUsers();
  }, [searchDebounced, refetchListUsers]);

  const usersTotal = useMemo(() => {
    return getListUserQuery.data?.pages.reduce(
      (acc, page) => acc + page.data.length,
      0
    );
  }, [getListUserQuery.data]);

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

      <Container className="mt-5 font-poppins" fluid>
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

      <ScrollArea.Autosize
        mt={24}
        className="max-h-[60%] mx-4"
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Skeleton
          visible={getListUserQuery.isFetching || getListUserQuery.isLoading}
        >
          <Table striped withBorder withColumnBorders>
            <thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <tr>
                <th>Role</th>
                <th>Username</th>
                <th>Nama</th>
                <th>Mitra</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersTotal === 0 && (
                <tr>
                  <td colSpan={5} className="text-center">
                    Tidak ada data
                  </td>
                </tr>
              )}

              {getListUserQuery.data?.pages.map((group) => (
                <React.Fragment key={group.nextCursor ?? 0}>
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
        </Skeleton>
      </ScrollArea.Autosize>

      <Flex className="mt-4 ml-4" align={"center"} gap={"lg"}>
        <ButtonAMDA
          disabled={!getListUserQuery.hasNextPage}
          onClick={() => getListUserQuery.fetchNextPage()}
        >
          Load More
        </ButtonAMDA>

        <Text>
          Menampilkan <strong>{usersTotal}</strong> user
        </Text>
      </Flex>
    </>
  );
};

export default DaftarUser;
