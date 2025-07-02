namespace InventoryHQ.Models.DTOs
{
    public class VariationAttributeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }

        public AttributeValueDto Value { get; set; }

        public bool IsVariational { get; set; }
    }
}
