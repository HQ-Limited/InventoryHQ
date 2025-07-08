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
                    attributes = await query.Include(x => x.Values).ToListAsync();
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
                            attr.Values = values.Where(v => v.AttributeId == attr.Id).ToList();
                        }
                        else
                        {
                            attr.Values = new List<AttributeValue>();
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

        public async Task<int?> CreateAttribute(string name)
        {
            if (string.IsNullOrWhiteSpace(name))
                return null;

            var attribute = new Data.Models.Attribute
            {
                Name = name
            };

            await _data.Attributes.AddAsync(attribute);
            await _data.SaveChangesAsync();

            return attribute.Id;
        }

        public async Task<int?> CreateAttributeValue(int id, string value)
        {
            if (string.IsNullOrWhiteSpace(value))
                return null;

            var attribute = await _data.Attributes.FindAsync(id);
            if (attribute == null)
                return null;

            var attributeValue = new AttributeValue
            {
                AttributeId = id,
                Value = value
            };

            await _data.AttributeValues.AddAsync(attributeValue);
            await _data.SaveChangesAsync();

            return attributeValue.Id;
        }
    }
}
