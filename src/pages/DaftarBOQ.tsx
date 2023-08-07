import { LopTicket } from "@api/types/tickets";
import ButtonAMDA from "@components/ButtonAMDA";
import EvidenceDrawer from "@components/pages/DaftarBOQ/EvidenceDrawer";
import ExportConfirmModal from "@components/pages/DaftarBOQ/ExportConfirmModal";
import FilterDaftarBOQModal from "@components/pages/DaftarBOQ/FilterDaftarBOQModal";
import TicketTableItem from "@components/pages/DaftarBOQ/TicketTableItem";
import TicketVolumeDetailsModal from "@components/pages/DaftarBOQ/TicketVolumeDetailsModal";
import useFilterForm from "@hooks/useFilterForm";
import useGetListTicketsQuery from "@hooks/useGetListTicketsQuery";
import useVolumeDetailsForm from "@hooks/useVolumeDetailsForm";
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
import { IconDownload, IconFilter } from "@tabler/icons-react";
import React, { useEffect, useMemo, useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import { useProfileStore } from "@zustand/profileStore";
import { RoleType } from "../types";
import { checkRoleAllowed } from "../utils";

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

const DaftarBOQ: React.FC = () => {
  const { classes, cx } = useStyles();
  const [scrolled, setScrolled] = useState(false);

  const searchForm = useForm({
    initialValues: { search: "" },
  });

  const { profile } = useProfileStore();
  const role = profile?.role.slug as unknown as RoleType;
  const hasCRUDAccess = useMemo(() => {
    return checkRoleAllowed(role, {
      whiteListedRoles: ["ta-maintenance", "admin-mitra"],
    });
  }, [role]);

  const isAdminMitra = useMemo(() => {
    return role === "admin-mitra";
  }, [role]);

  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const [selectedTicket, setSelectedTicket] = React.useState<LopTicket | null>(
    null
  );

  const filterForm = useFilterForm({
    values: {
      mitraIds: isAdminMitra && profile?.mitra.id ? [profile?.mitra.id] : null,
    },
  });

  const {
    refetchListTicketQuery,
    isFetchingListTicketQuery,
    isLoadingListTicketQuery,
    listTicketQueryData,
    getListTicketQuery,
  } = useGetListTicketsQuery({
    filterForm,
    searchDebounced,
  });

  useEffect(() => {
    const refetch = async () => {
      await refetchListTicketQuery();
    };

    void refetch();
  }, [refetchListTicketQuery, searchDebounced]);

  const [
    isVolumeDetailsModalOpen,
    { open: openVolumeDetailsModal, close: closeVolumeDetailsModal },
  ] = useDisclosure(false);

  const [
    isFilterModalOpen,
    { open: openFilterModal, close: closeFilterModal },
  ] = useDisclosure(false);

  const [
    isExportModalOpen,
    { open: openExportModal, close: closeExportModal },
  ] = useDisclosure(false);

  const [
    isEvidenceDrawerOpen,
    { open: openEvidenceDrawer, close: closeEvidenceDrawer },
  ] = useDisclosure(false);

  const volumeDetailsForm = useVolumeDetailsForm();

  const filter = () => {
    void refetchListTicketQuery();
    closeFilterModal();
  };

  const totalTickets = useMemo(() => {
    if (listTicketQueryData?.pages) {
      return listTicketQueryData.pages.reduce(
        (acc, page) => acc + page.data.length,
        0
      );
    }
    return 0;
  }, [listTicketQueryData?.pages]);

  const handleExportTicket = () => {
    openExportModal();
  };

  return (
    <>
      <EvidenceDrawer
        isAdminMitra={isAdminMitra}
        hasCRUDAccess={hasCRUDAccess}
        opened={isEvidenceDrawerOpen}
        onClose={() => {
          setSelectedTicket(null);
          closeEvidenceDrawer();
        }}
        ticket={selectedTicket}
      />

      <ExportConfirmModal
        opened={isExportModalOpen}
        onClose={closeExportModal}
        ticketIdentifiers={
          listTicketQueryData?.pages.flatMap((page) =>
            page.data.map((ticket) => ticket.identifier)
          ) || []
        }
      />

      <TicketVolumeDetailsModal
        isAdminMitra={isAdminMitra}
        hasCRUDAccess={hasCRUDAccess}
        selectedTicket={selectedTicket}
        setSelectedTicket={setSelectedTicket}
        isOpen={isVolumeDetailsModalOpen}
        onClose={closeVolumeDetailsModal}
        volumeDetailsForm={volumeDetailsForm}
      />

      <FilterDaftarBOQModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        filter={filter}
        filterForm={filterForm.form}
      />

      <Container className="mt-8 font-poppins" fluid>
        <p className="font-semibold text-xl text-black">Daftar BOQ</p>
      </Container>

      <Container className="my-5" fluid>
        <Grid justify="space-between">
          <Grid.Col span={6}>
            <SearchBar searchForm={searchForm} />
          </Grid.Col>

          <Grid.Col span={6}>
            <Flex justify={"flex-start"}>
              <ButtonAMDA
                variant="outline"
                leftIcon={<IconFilter />}
                onClick={openFilterModal}
              >
                Filter
              </ButtonAMDA>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>

      <ScrollArea.Autosize
        offsetScrollbars
        className="max-h-1/2 mx-4"
        onScrollPositionChange={({ y }) => setScrolled(y !== 0)}
      >
        <Skeleton
          visible={isFetchingListTicketQuery || isLoadingListTicketQuery}
        >
          <Table striped withBorder withColumnBorders>
            <thead
              className={cx(classes.header, { [classes.scrolled]: scrolled })}
            >
              <tr>
                <th className="w-32">ID Tiket</th>
                <th className="w-36">Lokasi Tiket</th>
                <th className="w-36">Status Volume</th>
                <th className="w-8">Detail Volume</th>
                <th className="w-36">Status Evidence</th>
                <th className="w-20">Evidence</th>
                <th>Catatan UT</th>
                <th className="w-24">Status Acc</th>
              </tr>
            </thead>
            <tbody>
              {totalTickets === 0 && (
                <tr>
                  <td colSpan={8}>
                    <Text align="center">Data tiket tidak ditemukan.</Text>
                  </td>
                </tr>
              )}

              {listTicketQueryData?.pages.map((group, i) => (
                <React.Fragment key={i}>
                  {group.data.map((ticket) => (
                    <TicketTableItem
                      key={ticket.id}
                      ticket={ticket}
                      isAdminMitra={isAdminMitra}
                      hasCRUDAccess={hasCRUDAccess}
                      openEvidenceDrawer={(ticket: LopTicket) => {
                        setSelectedTicket(ticket);
                        openEvidenceDrawer();
                      }}
                      openModal={(ticket: LopTicket) => {
                        setSelectedTicket(ticket);
                        volumeDetailsForm.form.setFieldValue(
                          "volumes",
                          ticket.volumes
                        );
                        volumeDetailsForm.form.setDirty({
                          volumes: false,
                        });

                        openVolumeDetailsModal();
                      }}
                    />
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </Table>
        </Skeleton>
      </ScrollArea.Autosize>

      <Flex
        direction={"row"}
        justify={"space-between"}
        align={"center"}
        className="mt-4 mx-4"
      >
        <Flex direction={"row"} gap={"xl"} align={"center"}>
          <ButtonAMDA
            disabled={!getListTicketQuery.hasNextPage}
            loading={isFetchingListTicketQuery}
            onClick={getListTicketQuery.fetchNextPage}
          >
            Load More
          </ButtonAMDA>

          <Text>
            Menampilkan <strong>{totalTickets}</strong> tiket
          </Text>
        </Flex>

        {!isAdminMitra && (
          <ButtonAMDA
            disabled={isAdminMitra || totalTickets === 0}
            leftIcon={<IconDownload />}
            onClick={handleExportTicket}
          >
            Export XLSX
          </ButtonAMDA>
        )}
      </Flex>
    </>
  );
};

export default DaftarBOQ;
