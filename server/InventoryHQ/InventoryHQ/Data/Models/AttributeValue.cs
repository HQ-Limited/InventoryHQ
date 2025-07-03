using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(AttributeId), nameof(Value), IsUnique = true)]
    public class AttributeValue : BaseEntity
    {
        public int AttributeId { get; set; }

        public Attribute Attribute { get; set; }

        [Required]
        public required string Value { get; set; }

        public ICollection<ProductAttribute>? ProductAttributes { get; set; }

        public ICollection<VariationAttribute>? VariationAttributes { get; set; }
    }
}