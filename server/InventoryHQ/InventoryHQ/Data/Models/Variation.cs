using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(SKU), IsUnique = true)]
    public class Variation : BaseEntity
    {
        [Required]
        public string SKU { get; set; }

        [Required]
        public decimal RetailPrice { get; set; }

        public string? Description { get; set; }

        [Required]
        public int ProductId { get; set; }

        [Required]
        public Product Product { get; set; }

        [Required]
        public ICollection<InventoryUnit> InventoryUnits { get; set; }

        public ICollection<VariationAttributeValue> VariationAttributeValues { get; set; }
    }
}
