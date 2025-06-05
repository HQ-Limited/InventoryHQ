using Bogus;
using InventoryHQ.Data.Models;

namespace InventoryHQ.Data
{
    public static class DbSeeder
    {
        public static void Seed(InventoryHQDbContext context)
        {
            if (context.Products.Any())
            {
                return;
            }

            var categoryFaker = new Faker<Category>()
                .RuleFor(c => c.Name, f => f.Commerce.Department());

            var variationFaker = new Faker<Variation>()
                .RuleFor(v => v.Name, f => f.Commerce.Product())
                .RuleFor(v => v.Description, f => f.Commerce.ProductDescription())
                .RuleFor(v => v.SKU, f => f.Commerce.Ean8())
                .RuleFor(v => v.Quantity, f => f.Random.Number())
                .RuleFor(v => v.Price, f => f.Random.Number());

            var productsFaker = new Faker<Product>()
                .RuleFor(p => p.Variations, (f, p) =>
                {
                    return variationFaker.Generate(f.Random.Int(1, 4));
                })
                .RuleFor(p => p.Categories, (f, p) =>
                {
                    return categoryFaker.Generate(f.Random.Int(1, 3));
                });

            var products = productsFaker.Generate(50);
            context.Products.AddRange(products);
            context.SaveChanges();
        }
    }
}
