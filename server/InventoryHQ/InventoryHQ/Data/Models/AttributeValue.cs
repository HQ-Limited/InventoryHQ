using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(AttributeId), nameof(Value), IsUnique = true)]
    public class AttributeValue : BaseEntity
    {
        [Required]
        public int AttributeId { get; set; }

        [Required]
        public Attribute Attribute { get; set; }

        [Required]
        public string Value { get; set; }

        public ICollection<VariationAttributeValue> VariationAttributeValues { get; set; }
    }
}