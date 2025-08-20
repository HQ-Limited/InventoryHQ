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

            CreateMap<Data.Models.Product, EditProductDto>().ReverseMap();

            CreateMap<UnitOfMeasurement, UnitOfMeasurementDto>().ReverseMap();

            CreateMap<Category, CategoryDto>().ReverseMap();

            CreateMap<Data.Models.Attribute, AttributeDto>()
                .ReverseMap();

            CreateMap<AttributeValue, AttributeValueDto>().ReverseMap();

            CreateMap<Variation, VariationDto>()
                .ReverseMap();

            CreateMap<VariationAttribute, VariationAttributeDto>()
            .ReverseMap();

            CreateMap<ProductAttribute, ProductAttributeDto>()
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Attribute.Name))
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

            CreateMap<Category, CategoryTreeDto>()
                .ForMember(dest => dest.IsLeaf, opt => opt.MapFrom(src => src.Children == null || !src.Children.Any()))
                .ForMember(dest => dest.ParentId, opt => opt.MapFrom(src => src.ParentId));

            CreateMap<Category, CreateCategoryDto>().ReverseMap();
            CreateMap<Data.Models.Product, ViewProductDto>()
                .ReverseMap();

            CreateMap<ProductAttribute, ViewProductAttributeDto>()
                .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Attribute.Id))
                .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Attribute.Name))
                .ReverseMap();

            CreateMap<AttributeValue, ViewAttributeValueDto>().ReverseMap();

            CreateMap<Category, ViewCategoryDto>().ReverseMap();

            CreateMap<Variation, ViewVariationDto>()
                .ForMember(dest => dest.Attributes, opt => opt.MapFrom(src => src.Attributes.Select(a => new ViewVariationAttributeDto
                {
                    Name = a.Value.Attribute.Name,
                    Value = a.Value.Value
                })))
                .ForMember(dest => dest.InventoryUnits, opt => opt.MapFrom(src => src.InventoryUnits.Select(iu => new ViewInventoryUnitDto
                {
                    Id = iu.Id,
                    Quantity = iu.Quantity,
                    LocationName = iu.Location.Name,
                })))
                .ReverseMap();

            CreateMap<InventoryUnit, ViewInventoryUnitDto>()
                .ForMember(dest => dest.LocationName, opt => opt.MapFrom(src => src.Location.Name))
            .ReverseMap();
        }

    }
}
