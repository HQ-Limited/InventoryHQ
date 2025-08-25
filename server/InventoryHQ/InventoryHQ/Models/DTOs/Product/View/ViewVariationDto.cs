namespace InventoryHQ.Models.DTOs
{
    public class ViewVariationDto
    {
        public int Id { get; set; }

        public string? SKU { get; set; }

        public string? Barcode { get; set; }

        public decimal RetailPrice { get; set; }

        public string? Description { get; set; }

        public float? MinStock { get; set; }

        public IEnumerable<ViewVariationAttributeDto>? Attributes { get; set; }

        public IEnumerable<ViewInventoryUnitDto> InventoryUnits { get; set; }
    }
}
