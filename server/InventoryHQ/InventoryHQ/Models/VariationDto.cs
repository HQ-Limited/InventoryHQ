using InventoryHQ.Data.Models;
using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Models
{
    public class VariationDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public decimal Price { get; set; }

        public double Quantity { get; set; }

        public string Description { get; set; }

        public string SKU { get; set; }

        public int ProductId { get; set; }

        public List<AttributeDto> Attributes { get; set; } = new();
    }
}