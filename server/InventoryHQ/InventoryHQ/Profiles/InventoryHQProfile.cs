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
                .ForMember(x => x.Attributes, s => s.MapFrom(src => GetAllVariationsAttributes(src)))
                .ReverseMap();

            CreateMap<Category, CategoryDto>().ReverseMap();

            CreateMap<Data.Models.Attribute, AttributeDto>()
                .ForMember(x => x.Name, s => s.MapFrom(src => src.Name))
                .ReverseMap();

            CreateMap<AttributeValue, AttributeValueDto>().ReverseMap();

            CreateMap<Variation, VariationDto>()
                .ForMember(x => x.Quantity, s => s.MapFrom(src => src.InventoryUnits.Sum(sum => sum.Quantity)))
                .ForMember(x => x.Attributes, s => s.MapFrom(src => GetVariationAttributes(src)))
                .ForMember(x=>x.Quantity, s=>s.MapFrom(src=> src.InventoryUnits.Sum(sum=>sum.Quantity)))
                .ReverseMap();
        }

        private object GetVariationAttributes(Variation src)
        {
            return src.VariationAttributeValues.Select(vav => new VariationAttributeDto
            {
                Id = vav.AttributeValue.Attribute.Id,
                Name = vav.AttributeValue.Attribute.Name,
                Value = new AttributeValueDto
                {
                    Id = vav.AttributeValue.Id,
                    Value = vav.AttributeValue.Value
                }
            }).ToList();
        }

        private static List<AttributeDto> GetAllVariationsAttributes(Product product)
        {
            return product.Variations
                .SelectMany(v => v.VariationAttributeValues)
                .GroupBy(vav => new { vav.AttributeValue.Attribute.Id, vav.AttributeValue.Attribute.Name })
                .Select(group => new AttributeDto
                {
                    Id = group.Key.Id,
                    Name = group.Key.Name,
                    Value = group
                        .Select(g => g.AttributeValue)
                        .DistinctBy(av => av.Id)
                        .Select(av => new AttributeValueDto
                        {
                            Id = av.Id,
                            Value = av.Value
                        }).ToList()
                }).ToList();
        }
    }
}
