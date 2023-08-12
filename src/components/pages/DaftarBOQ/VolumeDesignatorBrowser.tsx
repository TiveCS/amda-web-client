import { getListDesignator } from "@api/designators";
import { LopTicket } from "@api/types/tickets";
import useAddVolumeMutation from "@hooks/useAddVolumeMutation";
import useRemoveVolumeMutation from "@hooks/useRemoveVolumeMutation";
import {
  ActionIcon,
  Center,
  LoadingOverlay,
  ScrollArea,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import React, { useEffect, useMemo } from "react";
import VolumeDesignatorBrowseItem from "./VolumeDesignatorBrowseItem";

interface VolumeDesignatorBrowserProps {
  ticket: LopTicket | null;
  searchForm: UseFormReturnType<{ search: string }>;
  searchDebounced: string;
  addVolumeMutation: ReturnType<typeof useAddVolumeMutation>;
  removeVolumeMutation: ReturnType<typeof useRemoveVolumeMutation>;
  isAllowEdit?: boolean;
}

export default function VolumeDesignatorBrowser({
  ticket,
  searchForm,
  searchDebounced,
  addVolumeMutation,
  removeVolumeMutation,
  isAllowEdit,
}: VolumeDesignatorBrowserProps) {
  const {
    data: listDesignators,
    fetchNextPage,
    isLoading,
    isFetching,
    hasNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["volume_designator_browser_designators"],
    refetchOnWindowFocus: false,
    queryFn: async ({ pageParam = 0 }) => {
      const res = await getListDesignator({
        search: searchDebounced,
        take: 15,
        cursor: pageParam as number,
        takeForTicket: ticket?.identifier,
      });

      return res;
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    // check if scroll reach bottom
    const isBottom =
      e.currentTarget.scrollHeight - e.currentTarget.scrollTop ===
      e.currentTarget.clientHeight;

    // if scroll reach bottom, fetch more data
    if (isBottom && hasNextPage) {
      void fetchNextPage();
    }
  };

  const foundAmount = useMemo(() => {
    return listDesignators?.pages.reduce((acc, page) => {
      return acc + page.data.length;
    }, 0);
  }, [listDesignators?.pages]);

  useEffect(() => {
    void refetch();
  }, [refetch, searchDebounced]);

  return (
    <>
      <TextInput
        placeholder="Cari Designator"
        data-autofocus
        rightSection={
          searchForm.values.search && (
            <ActionIcon onClick={() => searchForm.reset()}>
              <IconX size={20} />
            </ActionIcon>
          )
        }
        icon={<IconSearch size={20} />}
        {...searchForm.getInputProps("search")}
      />

      <ScrollArea.Autosize
        id="browse-designator"
        offsetScrollbars
        onScroll={handleScroll}
        className="max-h-[100%] mt-4"
      >
        <LoadingOverlay visible={isFetching || isLoading} />

        <Stack spacing={"md"}>
          {foundAmount === 0 && (
            <Center>
              <Text color="gray">Designator tidak ditemukan</Text>
            </Center>
          )}

          {listDesignators?.pages.map((page, index) => (
            <React.Fragment key={index}>
              {page.data.map((designator) => {
                const { volumes } = designator;

                return (
                  <VolumeDesignatorBrowseItem
                    key={designator.id}
                    designator={designator}
                    search={searchDebounced}
                    isReadOnly={!isAllowEdit}
                    volumeId={volumes && volumes[0] ? volumes[0].id : -1}
                    addVolumeMutation={addVolumeMutation}
                    removeVolumeMutation={removeVolumeMutation}
                  />
                );
              })}
            </React.Fragment>
          ))}
        </Stack>
      </ScrollArea.Autosize>
    </>
  );
}
