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
        

        // TODO: REFACTOR
        public async Task<IEnumerable<AttributeDto>> GetAttributes(bool includeValues = false, int[] ids = null)
        {
            ids ??= Array.Empty<int>();
            IQueryable<Data.Models.Attribute> query = _data.Attributes;
            List<Data.Models.Attribute> attributes;

            if (includeValues)
            {
                if (ids.Length == 0)
                {
                    // All attributes with all values
                    attributes = await query.Include(x => x.AttributeValues).ToListAsync();
                }
                else
                {
                    // All attributes, but only fill values for provided ids
                    attributes = await query.ToListAsync();

                    // Load values only for attributes in ids
                    var values = await _data.AttributeValues
                    .Where(av => ids.Contains(av.AttributeId))
                    .ToListAsync();

                    foreach (var attr in attributes)
                    {
                        if (ids.Contains(attr.Id))
                        {
                            attr.AttributeValues = values.Where(v => v.AttributeId == attr.Id).ToList();
                        }
                        else
                        {
                            attr.AttributeValues = new List<AttributeValue>();
                        }
                    }
                }
            }
            else
            {
                // Only attributes, no values
                attributes = await query.ToListAsync();
            }

            var result = _mapper.Map<IEnumerable<AttributeDto>>(attributes);
            return result;
        }

        public async Task<IEnumerable<AttributeValueDto>> GetAttributeValues(int id)
        {
            var attributeValues = await _data.AttributeValues
            .Where(av => av.AttributeId == id)
            .ToListAsync();

            var result = _mapper.Map<IEnumerable<AttributeValueDto>>(attributeValues);
            return result;
        }
    }
}
