namespace InventoryHQ.Models.DTOs
{
    public class VariationAttributeDto
    {
        public int Id { get; set; }
        public required string Name { get; set; }
        public required AttributeValueDto Value { get; set; }
    }
}
