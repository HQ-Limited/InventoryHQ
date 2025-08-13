using InventoryHQ.Data.Models;

namespace InventoryHQ.Models.DTOs
{
    public class CustomerGroupDto
    {
        public int Id { get; set; }
        
        public string Name { get; set; }

        public float? Discount { get; set; }
    }
}
