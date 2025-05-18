using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data.Models
{
    public class Category : BaseEntity
    {
        [Required]
        public string Name { get; set; }

        public int ParentId { get; set; }

        public Category Parent { get; set; }

        public List<Category> Children { get; set; }

        public List<Product> Products { get; set; } = new();
    }
}
