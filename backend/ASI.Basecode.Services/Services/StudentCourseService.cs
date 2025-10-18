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
    public class StudentCourseService : IStudentCourseService
    {
        private readonly IStudentCourseRepository _repository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly ICourseRepository _courseRepository;

        public StudentCourseService(
            IStudentCourseRepository repository,
            IUserRepository userRepository,
            ICourseRepository courseRepository,
            IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _courseRepository = courseRepository;
            _repository = repository;
        }

        public void CreateStudentCourse(StudentCourseCreateModel model)
        {
            var user = _userRepository.GetUser(model.StudentUserId);
            var course = _courseRepository.GetCourse(model.CourseCode);
            var newStudentCourse = new StudentCourse
            {
                UserId = model.StudentUserId,
                CourseCode = model.CourseCode,
                Grade = model.Grade,
                User = user,
                Course = course
            };
            _repository.AddStudentCourse(newStudentCourse);
        }

         public void UpdateStudentGrade(StudentGradeUpdateViewModel model)
        {
            // Fetch existing enrollment
            var existingEnrollment = _repository.GetStudentCourse(model.StudentUserId, model.CourseCode);
            if (existingEnrollment == null)
            {
                throw new ArgumentException("Student is not enrolled in this course.");
            }

            // Update grade
            existingEnrollment.Grade = model.Grade;

            // Optionally update navigation properties
            existingEnrollment.User = _userRepository.GetUser(model.StudentUserId);
            existingEnrollment.Course = _courseRepository.GetCourse(model.CourseCode);

            // Save changes
            _repository.UpdateStudentCourse(existingEnrollment);
        }


        public void DeleteStudentCourse(string studentUserId, string courseCode)
        {
            var studentCourse = _repository.GetStudentCourse(studentUserId, courseCode);
            if (studentCourse == null)
            {
                throw new ArgumentNullException("Student course does not exist.");
            }
            _repository.DeleteStudentCourseByStudentCourseId(studentCourse.StudentCourseId);
        }

       public List<StudentCourse> GetStudentCoursesOfStudent(string userId)
        {
            return _repository.GetStudentCoursesByStudent(userId).ToList();
        }

        public List<StudentCourse> GetStudentCoursesOfCourse(string courseCode)
        {
            return _repository.GetStudentCoursesByCourse(courseCode).ToList();
        }
    }
}
