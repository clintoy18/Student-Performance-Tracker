using ASI.Basecode.Data.EFCore;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ASI.Basecode.Data.Repositories
{
    public class CourseRepository : BaseRepository<Course>, ICourseRepository
    {
        public CourseRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<Course> GetCourses()
        {
            return GetDbSet<Course>()
                .Where(c => !c.IsDeleted);
        }

        public Course GetCourse(string courseCode)
        {
            return GetDbSet<Course>()
            .FirstOrDefault(c =>
                c.CourseCode == courseCode &&
                !c.IsDeleted);
        }

        public bool CourseExists(string courseCode)
        {
            return GetDbSet<Course>().Any(x =>
                x.CourseCode == courseCode &&
                !x.IsDeleted);
        }

        public void AddCourse(Course course)
        {
            GetDbSet<Course>().Add(course);
            UnitOfWork.SaveChanges();
        }

        public void UpdateCourse(Course course)
        {
            GetDbSet<Course>().Update(course);
            UnitOfWork.SaveChanges();
        }

        public void DeleteCourseByCourseCode(string courseCode)
        {
            GetDbSet<Course>()
                .FirstOrDefault(c =>
                    c.CourseCode == courseCode)
                .IsDeleted = true;

            GetDbSet<StudentCourse>()
                .Where(sc => sc.CourseCode == courseCode)
                .ExecuteUpdate(setters =>
                    setters.SetProperty(sc => sc.IsDeleted, true));

            UnitOfWork.SaveChanges();
        }
    }
}