using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Product : BaseEntity
    {
        [Required]
        public required string Name { get; set; }

        public string? Description { get; set; }

        public string? UnitOfMeasure { get; set; }

        [Required]
        public required bool ManageQuantity { get; set; }

        public bool? InStock { get; set; }

        [Required]
        public required List<Variation> Variations { get; set; }

        public List<ProductAttribute>? Attributes { get; set; }

        public List<Category>? Categories { get; set; } = new List<Category>();

        public List<UnitOfMeasurement>? UnitsOfMeasurement { get; set; } = new List<UnitOfMeasurement>();

        public bool isVariable { get; set; }
    }
}
