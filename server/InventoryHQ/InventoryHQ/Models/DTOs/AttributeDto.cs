namespace InventoryHQ.Models.DTOs
{
    public class AttributeDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public List<AttributeValueDto> Values { get; set; }

        public bool? IsVariational { get; set; }
    }
}
