using ASI.Basecode.Data.Models;
using ASI.Basecode.Services.ServiceModels;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages;
using ASI.Basecode.WebApp.Models;

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
                // CreateMap<SourceModel, DestModel>()
                CreateMap<RegisterUserViewModel, User>();   // Means we want to be able to map RegisterUserViewModel to User
                CreateMap<RegisterUserAdminModel, User>();
                CreateMap<UserViewAdminModel, User>()
                    .ForMember(dest => dest.Id, opt => opt.Ignore())
                    .ForMember(dest => dest.HashedPassword, opt => opt.Ignore());
                CreateMap<CourseViewModel, Course>();
                CreateMap<Course, CourseViewControllerModel>();
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
                CreateMap<GradeFeedbackForStudentCreateRequestModel, GradeFeedbackCreateForStudentModel>()
                    .ForMember(dest => dest.StudentUserId, opt => opt.MapFrom(src => src.CourseStudentUserId));
                CreateMap<CourseViewModel, Course>();
                CreateMap<GradeFeedbackForTeacherDto, GradeFeedback>()
                    .ForMember(dest => dest.Id, opt => opt.Ignore())
                    .ForMember(dest => dest.CreatedTime, opt => opt.Ignore())
                    .ForMember(dest => dest.UpdatedTime, opt => opt.Ignore())
                    .ForMember(dest => dest.StudentFeedback, opt => opt.Ignore());
                CreateMap<StudentCourseCreateRequest, StudentCourseCreateModel>()
                    .ForMember(dest => dest.Grade, opt => opt.Ignore());
                CreateMap<User, UserDto>()
                    .ForMember(dest => dest.role, opt => opt.MapFrom(src => src.Role.ToString()));
                CreateMap<User, UserViewControllerModel>()
                    .ForMember(dest => dest.role, opt => opt.MapFrom(src => src.Role.ToString()));


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
