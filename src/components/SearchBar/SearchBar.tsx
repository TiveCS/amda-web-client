import { TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import React from "react";

interface SearchBarProps {
  searchForm: UseFormReturnType<
    {
      search: string;
    },
    (values: { search: string }) => {
      search: string;
      [key: string]: unknown;
    }
  >;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchForm }) => {
  return (
    <form>
      <TextInput
        placeholder="Search"
        radius="xl"
        className="max-w-3xl"
        value={searchForm.values.search}
        onChange={(event) =>
          searchForm.setFieldValue("search", event.currentTarget.value)
        }
        error={searchForm.errors.search}
      />
    </form>
  );
};

export default SearchBar;
