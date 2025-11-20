using ASI.Basecode.Data.EFCore;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ASI.Basecode.Data.Repositories
{
    public class StudentCourseRepository : BaseRepository<User>, IStudentCourseRepository
    {
        public StudentCourseRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<StudentCourse> GetStudentCourses()
        {
            return GetDbSet<StudentCourse>()
                .Where(sc => !sc.IsDeleted);
        }

       public IQueryable<StudentCourse> GetStudentCoursesByStudent(string userId)
        {
            return GetDbSet<StudentCourse>()
                .Include(sc => sc.Course)
                .Where(sc =>
                    sc.UserId == userId &&
                    !sc.IsDeleted &&
                    !sc.Course.IsDeleted);
        }

        public IQueryable<StudentCourse> GetStudentCoursesByCourse(string courseCode)
        {
            return GetDbSet<StudentCourse>()
                .Include(sc => sc.Course)
                .Include(sc => sc.User)
                .Where(sc =>
                    sc.Course.CourseCode == courseCode &&
                    !sc.IsDeleted && !sc.Course.IsDeleted && !sc.User.IsDeleted);
        }

        public StudentCourse GetStudentCourse(string userId, string courseCode)
        {
            return GetDbSet<StudentCourse>()
                .Include(sc => sc.Course)
                .FirstOrDefault(sc =>
                    sc.UserId == userId &&
                    sc.CourseCode == courseCode &&
                    !sc.IsDeleted && !sc.Course.IsDeleted);
        }

        public bool StudentCourseExists(string studentCourseId)
        {
            return GetDbSet<StudentCourse>().Any(x =>
                x.StudentCourseId == studentCourseId &&
                !x.IsDeleted);
        }

        public bool StudentCourseExists(string studentUserId, string courseCode)
        {
            return GetDbSet<StudentCourse>()
                .Any(x =>
                    x.UserId == studentUserId &&
                    x.CourseCode == courseCode &&
                    !x.IsDeleted);
        }

        public void AddStudentCourse(StudentCourse studentCourse)
        {
            GetDbSet<StudentCourse>().Add(studentCourse);
            UnitOfWork.SaveChanges();
        }

        public void UpdateStudentCourse(StudentCourse studentCourse)
        {
            GetDbSet<StudentCourse>().Update(studentCourse);
            UnitOfWork.SaveChanges();
        }

        public void DeleteStudentCourseByStudentCourseId(string studentCourseId)
        {
            var studentCourse = GetDbSet<StudentCourse>()
                .FirstOrDefault(sc =>
                    sc.StudentCourseId == studentCourseId &&
                    !sc.IsDeleted)
                .IsDeleted = true;

            UnitOfWork.SaveChanges();
        }

        public IQueryable<StudentCourse> GetAllStudentCoursesWithUsersAndCourses()
        {
            return GetDbSet<StudentCourse>()
                .Include(sc => sc.Course)
                .Include(sc => sc.User)
                .Where(sc =>
                    !sc.IsDeleted && !sc.Course.IsDeleted && !sc.User.IsDeleted);
        }

        public IQueryable<StudentCourse> GetStudentCoursesGradesByCourseCode(string courseCode)
        {
            return GetDbSet<StudentCourse>()
                .Include(sc => sc.Course)
                .Include(sc => sc.User)
                .Where(sc =>
                    sc.CourseCode == courseCode &&
                    !sc.IsDeleted && !sc.Course.IsDeleted && !sc.User.IsDeleted);
        }

    }
}