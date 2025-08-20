using AutoMapper;
using AutoMapper.QueryableExtensions;
using InventoryHQ.Data;
using InventoryHQ.Data.Models;
using InventoryHQ.Extensions;
using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

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
                                            .ThenInclude(p => p.Location)
                                .Include(x => x.UnitsOfMeasurement)
                                .FirstOrDefaultAsync();

            if (product == null)
            {
                return null;
            }

            return new EditProductDto()
            {
                Id = product.Id,
                Description = product.Description,
                Name = product.Name,
                Vat = product.Vat,
                UnitsOfMeasurement = product.UnitsOfMeasurement.OrderBy(x => x.Id).Select(x => new UnitOfMeasurementDto()
                {
                    Id = x.Id,
                    Name = x.Name,
                    Abbreviation = x.Abbreviation,
                    Multiplier = x.Multiplier,
                    Barcode = x.Barcode,
                    IsDefault = x.IsDefault,
                    IsBase = x.IsBase,
                }),
                IsVariable = product.isVariable,
                Attributes = product.Attributes?.Select(x => new ProductAttributeDto()
                {
                    Id = x.Id,
                    AttributeId = x.Attribute.Id,
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
                    Barcode = v.Barcode,
                    MinStock = v.MinStock,
                    InventoryUnits = v.InventoryUnits
                                    .Where(iu => iu.PackageId == null)
                                    .Select(viu => new InventoryUnitDto()
                                    {
                                        Id = viu.Id,
                                        Location = new LocationDto()
                                        {
                                            Id = viu.Location.Id,
                                            Name = viu.Location.Name
                                        },
                                        Quantity = viu.Quantity,
                                        Package = viu.Package != null ? new PackageDto()
                                        {
                                            Id = viu.Package.Id,
                                            Description = viu.Package.Description,
                                            Label = viu.Package.Label,
                                            Price = viu.Package.Price,
                                            ExpirationDate = viu.Package.ExpirationDate,
                                            LotNumber = viu.Package.LotNumber
                                        } : null,
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
                Packages = product.Variations?
                    .SelectMany(x => x.InventoryUnits)
                    .Where(iu => iu.PackageId != null)
                    .GroupBy(iu => iu.PackageId)
                    .Select(g =>
                    {
                        var first = g.First();
                        return new PackageDto()
                        {
                            Id = (int)first.PackageId,
                            Description = first.Package.Description,
                            Label = first.Package.Label,
                            Price = first.Package.Price,
                            ExpirationDate = first.Package.ExpirationDate,
                            LotNumber = first.Package.LotNumber,
                            Location = new LocationDto()
                            {
                                Id = first.Package.Location.Id,
                                Name = first.Package.Location.Name
                            },
                            InventoryUnits = g.Select(w => new InventoryUnitDto()
                            {
                                Id = w.Id,
                                Quantity = w.Quantity,
                                Variation = new VariationDto()
                                {
                                    Id = w.Variation.Id,
                                    SKU = w.Variation.SKU,
                                    Attributes = w.Variation.Attributes?.Select(va => new VariationAttributeDto()
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
                                },
                            })
                        };
                    })
            };
        }

        public IQueryable<ViewProductDto> GetProducts()
        {
            var data = _data.Products
                            .Include(x => x.Categories)
                            .Include(x => x.Attributes)
                                .ThenInclude(a => a.Values)
                            .Include(x => x.Attributes)
                                .ThenInclude(a => a.Attribute)
                            .Include(x => x.Variations)
                                .ThenInclude(i => i.InventoryUnits)
                                    .ThenInclude(i => i.Location)
                            .Include(x => x.Variations)
                                .ThenInclude(v => v.Attributes)
                                    .ThenInclude(a => a.Value)
                                        .ThenInclude(v => v.Attribute)
                            .AsQueryable();

            return _mapper.ProjectTo<ViewProductDto>(data);
        }

        public async Task<int?> CreateProduct(EditProductDto data)
        {
            var product = _mapper.Map<Product>(data);
            await _data.Products.AddAsync(product);

            await _data.SaveChangesAsync();

            return product.Id;
        }

        public async Task<int?> UpdateProduct(EditProductDto data)
        {
            var product = await _data.Products.FirstAsync(x => x.Id == data.Id);

            if (product == null)
            {
                return null;
            }

            _mapper.Map(data, product);

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
