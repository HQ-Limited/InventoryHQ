using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Models.DTOs
{
    public class VariationDto
    {
        public int Id { get; set; }

        public required string SKU { get; set; }

        public required decimal RetailPrice { get; set; }

        public string? Description { get; set; }

        public List<VariationAttributeDto>? Attributes { get; set; }

        public required List<InventoryUnitDto> InventoryUnits { get; set; }
    }
}
