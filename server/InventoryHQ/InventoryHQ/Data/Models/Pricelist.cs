using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(SupplierId), nameof(VariationId), IsUnique = true)]
    public class Pricelist : BaseEntity
    {
        public int SupplierId { get; set; }

        public Supplier Supplier { get; set; }

        public int VariationId { get; set; }

        public Variation Variation { get; set; }

        [Required]
        public required float Price { get; set; }
    }
}
