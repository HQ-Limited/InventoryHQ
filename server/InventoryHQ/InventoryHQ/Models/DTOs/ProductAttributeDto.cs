namespace InventoryHQ.Models.DTOs
{
    public class ProductAttributeDto
    {
        public int Id { get; set; }

        public int AttributeId { get; set; }

        public required string Name { get; set; }

        public IEnumerable<AttributeValueDto> Values { get; set; }

        public bool? IsVariational { get; set; }
    }
}
