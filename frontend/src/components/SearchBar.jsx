import { useState } from "react";
import { useNavigate } from "react-router";
import { Search } from "lucide-react";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md">
      <label className="input input-bordered flex items-center gap-2">
        <Search size={16} className="opacity-50" />
        <input
          type="text"
          placeholder="Search products..."
          className="grow"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
    </form>
  );
};

export default SearchBar;
