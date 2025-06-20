using AutoMapper;
using InventoryHQ.Data.Models;
using InventoryHQ.Models.DTOs;

namespace InventoryHQ.Profiles
{
    public class InventoryHQProfile : Profile
    {
        public InventoryHQProfile()
        {
            CreateMap<Product, SimpleProductDto>()
                .ForMember(x => x.SKU, opt => opt.MapFrom(src => src.Variations.FirstOrDefault().SKU))
                .ForMember(x => x.Quantity, opt => opt.MapFrom(src => src.Variations.FirstOrDefault().InventoryUnits.FirstOrDefault().Quantity))
                .ForMember(x => x.Description, opt => opt.MapFrom(src => src.Variations.FirstOrDefault().Description))
                .ForMember(x => x.Price, opt => opt.MapFrom(src => src.Variations.FirstOrDefault().RetailPrice))
                .ReverseMap();
        }
    }
}
