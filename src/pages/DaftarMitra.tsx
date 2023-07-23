import { getListMitra } from "@api/mitra";
import ButtonAMDA from "@components/ButtonAMDA";
import AddMitraModal from "@components/pages/DaftarMitra/AddMitraModal";
import MitraItemTable from "@components/pages/DaftarMitra/MitraItemTable";
import RemoveMitraModal from "@components/pages/DaftarMitra/RemoveMitraModal";
import { Card, Container, Flex, Grid, Table } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconCirclePlus, IconFilter } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import SearchBar from "../components/SearchBar/SearchBar";
import { MitraResponsePayload } from "@api/types/mitra";

const DaftarMitra: React.FC = () => {
  const [isOpenAddMitraModal, { open: openAddMitra, close: closeAddMitra }] =
    useDisclosure(false);

  const [
    isOpenRemoveMitraModal,
    { open: openRemoveMitra, close: closeRemoveMitra },
  ] = useDisclosure(false);

  const [removeMitra, setRemoveMitra] = useState<MitraResponsePayload | null>(
    null
  );

  const { data: getMitraData, isLoading } = useQuery({
    queryKey: ["mitra"],
    queryFn: async () => getListMitra(),
  });

  const handleSearch = (searchTerm: string) => {
    // Perform search logic using the search term
    console.log("Searching for:", searchTerm);
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <AddMitraModal isOpen={isOpenAddMitraModal} closeModal={closeAddMitra} />

      <RemoveMitraModal
        isOpen={isOpenRemoveMitraModal}
        closeModal={closeRemoveMitra}
        mitra={removeMitra}
        setRemoveMitra={setRemoveMitra}
      />

      <Container className="mt-8 font-poppins" fluid>
        <p className="font-semibold text-xl text-black">Daftar Mitra</p>
      </Container>
      <Container className="mt-5 font-poppins" fluid>
        <Grid justify="space-between" align="flex-start" columns={12}>
          <Grid.Col span={7}>
            <SearchBar onSearch={handleSearch} />
          </Grid.Col>
          <Grid.Col span={4}>
            <Flex
              gap={"md"}
              direction={"row"}
              align={"center"}
              justify={"flex-end"}
            >
              <ButtonAMDA variant="outline">
                <IconFilter></IconFilter>
              </ButtonAMDA>
              <ButtonAMDA onClick={openAddMitra} leftIcon={<IconCirclePlus />}>
                Add Mitra
              </ButtonAMDA>
            </Flex>
          </Grid.Col>
        </Grid>
      </Container>
      <Container fluid>
        <Card withBorder className="mt-4 overflow-y-scroll max-h-96">
          <Table striped withBorder withColumnBorders>
            <thead>
              <tr>
                <th className="max-w-lg">Nama Mitra</th>
                <th className="w-40">Action</th>
              </tr>
            </thead>
            <tbody>
              {getMitraData?.data?.map((mitra) => (
                <MitraItemTable
                  key={mitra.id}
                  mitra={mitra}
                  setRemoveMitraId={setRemoveMitra}
                  openRemoveMitraModal={openRemoveMitra}
                />
              ))}
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default DaftarMitra;
