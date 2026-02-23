import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const statusOptions = ["", "created", "pending", "failed"];

const CompaniesTable = ({
  data,
  pagination,
  isLoading,
  status,
  onFilterChange,
  onPageChange,
  onRowClick
}) => {
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString() : "—";

  const StatusBadge = ({ value }) => (
    <span className="px-2.5 py-1 text-xs rounded-full border bg-gray-50">
      {value || "unknown"}
    </span>
  );

  return (
    <div className="space-y-6">

      {/* Filter Bar */}
      <div className="flex items-center justify-between">
        <select
          value={status}
          onChange={(e) => onFilterChange(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          {statusOptions.map((s) => (
            <option key={s} value={s}>
              {s || "All statuses"}
            </option>
          ))}
        </select>

        {pagination && (
          <p className="text-sm text-gray-500">
            {pagination.total_items} companies
          </p>
        )}
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Contact</th>
              <th className="px-6 py-3 text-left">Joined</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  Loading…
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  No companies found
                </td>
              </tr>
            ) : (
              data.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => onRowClick(c)}
                  className="hover:bg-gray-50 cursor-pointer border-b"
                >
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4">{c.email || "—"}</td>
                  <td className="px-6 py-4">{formatDate(c.created_at)}</td>
                  <td className="px-6 py-4">
                    <StatusBadge value={c.folder_status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.total_pages}
          </p>

          <div className="flex gap-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-2 border rounded-lg disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>

            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.total_pages}
              className="p-2 border rounded-lg disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompaniesTable;