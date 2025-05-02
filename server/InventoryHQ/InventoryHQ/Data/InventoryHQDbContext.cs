using InventoryHQ.Data.Models;
using Microsoft.EntityFrameworkCore;

namespace InventoryHQ.Data
{
    public class InventoryHQDbContext : DbContext
    {
        public InventoryHQDbContext(DbContextOptions<InventoryHQDbContext> options) 
            : base(options) { }

        public DbSet<TestModel> Test { get; set; }
    }
}
