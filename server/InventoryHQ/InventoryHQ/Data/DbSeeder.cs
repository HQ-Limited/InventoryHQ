using InventoryHQ.Data.Models;
using Bogus;
using System.Linq;

namespace InventoryHQ.Data
{
    public static class DbSeeder
    {
        public static void Seed(InventoryHQDbContext context)
        {
            // If database already has data, don't seed
            if (context.Products.Any())
            {
                return;
            }

            var locationFaker = new Faker<Location>()
                .RuleFor(l => l.Name, f => f.Address.City());
            var locations = locationFaker.Generate(3);
            context.Locations.AddRange(locations);
            context.SaveChanges();

            var dbLocations = context.Locations.ToList();

            // Fixed categories
            var categoryFaker = new Faker<Category>()
                .RuleFor(c => c.Name, f => f.Commerce.Categories(1)[0]);
            var categories = categoryFaker.Generate(5);
            context.Categories.AddRange(categories);
            context.SaveChanges();

            // Fixed attributes and values
            var colorAttribute = new Models.Attribute
            {
                Name = "Color",
                Values = new List<AttributeValue>
                {
                    new AttributeValue { Value = "Red" },
                    new AttributeValue { Value = "Green" },
                    new AttributeValue { Value = "Blue" }
                }
            };
            var materialAttribute = new Models.Attribute
            {
                Name = "Material",
                Values = new List<AttributeValue>
                {
                    new AttributeValue { Value = "Wool" },
                    new AttributeValue { Value = "Leather" }
                }
            };
            var sizeAttribute = new Models.Attribute
            {
                Name = "Size",
                Values = new List<AttributeValue>
                {
                    new AttributeValue { Value = "S" },
                    new AttributeValue { Value = "M" },
                    new AttributeValue { Value = "L" }
                }
            };

            var attributes = new List<Models.Attribute>
            {
                colorAttribute,
                materialAttribute,
                sizeAttribute
            };
            context.Attributes.AddRange(attributes);
            context.SaveChanges();

            // Reload tracked AttributeValues from DB
            var dbAttributeValues = context.AttributeValues.ToList();


            var product1 = new Product
            {
                Name = "Sweater",
                Description = "Warm and cozy sweater",
                Categories = new List<Category> { categories[0] },
                isVariable = true,
                Attributes = new List<ProductAttribute>
                {
                    new ProductAttribute
                    {
                        Attribute = colorAttribute,
                        Values = new List<AttributeValue>
                        {
                            dbAttributeValues.First(av => av.AttributeId == colorAttribute.Id && av.Value == "Red"),
                            dbAttributeValues.First(av => av.AttributeId == colorAttribute.Id && av.Value == "Green")
                        },
                        IsVariational = true
                    },
                },
                Variations = new List<Variation>
                {
                    new Variation
                    {
                        SKU = "ABC123",
                        RetailPrice = 20,
                        Attributes = new List<VariationAttribute>
                        {
                            new VariationAttribute
                            {
                                AttributeValueId = dbAttributeValues.First(av => av.AttributeId == colorAttribute.Id && av.Value == "Red").Id,
                            }
                        },
                        InventoryUnits = new List<InventoryUnit>
                        {
                            new InventoryUnit
                            {
                                LocationId = dbLocations[0].Id,
                                Quantity = 10,
                                ManageQuantity = true
                            },
                        }
                    },
                    new Variation
                    {
                        SKU = "ABC1234",
                        RetailPrice = 25,
                        Attributes = new List<VariationAttribute>
                        {
                            new VariationAttribute
                            {
                                AttributeValueId = dbAttributeValues.First(av => av.AttributeId == colorAttribute.Id && av.Value == "Green").Id,
                            }
                        },
                        InventoryUnits = new List<InventoryUnit>
                        {
                            new InventoryUnit
                            {
                                LocationId = dbLocations[0].Id,
                                ManageQuantity = false
                            },
                        }
                    },

                }
            };

            context.Products.Add(product1);
            context.SaveChanges();
            Console.WriteLine("Seeding completed successfully.");
        }
    }
}