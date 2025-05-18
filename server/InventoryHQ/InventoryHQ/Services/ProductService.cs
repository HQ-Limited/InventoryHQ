using AutoMapper;
using InventoryHQ.Data;
using InventoryHQ.Data.Models;
using InventoryHQ.Models;
using Microsoft.EntityFrameworkCore;

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

        public async Task<List<ProductDto>> GetProducts()
        {
            return _mapper.Map<List<ProductDto>>(await _data.Products.ToListAsync());
        }

        public async Task<ProductDto> GetProductByIdAsync(int id)
        {
            var product = await _data.Products
                .Include(x => x.Variations)
                .ThenInclude(x => x.Attributes)
                .Include(x => x.Categories)
                .FirstOrDefaultAsync(x => x.Id == id);

            return _mapper.Map<ProductDto>(product);
        }

        public async Task<int?> CreateProductAsync(ProductDto dto)
        {
            var product = _mapper.Map<Product>(dto);

            if (product == null)
            {
                return null;
            }

            await _data.Products.AddAsync(product);
            await _data.SaveChangesAsync();

            return product.Id;
        }

        public async Task<int?> UpdateProductAsync(ProductDto dto)
        {
            var product = await _data.Products
                .Include(x => x.Variations)
                .Include(x => x.Categories)
                .FirstOrDefaultAsync(x => x.Id == dto.Id);

            if (product == null)
            {
                return null;
            }

            _mapper.Map(dto, product);

            await _data.SaveChangesAsync();

            return product.Id;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            var entity = await _data.Products.FirstOrDefaultAsync(x=> x.Id == id);

            if (entity == null || entity.IsDeleted)
            {
                return false;
            }

            _data.Products.Remove(entity);
            await _data.SaveChangesAsync();

            return true;
        }
    }
}
