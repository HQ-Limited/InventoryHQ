using InventoryHQ.Data.Models;

namespace InventoryHQ.Models.DTOs
{
    public class ReceiverDto
    {
        public int Id { get; set; }
        
        public required string Name { get; set; }
    }
}