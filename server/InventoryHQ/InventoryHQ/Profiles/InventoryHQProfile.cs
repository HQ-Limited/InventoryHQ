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
                .ForMember(x => x.IsVariable, s => s.MapFrom(src => src.Variations.Count > 1))
                .ReverseMap();

            CreateMap<Category, CategoryDto>().ReverseMap();

            CreateMap<Data.Models.Attribute, AttributeDto>()
                .ForMember(x => x.Name, s => s.MapFrom(src => src.Name))
                .ReverseMap();

            CreateMap<AttributeValue, AttributeValueDto>().ReverseMap();

            CreateMap<VariationDto, Variation>().ReverseMap()
                .ForMember(x => x.Quantity, s => s.MapFrom(src => src.InventoryUnits.Sum(sum => sum.Quantity)));
        }
    }
}
