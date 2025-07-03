using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(SKU), IsUnique = true)]
    public class Variation : BaseEntity
    {
        [Required]
        public required string SKU { get; set; }

        [Required]
        public required decimal RetailPrice { get; set; }

        public string? Description { get; set; }

        public int ProductId { get; set; }

        public Product Product { get; set; }

        public required ICollection<InventoryUnit> InventoryUnits { get; set; }

        public ICollection<VariationAttribute>? Attributes { get; set; }
    }
}
