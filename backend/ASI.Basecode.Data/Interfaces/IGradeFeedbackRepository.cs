using ASI.Basecode.Data.Models;
using System.Linq;

namespace ASI.Basecode.Data.Interfaces
{
    public interface IGradeFeedbackRepository
    {
        public IQueryable<GradeFeedback> GetGradeFeedbacks();

        public GradeFeedback GetGradeFeedback(int id);
        public bool GradeFeedbackExists(int id);

        public void AddGradeFeedback(GradeFeedback gradeFeedback);

        public void UpdateGradeFeedback(GradeFeedback gradeFeedback);

        public void DeleteGradeFeedbackById(int id);
    }
}