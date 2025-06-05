using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using InventoryHQ.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryHQ.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly ProductService _productService;

        public ProductController(ProductService productService)
        {
            _productService = productService;
        }

        [HttpPost("simple")]
        public async Task<ActionResult<List<SimpleProductDto>>> GetSimpleProducts(TableParams @params)
        {
            var simpleProducts = await _productService.GetSimpleProducts(@params);
            return simpleProducts;
        }

        [HttpGet]
        public async Task<ActionResult<List<ProductDto>>> GetProducts()
        {
            var products = await _productService.GetProducts();
            return products;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<ProductDto>> GetProductById(int id)
        {
            var product = await _productService.GetProductByIdAsync(id);

            if (product == null)
            {
                return NotFound($"There is no product with id {id}");
            }
            return Ok(product);
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateProduct(ProductDto dto)
        {
            var newProductId = await _productService.CreateProductAsync(dto);

            if (newProductId == null)
            {
                return BadRequest();
            }

            return Ok(newProductId);
        }

        [HttpPut]
        public async Task<ActionResult<int>> UpdateProduct(ProductDto dto)
        {
            var updatedProductId = await _productService.UpdateProductAsync(dto);

            if (updatedProductId == null)
            {
                return BadRequest();
            }

            return Ok(updatedProductId);
        }

        [HttpDelete]
        public async Task<ActionResult<bool>> DeleteProduct(int id)
        {
            var isDeleted = await _productService.DeleteProductAsync(id);

            if (isDeleted)
            {
                return Ok();
            }

            return NotFound();
        }
    }
}
