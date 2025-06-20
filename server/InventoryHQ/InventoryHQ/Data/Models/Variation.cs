using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Variation : BaseEntity
    {
        [Required]
        public string SKU { get; set; }

        [Required]
        public decimal RetailPrice { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int ProductId { get; set; }

        public Product Product { get; set; }

        public ICollection<InventoryUnit> InventoryUnits { get; set; }

        public ICollection<VariationAttributeValue> VariationAttributeValues {get; set;}
    }
}
