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

        public Course FetchCourse(int courseId)
        {
            return _repository.GetCourses().FirstOrDefault(c => c.Id == courseId);
        }

        public Course FetchCourseByCourseCode(string courseCode)
        {
            return _repository.GetCourses().FirstOrDefault(c => c.CourseCode == courseCode);
        }

        public List<Course> FetchCoursesByUser(string userId)
        {
            return _repository.GetCourses().Where(c => c.UserId == userId).ToList();
        }

        public void RegisterCourse(CourseViewModel model)
        {
            var course = _mapper.Map<Course>(model);
            course.CreatedAt = DateTime.UtcNow;

            _repository.AddCourse(course);
        }

        public void UpdateCourse(CourseUpdateViewModel model)
        {
            ArgumentNullException.ThrowIfNull(model);

            // Fetch existing course
            var existingCourse = _repository.GetCourses()
                                            .FirstOrDefault(c => c.Id == model.Id);
            if (existingCourse == null)
                throw new Exception("Course not found.");

            // Map updatable fields while ignoring keys
            _mapper.Map(model, existingCourse);

            // Save changes
            _repository.UpdateCourse(existingCourse);
        }


        public void DeleteCourse(int courseId)
        {
            var course = _repository.GetCourses().FirstOrDefault(c => c.Id == courseId);
            if (course == null)
                throw new Exception("Course not found.");

            _repository.DeleteCourseByCourseCode(course.CourseCode);
        }

        public void DeleteCourseByCourseCode(string courseCode)
        {
            if (string.IsNullOrWhiteSpace(courseCode))
                throw new ArgumentException("Course code cannot be null or empty.", nameof(courseCode));

            if (!_repository.CourseExists(courseCode))
                throw new Exception("Course not found.");

            _repository.DeleteCourseByCourseCode(courseCode);
        }

        public List<Course> GetAllCourses()
        {
            return _repository.GetCourses().ToList();
        }

        public bool CourseExists(string courseCode)
        {
            return _repository.CourseExists(courseCode);
        }

        public int GetCourseCount()
        {
            return _repository.GetCourses().Count();
        }
    }
}
