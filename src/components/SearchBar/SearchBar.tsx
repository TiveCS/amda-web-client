import { Button, TextInput } from "@mantine/core";
import { UseFormReturnType } from "@mantine/form";
import { IconSearch } from "@tabler/icons-react";
import React from "react";

interface SearchBarProps {
  searchForm: UseFormReturnType<
    {
      search: string;
    },
    (values: { search: string }) => {
      search: string;
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
        rightSection={
          <Button type="button" variant="default" color="dark" radius="xl">
            <IconSearch></IconSearch>
          </Button>
        }
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
