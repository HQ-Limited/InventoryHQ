using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryHQ.Migrations
{
    /// <inheritdoc />
    public partial class ChangeManageQuantity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InStock",
                table: "InventoryUnits");

            migrationBuilder.DropColumn(
                name: "ManageQuantity",
                table: "InventoryUnits");

            migrationBuilder.AddColumn<bool>(
                name: "InStock",
                table: "Products",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ManageQuantity",
                table: "Products",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "InventoryUnits",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "InStock",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "ManageQuantity",
                table: "Products");

            migrationBuilder.AlterColumn<int>(
                name: "Quantity",
                table: "InventoryUnits",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddColumn<bool>(
                name: "InStock",
                table: "InventoryUnits",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ManageQuantity",
                table: "InventoryUnits",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }
    }
}
