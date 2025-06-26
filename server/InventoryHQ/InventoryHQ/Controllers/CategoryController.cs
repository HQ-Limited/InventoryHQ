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
        [HttpGet("tree")]
        public async Task<ActionResult<IEnumerable<CategoryDto>>> GetTree()
        {
            var categories = await _categoryService.GetCategoriesTree();

            if (categories == null || !categories.Any())
            {
                return NotFound();
            }

            return Ok(categories);
        }

    }
}
