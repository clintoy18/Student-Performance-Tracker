import React, { useState, useMemo, useEffect } from "react";
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
  Users,
  UserPlus,
  BookOpen,
} from "lucide-react";
import Button from "../../common/Button";
import Modal from "../../common/modal/Modal";
import SubjectForm from "./subjects/SubjectForm";
import EnrollStudentModal from "./subjects/EnrollStudentModal";
import ViewEnrolledStudentsModal from "./subjects/ViewEnrolledStudentsModal";
import AssignTeacherModal from "./subjects/AssignTeacherModal";
import { getAllCourses, addCourse, updateCourse, deleteCourseByCourseCode } from "@services/CourseService";
import type { ICourse } from "@interfaces/models/ICourse";
import { useAuth } from "../../../context/AuthContext";
import { InlineSpinner } from "../../../components/common/LoadingSpinnerPage";
import type { IUser } from "@interfaces";
interface ICourseWithTeacherDetails extends ICourse {
  TeacherDetails: IUser
}

const columnHelper = createColumnHelper<ICourseWithTeacherDetails>();

export default function Subjects() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<ICourseWithTeacherDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalFilter, setGlobalFilter] = useState("");

  // Modal states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEnrollModalOpen, setIsEnrollModalOpen] = useState(false);
  const [isViewStudentsModalOpen, setIsViewStudentsModalOpen] = useState(false);
  const [isAssignTeacherModalOpen, setIsAssignTeacherModalOpen] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [error, setError] = useState("");


  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const rawData = await getAllCourses();

      const parsedData: ICourseWithTeacherDetails[] = rawData.map((course) => {
        // Handle assignedTeacher being null
        const teacher = course.assignedTeacher;

        return {
          Id: course.id,
          CourseCode: course.courseCode,
          CourseName: course.courseName,
          CourseDescription: course.courseDescription,
          CreatedAt: course.createdAt,
          TeacherUserId: teacher?.userId ?? null, // or "" if you prefer string
          TeacherDetails: teacher
            ? {
              UserId: teacher.userId,
              FirstName: teacher.firstName ?? "",
              MiddleName: teacher.middleName ?? "",
              LastName: teacher.lastName ?? "",
              Program: teacher.program ?? "",
              CreatedTime: teacher.createdTime,
              Role: teacher.role,
            }
            : null,
        };
      });

      setCourses(parsedData);
    } catch (err: any) {
      setError("Failed to load courses");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Modal handlers
  const handleOpenEdit = (course: ICourse) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const handleOpenDelete = (course: ICourse) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleOpenEnroll = (course: ICourse) => {
    setSelectedCourse(course);
    setIsEnrollModalOpen(true);
  };

  const handleOpenViewStudents = (course: ICourse) => {
    setSelectedCourse(course);
    setIsViewStudentsModalOpen(true);
  };

  const handleOpenAssignTeacher = (course: ICourse) => {
    setSelectedCourse(course);
    setIsAssignTeacherModalOpen(true);
  };

  const handleModalSuccess = () => {
    fetchCourses(); // Refresh the course list
  };

  const handleAddCourse = async (data: Partial<ICourse>) => {
    try {
      await addCourse(data);
      handleModalSuccess();
      setIsCreateModalOpen(false);
    } catch (err: any) {
      console.error("Error adding course:", err);
      throw err;
    }
  };

  const handleUpdateCourse = async (data: Partial<ICourse>) => {
    try {
      if (!selectedCourse)
        throw new Error("No course selected for update")
      
      const updatePayload = {
        ...data,
        TeacherUserId: selectedCourse.TeacherUserId
      }
      await updateCourse(updatePayload);
      handleModalSuccess();
      setIsEditModalOpen(false);
      setSelectedCourse(null);
    } catch (err: any) {
      console.error("Error updating course:", err);
      throw err;
    }
  };

  const handleDeleteCourse = async () => {
    if (!selectedCourse) return;

    setDeleteLoading(true);
    try {
      await deleteCourseByCourseCode(selectedCourse.CourseCode);
      handleModalSuccess();
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
    } catch (err: any) {
      console.error("Error deleting course:", err);
      setError(err.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleEnrollSuccess = () => {
    setIsEnrollModalOpen(false);
    setSelectedCourse(null);
  };

  const columns = [
    columnHelper.accessor("CourseCode", {
      header: "Course Code",
      cell: (info) => <div className="font-medium text-gray-900 text-sm">{info.getValue()}</div>,
    }),
    columnHelper.accessor("CourseName", {
      header: "Course Name",
      cell: (info) => <div className="text-gray-900 text-sm">{info.getValue()}</div>,
    }),
    columnHelper.accessor("CourseDescription", {
      header: "Description",
      cell: (info) => <div className="text-gray-600 text-sm">{info.getValue() || "—"}</div>,
    }),
    columnHelper.accessor("TeacherDetails", {
      header: "Assigned Teacher",
      cell: (info) => {
        const teacher = info.getValue() as IUser | undefined;
        if (!teacher || !teacher.UserId) {
          return <span className="text-gray-500 text-sm">—</span>;
        }
        const fullName = [teacher.FirstName, teacher.MiddleName, teacher.LastName]
          .filter(Boolean)
          .join(" ");
        return (
          <div className="text-gray-900 text-sm">
            <div>{fullName}</div>
            <div className="text-xs text-gray-500">ID: {teacher.UserId}</div>
          </div>
        );
      },
    }),
    {
      id: "actions",
      header: "Actions",
      cell: (info) => {
        const course = info.row.original;
        return (
          <div className="flex gap-1 sm:gap-2 flex-wrap">
            <button
              onClick={() => handleOpenViewStudents(course)}
              className="flex items-center gap-1 text-purple-600 border border-purple-300 px-2 py-1 rounded text-xs hover:bg-purple-50 transition-colors"
              title="View Enrolled Students"
            >
              <Users size={12} />
              <span className="hidden sm:inline">Students</span>
            </button>

            <button
              onClick={() => handleOpenEnroll(course)}
              className="flex items-center gap-1 text-green-600 border border-green-300 px-2 py-1 rounded text-xs hover:bg-green-50 transition-colors"
              title="Enroll Student"
            >
              <UserPlus size={12} />
              <span className="hidden sm:inline">Enroll</span>
            </button>

            <button
              onClick={() => handleOpenAssignTeacher(course)}
              className="flex items-center gap-1 text-indigo-600 border border-indigo-300 px-2 py-1 rounded text-xs hover:bg-indigo-50 transition-colors"
              title="Assign Teacher"
            >
              <UserPlus size={12} />
              <span className="hidden sm:inline">Assign</span>
            </button>

            <button
              onClick={() => handleOpenEdit(course)}
              className="flex items-center gap-1 text-blue-600 border border-blue-300 px-2 py-1 rounded text-xs hover:bg-blue-50 transition-colors"
              title="Edit Course"
            >
              <Edit size={12} />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={() => handleOpenDelete(course)}
              className="flex items-center gap-1 text-red-600 border border-red-300 px-2 py-1 rounded text-xs hover:bg-red-50 transition-colors"
              title="Delete Course"
            >
              <Trash2 size={12} />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: courses,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 5 } },
  });

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Course Management</h2>
          <p className="text-gray-500 text-sm mt-1">View and manage all courses</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>Add Course</span>
        </button>
      </div>

      {/* Search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search courses..."
            className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-gray-400 focus:border-transparent"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">{error}</div>}

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
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4}>
                  <div className="flex flex-col py-32 items-center">
                    <InlineSpinner />
                    <span className="text-sm py-4 text-gray-800">Loading courses...</span>
                  </div>
                </td>
              </tr>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-3 py-3 border-b text-sm">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-8 text-gray-500">
                  <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                  <p className="text-sm">No courses found.</p>
                  <p className="text-xs mt-1">Add your first course to get started</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <span>Page</span>
          <strong>
            {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
          </strong>
          <span className="hidden sm:inline">•</span>
          <span className="hidden sm:inline">
            {table.getFilteredRowModel().rows.length} courses
          </span>
        </div>

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
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
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

        <div className="flex items-center gap-2 text-sm">
          <label htmlFor="pageSize" className="text-gray-600">Rows:</label>
          <select
            id="pageSize"
            value={table.getState().pagination.pageSize}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-gray-400"
          >
            {[5, 10, 20, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>{pageSize}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Add New Course">
        <SubjectForm onSubmit={handleAddCourse} onCancel={() => setIsCreateModalOpen(false)} teacherUserId={user?.UserId || ""} />
      </Modal>

      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Course">
        <SubjectForm onSubmit={handleUpdateCourse} onCancel={() => setIsEditModalOpen(false)} initialData={selectedCourse} teacherUserId={user?.UserId || ""} />
      </Modal>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Course">
        <div className="space-y-4">
          <p className="text-gray-700 text-sm">
            Are you sure you want to delete this course? This action cannot be undone.
          </p>

          {selectedCourse && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Course Name:</span>
                <span className="font-medium text-gray-900">{selectedCourse.CourseName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Course Code:</span>
                <span className="font-medium text-gray-900">{selectedCourse.CourseCode}</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button type="button" onClick={() => setIsDeleteModalOpen(false)} label="Cancel" className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300" disabled={deleteLoading} />
            <Button type="button" onClick={handleDeleteCourse} label={deleteLoading ? "Deleting..." : "Delete Course"} className="flex-1 bg-red-600 text-white hover:bg-red-700" disabled={deleteLoading} />
          </div>
        </div>
      </Modal>

      <EnrollStudentModal isOpen={isEnrollModalOpen} onClose={() => setIsEnrollModalOpen(false)} onSuccess={handleEnrollSuccess} course={selectedCourse} />

      <ViewEnrolledStudentsModal isOpen={isViewStudentsModalOpen} onClose={() => setIsViewStudentsModalOpen(false)} course={selectedCourse} />

      <AssignTeacherModal
        isOpen={isAssignTeacherModalOpen}
        onClose={() => setIsAssignTeacherModalOpen(false)}
        course={selectedCourse ? { Id: selectedCourse.Id, CourseName: selectedCourse.CourseName } : null}
        onSuccess={() => {
          setIsAssignTeacherModalOpen(false);
          setSelectedCourse(null);
          fetchCourses(); // optional: refresh courses after assignment
        }}
      />
    </div>
  );
}
