using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

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
                CreateMap<GradeFeedback, GradeFeedbackViewModel>()
                    .ForMember(dest => dest.TeacherUserId, opt => opt.MapFrom(src => src.UserId))
                    .ForMember(dest => dest.CourseCode, opt => opt.MapFrom(src => src.StudentCourse.CourseCode))
                    .ForMember(dest => dest.CourseName, opt => opt.MapFrom(src => src.StudentCourse.Course.CourseName))
                    .ForMember(dest => dest.StudentFeedback, opt => opt.MapFrom(src => src.StudentFeedback))
                    .ForMember(dest => dest.TeacherName, opt => opt.MapFrom(src =>
                        $"{src.User.FirstName} {(string.IsNullOrEmpty(src.User.MiddleName) ? "" : src.User.MiddleName + " ")}{src.User.LastName}"));
                CreateMap<CourseViewModel, Course>();
                CreateMap<GradeFeedbackForTeacherDto, GradeFeedback>()
                    .ForMember(dest => dest.Id, opt => opt.Ignore())
                    .ForMember(dest => dest.CreatedTime, opt => opt.Ignore())
                    .ForMember(dest => dest.UpdatedTime, opt => opt.Ignore())
                    .ForMember(dest => dest.StudentFeedback, opt => opt.Ignore());


                // map for users
                CreateMap<User, UserViewAdminModel>();


                // Map StudentCourse → StudentCourseGradeViewModel
                CreateMap<StudentCourse, StudentCourseGradeViewModel>()
                    .ForMember(dest => dest.StudentId, opt => opt.MapFrom(src => src.User.UserId))
                    .ForMember(dest => dest.StudentName, opt => opt.MapFrom(src => $"{src.User.FirstName} {src.User.LastName}"))
                    .ForMember(dest => dest.Grade, opt => opt.MapFrom(src => src.Grade));

                // Map IGrouping<string, StudentCourse> → CourseGradesViewModel
                CreateMap<IGrouping<string, StudentCourse>, CourseGradesViewModel>()
                    .ForMember(dest => dest.CourseCode, opt => opt.MapFrom(src => src.Key))
                    .ForMember(dest => dest.CourseName, opt => opt.MapFrom(src => src.First().Course.CourseName))
                    .ForMember(dest => dest.StudentGrades, opt => opt.MapFrom(src => src));


            }
        }
    }
}
