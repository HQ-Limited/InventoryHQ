namespace InventoryHQ.Models.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public bool IsVariable { get; set; }

        public bool ManageQuantity { get; set; }

        public bool? InStock { get; set; }

        public List<CategoryDto>? Categories { get; set; }

        public List<VariationDto> Variations { get; set; }

        public List<ProductAttributeDto>? Attributes { get; set; }
    }
}
