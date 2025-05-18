namespace InventoryHQ.Models
{
    public class ProductDto
    {
        public int Id { get; set; }

        public List<VariationDto> Variations { get; set; }

        public List<CategoryDto> Categories { get; set; } = new();
    }
}
