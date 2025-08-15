using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(Name), IsUnique = true)]
    public class Location : BaseEntity
    {
        [Required]
        public required string Name { get; set; }

        public string? Description { get; set; }

        public List<InventoryUnit> InventoryUnits { get; set; } = new List<InventoryUnit>();
    }
}