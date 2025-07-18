namespace InventoryHQ.Models.DTOs
{
    public class EditAttributeDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public IEnumerable<AttributeValueDto> Values { get; set; }
    }
}
