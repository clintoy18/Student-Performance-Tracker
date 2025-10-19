using AutoMapper;
using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.ServiceModels;
using Microsoft.Extensions.DependencyInjection;

namespace ASI.Basecode.WebApp
{
    // AutoMapper configuration
    internal partial class StartupConfigurer
    {
        /// <summary>
        /// Configure auto mapper
        /// </summary>
        private void ConfigureAutoMapper()
        {
            var mapperConfiguration = new MapperConfiguration(config =>
            {
                config.AddProfile(new AutoMapperProfileConfiguration());
            });

            this._services.AddSingleton<IMapper>(sp => mapperConfiguration.CreateMapper());
        }

        private class AutoMapperProfileConfiguration : Profile
        {
            public AutoMapperProfileConfiguration()
            {
                CreateMap<RegisterUserViewModel, User>();
                CreateMap<RegisterUserAdminModel, User>();
                CreateMap<CourseViewModel, Course>();
                CreateMap<CourseUpdateViewModel, Course>()
                    .ForMember(dest => dest.Id, opt => opt.Ignore())           // Don't overwrite primary key
                    .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())    // Keep original creation time
                    .ForMember(dest => dest.UserId, opt => opt.MapFrom(src => src.UserId)); // Map assigned teacher
                CreateMap<GradeFeedback, GradeFeedbackViewModel>();
            }
        }
    }
}
