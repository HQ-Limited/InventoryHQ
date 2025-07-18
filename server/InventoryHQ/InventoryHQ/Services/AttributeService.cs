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


        public async Task<IEnumerable<EditAttributeDto>> GetAttributes(bool includeValues = false, int[] ids = null)
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

            var result = _mapper.Map<IEnumerable<EditAttributeDto>>(attributes);
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

        public async Task<EditAttributeDto> CreateAttribute(CreateAttributeDto attribute)
        {
            var attributeToCreate = _mapper.Map<Data.Models.Attribute>(attribute);

            await _data.Attributes.AddAsync(attributeToCreate);
            await _data.SaveChangesAsync();

            return _mapper.Map<EditAttributeDto>(attributeToCreate);
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

        public async Task<string?> DeleteAttribute(int id)
        {
            var attribute = await _data.Attributes.FirstOrDefaultAsync(x => x.Id == id);

            if (attribute == null)
                return "NotFound";

            // Check if attribute is used in any variations or products
            var variations = await _data.Variations
                .Where(x => x.Attributes.Any(a => a.Value.AttributeId == id))
                .ToListAsync();
            var products = await _data.Products.Where(x => x.Attributes.Any(a => a.AttributeId == id)).ToListAsync();
            if (variations.Count > 0 || products.Count > 0)
                return "Attribute is used in variations or products";

            _data.Attributes.Remove(attribute);
            await _data.SaveChangesAsync();

            return "Ok";
        }

        public async Task<string?> DeleteAttributeValue(int attributeId, int valueId)
        {
            var attributeValue = await _data.AttributeValues.FirstOrDefaultAsync(x => x.Id == valueId && x.AttributeId == attributeId);

            if (attributeValue == null)
                return "NotFound";

            // Check if attribute value is used in any variations or products
            var variations = await _data.Variations
                .Where(x => x.Attributes.Any(a => a.Value.AttributeId == attributeId && a.Value.Id == valueId))
                .ToListAsync();
            var products = await _data.Products
                .Where(x => x.Attributes.Any(a => a.AttributeId == attributeId && a.Values.Any(v => v.Id == valueId)))
                .ToListAsync();

            if (variations.Count > 0 || products.Count > 0)
                return "Attribute value is used in variations or products";

            _data.AttributeValues.Remove(attributeValue);
            await _data.SaveChangesAsync();

            return "Ok";
        }
    }
}
