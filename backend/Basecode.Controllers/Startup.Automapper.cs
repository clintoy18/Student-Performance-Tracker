using AutoMapper;
using Basecode.Data.Models;
using Basecode.Services.ServiceModels;
using Microsoft.Extensions.DependencyInjection;

namespace Basecode.Controllers
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
                CreateMap<UserViewModel, User>();
                CreateMap<Menu, MenuReturnViewModel>()
                    .ForMember(dest => dest.MenuId, opt => opt.MapFrom(src => src.MenuID))
                    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.MenuName))
                    .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.MenuDescription))
                    .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                    .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => src.IsDeleted));

                //Map from MenuRequestViewModel to Menu
                CreateMap<MenuRequestViewModel, Menu>()
                    .ForMember(dest => dest.MenuID, opt => opt.MapFrom(src => src.ID))
                    .ForMember(dest => dest.MenuName, opt => opt.MapFrom(src => src.Name))
                    .ForMember(dest => dest.MenuDescription, opt => opt.MapFrom(src => src.Description))
                    .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                    .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => src.IsDeleted))
                    .ForMember(dest => dest.LogMenus, opt => opt.Ignore());

                //Reverse mapping from Menu to MenuRequestViewModel
                CreateMap<Menu, MenuRequestViewModel>()
                    .ForMember(dest => dest.ID, opt => opt.MapFrom(src => src.MenuID))
                    .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.MenuName))
                    .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.MenuDescription))
                    .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
                    .ForMember(dest => dest.IsDeleted, opt => opt.MapFrom(src => src.IsDeleted));
            }
        }
    }
}
