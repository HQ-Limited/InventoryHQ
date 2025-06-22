namespace InventoryHQ.Models.DTOs
{
    public class AttributeDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public List<AttributeValueDto> Values { get; set; }
    }
}
