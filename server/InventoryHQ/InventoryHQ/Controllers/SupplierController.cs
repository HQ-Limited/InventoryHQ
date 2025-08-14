using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using InventoryHQ.Services;
using Microsoft.AspNetCore.Mvc;

namespace InventoryHQ.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SupplierController : ControllerBase
    {
        private readonly SupplierService _supplierService;

        public SupplierController(SupplierService supplierService)
        {
            _supplierService = supplierService;
        }

        /// <summary>
        /// Retrieves a supplier by ID.
        /// </summary>
        /// <param name="id">The ID of the supplier to retrieve.</param>
        /// <returns>The supplier with the given ID.</returns>
        [HttpGet("{id:int}")]
        public async Task<ActionResult<SupplierDto>> GetById(int id)
        {
            var supplier = await _supplierService.GetById(id);

            if (supplier == null)
            {
                return NotFound();
            }

            return Ok(supplier);
        }

        /// <summary>
        /// Retrieves a supplier's pricelist by ID.
        /// </summary>
        /// <param name="id">The ID of the supplier to retrieve.</param>
        /// <returns>The supplier's pricelist with the given ID.</returns>
        [HttpGet("{id:int}/pricelist")]
        public async Task<ActionResult<IEnumerable<PricelistDto>>> GetPricelist(int id)
        {
            var pricelist = await _supplierService.GetPricelist(id);

            if (pricelist == null)
            {
                return NotFound();
            }

            return Ok(pricelist);
        }

        /// <summary>
        /// Retrieves a list of all suppliers.
        /// </summary>
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SupplierDto>>> Get()
        {
            var suppliers = await _supplierService.GetSuppliers();

            if (suppliers == null || !suppliers.Any())
            {
                return NotFound();
            }

            return Ok(suppliers);
        }

        /// <summary>
        /// Creates a new supplier.
        /// </summary>
        /// <param name="supplierDto">The supplier to create.</param>
        /// <returns>The ID of the created supplier.</returns>
        [HttpPost]
        public async Task<ActionResult<int?>> Create(SupplierDto supplierDto)
        {
            var id = await _supplierService.CreateSupplier(supplierDto);

            if (id == null)
            {
                return BadRequest();
            }

            return Ok(id);
        }

        /// <summary>
        /// Updates an existing supplier.
        /// </summary>
        /// <param name="supplierDto">The supplier to update.</param>
        /// <returns>The ID of the updated supplier.</returns>
        [HttpPut]
        public async Task<ActionResult<SupplierDto>> Update(SupplierDto supplierDto)
        {
            var id = await _supplierService.UpdateSupplier(supplierDto);

            if (id == null)
            {
                return NotFound();
            }

            return Ok(id);  
        }

        /// <summary>
        /// Deletes a supplier.
        /// </summary>
        /// <param name="id">The ID of the supplier to delete.</param>
        /// <returns>The ID of the deleted supplier.</returns>
        [HttpDelete("{id:int}")]
        public async Task<ActionResult<int?>> Delete(int id)
        {
            var deletedId = await _supplierService.DeleteSupplier(id);

            if (deletedId == null)
            {
                return NotFound();
            }

            return Ok(id);
        }

    }
}
