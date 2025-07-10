namespace InventoryHQ.Models.DTOs
{
    public class VariationDto
    {
        public int Id { get; set; }

        public string SKU { get; set; }

        public decimal RetailPrice { get; set; }

        public string? Description { get; set; }

        public IEnumerable<VariationAttributeDto>? Attributes { get; set; }

        public IEnumerable<InventoryUnitDto>? InventoryUnits { get; set; }
    }
}
