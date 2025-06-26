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
    public class CategoryService
    {
        private readonly InventoryHQDbContext _data;
        private readonly IMapper _mapper;

        public CategoryService(InventoryHQDbContext data, IMapper mapper)
        {
            _data = data;
            _mapper = mapper;
        }

        public async Task<IEnumerable<CategoryDto>> GetCategories()
        {
            var data = await _data.Categories
                .Select(c => new CategoryDto
                {
                    Id = c.Id,
                    Name = c.Name,
                    ParentId = c.ParentId
                })
                .ToListAsync();

            return data;
        }

        public async Task<IEnumerable<CategoryDto>> GetCategoriesTree()
        {
            var data = await _data.Categories.ToListAsync();
            var categories = _mapper.Map<List<CategoryDto>>(data);

            return categories.Where(c => c.ParentId == null).ToList();
        }
    }
}