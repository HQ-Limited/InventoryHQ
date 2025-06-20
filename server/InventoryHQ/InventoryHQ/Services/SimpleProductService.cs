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
    public class SimpleProductService
    {
        private readonly InventoryHQDbContext _data;
        private readonly IMapper _mapper;

        public SimpleProductService(InventoryHQDbContext data, IMapper mapper)
        {
            _data = data;
            _mapper = mapper;
        }

        public async Task<SimpleProductDto?> GetById(int id)
        {
            var product = await _data.Products.FirstOrDefaultAsync(x => x.Id == id && x.Variations.Count == 1);
            var simpleProduct = _mapper.Map<SimpleProductDto>(product);

            return simpleProduct;
        }

        public async Task<IEnumerable<SimpleProductDto>> GetProducts()
        {
            var products = await _data.Products.ToListAsync();
            var simpleProducts = _mapper.Map<IEnumerable<SimpleProductDto>>(products);

            return simpleProducts;
        }

        public async Task<int?> CreateProduct(SimpleProductDto simpleProductDto)
        {
            var product = _mapper.Map<Product>(simpleProductDto);
            await _data.Products.AddAsync(product);

            await _data.SaveChangesAsync();

            return product.Id;
        }

        public async Task<int?> UpdateProduct(SimpleProductDto productDto)
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
