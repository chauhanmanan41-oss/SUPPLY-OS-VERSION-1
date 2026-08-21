import { useState } from "react";

export function useSearch(initial = "All") {
  const [searchFilter, setSearchFilter] = useState(initial);
  return { searchFilter, setSearchFilter };
}
