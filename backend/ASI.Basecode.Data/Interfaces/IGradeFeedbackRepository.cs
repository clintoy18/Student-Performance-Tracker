using ASI.Basecode.Data.Models;
using System.Linq;

namespace ASI.Basecode.Data.Interfaces
{
    public interface IGradeFeedbackRepository
    {
        public IQueryable<GradeFeedback> GetGradeFeedbacks();

        public GradeFeedback GetGradeFeedback(int id);
        public GradeFeedback GetGradeFeedback(string teacherId, string courseCode);
        public GradeFeedback GetGradeFeedbackByStudentId(string studentId, string courseCode);
        public bool GradeFeedbackExists(int id);
        public bool GradeFeedbackExists(string teacherUserId, string courseCode);

        public void AddGradeFeedback(GradeFeedback gradeFeedback);

        public void UpdateGradeFeedback(GradeFeedback gradeFeedback);

        public void DeleteGradeFeedbackById(int id);
    }
}