using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Models.DTOs
{
    public class VariationDto
    {
        public int Id { get; set; }
        
        [Required]
        public string SKU { get; set; }

        [Required]
        public decimal RetailPrice { get; set; }

        public string? Description { get; set; }

        [Required]
        public bool ManageQuantity { get; set; }

        [Required]
        public int Quantity { get; set; }

        public List<VariationAttributeDto> Attributes { get; set; } = new();
    }
}
