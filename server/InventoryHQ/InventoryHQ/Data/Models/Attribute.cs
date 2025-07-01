using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Attribute : BaseEntity
    {
        // TODO: Add uniqueness check for Name
        [Required]
        public string Name { get; set; }

        [Required]
        public ICollection<AttributeValue> AttributeValues { get; set; }
    }
}
