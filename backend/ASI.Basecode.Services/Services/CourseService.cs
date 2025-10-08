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

        
    }
}
