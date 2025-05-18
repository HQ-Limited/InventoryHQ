using System.ComponentModel.DataAnnotations;

namespace InventoryHQ.Data
{
    public abstract class BaseEntity
    {
        [Key]
        public int Id { get; set; }

        public DateTime? UpdatedDate { get; set; }

        public DateTime? CreatedDate { get; set; }

        public bool IsDeleted { get; set; }
    }
}