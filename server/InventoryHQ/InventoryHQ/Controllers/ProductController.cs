using InventoryHQ.Data.Models;
using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using InventoryHQ.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

namespace InventoryHQ.Controllers
{
    /// <summary>
    /// Simple products are basically products with just one variation.
    /// </summary>
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ODataController
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
        public async Task<ActionResult<EditProductDto>> GetById(int id)
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
        [EnableQuery]
        public IQueryable<ViewProductDto> Get()
        {
            // Directly return the IQueryable from the service
            return _productService.GetProducts();
        }

        /// <summary>
        /// Creates a new product.
        /// </summary>
        /// <param name="data">The product to create.</param>
        /// <returns>The ID of the created product.</returns>
        [HttpPost]
        public async Task<ActionResult<int?>> CreateProduct(EditProductDto data)
        {
            var id = await _productService.CreateProduct(data);

            if (id == null)
            {
                return BadRequest();
            }

            return Ok(id);
        }

        /// <summary>
        /// Updates an existing product.
        /// </summary>
        /// <param name="data">The product to update.</param>
        /// <returns>The ID of the updated product.</returns>
        [HttpPut]
        public async Task<ActionResult<ProductDto>> UpdateProduct(EditProductDto data)
        {
            var id = await _productService.UpdateProduct(data);

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

        [HttpPost("{id:int}/variations")]
        public async Task<ActionResult<IEnumerable<VariationDto>>> GetVariations(int id, [FromBody]TableDatasourceRequest? request)
        {
            var variations = await _productService.GetVariations(id, request);
            return Ok(variations);
        }
    }
}

