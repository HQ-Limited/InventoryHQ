using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Attribute : BaseEntity
    {
        [Required]
        public required string Name { get; set; }

        public ICollection<AttributeValue>? Values { get; set; }
    }
}
