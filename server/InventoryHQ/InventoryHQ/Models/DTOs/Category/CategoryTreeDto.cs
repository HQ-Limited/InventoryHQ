namespace InventoryHQ.Models.DTOs
{
    public class CategoryTreeDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public int? ParentId { get; set; }

        public List<CategoryTreeDto>? Children { get; set; }

        public bool IsLeaf { get; set; }
    }
}