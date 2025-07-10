namespace InventoryHQ.Models.DTOs
{
    public class PackageDto
    {
        public int Id { get; set; }
        public string? Label { get; set; }

        public required decimal Price { get; set; }

        public string? Description { get; set; }
    }
}
