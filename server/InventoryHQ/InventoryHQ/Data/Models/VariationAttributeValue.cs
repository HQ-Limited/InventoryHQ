namespace InventoryHQ.Data.Models
{
    public class VariationAttributeValue : BaseEntity
    {
        public int VariationId { get; set; }

        public Variation Variation { get; set; }

        public int AttributeValueId { get; set; }

        public AttributeValue AttributeValue { get; set; }

        /// <summary>
        /// Indicates if the attribute defines a product variation and impacts its price.
        /// TODO: Consider adding relation Attributes -> Product if filtering is a burden. 
        /// </summary>
        public bool IsVariational { get; set; }
    }
}