using AutoMapper;
using AutoMapper.QueryableExtensions;
using InventoryHQ.Data;
using InventoryHQ.Data.Models;
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
            var product = await _data.Products.Include(x => x.Variations)
                                              .ThenInclude(x=>x.InventoryUnits)
                                              .Include(x=>x.Variations)
                                              .ThenInclude(x => x.VariationAttributeValues)
                                              .ThenInclude(x => x.AttributeValue)
                                              .ThenInclude(x => x.Attribute)
                                              .Include(x => x.Categories)
                                              .FirstOrDefaultAsync(x => x.Id == id);
            var simpleProduct = _mapper.Map<ProductDto>(product);

            return simpleProduct;
        }

        public async Task<IEnumerable<ProductDto>> GetProducts()
        {
            var products = await _data.Products.Include(x => x.Variations)
                                              .ThenInclude(x=>x.InventoryUnits)
                                              .Include(x=>x.Variations)
                                              .ThenInclude(x => x.VariationAttributeValues)
                                              .ThenInclude(x => x.AttributeValue)
                                              .ThenInclude(x => x.Attribute)
                                              .Include(x => x.Categories).ToListAsync();
            var simpleProducts = _mapper.Map<IEnumerable<ProductDto>>(products);

            return simpleProducts;
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
    }
}
