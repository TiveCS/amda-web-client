import React from "react";
import {
  Container,
  Card,
  Select,
  TextInput,
  Table,
  Flex,
  Center,
} from "@mantine/core";
import { Calendar, TimeInput } from "@mantine/dates";
import ButtonAMDA from "@components/ButtonAMDA";

const App: React.FC = () => {
  return (
    <>
      <Container className="mt-8 font-['Poppins']">
        <p className="font-semibold text-xl text-black">Agenda Tim</p>
      </Container>
      <Container className="mt-8">
        <Flex>
          <Card withBorder style={{ width: 300, height: 320 }}>
            <Calendar />
          </Card>
          <Container>
            <TextInput withAsterisk placeholder="" label="Agenda"></TextInput>
            <br />
            <Select
              withAsterisk
              label="Dasar Kegiatan"
              placeholder="Select one"
              data={[
                { value: "1", label: "Dasar Kegiatan 1" },
                { value: "2", label: "Dasar Kegiatan 2" },
                { value: "3", label: "Dasar Kegiatan 3" },
                { value: "4", label: "Dasar Kegiatan 4" },
              ]}
            />
            <br />
            <Select
              withAsterisk
              label="Sub Unit"
              placeholder="Select one"
              data={[
                { value: "1", label: "Optima" },
                { value: "2", label: "Data Management" },
                { value: "3", label: "Maintenance" },
                { value: "4", label: "Hubungan Antar Instansi" },
              ]}
            />
          </Container>
          <Container>
            <TextInput withAsterisk placeholder="" label="PIC"></TextInput>
            <br />
            <TimeInput withAsterisk label="Pukul" placeholder=""></TimeInput>
            <br />
            <Center>
              <ButtonAMDA>Reset</ButtonAMDA>
              <ButtonAMDA>Submit</ButtonAMDA>
            </Center>
          </Container>
        </Flex>
      </Container>
      <Container>
        <Card withBorder className="mt-8">
          <Table
            striped
            withBorder
            withColumnBorders
            className="text-center text-sm"
          >
            <thead>
              <tr>
                <th>Waktu</th>
                <th>Agenda</th>
                <th>PIC</th>
                <th>Dasar Kegiatan</th>
                <th>Evidence</th>
                <th>Catatan Meeting</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>23/07/2023 3:45 PM</td>
                <td>Meeting dengan tim Marketing</td>
                <td>Achmad Adib</td>
                <td>Planning pemasaran</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>23/07/2023 3:45 PM</td>
                <td>Meeting dengan tim Marketing</td>
                <td>Achmad Adib</td>
                <td>Planning pemasaran</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>23/07/2023 3:45 PM</td>
                <td>Meeting dengan tim Marketing</td>
                <td>Achmad Adib</td>
                <td>Planning pemasaran</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>23/07/2023 3:45 PM</td>
                <td>Meeting dengan tim Marketing</td>
                <td>Achmad Adib</td>
                <td>Planning pemasaran</td>
                <td></td>
                <td></td>
              </tr>
              <tr>
                <td>23/07/2023 3:45 PM</td>
                <td>Meeting dengan tim Marketing</td>
                <td>Achmad Adib</td>
                <td>Planning pemasaran</td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Card>
      </Container>
    </>
  );
};

export default App;
