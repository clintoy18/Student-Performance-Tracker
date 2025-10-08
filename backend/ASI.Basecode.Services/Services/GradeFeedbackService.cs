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
    public class GradeFeedbackService : IGradeFeedbackService
    {
        private readonly IGradeFeedbackRepository _repository;
        private readonly IMapper _mapper;

        public GradeFeedbackService(IGradeFeedbackRepository repository, IMapper mapper)
        {
            _mapper = mapper;
            _repository = repository;
        }
    }
}
