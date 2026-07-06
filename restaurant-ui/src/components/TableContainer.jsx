import { useState, useMemo } from "react";
import { SearchBar } from "./SearchBar";

export function TableContainer({ title, columns, data, searchFields, onDelete, isLoading }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 10;

  // Filter data based on search term
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    return data.filter((item) =>
      searchFields.some((field) => {
        const value = String(item[field] || "").toLowerCase();
        return value.includes(searchTerm.toLowerCase());
      })
    );
  }, [data, searchTerm, searchFields]);

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortConfig.key) return filteredData;

    const sorted = [...filteredData].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === "string") {
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    });

    return sorted;
  }, [filteredData, sortConfig]);

  // Paginate data
  const paginatedData = useMemo(() => {
    const start = currentPage * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (columnKey) => {
    setSortConfig((prev) => ({
      key: columnKey,
      direction: prev.key === columnKey && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(0);
  };

  const handleSearch = (term) => {
    setSearchTerm(term);
    setCurrentPage(0);
  };

  return (
    <div className="content-wrapper">
      <div className="panel-header">
        <h3>{title}</h3>
        <SearchBar value={searchTerm} onChange={handleSearch} placeholder={`Search ${title.toLowerCase()}...`} />
      </div>

      {isLoading ? (
        <div className="empty-state">Loading…</div>
      ) : paginatedData.length === 0 ? (
        <div className="empty-state">
          <p>No {title.toLowerCase()} found</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className={`sortable ${sortConfig.key === col.key ? `sorted-${sortConfig.direction}` : ""}`}
                  >
                    {col.label}
                    {sortConfig.key === col.key && (
                      <span className="sort-indicator">{sortConfig.direction === "asc" ? " ▲" : " ▼"}</span>
                    )}
                  </th>
                ))}
                {onDelete && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item) => (
                <tr key={item.id}>
                  {columns.map((col) => (
                    <td key={col.key} className={col.className || ""}>
                      {col.render ? col.render(item[col.key], item) : formatValue(item[col.key])}
                    </td>
                  ))}
                  {onDelete && (
                    <td className="action-cell">
                      <button
                        type="button"
                        className="secondary-button danger-button small"
                        onClick={() => onDelete(item.id)}
                        title="Delete"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="pagination-btn"
          >
            ← Previous
          </button>
          <span className="pagination-info">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage >= totalPages - 1}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="pagination-btn"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}

function formatValue(value) {
  if (value === null || value === undefined) return "-";
  if (typeof value === "number") return value;
  return String(value);
}