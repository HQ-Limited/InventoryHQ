using AutoMapper;
using InventoryHQ.Data;
using InventoryHQ.Models.DTOs;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Services
{
    public class LocationService
    {
        private readonly InventoryHQDbContext _data;
        private readonly IMapper _mapper;

        public LocationService(InventoryHQDbContext data, IMapper mapper)
        {
            _data = data;
            _mapper = mapper;
        }

        public async Task<IEnumerable<LocationDto>> GetLocations()
        {
            var locations = await _data.Locations.ToListAsync();
            return _mapper.Map<IEnumerable<LocationDto>>(locations);
        }

        public async Task<LocationDto?> GetById(int id)
        {
            var location = await _data.Locations.FirstOrDefaultAsync(x => x.Id == id);
            return _mapper.Map<LocationDto>(location);
        }
    }
}
