namespace InventoryHQ.Models.DTOs
{
    public class ViewProductAttributeDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public IEnumerable<string> Values { get; set; }
    }
}
