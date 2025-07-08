namespace InventoryHQ.Models.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public string? Description { get; set; }

        public required bool IsVariable { get; set; }

        public required bool ManageQuantity { get; set; }

        public bool? InStock { get; set; }

        public List<CategoryDto>? Categories { get; set; }

        public required List<VariationDto> Variations { get; set; }

        public List<ProductAttributeDto>? Attributes { get; set; }
    }
}
