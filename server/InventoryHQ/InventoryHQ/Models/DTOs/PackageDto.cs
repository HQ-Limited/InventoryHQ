namespace InventoryHQ.Models.DTOs
{
    public class PackageDto
    {
        public string? Label { get; set; }

        public required decimal Price { get; set; }

        public int LocationId { get; set; }

        public required LocationDto Location { get; set; }

        public string? Description { get; set; }
    }
}
