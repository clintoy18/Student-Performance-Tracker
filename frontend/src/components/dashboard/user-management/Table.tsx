import React, { useState, useMemo, useEffect, useRef } from "react";
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
  Plus,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Edit,
  MoreVertical,
} from "lucide-react";
import { createPortal } from "react-dom";
import { fetchAllUsersAdmin } from "@services";
import { parseNumericRole } from "../../../utils/roleUtils";
import type { IUser } from "@interfaces";
import CreateTeacherModal from "./CreateTeacherModal";
import UpdateUserModal from "./UpdateUserModal";
import DeleteUserModal from "./DeleteUserModal";
import { InlineSpinner } from "../../../components/common/LoadingSpinnerPage";

const columnHelper = createColumnHelper<IUser>();

// Dropdown Menu Component with Positioning
const ActionDropdown = ({ 
  user, 
  onEdit, 
  onDelete 
}: { 
  user: IUser; 
  onEdit: () => void; 
  onDelete: () => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        const dropdown = document.getElementById(`dropdown-${user.UserId}`);
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [user.UserId]);

  const handleToggle = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right + window.scrollX - 144, // 144px = w-36 (9rem = 144px)
      });
    }
    setIsOpen(!isOpen);
  };

  const handleAction = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1 rounded hover:bg-gray-100 transition-colors"
        title="More actions"
      >
        <MoreVertical size={16} className="text-gray-600" />
      </button>

      {isOpen &&
        createPortal(
          <div
            id={`dropdown-${user.UserId}`}
            style={{
              position: 'absolute',
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
            className="w-36 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
          >
            <button
              onClick={() => handleAction(onEdit)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Edit size={14} />
              <span>Edit</span>
            </button>
            <button
              onClick={() => handleAction(onDelete)}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <Trash2 size={14} />
              <span>Delete</span>
            </button>
          </div>,
          document.body
        )}
    </>
  );
};

export default function UserTable() {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const rawData = await fetchAllUsersAdmin();
      const parsedUsers: IUser[] = rawData
        .map((user: any) => {
          const role = parseNumericRole(user.role);
          if (role === null) {
            console.warn("Unknown role value:", user.role, "for user", user.userId);
            return null;
          }

          return {
            UserId: user.userId,
            FirstName: user.firstName,
            MiddleName: user.middleName,
            LastName: user.lastName,
            Program: user.program,
            Role: role,
            CreatedTime: user.createdTime
          };
        })
        .filter((user): user is IUser => user !== null);

      setUsers(parsedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Modal handlers
  const handleOpenUpdate = (user: IUser) => {
    setSelectedUser(user);
    setIsUpdateModalOpen(true);
  };

  const handleOpenDelete = (user: IUser) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchUsers(); // Refresh the user list
  };

  const filteredData = useMemo(() => {
    return users.filter((user) => {
      const fullName = [user.FirstName, user.MiddleName, user.LastName]
        .filter(Boolean)
        .join(" ");

      const matchesSearch =
        fullName.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.UserId.toLowerCase().includes(globalFilter.toLowerCase()) ||
        user.Program.toLowerCase().includes(globalFilter.toLowerCase());
      const matchesRole = roleFilter === "All" || user.Role === roleFilter;
      return matchesSearch && matchesRole;
    });
  }, [users, globalFilter, roleFilter]);

  const columns = [
    columnHelper.display({
      id: "name",
      header: "Name",
      cell: (info) => {
        const user = info.row.original;
        const fullName = [user.FirstName, user.MiddleName, user.LastName]
          .filter(Boolean)
          .join(" ");
        return <div className="font-medium text-gray-900">{fullName}</div>;
      },
    }),
    columnHelper.accessor("UserId", {
      header: "User ID",
      cell: (info) => (
        <div className="text-gray-600 text-sm">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("Program", {
      header: "Program",
      cell: (info) => (
        <div className="text-gray-600 text-sm">{info.getValue()}</div>
      ),
    }),
    columnHelper.accessor("Role", {
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
    columnHelper.accessor("CreatedTime", {
      header: "Joined",
      cell: (info) => (
        <div className="text-gray-500 text-sm">
          {new Date(info.getValue()).toLocaleDateString()}
        </div>
      ),
    }),
    {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const user = info.row.original;
        return (
          <ActionDropdown
            user={user}
            onEdit={() => handleOpenUpdate(user)}
            onDelete={() => handleOpenDelete(user)}
          />
        );
      },
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
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
        >
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
            {loading ? (
              <tr>
                <td colSpan={6}>
                  <div className="flex flex-col py-32 items-center">
                    <InlineSpinner />
                    <span className="text-sm py-4 text-gray-800">Loading users...</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
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
                <td colSpan={6} className="text-center py-8 text-gray-500">
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

      {/* Modals */}
      <CreateTeacherModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleModalSuccess}
      />

      <UpdateUserModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        onSuccess={handleModalSuccess}
        user={selectedUser}
      />

      <DeleteUserModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onSuccess={handleModalSuccess}
        user={selectedUser}
      />
    </div>
  );
}