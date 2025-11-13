using System.Collections.Generic;
using System.Threading.Tasks;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.ServiceModels;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Interfaces
{
    public interface IGradeFeedbackService
    {
        public void CreateGradeFeedbackForStudent(GradeFeedbackCreateForStudentModel model);
        public void CreateGradeFeedbackForTeacher(GradeFeedbackCreateForTeacherModel model);

        public void UpdateGradeFeedback(int feedbackId, string feedback);

        public void DeleteGradeFeedback(int feedbackId);

        public GradeFeedbackViewModel GetGradeFeedbackForStudent(string studentUserId, string courseCode);

        public List<GradeFeedbackViewModel> GetAllGradeFeedbacks();
        public GradeFeedbackViewModel GetGradeFeedbackById(int id);

        public bool CheckGradeFeedbackExists(string studentUserId, string courseCode);
        public bool CheckTeacherFeedbackExists(string studentUserId, string courseCode);
        public bool CheckStudentFeedbackExists(string studentUserId, string courseCode);
    }
}
