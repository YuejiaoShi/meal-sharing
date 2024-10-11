import { IconButton, InputBase, Paper } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function SearchBar({ searchQuery, handleSearchSubmit, setSearchQuery }) {
  return (
    <Paper
      component="form"
      onSubmit={handleSearchSubmit}
      className="flex items-center h-10 rounded-full pl-4 pr-1 bg-gray-100 shadow-md"
    >
      <InputBase
        className="flex-grow text-black bg-transparent outline-none"
        placeholder="Search..."
        inputProps={{ "aria-label": "search meal" }}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <IconButton
        type="button"
        aria-label="search"
        className="p-2 text-gray-600 hover:text-gray-800"
      >
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}

export default SearchBar;
