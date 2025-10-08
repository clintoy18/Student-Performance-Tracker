using ASI.Basecode.Data.EFCore;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ASI.Basecode.Data.Repositories
{
    public class CourseRepository : BaseRepository<User>, ICourseRepository
    {
        public CourseRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<Course> GetCourses()
        {
            return GetDbSet<Course>();
        }

        public Course GetCourse(string courseCode)
        {
            return GetDbSet<Course>().FirstOrDefault(c => c.CourseCode == courseCode);
        }

        public bool CourseExists(string courseCode)
        {
            return GetDbSet<Course>().Any(x => x.CourseCode == courseCode);
        }

        public void AddCourse(Course course)
        {
            ArgumentNullException.ThrowIfNull(course);
            GetDbSet<Course>().Add(course);
            UnitOfWork.SaveChanges();
        }

        public void UpdateCourse(Course course)
        {
            ArgumentNullException.ThrowIfNull(course);
            GetDbSet<Course>().Update(course);
            UnitOfWork.SaveChanges();
        }

        public void DeleteCourseByCourseCode(string courseCode)
        {
            var course = GetDbSet<Course>().FirstOrDefault(c => c.CourseCode == courseCode);
            GetDbSet<Course>().Remove(course);
            UnitOfWork.SaveChanges();
        }
    }
}