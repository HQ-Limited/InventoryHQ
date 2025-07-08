namespace InventoryHQ.Models.DTOs
{
    public class ProductAttributeDto
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public required List<AttributeValueDto> Values { get; set; }

        public required bool IsVariational { get; set; }
    }
}
