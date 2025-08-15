using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Product : BaseEntity
    {
        [Required]
        public required string Name { get; set; }

        public string? Description { get; set; }

        public int? Vat { get; set; }

        [Required]
        public required List<Variation> Variations { get; set; }

        public List<ProductAttribute>? Attributes { get; set; }

        public List<Category>? Categories { get; set; } = new List<Category>();

        [Required]
        public required List<UnitOfMeasurement> UnitsOfMeasurement { get; set; }

        public bool isVariable { get; set; }
    }
}
