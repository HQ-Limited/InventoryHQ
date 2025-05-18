using InventoryHQ.Data;
using InventoryHQ.Middlewares;
using InventoryHQ.Profiles;
using InventoryHQ.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<InventoryHQDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

builder.Services.AddTransient<ProductService>();
builder.Services.AddAutoMapper(config =>
{
    config.AddProfile<InventoryHQProfile>();
});

var app = builder.Build();

app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

#if DEBUG

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InventoryHQDbContext>();
    db.Database.Migrate();
}

# endif

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
