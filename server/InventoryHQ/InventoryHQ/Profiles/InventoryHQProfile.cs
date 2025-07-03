using AutoMapper;
using InventoryHQ.Data.Models;
using InventoryHQ.Models.DTOs;

namespace InventoryHQ.Profiles
{
    public class InventoryHQProfile : Profile
    {
        public InventoryHQProfile()
        {
            CreateMap<Location, LocationDto>().ReverseMap();

            CreateMap<InventoryUnit, InventoryUnitDto>().ReverseMap();

            CreateMap<Product, ProductDto>()
                .ReverseMap();

            CreateMap<Category, CategoryDto>().ReverseMap();

            CreateMap<Data.Models.Attribute, AttributeDto>()
                .ReverseMap();

            CreateMap<AttributeValue, AttributeValueDto>().ReverseMap();

            CreateMap<Variation, VariationDto>()
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => GetVariationAttributes(src)))
                .ReverseMap();

            CreateMap<VariationAttribute, VariationAttributeDto>()
            .ReverseMap();

            CreateMap<ProductAttribute, ProductAttributeDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Product.Name))
                .ReverseMap();

            CreateMap<Data.Models.Attribute, AttributeDto>().ReverseMap();
        }

        private object GetVariationAttributes(Variation src)
        {
            return src.Attributes.Select(vav => new VariationAttributeDto
            {
                Id = vav.Value.Attribute.Id,
                Name = vav.Value.Attribute.Name,
                Value = new AttributeValueDto
                {
                    Id = vav.Value.Id,
                    Value = vav.Value.Value
                }
            }).ToList();
        }
    }
}
