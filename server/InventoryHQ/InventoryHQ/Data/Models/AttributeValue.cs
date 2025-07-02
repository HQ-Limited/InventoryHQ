using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(AttributeId), nameof(Value), IsUnique = true)]
    public class AttributeValue : BaseEntity
    {
        public int AttributeId { get; set; }

        public Attribute Attribute { get; set; }

        public string Value { get; set; }

        public ICollection<VariationAttributeValue> VariationAttributeValues { get; set; }
    }
}