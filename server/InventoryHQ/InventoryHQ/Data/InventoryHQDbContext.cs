using InventoryHQ.Data.Models;
using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System;

namespace InventoryHQ.Data
{
    public class InventoryHQDbContext : DbContext
    {
        public InventoryHQDbContext(DbContextOptions<InventoryHQDbContext> options)
            : base(options) { }

        public DbSet<Product> Products { get; set; }

        public DbSet<Variation> Variations { get; set; }

        public DbSet<Models.Attribute> Attributes { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<AttributeValue> AttributeValues { get; set; }

        public DbSet<Location> Locations { get; set; }

        public DbSet<Package> Packages { get; set; }

        public DbSet<VariationAttributeValue> VariationsAttributeValue { get; set; }

        public DbSet<InventoryUnit> InventoryUnits { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var entityType in modelBuilder.Model.GetEntityTypes())
            {
                if (typeof(BaseEntity).IsAssignableFrom(entityType.ClrType))
                {
                    var method = typeof(InventoryHQDbContext).GetMethod(nameof(SetSoftDeleteFilter), BindingFlags.NonPublic | BindingFlags.Static)
                        ?.MakeGenericMethod(entityType.ClrType);

                    method?.Invoke(null, [modelBuilder]);
                }
            }

            base.OnModelCreating(modelBuilder);
        }

        public override int SaveChanges()
        {
            HandleUpdate();
            HandleSoftDelete();

            return base.SaveChanges();
        }

        private void HandleUpdate()
        {
            var entries = ChangeTracker
                .Entries()
                .Where(e => e.Entity is BaseEntity && (e.State == EntityState.Added || e.State == EntityState.Modified));

            foreach (var entityEntry in entries)
            {
                ((BaseEntity)entityEntry.Entity).UpdatedDate = DateTime.UtcNow;

                if (entityEntry.State == EntityState.Added)
                {
                    ((BaseEntity)entityEntry.Entity).CreatedDate = DateTime.UtcNow;
                }
            }
        }

        private void HandleSoftDelete()
        {
            var entities = ChangeTracker.Entries<BaseEntity>();

            foreach (var entityEntry in entities)
            {
                if (entityEntry.State == EntityState.Deleted)
                {
                    entityEntry.State = EntityState.Modified;
                    entityEntry.Entity.IsDeleted = true;
                }
            }
        }

        private static void SetSoftDeleteFilter<TEntity>(ModelBuilder builder) where TEntity : BaseEntity
        {
            builder.Entity<TEntity>().HasQueryFilter(e => !e.IsDeleted);
        }

        public async Task RestoreAsync<TEntity>(int id) where TEntity : BaseEntity
        {
            var entity = await Set<TEntity>().IgnoreQueryFilters().FirstOrDefaultAsync(e => e.Id == id);

            if (entity != null && entity.IsDeleted)
            {
                entity.IsDeleted = false;
                Update(entity);
                await SaveChangesAsync();
            }
        }
    }
}
