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

        public async Task<ProductDto?> GetById(int id)
        {
            var data = await _data.Products
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
                                .FirstOrDefaultAsync(x => x.Id == id);
            var product = _mapper.Map<ProductDto>(data);

            return product;
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
