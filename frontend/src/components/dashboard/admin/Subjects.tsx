import React, { useState, useEffect } from "react";
import Button from "../../common/Button";
import { PlusCircle, BookOpen, Edit, Trash2 } from "lucide-react";
import Modal from "../../common/modal/Modal";
import SubjectForm from "./subjects/SubjectForm";
import { getAllCourses, addCourse, updateCourse, deleteCourseByCourseCode } from "@services/CourseService";
import type { ICourse } from "@interfaces/models/ICourse";
import { useAuth } from "../../../context/AuthContext";
import { InlineSpinner } from "../../../components/common/LoadingSpinnerPage";

const Subjects: React.FC = () => {
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    setError("");
    try {
      const rawData = await getAllCourses();
      const parsedData: ICourse[] = rawData
        .map(course => ({
          Id: course.id,
          CourseCode: course.courseCode,
          CourseName: course.courseName,
          CourseDescription: course.courseDescription,
          CreatedAt: course.createdAt,
          TeacherUserId: course.userId
        }))
      console.log(parsedData)
      setCourses(parsedData);
    } catch (err: any) {
      setError("Failed to load courses");
      console.error("Error fetching courses:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (data: Partial<ICourse>) => {
    try {
      await addCourse(data);
      await fetchCourses();
      setIsModalOpen(false);
    } catch (err: any) {
      console.error("Error adding course:", err);
      throw err;
    }
  };

  const handleUpdateCourse = async (data: Partial<ICourse>) => {
    try {
      await updateCourse(data);
      await fetchCourses();
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
      await fetchCourses();
      setIsDeleteModalOpen(false);
      setSelectedCourse(null);
    } catch (err: any) {
      console.error("Error deleting course:", err);
      setError(err.response?.data?.message || "Failed to delete course");
    } finally {
      setDeleteLoading(false);
    }
  };

  const openEditModal = (course: ICourse) => {
    setSelectedCourse(course);
    setIsEditModalOpen(true);
  };

  const openDeleteModal = (course: ICourse) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col py-32 items-center">
        <InlineSpinner />
        <span className="text-sm py-4 text-gray-800">Loading courses...</span>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Courses</h3>
          <p className="text-sm text-gray-500 mt-1">Manage academic subjects</p>
        </div>
        <Button
          icon={<PlusCircle size={18} />}
          label="Add Course"
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto justify-center bg-gray-900 text-white hover:bg-gray-800"
        />
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      {/* Course List */}
      {courses.length > 0 ? (
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.Id} className="p-3 sm:p-4 border border-gray-100 rounded-lg hover:border-gray-300 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-start gap-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{course.CourseName}</h4>
                      <p className="text-sm text-gray-500 mt-1">Code: {course.CourseCode}</p>
                      {course.CourseDescription && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{course.CourseDescription}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openEditModal(course)}
                    className="flex items-center gap-1 text-blue-600 border border-blue-300 px-3 py-1.5 rounded text-sm hover:bg-blue-50 transition-colors"
                    title="Edit Course"
                  >
                    <Edit size={14} />
                    <span className="hidden sm:inline">Edit</span>
                  </button>
                  <button
                    onClick={() => openDeleteModal(course)}
                    className="flex items-center gap-1 text-red-600 border border-red-300 px-3 py-1.5 rounded text-sm hover:bg-red-50 transition-colors"
                    title="Delete Course"
                  >
                    <Trash2 size={14} />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <p className="text-sm sm:text-base">No courses added yet</p>
          <p className="text-xs sm:text-sm mt-1">Add your first course to get started</p>
        </div>
      )}

      {/* Add Course Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Course">
        <SubjectForm
          onSubmit={handleAddCourse}
          onCancel={() => setIsModalOpen(false)}
          teacherUserId={user?.UserId || ""}
        />
      </Modal>

      {/* Edit Course Modal */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Course">
        <SubjectForm
          onSubmit={handleUpdateCourse}
          onCancel={() => setIsEditModalOpen(false)}
          initialData={selectedCourse}
          teacherUserId={user?.UserId || ""}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Course">
        <div className="space-y-4">
          <p className="text-gray-700">
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
            <Button
              type="button"
              onClick={() => setIsDeleteModalOpen(false)}
              label="Cancel"
              className="flex-1 bg-gray-200 text-gray-700 hover:bg-gray-300"
              disabled={deleteLoading}
            />
            <Button
              type="button"
              onClick={handleDeleteCourse}
              label={deleteLoading ? "Deleting..." : "Delete Course"}
              className="flex-1 bg-red-600 text-white hover:bg-red-700"
              disabled={deleteLoading}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Subjects;
