import { getTicketEvidences } from "@api/tickets";
import { LopTicket } from "@api/types/tickets";
import { Container, Drawer, Flex, Grid } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import EvidenceImageItem from "./EvidenceImageItem";
import EvidenceUploadButton from "./EvidenceUploadButton";

interface EvidenceDrawerProps {
  opened: boolean;
  onClose: () => void;
  ticket: LopTicket | null;
}

export default function EvidenceDrawer({
  onClose,
  opened,
  ticket,
}: EvidenceDrawerProps) {
  const { refetch: refetchEvidence, data: evidences } = useQuery({
    queryKey: ["evidence_drawer_evidence", ticket?.identifier],
    queryFn: async () => {
      if (!ticket) return null;
      const { data: result } = await getTicketEvidences(ticket.identifier, {
        after: true,
        before: true,
        onProgress: true,
      });

      return result;
    },
  });

  useEffect(() => {
    const refetch = async () => {
      await refetchEvidence();
    };

    void refetch();
  }, [refetchEvidence, ticket]);

  const checkUrlEmpty = (url: string | null | undefined) => {
    return url === null || url === undefined || url === "";
  };

  const hasAfter = useMemo(
    () => !checkUrlEmpty(evidences?.afterUrl),
    [evidences?.afterUrl]
  );
  const hasOnProgress = useMemo(
    () => !checkUrlEmpty(evidences?.onProgressUrl),
    [evidences?.onProgressUrl]
  );
  const hasBefore = useMemo(
    () => !checkUrlEmpty(evidences?.beforeUrl),
    [evidences?.beforeUrl]
  );

  return (
    <Drawer
      onClose={onClose}
      opened={opened}
      position="bottom"
      size={"md"}
      className="overflow-y-hidden"
    >
      <Container fluid px={"xl"} mx={"xl"}>
        <Flex justify={"space-between"}>
          <Flex direction={"column"}>
            <p className="font-semibold text-xl text-black">Evidence</p>
            <p>{ticket?.identifier}</p>
          </Flex>

          <Flex align={"center"} gap={"lg"}>
            <EvidenceUploadButton
              ticketIdentifier={ticket?.identifier}
              text={hasBefore ? "Replace Before" : "Upload Before"}
              type="before"
            />
            <EvidenceUploadButton
              ticketIdentifier={ticket?.identifier}
              text={
                hasOnProgress ? "Replace On Progress" : "Upload On Progress"
              }
              type="onProgress"
            />
            <EvidenceUploadButton
              ticketIdentifier={ticket?.identifier}
              text={hasAfter ? "Replace After" : "Upload After"}
              type="after"
            />
          </Flex>
        </Flex>
      </Container>

      <Grid px={"md"} mx={"xl"} mt={"md"}>
        <Grid.Col span={4}>
          <EvidenceImageItem
            label="Before"
            src={evidences?.beforeUrl}
            identifier={ticket?.identifier}
            type="before"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <EvidenceImageItem
            label="On Progress"
            src={evidences?.onProgressUrl}
            identifier={ticket?.identifier}
            type="onProgress"
          />
        </Grid.Col>
        <Grid.Col span={4}>
          <EvidenceImageItem
            label="After"
            src={evidences?.afterUrl}
            identifier={ticket?.identifier}
            type="after"
          />
        </Grid.Col>
      </Grid>
    </Drawer>
  );
}
