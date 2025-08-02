namespace InventoryHQ.Models.DTOs
{
    public class CreateCategoryDto
    {
        public required string Name { get; set; }

        public int? ParentId { get; set; } = null;
    }
}