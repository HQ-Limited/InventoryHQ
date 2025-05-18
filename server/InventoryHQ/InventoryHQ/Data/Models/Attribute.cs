using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Attribute : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public string Value { get; set; }

        public List<Variation> Variations { get; set; } = new();
    }
}
