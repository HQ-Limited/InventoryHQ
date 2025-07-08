using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using InventoryHQ.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryHQ.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AttributeController : ControllerBase
    {
        private readonly AttributeService _attributeService;

        public AttributeController(AttributeService attributeService)
        {
            _attributeService = attributeService;
        }

        /// <summary>
        /// Retrieves a list of attributes, optionally including their values.
        /// </summary>
        /// <param name="includeValues">If true, includes attribute values in the response.</param>
        /// <param name="ids">An array of attribute IDs to fill with values. If includeValues is false, this array is ignored. If null or empty, returns all attributes with all values.</param>
        /// <returns>A list of attributes.</returns>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<AttributeDto>>> Get(
            [FromQuery] bool includeValues = false,
            [FromQuery(Name = "ids")] int[] ids = null)
        {
            var attributes = await _attributeService.GetAttributes(includeValues, ids);

            if (attributes == null || !attributes.Any())
            {
                return NotFound();
            }

            return Ok(attributes);
        }

        /// <summary>
        /// Retrieves an attribute by ID.
        /// </summary>
        /// <param name="id">The ID of the attribute to retrieve.</param>
        /// <returns>The attribute with the given ID.</returns>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<IEnumerable<AttributeValueDto>>> GetAttributeValues(int id)
        {
            var values = await _attributeService.GetAttributeValues(id);

            if (values == null)
            {
                return NotFound();
            }

            return Ok(values);
        }

        /// <summary>
        /// Creates a new attribute.
        /// </summary>
        /// <param name="name">The name of the attribute to create.</param>
        /// <returns>The ID of the created attribute.</returns>
        [HttpPost]
        public async Task<ActionResult<int?>> CreateAttribute(string name)
        {
            var id = await _attributeService.CreateAttribute(name);

            if (id == null)
            {
                return BadRequest();
            }

            return Ok(id);
        }

        /// <summary>
        /// Creates a new attribute value for an attribute.
        /// </summary>
        /// <param name="id">The ID of the attribute to create the value for.</param>
        /// <param name="value">The value to create.</param>
        /// <returns>The ID of the created value.</returns>
        [HttpPost("{id:int}")]
        public async Task<ActionResult<int?>> CreateAttributeValue(int id, [FromQuery] string value)
        {
            var valueId = await _attributeService.CreateAttributeValue(id, value);

            if (valueId == null)
            {
                return BadRequest();
            }

            return Ok(valueId);
        }

    }
}
