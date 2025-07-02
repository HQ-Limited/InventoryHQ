namespace InventoryHQ.Models.DTOs
{
    public class ProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public bool IsVariable { get; set; }

        public List<CategoryDto> Categories { get; set; } = new();

        public List<VariationDto> Variations { get; set; } = new();

        public List<AttributeDto> Attributes { get; set; }
    }
}
