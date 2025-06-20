using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Models.DTOs
{
    public class VariationDto
    {
        [Required]
        public string SKU { get; set; }

        [Required]
        public decimal RetailPrice { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public int Quantity { get; set; }
    }
}
