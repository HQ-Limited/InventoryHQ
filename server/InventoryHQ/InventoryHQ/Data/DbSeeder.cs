using InventoryHQ.Data.Models;
using Bogus;
using System.Linq;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

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

            // Generate parent categories (level 1)
            var parentCategoryFaker = new Faker<Category>()
                .RuleFor(c => c.Name, f => f.Commerce.Categories(1)[0]);
            var parentCategories = parentCategoryFaker.Generate(10);

            // Generate child categories (level 2), each with a random parent
            var childCategoryFaker = new Faker<Category>()
                .RuleFor(c => c.Name, f => f.Commerce.Categories(1)[0])
                .RuleFor(c => c.Parent, f => f.PickRandom(parentCategories));
            var childCategories = childCategoryFaker.Generate(30);

            // Generate sub-child categories (level 3), each with a random child as parent
            var subChildCategoryFaker = new Faker<Category>()
                .RuleFor(c => c.Name, f => f.Commerce.Categories(1)[0])
                .RuleFor(c => c.Parent, f => f.PickRandom(childCategories));
            var subChildCategories = subChildCategoryFaker.Generate(60);

            // Combine all categories
            var categories = parentCategories.Concat(childCategories).Concat(subChildCategories).ToList();
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


            var variableProduct = new Product
            {
                Name = "Variable Product in 2 Locations",
                Description = "Warm and cozy sweater",
                Categories = new List<Category> { categories[0] },
                isVariable = true,
                ManageQuantity = true,
                UnitsOfMeasurement = new List<UnitOfMeasurement>
                {
                    new UnitOfMeasurement
                    {
                        Abbreviation = "pcs",
                        IsDefault = true,
                        IsBase = true,
                    },
                    new UnitOfMeasurement
                    {
                        Name = "Box",
                        Multiplier = 12,
                        Abbreviation = "box",
                        Barcode = "1234567890",
                        IsDefault = false,
                        IsBase = false,
                    },
                    new UnitOfMeasurement
                    {
                        Name = "Pallet",
                        Multiplier = 100,
                        Abbreviation = "pallet",
                        Barcode = "1234567891",
                        IsDefault = false,
                        IsBase = false,
                    },
                },
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
                    new ProductAttribute
                    {
                        Attribute = sizeAttribute,
                        Values = new List<AttributeValue>
                        {
                            dbAttributeValues.First(av => av.AttributeId == sizeAttribute.Id && av.Value == "S"),
                            dbAttributeValues.First(av => av.AttributeId == sizeAttribute.Id && av.Value == "M")
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
                        Barcode = "123123123",
                        Attributes = new List<VariationAttribute>
                        {
                            new VariationAttribute
                            {
                                AttributeValueId = dbAttributeValues.First(av => av.AttributeId == colorAttribute.Id && av.Value == "Red").Id,
                            },
                            new VariationAttribute
                            {
                                AttributeValueId = dbAttributeValues.First(av => av.AttributeId == sizeAttribute.Id && av.Value == "S").Id,
                            }
                        },
                        InventoryUnits = new List<InventoryUnit>
                        {
                            new InventoryUnit
                            {
                                LocationId = dbLocations[0].Id,
                                Quantity = 10,
                            },
                            new InventoryUnit
                            {
                                LocationId = dbLocations[1].Id,
                                Quantity = 50,
                            },
                        }
                    },
                    new Variation
                    {
                        SKU = "ABC1234",
                        RetailPrice = 25,
                        Barcode = "123123124",
                        Attributes = new List<VariationAttribute>
                        {
                            new VariationAttribute
                            {
                                AttributeValueId = dbAttributeValues.First(av => av.AttributeId == colorAttribute.Id && av.Value == "Green").Id,
                            },
                            new VariationAttribute
                            {
                                AttributeValueId = dbAttributeValues.First(av => av.AttributeId == sizeAttribute.Id && av.Value == "M").Id,
                            }
                        },
                        InventoryUnits = new List<InventoryUnit>
                        {
                            new InventoryUnit
                            {
                                LocationId = dbLocations[0].Id,
                                Quantity = 20,
                            },
                            new InventoryUnit
                            {
                                LocationId = dbLocations[1].Id,
                                Quantity = 30,
                            },
                        }
                    },

                }
            };

            var simpleProduct1 = new Product
            {
                Name = "Simple product in 2 locations",
                Description = "Comfortable t-shirt",
                Categories = new List<Category> { categories[1] },
                isVariable = false,
                ManageQuantity = true,
                UnitsOfMeasurement = new List<UnitOfMeasurement>
                {
                    new UnitOfMeasurement
                    {
                        Abbreviation = "kg",
                        IsDefault = false,
                        IsBase = true,
                    },
                    new UnitOfMeasurement
                    {
                        Name = "Carton",
                        Multiplier = 4,
                        Abbreviation = "cart",
                        Barcode = "142423132",
                        IsDefault = true,
                        IsBase = false,
                    },
                },
                Attributes = new List<ProductAttribute>
                {
                    new ProductAttribute
                    {
                        Attribute = colorAttribute,
                        Values = new List<AttributeValue>
                        {
                            dbAttributeValues.First(av => av.AttributeId == colorAttribute.Id && av.Value == "Red"),
                        },
                        IsVariational = false
                    },
                },
                Variations = new List<Variation>
                {
                    new Variation
                    {
                        SKU = "ABC12345",
                        RetailPrice = 12,
                        Barcode = "123123125",
                        InventoryUnits = new List<InventoryUnit>
                        {
                            new InventoryUnit
                            {
                                LocationId = dbLocations[0].Id,
                                Quantity = 10,
                            },
                            new InventoryUnit
                            {
                                LocationId = dbLocations[1].Id,
                                Quantity = 5,
                            },
                        }
                    },

                }
            };

            var simpleProduct2 = new Product
            {
                Name = "Simple product (Unmannaged quantity)",
                Description = "Comfortable t-shirt",
                Categories = new List<Category> { categories[1] },
                isVariable = false,
                ManageQuantity = false,
                UnitsOfMeasurement = new List<UnitOfMeasurement>
                {
                    new UnitOfMeasurement
                    {
                        Abbreviation = "pcs",
                        IsDefault = true,
                        IsBase = true,
                    },
                },
                Variations = new List<Variation>
                {
                    new Variation
                    {
                        SKU = "ABC123456",
                        RetailPrice = 12,
                        InventoryUnits = new List<InventoryUnit>
                        {
                            new InventoryUnit
                            {
                                Quantity = 0,
                            },
                        }
                    }
                }
            };

            var package1 = new Package
            {
                Price = 10,
                LocationId = dbLocations[0].Id
            };

            var package2 = new Package
            {
                Price = 5,
                LocationId = dbLocations[0].Id
            };

            var package3 = new Package
            {
                Price = 10,
                LocationId = dbLocations[0].Id
            };

            var package4 = new Package
            {
                Price = 5,
                LocationId = dbLocations[0].Id
            };

            context.Packages.AddRange(new List<Package> { package1, package2, package3, package4 });
            context.SaveChanges();


            var simpleProductPackages = new Product
            {
                Name = "Simple product with 2 packages (1 location)",
                Description = "This product contains 2 packages with the following data inside: Package 1 - 10$ - 10 pieces inside, Package 2 - 5$ - 5 pieces inside",
                Categories = new List<Category> { categories[1] },
                isVariable = false,
                ManageQuantity = false,
                UnitsOfMeasurement = new List<UnitOfMeasurement>
                {
                    new UnitOfMeasurement
                    {
                        Abbreviation = "pcs",
                        IsDefault = true,
                        IsBase = true,
                    },
                },
                Attributes = new List<ProductAttribute>
                {
                    new ProductAttribute
                    {
                        Attribute = colorAttribute,
                        Values = new List<AttributeValue>
                        {
                            dbAttributeValues.First(av => av.AttributeId == colorAttribute.Id && av.Value == "Red"),
                        },
                        IsVariational = false
                    },
                },
                Variations = new List<Variation>
                {
                    new Variation
                    {
                        SKU = "FFFF123",
                        RetailPrice = 12,
                        InventoryUnits = new List<InventoryUnit>
                        {
                            new InventoryUnit
                            {
                                LocationId = dbLocations[0].Id,
                                Quantity = 10,
                                PackageId = package1.Id
                            },
                            new InventoryUnit
                            {
                                LocationId = dbLocations[0].Id,
                                Quantity = 5,
                                PackageId = package2.Id
                            }
                        },
                    },

                }
            };

            var variableProductPackages = new Product
            {
                Name = "Variable Product with 2 packages (No locations)",
                Description = "This product contains 2 packages with the following data inside: Package 1 - 10$ - 10 pieces of variation 1 and 10 pieces of variation 2, Package 2 - 5$ - 10 pieces of variation 1 and 5 pieces of variation 2",
                Categories = new List<Category> { categories[0] },
                isVariable = true,
                ManageQuantity = false,
                UnitsOfMeasurement = new List<UnitOfMeasurement>
                {
                    new UnitOfMeasurement
                    {
                        Abbreviation = "pcs",
                        IsDefault = true,
                        IsBase = true,
                    },
                },
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
                        SKU = "AAA111",
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
                                Quantity = 10,
                                PackageId = package3.Id
                            },
                            new InventoryUnit
                            {
                                Quantity = 10,
                                PackageId = package4.Id
                            },
                        }
                    },
                    new Variation
                    {
                        SKU = "AAA222",
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
                                Quantity = 10,
                                PackageId = package3.Id
                            },
                            new InventoryUnit
                            {
                                Quantity = 5,
                                PackageId = package4.Id
                            },
                        }
                    },

                }
            };


            context.Products.Add(variableProduct);
            context.Products.Add(simpleProduct1);
            context.Products.Add(simpleProduct2);
            context.Products.Add(simpleProductPackages);
            context.Products.Add(variableProductPackages);

            var customerGroup = new CustomerGroup
            {
                Name = "Wholesale",
                Discount = 10,
            };

            context.CustomerGroup.Add(customerGroup);
            context.SaveChanges();

            var customer = new Customer
            {
                Name = "Customer 1",
                PMR = "John Joe",
                Phone = "+359891231231",
                Email = "customer1@gmail.com",
                VAT = "123456789",
                TaxVAT = "BG123456789",
                Address = "Bulgaria, Sofia, 1000, Tsarigradsko shose 12",
                DeliveryAddress = "Bulgaria, Sofia, 1000, Borisova 3",
                Discount = 10,
                Receivers = new List<Receiver>
                {
                    new Receiver
                    {
                        Name = "John Doe",
                    }
                },
                CustomerGroup = customerGroup
            };

            var customer2 = new Customer
            {
                Name = "Customer 2",
                PMR = "Johny Bravo",
                VAT = "123123123",
            };

            context.Customers.Add(customer);
            context.Customers.Add(customer2);
            context.SaveChanges();

            var supplier = new Supplier
            {
                Name = "Supplier 1",
                PMR = "Supplier 1",
                VAT = "123456789",
                Pricelist = new List<Pricelist>
                {
                    new Pricelist
                    {
                        Variation = variableProduct.Variations.First(),
                        Price = 10,
                    }
                }
            };

            context.Suppliers.Add(supplier);
            context.SaveChanges();


            Console.WriteLine("Seeding completed successfully.");
        }
    }
}