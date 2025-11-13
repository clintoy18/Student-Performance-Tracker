using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.Manager;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using static ASI.Basecode.Resources.Constants.Enums;

namespace ASI.Basecode.Services.Services
{
    public class GradeFeedbackService : IGradeFeedbackService
    {
        private readonly IGradeFeedbackRepository _repository;
        private readonly IStudentCourseRepository _studentCourseRepository;
        private readonly IMapper _mapper;

        private readonly ILogger _logger;
        public GradeFeedbackService(
            IGradeFeedbackRepository repository,
            IStudentCourseRepository studentCourseRepository,
            IMapper mapper,
            ILogger<GradeFeedbackService> logger)
        {
            _mapper = mapper;
            _studentCourseRepository = studentCourseRepository;
            _repository = repository;
            _logger = logger;
        }

        public void CreateGradeFeedbackForStudent(GradeFeedbackCreateForStudentModel model)
        {
            var studentCourse = _studentCourseRepository.GetStudentCourse(model.StudentUserId, model.CourseCode);
            if (studentCourse == null)
            {
                throw new ArgumentNullException("Student does not have a related course to be feedbacked on.");
            }

            

            var currentGradeFeedback = _repository.GetGradeFeedbackByStudentId(model.StudentUserId, model.CourseCode);

            if (currentGradeFeedback == null)
            {
                throw new ArgumentNullException("Student does not yet have a grade feedback.");
            }


            currentGradeFeedback.StudentFeedback = model.StudentFeedback;
            currentGradeFeedback.UpdatedTime = DateTime.UtcNow;

            EventId Default = new(0, "General");
                _logger.LogInformation(Default, "Current GradeFeedback: {FeedbackJson}",
    JsonSerializer.Serialize(studentCourse));
            _repository.UpdateGradeFeedback(currentGradeFeedback);
        }

        public void CreateGradeFeedbackForTeacher(GradeFeedbackCreateForTeacherModel model)
        {
            var studentCourse = _studentCourseRepository.GetStudentCourse(model.CourseStudentUserId, model.CourseCode);
            if (studentCourse == null)
            {
                throw new ArgumentNullException("Student does not have a related course to be feedbacked on.");
            }

            // Check if student has a grade assigned before allowing feedback
            if (studentCourse.Grade == null)
            {
                throw new InvalidOperationException("Cannot create feedback for a student without an assigned grade. Please assign a grade first.");
            }

            var dto = new GradeFeedbackForTeacherDto
            {
                Feedback = model.Feedback,
                StudentCourseId = studentCourse.StudentCourseId,
                UserId = model.TeacherUserId
            };

            var gradeFeedbackEntity = _mapper.Map<GradeFeedback>(dto);
            _repository.AddGradeFeedback(gradeFeedbackEntity);
        }

        public void UpdateGradeFeedback(int feedbackId, string feedback)
        {
            var gradeFeedback = _repository.GetGradeFeedback(feedbackId);
            if (gradeFeedback == null)
            {
                throw new ArgumentNullException("Grade feedback does not exist");
            }
            gradeFeedback.Feedback = feedback;
            gradeFeedback.UpdatedTime = DateTime.UtcNow;
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
            EventId Default = new(0, "General");
                _logger.LogInformation(Default, "Feedback received: {FeedbackJson}",
    JsonSerializer.Serialize(gradeFeedback));
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
                    UpdatedTime = gf.UpdatedTime,
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

        // Check if grade feedback exists for a student in a course
        public bool CheckGradeFeedbackExists(string studentUserId, string courseCode)
        {
            var gradeFeedback = _repository.GetGradeFeedbackByStudentId(studentUserId, courseCode);
            return gradeFeedback != null;
        }

        public bool CheckTeacherFeedbackExists(string studentUserId, string courseCode)
        {
            var gradeFeedback = _repository.GetGradeFeedbackByStudentId(studentUserId, courseCode);
            return gradeFeedback.Feedback != null;
        }

        public bool CheckStudentFeedbackExists(string studentUserId, string courseCode)
        {
            var gradeFeedback = _repository.GetGradeFeedbackByStudentId(studentUserId, courseCode);
            return gradeFeedback.StudentFeedback != null;
        }
    }

}