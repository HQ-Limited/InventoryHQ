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

        public async Task<IEnumerable<CategoryTreeDto>> GetNestedCategoriesTree()
        {
            //FIXME: Find out why when the below line is deleted, childrens dont work.
            var allCategories = await _data.Categories.ToListAsync();

            var rootCategories = await _data.Categories.Where(c => c.ParentId == null).ToListAsync();
            var categories = _mapper.Map<List<CategoryTreeDto>>(rootCategories);
            return categories;
        }

        public async Task<IEnumerable<CategoryTreeDto>> GetRootCategoriesTree() {
            var rootCategories = await _data.Categories.Where(c => c.ParentId == null).ToListAsync();
            var categories = _mapper.Map<List<CategoryTreeDto>>(rootCategories);
            return categories;
        }

        public async Task<IEnumerable<CategoryTreeDto>> GetChildrenCategoriesTree(int parentId) {
            var childrenCategories = await _data.Categories.Where(c => c.ParentId == parentId).ToListAsync();
            var categories = _mapper.Map<List<CategoryTreeDto>>(childrenCategories);
            return categories;
        }
    }
}