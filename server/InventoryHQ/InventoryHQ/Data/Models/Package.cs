using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Package : BaseEntity
    {
        public string? Label { get; set; }

        [Required]
        public required decimal Price { get; set; }

        public int LocationId { get; set; }

        [Required]
        public required Location Location { get; set; }

        [MaxLength(200)]
        public string? Description { get; set; }
    }
}