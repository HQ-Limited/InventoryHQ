namespace InventoryHQ.Models
{
    public class CategoryDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int ParentId { get; set; }

        public CategoryDto Parent { get; set; }

        public List<CategoryDto> Children { get; set; }

        public List<ProductDto> Products { get; set; } = new();
    }
}