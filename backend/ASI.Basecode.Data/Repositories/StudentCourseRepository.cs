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
            return GetDbSet<StudentCourse>();
        }

       public IQueryable<StudentCourse> GetStudentCoursesByStudent(string userId)
        {
            return GetDbSet<StudentCourse>()
                .Include(sc => sc.Course)
                .Where(sc => sc.UserId == userId);
        }

        public IQueryable<StudentCourse> GetStudentCoursesByCourse(string courseCode)
        {
            return GetDbSet<StudentCourse>()
                .Include(sc => sc.Course)
                .Where(sc => sc.Course.CourseCode == courseCode);
        }

        public StudentCourse GetStudentCourse(string userId, string courseCode)
        {
            return GetDbSet<StudentCourse>().FirstOrDefault(sc => sc.UserId == userId && sc.CourseCode == courseCode);
        }

        public bool StudentCourseExists(string studentCourseId)
        {
            return GetDbSet<StudentCourse>().Any(x => x.StudentCourseId == studentCourseId);
        }

        public bool StudentCourseExists(string studentUserId, string courseCode)
        {
            return GetDbSet<StudentCourse>()
                .Any(x => x.UserId == studentUserId && x.CourseCode == courseCode);
        }

        public void AddStudentCourse(StudentCourse studentCourse)
        {
            ArgumentNullException.ThrowIfNull(studentCourse);
            GetDbSet<StudentCourse>().Add(studentCourse);
            UnitOfWork.SaveChanges();
        }

        public void UpdateStudentCourse(StudentCourse studentCourse)
        {
            ArgumentNullException.ThrowIfNull(studentCourse);
            GetDbSet<StudentCourse>().Update(studentCourse);
            UnitOfWork.SaveChanges();
        }

        public void DeleteStudentCourseByStudentCourseId(string studentCourseId)
        {
            var studentCourse = GetDbSet<StudentCourse>().FirstOrDefault(sc => sc.StudentCourseId == studentCourseId);
            GetDbSet<StudentCourse>().Remove(studentCourse);
            UnitOfWork.SaveChanges();
        }
    }
}