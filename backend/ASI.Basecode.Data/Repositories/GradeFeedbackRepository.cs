using ASI.Basecode.Data.EFCore;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;

namespace ASI.Basecode.Data.Repositories
{
    public class GradeFeedbackRepository : BaseRepository<User>, IGradeFeedbackRepository
    {
        public GradeFeedbackRepository(IUnitOfWork unitOfWork) : base(unitOfWork)
        {
        }

        public IQueryable<GradeFeedback> GetGradeFeedbacks()
        {
            return GetDbSet<GradeFeedback>()
                .Where(gf => 
                    !gf.IsDeleted);
        }

        public GradeFeedback GetGradeFeedback(int id)
        {
            return GetDbSet<GradeFeedback>()
                .FirstOrDefault(gf =>
                    gf.Id == id &&
                    !gf.IsDeleted);
        }

        public GradeFeedback GetGradeFeedback(string teacherId, string courseCode)
        {
            return GetDbSet<GradeFeedback>()
                .Include(gf => gf.StudentCourse)
                .FirstOrDefault(gf =>
                    gf.UserId == teacherId &&
                    gf.StudentCourse != null &&
                    gf.StudentCourse.CourseCode == courseCode &&
                    !gf.IsDeleted && !gf.StudentCourse.IsDeleted);
        }

        public GradeFeedback GetGradeFeedbackByStudentId(string studentId, string courseCode)
        {
            return GetDbSet<GradeFeedback>()
                .Include(gf => gf.StudentCourse)
                .Include(gf => gf.StudentCourse.Course)
                .Include(gf => gf.User)
                .FirstOrDefault(gf =>
                    gf.StudentCourse != null &&
                    gf.StudentCourse.UserId == studentId &&
                    gf.StudentCourse.CourseCode == courseCode &&
                    !gf.IsDeleted &&
                    !gf.StudentCourse.IsDeleted && 
                    !gf.StudentCourse.Course.IsDeleted &&
                    !gf.User.IsDeleted);   
        }

        public bool GradeFeedbackExists(int id)
        {
            return GetDbSet<GradeFeedback>().Any(x =>
                x.Id == id &&
                !x.IsDeleted);
        }

        // Check if grade feedback of a student exists 
        public bool GradeFeedbackExists(string teacherUserID, string courseCode)
        {
            return GetDbSet<GradeFeedback>()
                .Include(gf => gf.StudentCourse) // Explicitly include to ensure navigation works
                .Any(x =>
                    x.UserId == teacherUserID &&
                    x.StudentCourse != null &&
                    x.StudentCourse.CourseCode == courseCode &&
                    !x.IsDeleted && !x.StudentCourse.IsDeleted);
        }

        public void AddGradeFeedback(GradeFeedback gradeFeedback)
        {
            GetDbSet<GradeFeedback>().Add(gradeFeedback);
            UnitOfWork.SaveChanges();
        }

        public void UpdateGradeFeedback(GradeFeedback gradeFeedback)
        {
            GetDbSet<GradeFeedback>().Update(gradeFeedback);
            UnitOfWork.SaveChanges();
        }

        public void DeleteGradeFeedbackById(int id)
        {
            GetDbSet<GradeFeedback>()
                .Find(id)
                .IsDeleted = true;
            UnitOfWork.SaveChanges();
        }
    }
}