using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(SKU), IsUnique = true)]
    [Index(nameof(Barcode), IsUnique = true)]
    public class Variation : BaseEntity
    {
        public string? SKU { get; set; }

        public string? Barcode { get; set; }

        [Required]
        public required decimal RetailPrice { get; set; }

        public float? MinStock { get; set; }

        public string? Description { get; set; }

        public int ProductId { get; set; }

        public Product Product { get; set; }

        public ICollection<InventoryUnit> InventoryUnits { get; set; } = new List<InventoryUnit>();

        public ICollection<VariationAttribute>? Attributes { get; set; }
    }
}
