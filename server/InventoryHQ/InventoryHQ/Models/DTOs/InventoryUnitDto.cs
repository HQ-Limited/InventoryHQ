using InventoryHQ.Data.Models;

namespace InventoryHQ.Models.DTOs
{
    public class InventoryUnitDto
    {
        public int Id { get; set; }

        public required int Quantity { get; set; }

        public PackageDto? Package { get; set; }

        public required LocationDto Location { get; set; }
    }
}
