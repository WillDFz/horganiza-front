import { TextField } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import React from 'react';

interface SearchProps {
    query: string;
    setQuery: (query: string) => void;
}

const Search: React.FC<SearchProps> = ({ query, setQuery }) => {
    return (
        <form
            role="search"
            className="w-full max-w-lg"
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <div className="flex min-h-11 w-full items-stretch overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                <TextField
                    type="search"
                    placeholder="Pesquisar"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    variant="standard"
                    fullWidth
                    aria-label="Campo de pesquisa"
                    slotProps={{
                        input: {
                            disableUnderline: true,
                        },
                        htmlInput: {
                            className:
                                'box-border min-h-11 px-3 py-2 text-sm text-custom-black placeholder:text-custom-gray',
                        },
                    }}
                />
                <button
                    type="submit"
                    className="flex min-h-11 w-11 shrink-0 items-center justify-center bg-primary text-white transition hover:bg-primary-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                    aria-label="Buscar"
                >
                    <SearchIcon sx={{ fontSize: 22 }} />
                </button>
            </div>
        </form>
    );
};

export default Search;
