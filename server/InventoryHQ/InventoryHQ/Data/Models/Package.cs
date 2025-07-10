using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Package : BaseEntity
    {
        public string? Label { get; set; }

        [Required]
        public required decimal Price { get; set; }

        [Required]
        public required int LocationId { get; set; }

        public Location Location { get; set; }

        public List<InventoryUnit> InventoryUnit { get; set; }

        [MaxLength(200)]
        public string? Description { get; set; }
    }
}