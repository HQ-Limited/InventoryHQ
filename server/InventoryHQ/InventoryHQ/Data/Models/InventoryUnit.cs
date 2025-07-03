using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class InventoryUnit : BaseEntity
    {
        [Required]
        public required bool ManageQuantity { get; set; }

        public int? Quantity { get; set; }

        public int? PackageId { get; set; }

        public Package? Package { get; set; }

        public int VariationId { get; set; }

        public Variation Variation { get; set; }

        public int LocationId { get; set; }

        public Location Location { get; set; }
    }
}