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
            return GetDbSet<GradeFeedback>();
        }

        public GradeFeedback GetGradeFeedback(int id)
        {
            return GetDbSet<GradeFeedback>().FirstOrDefault(gf => gf.Id == id);
        }

        public GradeFeedback GetGradeFeedback(string teacherId, string courseCode)
        {
            return GetDbSet<GradeFeedback>()
                .Include(gf => gf.StudentCourse)
                .FirstOrDefault(gf => gf.UserId == teacherId &&
                                    gf.StudentCourse != null &&
                                    gf.StudentCourse.CourseCode == courseCode);
        }

        public GradeFeedback GetGradeFeedbackByStudentId(string studentId, string courseCode)
        {
            return GetDbSet<GradeFeedback>()
                .Include(gf => gf.StudentCourse)
                .FirstOrDefault(gf => gf.StudentCourse != null &&
                                    gf.StudentCourse.UserId == studentId &&
                                    gf.StudentCourse.CourseCode == courseCode);   
        }

        public bool GradeFeedbackExists(int id)
        {
            return GetDbSet<GradeFeedback>().Any(x => x.Id == id);
        }

        // Check if grade feedback of a student exists 
        public bool GradeFeedbackExists(string teacherUserID, string courseCode)
        {
            return GetDbSet<GradeFeedback>()
                .Include(gf => gf.StudentCourse) // Explicitly include to ensure navigation works
                .Any(x => x.UserId == teacherUserID &&
                        x.StudentCourse != null &&
                        x.StudentCourse.CourseCode == courseCode);
        }

        public void AddGradeFeedback(GradeFeedback gradeFeedback)
        {
            ArgumentNullException.ThrowIfNull(gradeFeedback);
            GetDbSet<GradeFeedback>().Add(gradeFeedback);
            UnitOfWork.SaveChanges();
        }

        public void UpdateGradeFeedback(GradeFeedback gradeFeedback)
        {
            ArgumentNullException.ThrowIfNull(gradeFeedback);
            GetDbSet<GradeFeedback>().Update(gradeFeedback);
            UnitOfWork.SaveChanges();
        }

        public void DeleteGradeFeedbackById(int id)
        {
            var gradeFeedback = GetDbSet<GradeFeedback>().Find(id);
            GetDbSet<GradeFeedback>().Remove(gradeFeedback);
            UnitOfWork.SaveChanges();
        }
    }
}