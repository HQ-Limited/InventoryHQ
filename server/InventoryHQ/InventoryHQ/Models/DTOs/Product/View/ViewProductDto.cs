namespace InventoryHQ.Models.DTOs
{
    public class ViewProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public bool IsVariable { get; set; }

        public IEnumerable<ViewProductAttributeDto>? Attributes { get; set; }

        public IEnumerable<ViewCategoryDto>? Categories { get; set; }

        public IEnumerable<ViewVariationDto> Variations { get; set; }
    }
}
