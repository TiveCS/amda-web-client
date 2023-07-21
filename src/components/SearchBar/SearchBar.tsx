import React, { useState } from 'react';
import { Input, Button } from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSearch(searchTerm);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        value={searchTerm}
        onChange={handleInputChange}
        placeholder="Search"
        radius="xl"
        className='max-w-3xl'
        rightSection={
          <Button type="submit" variant="default" color="dark" radius="xl">
            <IconSearch></IconSearch>
          </Button>
        }
      />
    </form>
  );
};

export default SearchBar;
