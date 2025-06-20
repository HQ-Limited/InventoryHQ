using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Attribute : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public ICollection<AttributeValue> AttributeValues { get; set; }
    }
}
