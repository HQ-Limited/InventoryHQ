using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class UnitOfMeasurement : BaseEntity
    {
        public string? Name { get; set; }

        [Required]
        public required string Abbreviation { get; set; }

        public float? Multiplier { get; set; }

        public string? Barcode { get; set; }

        public Product Product { get; set; }

        [Required]
        public required bool IsDefault { get; set; }

        [Required]
        public required bool IsBase { get; set; }
    }
}
