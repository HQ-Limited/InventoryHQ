using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using InventoryHQ.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryHQ.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CustomerController : ControllerBase
    {
        private readonly CustomerService _customerService;

        public CustomerController(CustomerService customerService)
        {
            _customerService = customerService;
        }

        /// <summary>
        /// Retrieves a customer by ID.
        /// </summary>
        /// <param name="id">The ID of the customer to retrieve.</param>
        /// <returns>The customer with the given ID.</returns>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<CustomerDto>> GetById(int id)
        {
            var customer = await _customerService.GetById(id);

            if (customer == null)
            {
                return NotFound();
            }

            return Ok(customer);
        }

        /// <summary>
        /// Retrieves a list of all customers.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CustomerDto>>> Get()
        {
            var customers = await _customerService.GetCustomers();

            if (customers == null || !customers.Any())
            {
                return NotFound();
            }

            return Ok(customers);
        }

        /// <summary>
        /// Creates a new customer.
        /// </summary>
        /// <param name="customerDto">The customer to create.</param>
        /// <returns>The ID of the created customer.</returns>
        [HttpPost]
        public async Task<ActionResult<int?>> Create(CustomerDto customerDto)
        {
            var id = await _customerService.CreateCustomer(customerDto);

            if (id == null)
            {
                return BadRequest();
            }

            return Ok(id);
        }

        /// <summary>
        /// Updates an existing customer.
        /// </summary>
        /// <param name="customerDto">The customer to update.</param>
        /// <returns>The ID of the updated customer.</returns>
        [HttpPut]
        public async Task<ActionResult<CustomerDto>> Update(CustomerDto customerDto)
        {
            var id = await _customerService.UpdateCustomer(customerDto);

            if (id == null)
            {
                return NotFound();
            }

            return Ok(id);  
        }

        /// <summary>
        /// Deletes a customer.
        /// </summary>
        /// <param name="id">The ID of the customer to delete.</param>
        /// <returns>The ID of the deleted customer.</returns>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<int?>> Delete(int id)
        {
            var deletedId = await _customerService.DeleteCustomer(id);

            if (deletedId == null)
            {
                return NotFound();
            }

            return Ok(id);
        }

    }
}
