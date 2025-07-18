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

            CreateMap<Package, PackageDto>().ReverseMap();

            CreateMap<InventoryUnit, InventoryUnitDto>().ReverseMap();

            CreateMap<Product, ProductDto>()
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => GetProductAttributes(src)))
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
                .ReverseMap();

            CreateMap<Data.Models.Attribute, AttributeDto>().ReverseMap();

            CreateMap<Data.Models.Attribute, CreateAttributeDto>().ReverseMap();

            CreateMap<Data.Models.Attribute, EditAttributeDto>().ReverseMap();

            CreateMap<CreateAttributeValueDto, AttributeValue>().ReverseMap();
        }

        private object GetProductAttributes(Product src)
        {
            return src.Attributes.Select(pa => new ProductAttributeDto
            {
                Id = pa.Attribute.Id,
                Name = pa.Attribute.Name,
                IsVariational = pa.IsVariational,
                Values = pa.Values.Select(v => new AttributeValueDto
                {
                    Id = v.Id,
                    Value = v.Value
                }).ToList()
            }).ToList();
        }

        private object GetVariationAttributes(Variation src)
        {
            return src.Attributes.Select(vav => new VariationAttributeDto
            {
                Id = vav.Id,
                AttributeId = vav.Value.Attribute.Id,
                AttributeName = vav.Value.Attribute.Name,
                Value = new AttributeValueDto
                {
                    Id = vav.Value.Id,
                    Value = vav.Value.Value
                }
            }).ToList();
        }
    }
}
