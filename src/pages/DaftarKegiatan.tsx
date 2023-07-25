import { getLops } from "@api/lops";
import ButtonAMDA from "@components/ButtonAMDA";
import AddKegiatanModal from "@components/pages/DaftarKegiatan/AddKegiatanModal";
import AddLopModal from "@components/pages/DaftarKegiatan/AddLopModal";
import LopTableItem from "@components/pages/DaftarKegiatan/LopTableItem";
import { Container, Flex, Grid, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useDebouncedValue, useDisclosure } from "@mantine/hooks";
import {
  IconCirclePlus,
  IconDownload,
  IconEdit,
  IconFilter,
  IconTrash,
} from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import SearchBar from "../components/SearchBar/SearchBar";

const DaftarKegiatan: React.FC = () => {
  const searchForm = useForm({
    initialValues: {
      search: "",
    },
  });
  const [searchDebounced] = useDebouncedValue(searchForm.values.search, 500);

  const [
    openedAddKegiatan,
    { open: openAddKegiatan, close: closeAddKegiatan },
  ] = useDisclosure(false);
  const [openedAddLOP, { open: openAddLOP, close: closeAddLOP }] =
    useDisclosure(false);

  const getListLop = useInfiniteQuery({
    queryKey: ["lops"],
    queryFn: async ({ pageParam = 0 }) => {
      const lops = await getLops({
        search: searchDebounced,
        cursor: pageParam as number,
        take: 5,
      });

      return { nextCursor: lops.nextCursor, lops: lops.data };
    },

    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return (
    <>
      <AddLopModal closeAddLOP={closeAddLOP} openedAddLOP={openedAddLOP} />

      <AddKegiatanModal
        openedAddKegiatan={openedAddKegiatan}
        closeAddKegiatan={closeAddKegiatan}
      />

      <Container className="mt-5" fluid>
        <p className="font-semibold text-xl text-black">Daftar Kegiatan</p>
        <Grid className="mt-2" justify="space-between">
          <Grid.Col span={5}>
            <SearchBar searchForm={searchForm} />
          </Grid.Col>
          <Grid.Col span={6}>
            <Flex justify={"flex-end"} gap={"md"}>
              <ButtonAMDA variant="outline">
                <IconFilter></IconFilter>
              </ButtonAMDA>{" "}
              <ButtonAMDA variant="outline">
                <IconEdit></IconEdit>
              </ButtonAMDA>{" "}
              <ButtonAMDA variant="outline">
                <IconTrash></IconTrash>
              </ButtonAMDA>{" "}
              <ButtonAMDA
                variant="outline"
                onClick={openAddLOP}
                leftIcon={<IconCirclePlus />}
              >
                Add LOP
              </ButtonAMDA>
              <ButtonAMDA
                onClick={openAddKegiatan}
                leftIcon={<IconCirclePlus />}
              >
                Add Kegiatan
              </ButtonAMDA>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>

      <Container fluid className="overflow-y-scroll max-h-3/4 mt-8">
        <Table striped withBorder withColumnBorders>
          <thead>
            <tr>
              <th>Nama LOP</th>
              <th>#</th>
              <th>STO</th>
              <th>Jenis Pekerjaan</th>
              <th>No Tiket</th>
              <th>Lokasi Tiket</th>
              <th>Mitra</th>
            </tr>
          </thead>
          <tbody>
            {getListLop.data?.pages.map((group, i) => (
              <React.Fragment key={i}>
                {group.lops.map((lop) => (
                  <LopTableItem key={lop.id} lop={lop} />
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </Container>

      <Flex justify={"space-between"} className="mt-8 mx-3">
        <Flex gap={16}>
          <ButtonAMDA>Load More</ButtonAMDA>
        </Flex>
        <ButtonAMDA leftIcon={<IconDownload />}>Export XLSX</ButtonAMDA>
      </Flex>
    </>
  );
};

export default DaftarKegiatan;
