using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class VariationAttribute : BaseEntity
    {
        public int VariationId { get; set; }

        public Variation Variation { get; set; }

        public int AttributeValueId { get; set; }

        public AttributeValue Value { get; set; }
    }
}