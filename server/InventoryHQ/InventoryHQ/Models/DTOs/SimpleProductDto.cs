namespace InventoryHQ.Models.DTOs
{
    public class SimpleProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public double Quantity { get; set; }

        public string Description { get; set; }

        public string SKU { get; set; }

        public List<CategoryDto> Categories { get; set; } = new();

        public List<AttributeDto> Attributes { get; set; } = new();
    }
}
