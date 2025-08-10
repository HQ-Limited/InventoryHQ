using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryHQ.Migrations
{
    /// <inheritdoc />
    public partial class Initialize3 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Barcode",
                table: "Variations",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Barcode",
                table: "UnitOfMeasurement",
                type: "text",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Variations_Barcode",
                table: "Variations",
                column: "Barcode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Variations_Barcode",
                table: "Variations");

            migrationBuilder.DropColumn(
                name: "Barcode",
                table: "Variations");

            migrationBuilder.DropColumn(
                name: "Barcode",
                table: "UnitOfMeasurement");
        }
    }
}
