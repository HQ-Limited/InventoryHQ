using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Product : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        public List<Variation> Variations { get; set; }

        public List<Category> Categories { get; set; } = new();
    }
}
