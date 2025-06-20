namespace InventoryHQ.Data.Models
{
    public class AttributeValue : BaseEntity
    {
        public int AttributeId { get; set; }

        public Attribute Attribute { get; set; }

        public string Value { get; set; }

        public ICollection<VariationAttributeValue> VariationAttributeValues { get; set; }
    }
}