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

            CreateMap<Data.Models.Product, ProductDto>()
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => GetProductAttributes(src)))
                .ReverseMap();

            CreateMap<Data.Models.Product, EditProductDto>().ReverseMap();

            CreateMap<UnitOfMeasurement, UnitOfMeasurementDto>().ReverseMap();

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

            CreateMap<Receiver, ReceiverDto>().ReverseMap();

            CreateMap<Customer, CustomerDto>().ReverseMap();

            CreateMap<CustomerGroup, CustomerGroupDto>().ReverseMap();

            CreateMap<Supplier, SupplierDto>().ReverseMap();

            CreateMap<Pricelist, PricelistDto>()
                .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Variation.Product.Name))
                .ReverseMap();

            CreateMap<Variation, PricelistVariationDto>()
                .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.RetailPrice))
                .ReverseMap();
            CreateMap<Category, CategoryTreeDto>()
                .ForMember(dest => dest.IsLeaf, opt => opt.MapFrom(src => src.Children == null || !src.Children.Any()))
                .ForMember(dest => dest.ParentId, opt => opt.MapFrom(src => src.ParentId));

            CreateMap<Category, CreateCategoryDto>().ReverseMap();
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
