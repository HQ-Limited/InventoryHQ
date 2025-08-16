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
        public async Task<ActionResult<IEnumerable<EditAttributeDto>>> Get(
            [FromQuery] bool includeValues = false,
            [FromQuery(Name = "ids")] int[] ids = null,
            [FromQuery] TableDatasourceRequest? tableParams = null)
        {
            var attributes = await _attributeService.GetAttributes(includeValues, ids, tableParams);

            if (attributes == null || !attributes.Any())
            {
                return NotFound();
            }

            return Ok(attributes);
        }

        /// <summary>
        /// Retrieves all attribute values.
        /// </summary>
        /// <param name="id">The ID of the attribute.</param>
        /// <returns>The attribute values.</returns>
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
        /// <param name="attribute">The attribute to create.</param>
        /// <returns>The created attribute.</returns>
        [HttpPost]
        public async Task<IActionResult> CreateAttribute(CreateAttributeDto attribute)
        {
            var createdAttribute = await _attributeService.CreateAttribute(attribute);

            if (createdAttribute == null)
            {
                return BadRequest("Failed to create attribute");
            }

            return Ok(createdAttribute);
        }

        //TODO: UpdateAttribute method.
        /* NOTES
           - Check if any of the attribute values were deleted.
              - If true, check if they are used in any variations or products.
                  - If true, return an error message as string.
                  - If false, delete the attribute values.
           - Check if any new attribute values were added. If so, create them.
        */

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

        /// <summary>
        /// Deletes an attribute.
        /// </summary>
        /// <param name="id">The ID of the attribute to delete.</param>
        /// <returns>Status 200</returns>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult> DeleteAttribute(int id)
        {
            var result = await _attributeService.DeleteAttribute(id);

            if (result == "Ok")
            {
                return Ok();
            }

            if (result == "NotFound")
            {
                return NotFound();
            }

            return BadRequest(result);
        }

        /// <summary>
        /// Deletes an attribute value.
        /// </summary>
        /// <param name="attributeId">The ID of the attribute to delete the value from.</param>
        /// <param name="valueId">The ID of the value to delete.</param>
        /// <returns>Status 200</returns>
        [HttpDelete("{attributeId:int}/{valueId:int}")]
        public async Task<ActionResult> DeleteAttributeValue(int attributeId, int valueId)
        {
            var result = await _attributeService.DeleteAttributeValue(attributeId, valueId);

            if (result == "Ok")
            {
                return Ok();
            }

            if (result == "NotFound")
            {
                return NotFound();
            }

            return BadRequest(result);
        }
    }
}
