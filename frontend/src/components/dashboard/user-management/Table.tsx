import React, { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import {
  Search,
  Trash2,
  FileDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type User = {
  name: string;
  email: string;
  role: "Admin" | "Teacher" | "Student";
  joined: string;
};

const data: User[] = [
  { name: "James Walker", email: "jwalker@uc.edu.ph", role: "Teacher", joined: "9/7/2025" },
  { name: "Vince Bryant N. Cabunilas", email: "vincebryantcabunilas@gmail.com", role: "Student", joined: "9/7/2025" },
  { name: "Sean Joseph C. Arcana", email: "seanjosepharcana@gmail.com", role: "Admin", joined: "9/7/2025" },
  { name: "John Doe", email: "john.doe@example.com", role: "Student", joined: "9/8/2025" },
  { name: "Jane Smith", email: "jane.smith@example.com", role: "Teacher", joined: "9/8/2025" },
  { name: "Mike Johnson", email: "mike.johnson@example.com", role: "Student", joined: "9/9/2025" },
  { name: "Sarah Wilson", email: "sarah.wilson@example.com", role: "Admin", joined: "9/9/2025" },
  { name: "David Brown", email: "david.brown@example.com", role: "Student", joined: "9/10/2025" },
];

const columnHelper = createColumnHelper<User>();

export default function UserTable() {
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  const filteredData = useMemo(() => {
    return data.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.email.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesRole = roleFilter === "All" || user.role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [globalFilter, roleFilter]);

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
      cell: (info) => (
        <div className="font-medium text-gray-900">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("email", {
      header: "Email",
      cell: (info) => (
        <div className="text-gray-600 text-sm">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("role", {
      header: "Role",
      cell: (info) => {
        const role = info.getValue();
        const roleStyle =
          role === "Admin"
            ? "bg-red-100 text-red-700 border-red-200"
            : role === "Teacher"
            ? "bg-blue-100 text-blue-700 border-blue-200"
            : "bg-green-100 text-green-700 border-green-200";
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${roleStyle}`}
          >
            {role}
          </span>
        );
      },
    }),
    columnHelper.accessor("joined", {
      header: "Joined",
      cell: (info) => (
        <div className="text-gray-500 text-sm">{info.getValue()}</div>
      ),
    }),
    {
      id: "actions",
      header: "Actions",
      cell: () => (
        <div className="flex gap-1 sm:gap-2">
          <button
            className="flex items-center gap-1 text-gray-600 border border-gray-300 px-2 py-1 rounded text-xs hover:bg-gray-50 transition-colors"
            title="Generate Report"
          >
            <FileDown size={12} />
            <span className="hidden sm:inline">Report</span>
          </button>
          <button
            className="flex items-center gap-1 text-red-600 border border-red-300 px-2 py-1 rounded text-xs hover:bg-red-50 transition-colors"
            title="Delete User"
          >
            <Trash2 size={12} />
            <span className="hidden sm:inline">Delete</span>
          </button>
        </div>
      ),
    },
  ];

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            User Management
          </h2>
          <p className="text-gray-500 text-sm mt-1">View and manage all users</p>
        </div>
        <button className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto">
          <Plus size={16} />
          <span>Create Teacher</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>

        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
        >
          <option value="All">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Teacher">Teacher</option>
          <option value="Student">Student</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border border-gray-200 rounded-lg">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="text-left px-3 py-3 font-medium text-gray-700 text-sm border-b"
                  >
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 border-b text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center py-8 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200">
        {/* Page Info */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Page</span>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{" "}
            {table.getPageCount()}
          </strong>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            {table.getFilteredRowModel().rows.length} users
          </span>
        </div>

        {/* Pagination Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="First page"
          >
            <ChevronsLeft size={16} />
          </button>
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="p-2 rounded border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Previous page"
          >
            <ChevronLeft size={16} />
          </button>
          <div className="flex items-center gap-1 mx-2">
            <span className="text-sm text-gray-600 px-2">
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </span>
          </div>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Next page"
          >
            <ChevronRight size={16} />
          </button>
          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            className="p-2 rounded border border-gray-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            title="Last page"
          >
            <ChevronsRight size={16} />
          </button>
        </div>

        {/* Page Size Selector */}
        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="pageSize" className="text-gray-600">
            Rows:
          </label>
          <select
            id="pageSize"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-gray-400"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
