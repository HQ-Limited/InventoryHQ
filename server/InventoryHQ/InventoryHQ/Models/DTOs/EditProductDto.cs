namespace InventoryHQ.Models.DTOs
{
    public class EditProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public bool IsVariable { get; set; }

        public bool ManageQuantity { get; set; }

        public IEnumerable<AttributeDto>? Attributes { get; set; }

        public IEnumerable<CategoryDto>? Categories { get; set; }

        public IEnumerable<VariationDto> Variations { get; set; }

        public IEnumerable<PackageDto>? Packages { get; set; }
    }
}
