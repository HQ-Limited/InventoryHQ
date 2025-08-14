using InventoryHQ.Data.Models;

namespace InventoryHQ.Models.DTOs
{
    public class PricelistDto
    {
        public int SupplierId { get; set; }

        public string ProductName { get; set; }

        public PricelistVariationDto Variation { get; set; }
        
        public float Price { get; set; }
    }
}
