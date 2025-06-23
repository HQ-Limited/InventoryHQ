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

    }
}
