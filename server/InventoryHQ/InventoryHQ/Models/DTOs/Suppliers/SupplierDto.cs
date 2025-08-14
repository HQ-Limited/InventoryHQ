using InventoryHQ.Data.Models;

namespace InventoryHQ.Models.DTOs
{
    public class SupplierDto
    {
        public int Id { get; set; }
        
        public string Name { get; set; }

        public string PMR { get; set; }

        public string? Phone { get; set; }

        public string? Email { get; set; }

        public string VAT { get; set; }
        
        public string? TaxVAT { get; set; }

        public string? Address { get; set; }

        public IEnumerable<PricelistDto>? Pricelist { get; set; }

        public bool Deleted { get; set; } = false;
    }
}
