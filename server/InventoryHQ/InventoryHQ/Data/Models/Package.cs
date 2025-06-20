using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Package : BaseEntity
    {
        public string Label { get; set; }

        public decimal Price { get; set; }

        public int LocationId { get; set; }

        public Location Location { get; set; }

        [MaxLength(200)]
        public string? Description { get; set; }
    }
}