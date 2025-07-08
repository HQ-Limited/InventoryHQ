using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryHQ.Migrations
{
    /// <inheritdoc />
    public partial class AddInStockToInventoryUnit : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "InStock",
                table: "InventoryUnits",
                type: "boolean",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InStock",
                table: "InventoryUnits");
        }
    }
}
