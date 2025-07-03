using InventoryHQ.Data.Models;

namespace InventoryHQ.Models.DTOs
{
    public class InventoryUnitDto
    {
        public int Id { get; set; }
        public required bool ManageQuantity { get; set; }

        public int? Quantity { get; set; }

        public Package? Package { get; set; }

        public required LocationDto Location { get; set; }
    }
}
