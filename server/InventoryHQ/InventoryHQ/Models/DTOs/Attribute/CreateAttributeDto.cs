namespace InventoryHQ.Models.DTOs
{
    public class CreateAttributeDto
    {
        public required string Name { get; set; }

        public IEnumerable<CreateAttributeValueDto>? Values { get; set; }
    }
}
