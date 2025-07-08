using InventoryHQ.Data.Models;
using InventoryHQ.Models.Request;

namespace InventoryHQ.Extensions
{
    public static class TableQueryExtensions
    {
        public static IQueryable<Product> ApplyProductFilters(this IQueryable<Product> query, IEnumerable<TableFilter> filters)
        {
            if (filters == null || !filters.Any())
            {
                return query;
            }

            foreach (var filter in filters)
            {
                var filterValue = filter.Value.ToString();
                switch (filter.FieldName.ToLower())
                {
                    case "name":
                        if (filter.Operator == "ct")
                        {
                            query = query.Where(x => x.Name.Contains(filterValue));
                        }
                        else if (filter.Operator == "sw")
                        {
                            query = query.Where(x => x.Name.StartsWith(filterValue));
                        }
                        else if (filter.Operator == "eq")
                        {
                            query = query.Where(x => x.Name == filterValue);
                        }
                        break;
                    case "sku":
                        if (filter.Operator == "ct")
                        {
                            query = query.Where(x => x.Variations.Any(x=>x.SKU.Contains(filterValue)));
                        }
                        else if (filter.Operator == "sw")
                        {
                            query = query.Where(x => x.Variations.Any(x => x.SKU.StartsWith(filterValue)));
                        }
                        else if (filter.Operator == "eq")
                        {
                            query = query.Where(x => x.Variations.Any(x => x.SKU == filterValue));
                        }
                        break;
                }
            }
            var categoriesFilters = filters.Where(x => x.FieldName.ToLower() == "categories").Select(x => int.Parse(x.Value.ToString())).ToList();
            //query = query.Where(x => x.Categories.Any(y => categoriesFilters.Contains(y.Id)));

            return query;
        }

        public static IQueryable<Variation> ApplyVariationFilters(this IQueryable<Variation> query, IEnumerable<TableFilter> filters) 
        {
            if (filters == null || !filters.Any())
            {
                return query;
            }

            foreach (var filter in filters)
            {
                var filterValue = filter.Value.ToString();
                switch (filter.FieldName.ToLower())
                {
                    case "sku":
                        if (filter.Operator == "ct")
                        {
                            query = query.Where(x => x.SKU.Contains(filterValue));
                        }
                        else if (filter.Operator == "sw")
                        {
                            query = query.Where(x => x.SKU.StartsWith(filterValue));
                        }
                        else if (filter.Operator == "eq")
                        {
                            query = query.Where(x => x.SKU == filterValue);
                        }
                        break;
                }
            }

            return query;
        }

        public static IQueryable<T> ApplySorting<T>(this IQueryable<T> query, string sortField, string sortOrder)
        {
            if (!string.IsNullOrWhiteSpace(sortField))
            {
                //query = query.OrderBy($"{sortField} {sortOrder}");
            }
            return query;
        }

        public static IQueryable<T> ApplyPaging<T>(this IQueryable<T> query, int page, int pageSize)
        {
            return query.Skip((page - 1) * pageSize).Take(pageSize);
        }
    }
}
