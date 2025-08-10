using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class UnitOfMeasurement : BaseEntity
    {
        [Required]
        public required string Name { get; set; }

        public string? Abbreviation { get; set; }

        [Required]
        public required float Multiplier { get; set; }

        public string? Barcode { get; set; }

        public Product Product { get; set; }
    }
}
