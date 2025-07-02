using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Attribute : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public ICollection<AttributeValue> AttributeValues { get; set; }
    }
}
