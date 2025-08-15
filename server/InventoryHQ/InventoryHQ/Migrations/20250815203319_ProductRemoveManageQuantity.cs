using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryHQ.Migrations
{
    /// <inheritdoc />
    public partial class ProductRemoveManageQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InStock",
                table: "Variations");

            migrationBuilder.DropColumn(
                name: "ManageQuantity",
                table: "Products");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "InStock",
                table: "Variations",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ManageQuantity",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
