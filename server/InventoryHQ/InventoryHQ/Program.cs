using InventoryHQ.Data;
using InventoryHQ.Profiles;
using InventoryHQ.Services;
using Microsoft.AspNetCore.OData;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;


var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers()
    .AddOData(opt =>
{
    opt.Filter().Select().OrderBy().Expand().Count().SetMaxTop(100)
       .AddRouteComponents("odata", ODataEdmConfig.GetEdmModel());
}); ;
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "InventoryHQ",
        Version = "v1",
        Contact = new OpenApiContact
        {
            Name = "HQ Limited",
            Email = "contact@hq-limited.com",
            Url = new Uri("https://hq-limited.com")
        },
        License = new OpenApiLicense
        {
            Name = "EULA",
            Url = new Uri("https://hq-limited.com/eula")
        }
    });

    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    c.IncludeXmlComments(xmlPath);
});

builder.Services.AddDbContext<InventoryHQDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
#if DEBUG
    options.EnableDetailedErrors();
    options.EnableSensitiveDataLogging();
#endif
});

builder.Services.AddTransient<ProductService>();
builder.Services.AddTransient<AttributeService>();
builder.Services.AddTransient<CategoryService>();
builder.Services.AddTransient<LocationService>();
builder.Services.AddTransient<CustomerService>();
builder.Services.AddTransient<CustomerGroupService>();
builder.Services.AddTransient<SupplierService>();
builder.Services.AddHttpClient();
builder.Services.AddAutoMapper(config =>
{
    config.AddProfile<InventoryHQProfile>();
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowClient", policy =>
    {
        policy.WithOrigins("https://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

//app.UseMiddleware<ErrorHandlingMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

#if DEBUG

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<InventoryHQDbContext>();
    await db.Database.EnsureDeletedAsync();
    db.Database.Migrate();

    DbSeeder.Seed(db);
}

# endif

app.UseCors("AllowClient");

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
