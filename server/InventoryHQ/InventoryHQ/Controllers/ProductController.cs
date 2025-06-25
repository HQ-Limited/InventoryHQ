using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using InventoryHQ.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryHQ.Controllers
{
    /// <summary>
    /// Simple products are basically products with just one variation.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        /// <summary>
        /// Retrieves a product by ID.
        /// </summary>
        /// <param name="id">The ID of the product to retrieve.</param>
        /// <returns>The product with the given ID.</returns>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetById(int id)
        {
            var product = await _productService.GetById(id);

            if (product == null)
            {
                return NotFound();
            }

            return Ok(product);
        }

        /// <summary>
        /// Retrieves all products.
        /// </summary>
        /// <returns>A list of all products.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> Get()
        {
            var products = await _productService.GetProducts();
            return Ok(products);
        }

        /// <summary>
        /// Creates a new product.
        /// </summary>
        /// <param name="simpleProductDto">The product to create.</param>
        /// <returns>The ID of the created product.</returns>
        [HttpPost]
        public async Task<ActionResult<int?>> CreateProduct(ProductDto simpleProductDto)
        {
            var id = await _productService.CreateProduct(simpleProductDto);

            if (id == null)
            {
                return BadRequest();
            }

            return Ok(id);
        }

        /// <summary>
        /// Updates an existing product.
        /// </summary>
        /// <param name="simpleProductDto">The product to update.</param>
        /// <returns>The ID of the updated product.</returns>
        [HttpPut]
        public async Task<ActionResult<ProductDto>> UpdateProduct(ProductDto simpleProductDto)
        {
            var id = await _productService.UpdateProduct(simpleProductDto);

            if (id == null)
            {
                return NotFound();
            }

            return Ok(id);  
        }

        /// <summary>
        /// Deletes a product.
        /// </summary>
        /// <param name="id">The ID of the product to delete.</param>
        /// <returns>The ID of the deleted product.</returns>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<int?>> DeleteProduct(int id)
        {
            var deletedId = await _productService.DeleteProduct(id);

            if (deletedId == null)
            {
                return NotFound();
            }

            return Ok(id);
        }

    }
}

