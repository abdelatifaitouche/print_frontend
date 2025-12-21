import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Search,
  Eye,
  ArrowUpDown,
  X
} from "lucide-react";

const CompaniesTable = ({ data = [], onRowClick, isLoading = false }) => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "created_at",
    direction: "desc",
  });
  const [filters, setFilters] = useState({
    status: "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Format date to be more readable
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(date);
  };

  // Sort data
  const sortedData = useMemo(() => {
    let sortableData = [...data];
    if (sortConfig.key) {
      sortableData.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableData;
  }, [data, sortConfig]);

  // Filter data
  const filteredData = useMemo(() => {
    return sortedData.filter((company) => {
      const matchesSearch = 
        company.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        !filters.status || company.folder_status?.toLowerCase() === filters.status.toLowerCase();

      return matchesSearch && matchesStatus;
    });
  }, [sortedData, searchTerm, filters]);

  // Request sort
  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get status badge variant
  const getStatusVariant = (folder_status) => {
    switch (folder_status?.toLowerCase()) {
      case "created": return "bg-gray-100 text-gray-800 border-gray-300";
      case "pending": return "bg-gray-200 text-gray-900 border-gray-400";
      case "failed": return "bg-red-50 text-red-700 border-red-300";
      default: return "bg-white text-gray-600 border-gray-300";
    }
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({ status: "" });
    setSearchTerm("");
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4 p-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            placeholder="Search companies..."
            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <button
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              isFilterOpen 
                ? "bg-black text-white" 
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} />
            Filters
            {activeFiltersCount > 0 && (
              <span className="px-2 py-0.5 text-xs bg-gray-200 text-gray-900 rounded-full">
                {activeFiltersCount}
              </span>
            )}
          </button>

          {activeFiltersCount > 0 && (
            <button
              className="flex items-center gap-1 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
              onClick={clearFilters}
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">Status</label>
              <select
                className="w-full p-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
                value={filters.status}
                onChange={(e) => setFilters({...filters, status: e.target.value})}
              >
                <option value="">All Statuses</option>
                <option value="created">Created</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("name")}
                >
                  <div className="flex items-center gap-1">
                    Company
                    <ArrowUpDown size={14} className="text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Location
                </th>
                <th 
                  className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => requestSort("created_at")}
                >
                  <div className="flex items-center gap-1">
                    Joined
                    <ArrowUpDown size={14} className="text-gray-400" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div></td>
                    <td className="px-6 py-4 text-right"><div className="h-4 bg-gray-200 rounded animate-pulse w-12 ml-auto"></div></td>
                  </tr>
                ))
              ) : filteredData.length > 0 ? (
                filteredData.map((company) => (
                  <tr 
                    key={company.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => onRowClick ? onRowClick(company) : null}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-sm font-semibold text-gray-700">
                            {company.name?.charAt(0)?.toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{company.name}</div>
                          <div className="text-sm text-gray-500">{company.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{company.contact_name || "—"}</div>
                      <div className="text-sm text-gray-500">{company.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">{company.address}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(company.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusVariant(company.folder_status)}`}>
                        {company.folder_status || "Unknown"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/companies/companyDetails/${company.id}`, {
                            state: { company }
                          });
                        }}
                      >
                        <Eye size={16} />
                        View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      {searchTerm || activeFiltersCount > 0
                        ? "No matching companies found" 
                        : "No companies available"}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {filteredData.length > 0 && (
        <div className="flex items-center justify-between px-2">
          <div className="text-sm text-gray-600">
            Showing {filteredData.length} of {data.length} companies
          </div>
          <div className="flex items-center space-x-2">
            <button
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={true}
            >
              <ChevronLeft size={16} />
            </button>
            <button
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              disabled={true}
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