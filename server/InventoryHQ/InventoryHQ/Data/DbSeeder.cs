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
                AttributeValues = new List<AttributeValue>
                {
                    new AttributeValue { Value = "Red" },
                    new AttributeValue { Value = "Green" },
                    new AttributeValue { Value = "Blue" }
                }
            };
            var materialAttribute = new Models.Attribute
            {
                Name = "Material",
                AttributeValues = new List<AttributeValue>
                {
                    new AttributeValue { Value = "Wool" },
                    new AttributeValue { Value = "Leather" }
                }
            };
            var sizeAttribute = new Models.Attribute
            {
                Name = "Size",
                AttributeValues = new List<AttributeValue>
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

            var productFaker = new Faker<Product>()
    .RuleFor(p => p.Name, f => f.Commerce.ProductName())
    .RuleFor(p => p.Categories, f => f.PickRandom(categories, f.Random.Int(0, 3)).ToList())
    .RuleFor(p => p.Variations, (f, p) =>
{
    // Pick 1-3 attributes for this product
    var usedAttributes = f.PickRandom(attributes, f.Random.Int(1, 3)).ToList();

    // Get all possible combinations of attribute values for the selected attributes
    IEnumerable<List<AttributeValue>> GetCombinations(List<Models.Attribute> attrs)
    {
        IEnumerable<List<AttributeValue>> combos = new List<List<AttributeValue>> { new List<AttributeValue>() };
        foreach (var attr in attrs)
        {
            combos = combos.SelectMany(
                acc => dbAttributeValues.Where(av => av.AttributeId == attr.Id).Select(av => acc.Concat(new[] { av }).ToList())
            );
        }
        return combos;
    }

    var allCombinations = GetCombinations(usedAttributes).ToList();
    int maxCombinations = allCombinations.Count;
    int variationCount = Math.Min(f.Random.Int(1, 3), maxCombinations);

    // Shuffle combinations and take as many as needed for variations
    var selectedCombinations = allCombinations
        .OrderBy(_ => f.Random.Int())
        .Take(variationCount)
        .ToList();

    var variations = new List<Variation>();
    bool isVariable = variationCount > 1; // true if product has more than one variation

    for (int i = 0; i < variationCount; i++)
    {
        var combination = selectedCombinations[i];

        var variation = new Variation
        {
            Description = f.Commerce.ProductDescription(),
            RetailPrice = Math.Round(f.Random.Decimal(0, 500), 2),
            SKU = f.Commerce.Ean13(),
            InventoryUnits = new List<InventoryUnit>
            {
                new InventoryUnit { ManageQuantity = f.Random.Bool(), Quantity = f.Random.Int(0, 500) }
            },
            VariationAttributeValues = new List<VariationAttributeValue>()
        };

        // Assign each attribute value in the combination to the variation
        for (int j = 0; j < usedAttributes.Count; j++)
        {
            variation.VariationAttributeValues.Add(new VariationAttributeValue
            {
                AttributeValueId = combination[j].Id,
                AttributeValue = combination[j],
                IsVariational = isVariable // <-- Set based on product's variation count
            });
        }

        variations.Add(variation);
    }
    return variations;
<<<<<<< Updated upstream
});

            try
            {
                var products = productFaker.Generate(50);
                context.Products.AddRange(products);
                context.SaveChanges();
                Console.WriteLine("Seeding completed successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
=======
});

            try
            {
                var products = productFaker.Generate(50);
                context.Products.AddRange(products);
                context.SaveChanges();
                Console.WriteLine("Seeding completed successfully.");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }
>>>>>>> Stashed changes
        }
    }
}