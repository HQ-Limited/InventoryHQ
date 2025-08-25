namespace InventoryHQ.Models.DTOs
{
    public class InventoryUnitDto
    {
        public int Id { get; set; }

        public int Quantity { get; set; }

        public VariationDto Variation { get; set; }

        public PackageDto? Package { get; set; }

        public LocationDto Location { get; set; }
    }
}
