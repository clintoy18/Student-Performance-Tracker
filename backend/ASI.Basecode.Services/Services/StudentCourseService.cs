using ASI.Basecode.Data.Interfaces;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.Interfaces;
using ASI.Basecode.Services.Manager;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;
using System;
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

        public StudentCourseService(
            IStudentCourseRepository repository,
            IUserRepository userRepository,
            IMapper mapper)
        {
            _mapper = mapper;
            _userRepository = userRepository;
            _repository = repository;
        }

        public void CreateStudentCourse(StudentCourseCreateModel model)
        {
            // var newStudentCourse = new StudentCourse
            // {
                
            // }
        }
    }
}
