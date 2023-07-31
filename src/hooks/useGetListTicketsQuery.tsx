import { getListTickets } from "@api/tickets";
import { useInfiniteQuery } from "@tanstack/react-query";
import useFilterForm from "./useFilterForm";

interface GetListTicketsQueryProps {
  searchDebounced: string;
  filterForm: ReturnType<typeof useFilterForm>;
}

export default function useGetListTicketsQuery({
  filterForm,
  searchDebounced,
}: GetListTicketsQueryProps) {
  const {
    refetch: refetchListTicketQuery,
    isFetching: isFetchingListTicketQuery,
    isLoading: isLoadingListTicketQuery,
    data: listTicketQueryData,
    ...getListTicketQuery
  } = useInfiniteQuery({
    queryKey: ["tickets"],
    queryFn: async ({ pageParam = 0 }) =>
      getListTickets({
        cursor: pageParam as number,
        take: 20,
        search: searchDebounced,
        identifier: filterForm.form.values.identifier,
        location: filterForm.form.values.location,
        acceptStatus: filterForm.form.values.acceptStatus,
        evidenceStatus: filterForm.form.values.evidenceStatus,
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  return {
    refetchListTicketQuery,
    isFetchingListTicketQuery,
    isLoadingListTicketQuery,
    listTicketQueryData,
    getListTicketQuery,
  };
}
