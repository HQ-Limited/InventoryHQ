using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Location : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        public string Description { get; set; }
    }
}