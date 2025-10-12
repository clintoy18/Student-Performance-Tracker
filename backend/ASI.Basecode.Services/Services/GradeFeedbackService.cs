using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.Manager;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Services
{
    public class GradeFeedbackService : IGradeFeedbackService
    {
        private readonly IGradeFeedbackRepository _repository;
        private readonly IStudentCourseRepository _studentCourseRepository;
        private readonly IMapper _mapper;

        public GradeFeedbackService(
            IGradeFeedbackRepository repository,
            IStudentCourseRepository studentCourseRepository,
            IMapper mapper)
        {
            _mapper = mapper;
            _studentCourseRepository = studentCourseRepository;
            _repository = repository;
        }

        public void CreateGradeFeedback(GradeFeedbackCreateModel model)
        {
            var studentCourse = _studentCourseRepository.GetStudentCourse(model.CourseStudentUserId, model.CourseCode);
            if (studentCourse == null)
            {
                throw new ArgumentNullException("Student does not have a related course to be feedbacked on.");
            }
            var gradeFeedback = new GradeFeedback
            {
                Feedback = model.Feedback,
                StudentCourseId = studentCourse.StudentCourseId,
                UserId = model.TeacherUserId,
                StudentCourse = studentCourse
            };
            _repository.AddGradeFeedback(gradeFeedback);
        }

        public void UpdateGradeFeedback(int feedbackId, string feedback)
        {
            var gradeFeedback = _repository.GetGradeFeedback(feedbackId);
            if (gradeFeedback == null)
            {
                throw new ArgumentNullException("Grade feedback does not exist");
            }
            gradeFeedback.Feedback = feedback;
            _repository.UpdateGradeFeedback(gradeFeedback);
        }

        public void DeleteGradeFeedback(int feedbackId)
        {
            var gradeFeedback = _repository.GetGradeFeedback(feedbackId);
            if (gradeFeedback == null)
                throw new ArgumentNullException("Grade feedback not found.");

            _repository.DeleteGradeFeedbackById(feedbackId);
        }

        public GradeFeedbackViewModel GetGradeFeedbackForStudent(string studentUserId, string courseCode)
        {

            var studentCourse = _studentCourseRepository.GetStudentCourse(studentUserId, courseCode);
            if (studentCourse == null)
            {
                throw new ArgumentNullException("Student does not have a related course to be feedbacked on.");
            }

            var gradeFeedback = _repository.GetGradeFeedbackByStudentId(studentUserId, courseCode);
            return _mapper.Map<GradeFeedbackViewModel>(gradeFeedback);
        }

        public List<GradeFeedbackViewModel> GetAllGradeFeedbacks()
        {
            return _repository.GetGradeFeedbacks()
                .Include(gf => gf.User)
                .Include(gf => gf.StudentCourse)
                .Select(gf => new
                {
                    GradeFeedback = gf,
                    StudentCourse = gf.StudentCourse,
                    Course = gf.StudentCourse != null ? gf.StudentCourse.Course : null
                })
                .AsEnumerable()
                .Select(gf => gf.GradeFeedback)
                .Select(gf => new GradeFeedbackViewModel
                {
                    Id = gf.Id,
                    Feedback = gf.Feedback,
                    StudentCourseId = gf.StudentCourseId,
                    CreatedTime = gf.CreatedTime,
                    TeacherUserId = gf.UserId,
                    TeacherName = gf.User != null ? $"{gf.User.FirstName} {gf.User.LastName}" : "",
                    CourseCode = gf.StudentCourse != null ? gf.StudentCourse.CourseCode : "",
                    CourseName = gf.StudentCourse?.Course != null ? gf.StudentCourse.Course.CourseName : ""
                })
                .ToList();
        }

        // Get feedback by ID
        public GradeFeedbackViewModel GetGradeFeedbackById(int id)
        {
            var gradeFeedback = _repository.GetGradeFeedback(id);
            return _mapper.Map<GradeFeedbackViewModel>(gradeFeedback);
        }

    }

}