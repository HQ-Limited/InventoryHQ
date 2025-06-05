using InventoryHQ.Data;
using InventoryHQ.Middlewares;
using InventoryHQ.Profiles;
using InventoryHQ.Services;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;
using System.Text.Json;

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

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins("https://localhost:5173/")
              .AllowAnyHeader()
              .AllowAnyOrigin()
              .AllowAnyMethod();
    });
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
    DbSeeder.Seed(db);
}

# endif

app.UseCors("AllowClient");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
