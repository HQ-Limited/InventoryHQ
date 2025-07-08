using Microsoft.AspNetCore.Mvc;
using InventoryHQ.Services;
using InventoryHQ.Models.DTOs;

namespace InventoryHQ.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LocationController : ControllerBase
    {
        private readonly LocationService _locationService;

        public LocationController(LocationService locationService)
        {
            _locationService = locationService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<LocationDto>>> GetLocations()
        {
            var locations = await _locationService.GetLocations();
            return Ok(locations);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<LocationDto>> GetLocationById(int id)
        {
            var location = await _locationService.GetById(id);
            if (location == null)
            {
                return NotFound();
            }
            return Ok(location);
        }
    }
}
