using System;
using System.Collections.Generic;
using System.Linq;
using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;

namespace ASI.Basecode.Services.Services
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _repository;
        private readonly IUserRepository _userRepository;
        private readonly IMapper _mapper;
        private readonly IRbacService _rbacService;

        public CourseService(
            ICourseRepository repository,
            IMapper mapper,
            IRbacService rbacService,
            IUserRepository userRepository)
        {
            _mapper = mapper;
            _repository = repository;
            _rbacService = rbacService;
            _userRepository = userRepository;
        }

        public CourseViewModel FetchCourse(int courseId)
        {
            var course = _repository.GetCourses().FirstOrDefault(c => c.Id == courseId);

            if (course == null)
            {
                throw new ArgumentNullException("Course not found");
            }

            return new CourseViewModel
                {
                    Id = course.Id,
                    CourseCode = course.CourseCode,
                    CourseName = course.CourseName,
                    CourseDescription = course.CourseDescription,
                    UserId = course.UserId,
                    CreatedAt = course.CreatedAt
                };
        }

        /// <summary>
        /// Fetches course by course code. UserId is nullable (assigned teacher)
        /// </summary>
        /// <param name="courseCode"></param>
        /// <returns></returns> 
        public CourseViewModel FetchCourseByCourseCode(string courseCode)
        {
            var course = _repository.GetCourses().FirstOrDefault(c => c.CourseCode == courseCode);

            if (course == null)
            {
                throw new ArgumentNullException(Resources.Messages.Errors.CourseNotExists);
            }

            return new CourseViewModel
                {
                    Id = course.Id,
                    CourseCode = course.CourseCode,
                    CourseName = course.CourseName,
                    CourseDescription = course.CourseDescription,
                    UserId = course.UserId,
                    CreatedAt = course.CreatedAt
                };
        }

        public List<CourseViewModel> FetchCoursesByUser(string userId)
        {
            var userExists = _userRepository.UserExists(userId);

            if (!userExists)
            {
                throw new ArgumentNullException(Resources.Messages.Errors.UserNotExist);
            }

            var courses = _repository.GetCourses().Where(c => c.UserId == userId).ToList();

            if (courses == null)
            {
                throw new ArgumentNullException(Resources.Messages.Errors.CourseNotExists);
            }

            return courses.Select(course => new CourseViewModel
                {
                    Id = course.Id,
                    CourseCode = course.CourseCode,
                    CourseName = course.CourseName,
                    CourseDescription = course.CourseDescription,
                    UserId = course.UserId,
                    CreatedAt = course.CreatedAt
                }).ToList();
        }

        public void RegisterCourse(CourseViewModel model)
        {
            var course = _mapper.Map<Course>(model);
            course.CreatedAt = DateTime.UtcNow;

            _repository.AddCourse(course);
        }

        public void UpdateCourse(CourseUpdateViewModel model)
        {
            // Fetch existing course
            var existingCourse = _repository.GetCourses()
                .FirstOrDefault(c => c.Id == model.Id);
            if (existingCourse == null)
                throw new ArgumentNullException(Resources.Messages.Errors.CourseNotExists);

            // Map updatable fields while ignoring keys
            _mapper.Map(model, existingCourse);

            // Save changes
            _repository.UpdateCourse(existingCourse);
        }


        public void DeleteCourse(int courseId)
        {
            var course = _repository.GetCourses().FirstOrDefault(c => c.Id == courseId);
            if (course == null)
                throw new ArgumentNullException(Resources.Messages.Errors.CourseNotExists);

            _repository.DeleteCourseByCourseCode(course.CourseCode);
        }

        public void DeleteCourseByCourseCode(string courseCode)
        {
            if (string.IsNullOrWhiteSpace(courseCode))
                throw new ArgumentException("Course code cannot be null or empty.", nameof(courseCode));

            if (!_repository.CourseExists(courseCode))
                throw new ArgumentNullException(Resources.Messages.Errors.CourseNotExists);

            _repository.DeleteCourseByCourseCode(courseCode);
        }

        public List<CourseViewModel> GetAllCourses()
        {
            var courses = _repository.GetCourses().ToList();

            if (courses == null)
            {
                throw new ArgumentNullException(Resources.Messages.Errors.CourseNotExists);
            }

            return courses.Select(course => new CourseViewModel
                {
                    Id = course.Id,
                    CourseCode = course.CourseCode,
                    CourseName = course.CourseName,
                    CourseDescription = course.CourseDescription,
                    UserId = course.UserId,
                    CreatedAt = course.CreatedAt
                }).ToList();
        }

        public bool CourseExists(string courseCode)
        {
            return _repository.CourseExists(courseCode);
        }

        public int GetCourseCount()
        {
            return _repository.GetCourses().Count();
        }

        public void AssignTeacher(int courseId, string teacherId)
        {
            var course = _repository.GetCourses().FirstOrDefault(c => c.Id == courseId);
            if (course == null)
                throw new ArgumentNullException(Resources.Messages.Errors.CourseNotExists);

            var userExists = _userRepository.UserExists(teacherId);
            if (!userExists)
            {
                throw new ArgumentNullException("Teacher userId not found");
            }

            var isTeacher = _rbacService.IsTeacher(teacherId);
            if (!isTeacher)
            {
                throw new ArgumentException("UserID supplied is not of role Teacher");
            }

            course.UserId = teacherId;

            _repository.UpdateCourse(course);
        }

    }
}
