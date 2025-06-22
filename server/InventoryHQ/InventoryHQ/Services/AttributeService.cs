using AutoMapper;
using AutoMapper.QueryableExtensions;
using InventoryHQ.Data;
using InventoryHQ.Data.Models;
using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace InventoryHQ.Services
{
    public class AttributeService
    {
        private readonly InventoryHQDbContext _data;
        private readonly IMapper _mapper;

        public AttributeService(InventoryHQDbContext data, IMapper mapper)
        {
            _data = data;
            _mapper = mapper;
        }

        public async Task<IEnumerable<AttributeDto>> GetAttributes(bool includeValues = false)
        {
            var attributes = new List<Data.Models.Attribute>();
            if (includeValues)
                attributes = await _data.Attributes.Include(x => x.AttributeValues).ToListAsync();
            else
                attributes = await _data.Attributes.ToListAsync();
            var result = _mapper.Map<IEnumerable<AttributeDto>>(attributes);

            return result;
        }

        public async Task<IEnumerable<AttributeDto>> GetAttributeValues(int id)
        {
            var attributes = await _data.Attributes
                .Where(x => x.Id == id)
                .Include(x => x.AttributeValues)
                .ToListAsync();

            var result = _mapper.Map<IEnumerable<AttributeDto>>(attributes);
            return result;
        }
    }
}
