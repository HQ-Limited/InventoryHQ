using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryHQ.Migrations
{
    /// <inheritdoc />
    public partial class ProductChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryUnits_Locations_LocationId",
                table: "InventoryUnits");

            migrationBuilder.DropColumn(
                name: "InStock",
                table: "Products");

            migrationBuilder.DropColumn(
                name: "MinStock",
                table: "Products");

            migrationBuilder.AddColumn<bool>(
                name: "InStock",
                table: "Variations",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "MinStock",
                table: "Variations",
                type: "real",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LocationId",
                table: "InventoryUnits",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryUnits_Locations_LocationId",
                table: "InventoryUnits",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryUnits_Locations_LocationId",
                table: "InventoryUnits");

            migrationBuilder.DropColumn(
                name: "InStock",
                table: "Variations");

            migrationBuilder.DropColumn(
                name: "MinStock",
                table: "Variations");

            migrationBuilder.AddColumn<bool>(
                name: "InStock",
                table: "Products",
                type: "boolean",
                nullable: true);

            migrationBuilder.AddColumn<float>(
                name: "MinStock",
                table: "Products",
                type: "real",
                nullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "LocationId",
                table: "InventoryUnits",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryUnits_Locations_LocationId",
                table: "InventoryUnits",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
