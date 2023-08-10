import { getListTickets } from "@api/tickets";
import { useInfiniteQuery } from "@tanstack/react-query";
import { amdaDayJs } from "src/utils";
import useFilterForm from "./useFilterForm";

interface GetListTicketsQueryProps {
  searchDebounced: string;
  filterForm: ReturnType<typeof useFilterForm>;
}

export default function useGetListTicketsQuery({
  filterForm,
  searchDebounced,
}: GetListTicketsQueryProps) {
  const dayjs = amdaDayJs();

  const {
    refetch: refetchListTicketQuery,
    isFetching: isFetchingListTicketQuery,
    isLoading: isLoadingListTicketQuery,
    data: listTicketQueryData,
    ...getListTicketQuery
  } = useInfiniteQuery({
    queryKey: ["tickets"],
    queryFn: async ({ pageParam = 0 }) => {
      const inputDate = dayjs(filterForm.form.values.inputDate)
        .utc()
        .add(1, "month");

      return getListTickets({
        cursor: pageParam as number,
        take: 20,
        search: searchDebounced,
        inputDate: inputDate.isValid()
          ? inputDate.startOf("month").toDate()
          : null,
        identifier: filterForm.form.values.identifier,
        location: filterForm.form.values.location,
        acceptStatus: filterForm.form.values.acceptStatus,
        evidenceStatus: filterForm.form.values.evidenceStatus,
        mitraIds: filterForm.form.values.mitraIds ?? undefined,
      });
    },
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
