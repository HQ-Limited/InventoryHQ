namespace InventoryHQ.Models.DTOs
{
    public class CreateAttributeDto
    {
        public required string Name { get; set; }

        //TODO: Figure out how to get an array of strings and then map them to CreateAttributeValueDto
        public IEnumerable<CreateAttributeValueDto>? Values { get; set; }
    }
}
