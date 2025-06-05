using AutoMapper;
using InventoryHQ.Data.Models;
using InventoryHQ.Models.DTOs;

namespace InventoryHQ.Profiles
{
    public class InventoryHQProfile : Profile
    {
        public InventoryHQProfile()
        {
            CreateMap<Product, ProductDto>()
                .ForMember(x => x.Variations, opt => opt.MapFrom(src => src.Variations))
                .ForMember(x => x.Categories, opt => opt.MapFrom(src => src.Categories))
                .ReverseMap();

            CreateMap<Product, SimpleProductDto>()
                .ForMember(x => x.Name, opt => opt.MapFrom(src => src.Variations.FirstOrDefault().Name))
                .ForMember(x => x.Quantity, opt => opt.MapFrom(src => src.Variations.FirstOrDefault().Quantity))
                .ForMember(x => x.Description, opt => opt.MapFrom(src => src.Variations.FirstOrDefault().Description))
                .ForMember(x => x.SKU, opt => opt.MapFrom(src => src.Variations.FirstOrDefault().SKU))
                .ForMember(x => x.Categories, opt => opt.MapFrom(src => src.Categories))
                .ReverseMap();

            CreateMap<Variation, VariationDto>()
                .ForMember(x => x.Attributes, opt => opt.MapFrom(src => src.Attributes))
                .ReverseMap();

            CreateMap<Data.Models.Attribute, AttributeDto>().ReverseMap();
            CreateMap<Category, CategoryDto>().ReverseMap();
        }
    }
}
