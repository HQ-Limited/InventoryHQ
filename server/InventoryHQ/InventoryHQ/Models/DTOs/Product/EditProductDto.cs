namespace InventoryHQ.Models.DTOs
{
    public class EditProductDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Description { get; set; }

        public bool IsVariable { get; set; }

        public bool ManageQuantity { get; set; }

        public bool? InStock { get; set; }

        public float? MinStock { get; set; }

        public int? Vat { get; set; }

        public IEnumerable<AttributeDto>? Attributes { get; set; }

        public IEnumerable<CategoryDto>? Categories { get; set; }

        public IEnumerable<VariationDto> Variations { get; set; }

        public IEnumerable<UnitOfMeasurementDto> UnitsOfMeasurement { get; set; }

        public IEnumerable<PackageDto>? Packages { get; set; }
    }
}
