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

    }
}
