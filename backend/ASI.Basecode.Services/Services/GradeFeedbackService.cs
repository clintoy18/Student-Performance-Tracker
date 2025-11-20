using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text.Json;

namespace ASI.Basecode.Services.Services
{
    public class GradeFeedbackService : IGradeFeedbackService
    {
        private readonly IGradeFeedbackRepository _repository;
        private readonly IStudentCourseRepository _studentCourseRepository;
        private readonly IMapper _mapper;
        private readonly ILogger<GradeFeedbackService> _logger;

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

        // Create or update student feedback
        public void CreateGradeFeedbackForStudent(GradeFeedbackCreateForStudentModel model)
        {
            var studentCourse = _studentCourseRepository.GetStudentCourse(model.StudentUserId, model.CourseCode);
            if (studentCourse == null)
                throw new ArgumentNullException("Student does not have a related course to be feedbacked on.");

            var gradeFeedback = _repository.GetGradeFeedbackByStudentId(model.StudentUserId, model.CourseCode);
            if (gradeFeedback == null)
                throw new ArgumentNullException("Student does not yet have a grade feedback from teacher.");

            gradeFeedback.StudentFeedback = model.StudentFeedback;
            gradeFeedback.UpdatedTime = DateTime.UtcNow;

            _logger.LogInformation("Updating Student Feedback: {FeedbackJson}", JsonSerializer.Serialize(gradeFeedback));
            _repository.UpdateGradeFeedback(gradeFeedback);
        }

        // Create or update teacher feedback
        public void CreateGradeFeedbackForTeacher(GradeFeedbackCreateForTeacherModel model)
        {
            var studentCourse = _studentCourseRepository.GetStudentCourse(model.CourseStudentUserId, model.CourseCode);
            if (studentCourse == null)
                throw new ArgumentNullException("Student does not have a related course to be feedbacked on.");

            if (studentCourse.Grade == null)
                throw new InvalidOperationException("Cannot create feedback for a student without an assigned grade.");

            var existingFeedback = _repository.GetGradeFeedbackByStudentId(model.CourseStudentUserId, model.CourseCode);

            if (existingFeedback != null)
            {
                existingFeedback.Feedback = model.Feedback;
                existingFeedback.UpdatedTime = DateTime.UtcNow;
                _repository.UpdateGradeFeedback(existingFeedback);
                _logger.LogInformation("Updated Teacher Feedback: {FeedbackJson}", JsonSerializer.Serialize(existingFeedback));
            }
            else
            {
                var dto = new GradeFeedbackForTeacherDto
                {
                    Feedback = model.Feedback,
                    StudentCourseId = studentCourse.StudentCourseId,
                    UserId = model.TeacherUserId
                };
                var gradeFeedbackEntity = _mapper.Map<GradeFeedback>(dto);
                _repository.AddGradeFeedback(gradeFeedbackEntity);
                _logger.LogInformation("Created Teacher Feedback: {FeedbackJson}", JsonSerializer.Serialize(gradeFeedbackEntity));
            }
        }

        public void UpdateGradeFeedback(int feedbackId, string feedback)
        {
            var gradeFeedback = _repository.GetGradeFeedback(feedbackId);
            if (gradeFeedback == null)
                throw new ArgumentNullException(Resources.Messages.Errors.GradeFeedbackNotExist);

            gradeFeedback.Feedback = feedback;
            gradeFeedback.UpdatedTime = DateTime.UtcNow;
            _repository.UpdateGradeFeedback(gradeFeedback);
        }

        public void DeleteGradeFeedback(int feedbackId)
        {
            var gradeFeedback = _repository.GetGradeFeedback(feedbackId);
            if (gradeFeedback == null)
                throw new ArgumentNullException(Resources.Messages.Errors.GradeFeedbackNotExist);

            _repository.DeleteGradeFeedbackById(feedbackId);
        }

        // Get both teacher and student feedback for a specific student and course
        public GradeFeedbackViewModel GetGradeFeedbackForStudent(string studentUserId, string courseCode)
        {
            var studentCourse = _studentCourseRepository.GetStudentCourse(studentUserId, courseCode);
            if (studentCourse == null)
                throw new ArgumentNullException("Student does not have a related course to be feedbacked on.");

            var gradeFeedback = _repository.GetGradeFeedbackByStudentId(studentUserId, courseCode);

            if (gradeFeedback == null)
                throw new ArgumentNullException(Resources.Messages.Errors.GradeFeedbackNotExist);

            _logger.LogInformation("Retrieved Feedback: {FeedbackJson}", JsonSerializer.Serialize(gradeFeedback));

            // Use AutoMapper to handle mapping with null checks
            return _mapper.Map<GradeFeedbackViewModel>(gradeFeedback);
        }

        // Get all feedback records
        public List<GradeFeedbackViewModel> GetAllGradeFeedbacks()
        {
            // Include User, StudentCourse, and the related Course
            var feedbacks = _repository.GetGradeFeedbacks()
                .Include(gf => gf.User)
                .Include(gf => gf.StudentCourse.Course) // ensure Course is included
                .ToList();

            if (feedbacks == null)
            {
                throw new ArgumentNullException("No feedbacks found");
            }

            return _mapper.Map<List<GradeFeedbackViewModel>>(feedbacks);
        }

        public GradeFeedbackViewModel GetGradeFeedbackById(int id)
        {
            var gradeFeedback = _repository.GetGradeFeedback(id);

            if (gradeFeedback == null)
            {
                throw new ArgumentNullException("No feedbacks found");
            }

            return _mapper.Map<GradeFeedbackViewModel>(gradeFeedback);
        }

        public bool CheckGradeFeedbackExists(string studentUserId, string courseCode)
        {
            return _repository.GetGradeFeedbackByStudentId(studentUserId, courseCode) != null;
        }

        public bool CheckTeacherFeedbackExists(string studentUserId, string courseCode)
        {
            var feedback = _repository.GetGradeFeedbackByStudentId(studentUserId, courseCode);
            return feedback?.Feedback != null;
        }

        public bool CheckStudentFeedbackExists(string studentUserId, string courseCode)
        {
            var feedback = _repository.GetGradeFeedbackByStudentId(studentUserId, courseCode);
            return feedback?.StudentFeedback != null;
        }
    }
}
