using AutoMapper;
using AutoMapper.QueryableExtensions;
using InventoryHQ.Data;
using InventoryHQ.Data.Models;
using InventoryHQ.Extensions;
using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace InventoryHQ.Services
{
    public class ProductService
    {
        private readonly InventoryHQDbContext _data;
        private readonly IMapper _mapper;

        public ProductService(InventoryHQDbContext data, IMapper mapper)
        {
            _data = data;
            _mapper = mapper;
        }

        public async Task<EditProductDto?> GetById(int id)
        {
            var product = await _data.Products
                                .Where(x => x.Id == id)
                                .Include(x => x.Categories)
                                .Include(x => x.Attributes)
                                    .ThenInclude(pa => pa.Attribute)
                                .Include(x => x.Attributes)
                                    .ThenInclude(a => a.Values)
                                .Include(x => x.Variations)
                                    .ThenInclude(v => v.Attributes)
                                .Include(x => x.Variations)
                                    .ThenInclude(i => i.InventoryUnits)
                                        .ThenInclude(i => i.Location)
                                .Include(x => x.Variations)
                                    .ThenInclude(v => v.InventoryUnits)
                                        .ThenInclude(iu => iu.Package)
                                .FirstOrDefaultAsync();

            return new EditProductDto()
            {
                Id = product.Id,
                Description = product.Description,
                Name = product.Name,
                ManageQuantity = product.ManageQuantity,
                IsVariable = product.isVariable,
                Attributes = product.Attributes?.Select(x => new AttributeDto()
                {
                    Id = x.Id,
                    Name = x.Attribute.Name,
                    IsVariational = x.IsVariational,
                    Values = x.Values?.Select(y => new AttributeValueDto()
                    {
                        Id = y.Id,
                        Value = y.Value
                    })
                }),
                Categories = product.Categories?.Select(ct => new CategoryDto()
                {
                    Id = ct.Id,
                    Name = ct.Name,
                }),
                Variations = product.Variations?.Select(v => new VariationDto()
                {
                    Id = v.Id,
                    Description = v.Description,
                    SKU = v.SKU,
                    InventoryUnits = v.InventoryUnits?
                                    .Where(q => q.PackageId == null)?
                                    .Select(viu => new InventoryUnitDto()
                                    {
                                        Id = viu.Id,
                                        Location = new LocationDto()
                                        {
                                            Id = viu.Location.Id,
                                            Name = viu.Location.Name
                                        },
                                        Quantity = viu.Quantity,
                                    }),
                    RetailPrice = v.RetailPrice,
                    Attributes = v.Attributes?.Select(va => new VariationAttributeDto()
                    {
                        Id = va.Id,
                        AttributeId = va.Value.Attribute.Id,
                        AttributeName = va.Value.Attribute.Name,
                        Value = new AttributeValueDto()
                        {
                            Id = va.Value.Id,
                            Value = va.Value.Value
                        }
                    })
                }),
                Packages = product.Variations?.SelectMany(x => x.InventoryUnits)
                                             .Where(s => s.PackageId != null)?.Select(iu => new PackageDto()
                                             {
                                                 Id = (int)iu.PackageId,
                                                 Description = iu.Package.Description,
                                                 Label = iu.Package.Label,
                                                 Price = iu.Package.Price,
                                                 Location = new LocationDto()
                                                 {
                                                     Id = iu.Location.Id,
                                                     Name = iu.Location.Name,
                                                 },
                                                 InventoryUnits = iu.Package.InventoryUnit?.Select(w => new InventoryUnitDto()
                                                 {
                                                     Id = w.Id,
                                                     Quantity = w.Quantity,
                                                     Variation = new VariationDto()
                                                     {
                                                         Id = w.Variation.Id,
                                                         SKU = w.Variation.SKU
                                                     }
                                                 })
                                             })
            };

        }

        public async Task<IEnumerable<ProductDto>> GetProducts(TableDatasourceRequest? request)
        {
            var data = _data.Products
                            .Include(x => x.Categories)
                                .Include(x => x.Attributes)
                                    .ThenInclude(pa => pa.Attribute)
                                .Include(x => x.Attributes)
                                    .ThenInclude(a => a.Values)
                                .Include(x => x.Variations)
                                    .ThenInclude(v => v.Attributes)
                                .Include(x => x.Variations)
                                    .ThenInclude(i => i.InventoryUnits)
                                        .ThenInclude(i => i.Location)
                                .Include(x => x.Variations)
                                    .ThenInclude(v => v.InventoryUnits)
                                        .ThenInclude(iu => iu.Package)
                            .AsQueryable();

            data = data.ApplyProductFilters(request.Filters);

            var products = _mapper.Map<IEnumerable<ProductDto>>(data);

            return products;
        }

        public async Task<int?> CreateProduct(ProductDto simpleProductDto)
        {
            var product = _mapper.Map<Product>(simpleProductDto);
            await _data.Products.AddAsync(product);

            await _data.SaveChangesAsync();

            return product.Id;
        }

        public async Task<int?> UpdateProduct(ProductDto productDto)
        {
            var product = await _data.Products.FirstAsync(x => x.Id == productDto.Id);

            if (product == null)
            {
                return null;
            }

            _mapper.Map(productDto, product);

            await _data.SaveChangesAsync();
            return product.Id;
        }

        public async Task<int?> DeleteProduct(int id)
        {
            var product = await _data.Products.FirstOrDefaultAsync(x => x.Id == id);

            if (product == null)
            {
                return null;
            }

            _data.Products.Remove(product);
            await _data.SaveChangesAsync();

            return product.Id;
        }

        public async Task<IEnumerable<VariationDto>> GetVariations(int id, TableDatasourceRequest? request)
        {
            var data = _data.Variations.Where(x => x.ProductId == id).AsQueryable();

            data = data.ApplyVariationFilters(request.Filters);

            var variations = _mapper.Map<IEnumerable<VariationDto>>(data);

            return variations;
        }
    }
}
