using InventoryHQ.Data.Models;

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

            var categories = new List<Category>();
            for (int i = 1; i <= 100; i++)
            {
                categories.Add(new Category()
                {
                    Id = i,
                    Name = $"Category {i}",
                    Parent = i % 3 == 0 ? categories.FirstOrDefault(c => c.Id == new Random().Next(1, i - 1)) : null
                });
            }

            context.Categories.AddRange(categories);
            context.SaveChanges();

            var attrs = new List<Models.Attribute>()
            {
                new Models.Attribute()
                { 
                    Id=1, 
                    Name="Color", 
                    AttributeValues=new List<AttributeValue> () 
                    {
                        new AttributeValue() { Id=1, Value="Red" },
                        new AttributeValue() { Id=2, Value="Green" }
                    }
                },
                new Models.Attribute()
                {
                    Id=2,
                    Name="Size",
                    AttributeValues=new List<AttributeValue> ()
                    {
                        new AttributeValue() { Id=3, Value="S" },
                        new AttributeValue() { Id=4, Value="M" }
                    }
                }
            };

            context.Attributes.AddRange(attrs);
            context.SaveChanges();

            var firstProductVariation = new Variation()
            {
                Id = 1,
                Description = "First Variation",
                RetailPrice = 30M,
                SKU = "12312312QWE",
                ProductId = 1,
                InventoryUnits = new List<InventoryUnit>()
                {
                    new InventoryUnit() { Id=1, Quantity=30 }
                },
                VariationAttributeValues=new List<VariationAttributeValue> () 
                {
                    new VariationAttributeValue() { VariationId=1, AttributeValueId=1, IsVariational=false}
                }
            };

            var secondProductVariation = new Variation()
            {
                Id = 2,
                Description = "Second Variation",
                RetailPrice = 30M,
                SKU = "12312312QWE",
                ProductId = 2,
                InventoryUnits = new List<InventoryUnit>()
                {
                    new InventoryUnit() { Id=2, Quantity=40 }
                },
                VariationAttributeValues = new List<VariationAttributeValue>()
                {
                    new VariationAttributeValue() { VariationId=2, AttributeValueId=2, IsVariational=true},
                    new VariationAttributeValue() {VariationId=2, AttributeValueId=3, IsVariational=true}
                }
            };

            var thirdProductVariation = new Variation()
            {
                Id = 3,
                Description = "Third Variation",
                RetailPrice = 30M,
                SKU = "12312312QWE",
                ProductId = 2,
                InventoryUnits = new List<InventoryUnit>()
                {
                    new InventoryUnit() { Id=3, Quantity=50 }
                },
                VariationAttributeValues = new List<VariationAttributeValue>()
                {
                    new VariationAttributeValue() { VariationId=3, AttributeValueId=2, IsVariational=true},
                    new VariationAttributeValue() { VariationId=3, AttributeValueId=4, IsVariational=true}
                }
            };

            var fourthProductVariation = new Variation()
            {
                Id = 4,
                Description = "Fourth Variation",
                RetailPrice = 30M,
                SKU = "12356312QWE",
                ProductId = 3,
                InventoryUnits = new List<InventoryUnit>()
                {
                    new InventoryUnit() { Id=4, Quantity=30 }
                }
            };

            var products = new List<Product>()
            {
                new Product() { Id = 1, Name="Product 1", Categories=new List<Category>() {categories.First() }, Variations=new List<Variation>() { firstProductVariation } },
                new Product() { Id = 2, Name="Product 2", Categories= {categories.First(), categories.Last()}, Variations=new List<Variation>() { secondProductVariation, thirdProductVariation }},
                new Product() { Id = 3, Name="Product 3", Variations=new List<Variation>() { fourthProductVariation }}
            };

            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
