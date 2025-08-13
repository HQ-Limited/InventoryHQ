using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data.Models
{
    [Index(nameof(Name), IsUnique = true)]
    [Index(nameof(VAT), IsUnique = true)]
    [Index(nameof(TaxVAT), IsUnique = true)]
    public class Customer : BaseEntity
    {
        [Required]
        public required string Name { get; set; }

        [Required]
        public required string PMR { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        [Required]
        public required string VAT { get; set; }
        
        public string? TaxVAT { get; set; }

        public string? Address { get; set; }

        public string? DeliveryAddress { get; set; }

        public float? Discount { get; set; }

        public List<Receiver>? Receivers { get; set; } = new List<Receiver>();

        public CustomerGroup? CustomerGroup { get; set; }

        public bool Deleted { get; set; } = false;
    }
}
