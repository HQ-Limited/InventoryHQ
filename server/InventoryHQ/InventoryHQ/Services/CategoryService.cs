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

        public async Task<CategoryDto?> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            var category = _mapper.Map<Category>(createCategoryDto);
            await _data.Categories.AddAsync(category);

            await _data.SaveChangesAsync();

            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<CategoryDto?> UpdateCategory(CategoryDto categoryDto)
        {
            var category = await _data.Categories.FirstAsync(x => x.Id == categoryDto.Id);

            if (category == null)
            {
                return null;
            }

            _mapper.Map(categoryDto, category);

            await _data.SaveChangesAsync();
            return _mapper.Map<CategoryDto>(category);
        }

        public async Task<int?> DeleteCategory(int id)
        {
            var category = await _data.Categories.FirstOrDefaultAsync(x => x.Id == id);

            if (category == null)
            {
                return null;
            }

            _data.Categories.Remove(category);
            await _data.SaveChangesAsync();

            return category.Id;
        }
    }
}