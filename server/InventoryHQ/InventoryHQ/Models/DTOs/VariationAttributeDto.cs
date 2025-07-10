namespace InventoryHQ.Models.DTOs
{
    public class VariationAttributeDto
    {
        public int Id { get; set; }

        public string AttributeName { get; set; }
        
        public int AttributeId { get; set; }

        public required AttributeValueDto Value { get; set; }
    }
}
