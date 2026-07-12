import { useMemo, useState } from "react";

export default function usePagination(items, pageSize = 10) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const paged = useMemo(() => items.slice(start, start + pageSize), [items, start, pageSize]);
  return { page: safePage, setPage, totalPages, paged, pageSize, total: items.length };
}
