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

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ProductDto>>> Get()
        {
            var products = await _productService.GetProducts();
            return Ok(products);
        }

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
