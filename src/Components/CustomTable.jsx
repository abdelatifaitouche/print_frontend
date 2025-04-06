import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input"; // Assuming you have this component
import { Search, SortDesc, ChevronLeft, ChevronRight, Filter, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
function CustomTable({ data }) {
  const navigate = useNavigate()
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    client: "",
    company: "",
  });
  const [sorting, setSorting] = useState({
    field: "created_at",
    direction: "desc",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const itemsPerPage = 10;
  
  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // List of possible statuses for filter dropdown
  const statuses = ["Pending", "Processing", "Completed", "Cancelled"];
  
  // Apply filters and sorting whenever data or filters change
  useEffect(() => {
    if (!data) return;
    
    // Apply filters
    let result = [...data];
    
    if (filters.status) {
      result = result.filter(item => item.status.toLowerCase() === filters.status.toLowerCase());
    }
    
    if (filters.client) {
      result = result.filter(item => 
        // Replace with actual client field when available
        "Idriss Moula".toLowerCase().includes(filters.client.toLowerCase())
      );
    }
    
    if (filters.company) {
      result = result.filter(item => 
        // Replace with actual company field when available
        "Grant thornton".toLowerCase().includes(filters.company.toLowerCase())
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      const fieldA = a[sorting.field];
      const fieldB = b[sorting.field];
      
      if (sorting.field === "created_at") {
        const dateA = new Date(fieldA);
        const dateB = new Date(fieldB);
        return sorting.direction === "asc" ? dateA - dateB : dateB - dateA;
      }
      
      // String comparison for other fields
      if (fieldA < fieldB) return sorting.direction === "asc" ? -1 : 1;
      if (fieldA > fieldB) return sorting.direction === "asc" ? 1 : -1;
      return 0;
    });
    
    setFilteredData(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [data, filters, sorting]);
  
  // Calculate pagination
  const totalPages = Math.ceil((filteredData?.length || 0) / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredData?.slice(startIndex, startIndex + itemsPerPage);
  
  // Change page
  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Toggle sort direction for a column
  const toggleSort = (field) => {
    setSorting({
      field,
      direction: sorting.field === field && sorting.direction === "desc" ? "asc" : "desc"
    });
  };
  
  // Get status badge styling based on status
  const getStatusBadge = (status) => {
    const statusStyles = {
      "pending": "bg-yellow-50 border-yellow-400 text-yellow-600",
      "processing": "bg-blue-50 border-blue-400 text-blue-600",
      "completed": "bg-green-50 border-green-400 text-green-600",
      "cancelled": "bg-red-50 border-red-400 text-red-600",
      "default": "bg-zinc-50 border-zinc-400 text-zinc-600"
    };
    
    const statusKey = status?.toLowerCase() || "default";
    return statusStyles[statusKey] || statusStyles.default;
  };

  return (
    <div className="overflow-hidden">
      {/* Filters */}
      <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-zinc-200">
        <div className="relative w-full sm:w-64">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" />
          <Input 
            placeholder="Search orders..." 
            className="pl-9 bg-white border-zinc-200"
            onChange={(e) => setFilters({...filters, client: e.target.value})}
          />
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Button 
            variant="outline" 
            size="sm"
            className="text-zinc-600 border-zinc-200"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter size={16} className="mr-2" />
            Filters
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="text-zinc-600 border-zinc-200"
            onClick={() => toggleSort("created_at")}
          >
            <SortDesc size={16} className="mr-2" />
            {sorting.direction === "desc" ? "Newest First" : "Oldest First"}
          </Button>
        </div>
      </div>
      
      {/* Advanced Filters */}
      {isFilterOpen && (
        <div className="p-4 bg-zinc-50 border-b border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1">Status</label>
            <select 
              className="w-full p-2 border border-zinc-200 rounded-md bg-white"
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
            >
              <option value="">All Statuses</option>
              {statuses.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1">Client</label>
            <Input 
              placeholder="Filter by client" 
              className="bg-white border-zinc-200"
              value={filters.client}
              onChange={(e) => setFilters({...filters, client: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-zinc-600 mb-1">Company</label>
            <Input 
              placeholder="Filter by company" 
              className="bg-white border-zinc-200"
              value={filters.company}
              onChange={(e) => setFilters({...filters, company: e.target.value})}
            />
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableCaption>
            {filteredData?.length 
              ? `Showing ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, filteredData.length)} of ${filteredData.length} orders`
              : "No orders found"
            }
          </TableCaption>
          <TableHeader>
            <TableRow className="bg-zinc-50 hover:bg-zinc-50">
              <TableHead className="w-[150px] cursor-pointer" onClick={() => toggleSort("order_name")}>
                Order ID
                {sorting.field === "order_name" && (
                  <span className="ml-1">{sorting.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("client")}>
                Client
                {sorting.field === "client" && (
                  <span className="ml-1">{sorting.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead>Company</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("status")}>
                Status
                {sorting.field === "status" && (
                  <span className="ml-1">{sorting.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead>Items</TableHead>
              <TableHead className="cursor-pointer" onClick={() => toggleSort("created_at")}>
                Date
                {sorting.field === "created_at" && (
                  <span className="ml-1">{sorting.direction === "asc" ? "↑" : "↓"}</span>
                )}
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData?.length ? (
              paginatedData.map((item, index) => (
                <TableRow key={index} className="hover:bg-zinc-50">
                  <TableCell className="font-medium text-teal-600">#{item.order_name}</TableCell>
                  <TableCell>{item.user.username}</TableCell>
                  <TableCell>{item.company.company_name}</TableCell>
                  <TableCell>
                    <span className={`inline-block border text-sm font-medium px-2.5 py-0.5 rounded-full ${getStatusBadge(item.status)}`}>
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell>{item.items.length}</TableCell>
                  <TableCell>{formatDate(item.created_at)}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                    onClick={() => {
                      //navigate to
                      navigate(`/Commandes/OrderDetails/${item.id}`, {
                        state: { item },
                      });
                    }}
                      size="sm" 
                      className="bg-teal-500 hover:bg-teal-600 text-white flex items-center gap-1"
                    >
                      <Eye size={14} />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                  No orders match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 border-t border-zinc-200">
          <div className="text-sm text-zinc-500">
            Page {currentPage} of {totalPages}
          </div>
          
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-zinc-200"
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={i}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    size="sm"
                    className={pageNum === currentPage 
                      ? "bg-teal-500 hover:bg-teal-600" 
                      : "border-zinc-200"
                    }
                    onClick={() => goToPage(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button 
              variant="outline" 
              size="sm"
              className="border-zinc-200"
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CustomTable;