using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Variation : BaseEntity
    {
        [Required]
        [StringLength(50)]
        public string Name { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Price must be greater than or equal 0.")]
        public decimal Price { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "Quantity must be greater than or equal 0.")]
        public double Quantity { get; set; }

        public string Description { get; set; }

        public string SKU { get; set; }

        public int ProductId { get; set; }

        public Product Product { get; set; }

        public List<Attribute> Attributes { get; set; } = new();
    }
}