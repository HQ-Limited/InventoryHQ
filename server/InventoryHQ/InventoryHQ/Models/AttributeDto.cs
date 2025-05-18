namespace InventoryHQ.Models
{
    public class AttributeDto
    {
        public string Name { get; set; }

        public string Value { get; set; }

        public List<VariationDto> Variations { get; set; } = new();
    }
}