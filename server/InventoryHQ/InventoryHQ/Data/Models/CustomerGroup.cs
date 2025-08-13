using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class CustomerGroup : BaseEntity
    {
        [Required]
        public required string Name { get; set; }

        public float? Discount { get; set; }

        public List<Customer>? Customers { get; set; } = new List<Customer>();
    }
}
