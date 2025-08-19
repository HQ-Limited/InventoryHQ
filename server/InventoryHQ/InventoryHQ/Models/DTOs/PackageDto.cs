using InventoryHQ.Data.Models;

namespace InventoryHQ.Models.DTOs
{
    public class PackageDto
    {
        public int Id { get; set; }

        public string? Label { get; set; }

        public decimal Price { get; set; }

        public string? Description { get; set; }

        public LocationDto Location { get; set; }

        public IEnumerable<InventoryUnitDto> InventoryUnits { get; set; }

        public DateOnly? ExpirationDate { get; set; }

        public string? LotNumber { get; set; }
    }
}
