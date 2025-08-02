using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using InventoryHQ.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryHQ.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoryController : ControllerBase
    {
        private readonly CategoryService _categoryService;

        public CategoryController(CategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        /// <summary>
        /// Retrieves a list of all categories.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> Get()
        {
            var categories = await _categoryService.GetCategories();

            if (categories == null || !categories.Any())
            {
                return NotFound();
            }

            return Ok(categories);
        }
        
        /// <summary>
        /// Retrieves a list of all categories with their children as a tree.
        /// </summary>
        [HttpGet("nestedTree")]
        public async Task<ActionResult<IEnumerable<CategoryTreeDto>>> GetNestedCategoriesTree()
        {
            var categories = await _categoryService.GetNestedCategoriesTree();
            return Ok(categories);
        }

        /// <summary>
        /// Retrieves a list of all root categories without children.
        /// </summary>
        [HttpGet("rootTree")]
        public async Task<ActionResult<IEnumerable<CategoryTreeDto>>> GetRootCategoriesTree()
        {
            var categories = await _categoryService.GetRootCategoriesTree();
            return Ok(categories);
        }

        /// <summary>
        /// Retrieves a list of all children categories of a given parent category.
        /// </summary>
        [HttpGet("{parentId}/childrenTree")]
        public async Task<ActionResult<IEnumerable<CategoryTreeDto>>> GetChildrenCategoriesTree(int parentId)
        {
            var categories = await _categoryService.GetChildrenCategoriesTree(parentId);
            return Ok(categories);
        }

        /// <summary>
        /// Creates a new category.
        /// </summary>
        /// <param name="createCategoryDto">The category to create.</param>
        /// <returns>The created category.</returns>
        [HttpPost]
        public async Task<ActionResult<CategoryDto>> CreateCategory(CreateCategoryDto createCategoryDto)
        {
            // echo the createCategoryDto
            var category = await _categoryService.CreateCategory(createCategoryDto);

            if (category == null)
            {
                return BadRequest();
            }

            return Ok(category);
        }

        /// <summary>
        /// Updates an existing category.
        /// </summary>
        /// <param name="categoryDto">The category to update.</param>
        /// <returns>The updated category.</returns>
        [HttpPut]
        public async Task<ActionResult<CategoryDto>> UpdateCategory(CategoryDto categoryDto)
        {
            var category = await _categoryService.UpdateCategory(categoryDto);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);  
        }

        /// <summary>
        /// Deletes a category.
        /// </summary>
        /// <param name="id">The ID of the category to delete.</param>
        /// <returns>The ID of the deleted category.</returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<int>> DeleteCategory(int id)
        {
            var category = await _categoryService.DeleteCategory(id);

            if (category == null)
            {
                return NotFound();
            }

            return Ok(category);
        }

    }
}
