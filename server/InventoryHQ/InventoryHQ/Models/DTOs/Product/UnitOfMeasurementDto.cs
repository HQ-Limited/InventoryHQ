namespace InventoryHQ.Models.DTOs
{
    public class UnitOfMeasurementDto
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public string? Abbreviation { get; set; }
        
        public string? Barcode { get; set; }

        public float Multiplier { get; set; }

    }
}
