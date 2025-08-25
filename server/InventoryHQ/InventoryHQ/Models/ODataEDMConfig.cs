using InventoryHQ.Models.DTOs;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

public static class ODataEdmConfig
{
    public static IEdmModel GetEdmModel()
    {
        var builder = new ODataConventionModelBuilder();

// From Models> DTOs
        builder.EntitySet<CustomerDto>("Customers");
        builder.EntitySet<CustomerGroupDto>("CustomerGroups");
        builder.EntitySet<ReceiverDto>("Receiver");
        builder.EntitySet<EditProductDto>("EditProducts");
        builder.EntitySet<UnitOfMeasurementDto>("UnitsOfMeasurement");
        builder.EntitySet<SupplierDto>("Suppliers");
        builder.EntitySet<PricelistDto>("Pricelist");
        builder.EntitySet<PricelistVariationDto>("PricelistVariations");
        builder.EntitySet<AttributeDto>("Attributes");
        builder.EntitySet<AttributeValueDto>("AttributeValues");
        builder.EntitySet<CategoryDto>("Categories");
        builder.EntitySet<InventoryUnitDto>("InventoryUnits");
        builder.EntitySet<LocationDto>("Locations");
        builder.EntitySet<PackageDto>("Packages");
        builder.EntitySet<ProductAttributeDto>("ProductAttributes");
        builder.EntitySet<ViewProductDto>("ViewProducts");
        builder.EntitySet<ViewProductAttributeDto>("ViewProductAttributes");
        builder.EntitySet<ViewAttributeValueDto>("ViewAttributeValues");
        builder.EntitySet<VariationAttributeDto>("VariationAttributes");
        builder.EntitySet<VariationDto>("Variations");

        return builder.GetEdmModel();
    }
}
