using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class ProductAttribute : BaseEntity
    {
        public int ProductId { get; set; }

        public Product Product { get; set; }

        public int AttributeId { get; set; }

        public Attribute Attribute { get; set; }

        [Required]
        public required List<AttributeValue> Values { get; set; }

        public bool IsVariational { get; set; }
    }
}