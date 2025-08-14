using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using InventoryHQ.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryHQ.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerGroupController : ControllerBase
    {
        private readonly CustomerGroupService _customerGroupService;

        public CustomerGroupController(CustomerGroupService customerGroupService)
        {
            _customerGroupService = customerGroupService;
        }

        /// <summary>
        /// Retrieves a customer group by ID.
        /// </summary>
        /// <param name="id">The ID of the customer group to retrieve.</param>
        /// <returns>The customer group with the given ID.</returns>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CustomerGroupDto>> GetById(int id)
        {
            var customerGroup = await _customerGroupService.GetById(id);

            if (customerGroup == null)
            {
                return NotFound();
            }

            return Ok(customerGroup);
        }

        /// <summary>
        /// Retrieves a list of all customer groups.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerGroupDto>>> Get()
        {
            var customerGroups = await _customerGroupService.GetCustomerGroups();

            if (customerGroups == null || !customerGroups.Any())
            {
                return NotFound();
            }

            return Ok(customerGroups);
        }

        /// <summary>
        /// Creates a new customer group.
        /// </summary>
        /// <param name="customerGroupDto">The customer group to create.</param>
        /// <returns>The ID of the created customer group.</returns>
        [HttpPost]
        public async Task<ActionResult<int?>> Create(CustomerGroupDto customerGroupDto)
        {
            var id = await _customerGroupService.CreateCustomerGroup(customerGroupDto);

            if (id == null)
            {
                return BadRequest();
            }

            return Ok(id);
        }

        /// <summary>
        /// Updates an existing customer group.
        /// </summary>
        /// <param name="customerGroupDto">The customer group to update.</param>
        /// <returns>The ID of the updated customer group.</returns>
        [HttpPut]
        public async Task<ActionResult<CustomerGroupDto>> Update(CustomerGroupDto customerGroupDto)
        {
            var id = await _customerGroupService.UpdateCustomerGroup(customerGroupDto);

            if (id == null)
            {
                return NotFound();
            }

            return Ok(id);  
        }

        /// <summary>
        /// Deletes a customer group.
        /// </summary>
        /// <param name="id">The ID of the customer group to delete.</param>
        /// <returns>The ID of the deleted customer group.</returns>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<int?>> Delete(int id)
        {
            var deletedId = await _customerGroupService.DeleteCustomerGroup(id);

            if (deletedId == null)
            {
                return NotFound();
            }

            return Ok(id);
        }

    }
}
