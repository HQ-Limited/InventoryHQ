using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryHQ.Migrations
{
    /// <inheritdoc />
    public partial class MakeLocationDescriptionNullable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryUnits_Locations_LocationId",
                table: "InventoryUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_VariationsAttributeValue_Variations_VariationId",
                table: "VariationsAttributeValue");

            migrationBuilder.AlterColumn<int>(
                name: "VariationId",
                table: "VariationsAttributeValue",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AlterColumn<bool>(
                name: "IsVariational",
                table: "VariationsAttributeValue",
                type: "boolean",
                nullable: true,
                oldClrType: typeof(bool),
                oldType: "boolean");

            migrationBuilder.AddColumn<int>(
                name: "ProductId",
                table: "VariationsAttributeValue",
                type: "integer",
                nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Label",
                table: "Packages",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Locations",
                type: "text",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<int>(
                name: "LocationId",
                table: "InventoryUnits",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_VariationsAttributeValue_ProductId",
                table: "VariationsAttributeValue",
                column: "ProductId");

            migrationBuilder.AddForeignKey(
                name: "FK_InventoryUnits_Locations_LocationId",
                table: "InventoryUnits",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_VariationsAttributeValue_Products_ProductId",
                table: "VariationsAttributeValue",
                column: "ProductId",
                principalTable: "Products",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_VariationsAttributeValue_Variations_VariationId",
                table: "VariationsAttributeValue",
                column: "VariationId",
                principalTable: "Variations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_InventoryUnits_Locations_LocationId",
                table: "InventoryUnits");

            migrationBuilder.DropForeignKey(
                name: "FK_VariationsAttributeValue_Products_ProductId",
                table: "VariationsAttributeValue");

            migrationBuilder.DropForeignKey(
                name: "FK_VariationsAttributeValue_Variations_VariationId",
                table: "VariationsAttributeValue");

            migrationBuilder.DropIndex(
                name: "IX_VariationsAttributeValue_ProductId",
                table: "VariationsAttributeValue");

            migrationBuilder.DropColumn(
                name: "ProductId",
                table: "VariationsAttributeValue");

            migrationBuilder.AlterColumn<int>(
                name: "VariationId",
                table: "VariationsAttributeValue",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AlterColumn<bool>(
                name: "IsVariational",
                table: "VariationsAttributeValue",
                type: "boolean",
                nullable: false,
                defaultValue: false,
                oldClrType: typeof(bool),
                oldType: "boolean",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Label",
                table: "Packages",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Description",
                table: "Locations",
                type: "text",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "text",
                oldNullable: true);

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

            migrationBuilder.AddForeignKey(
                name: "FK_VariationsAttributeValue_Variations_VariationId",
                table: "VariationsAttributeValue",
                column: "VariationId",
                principalTable: "Variations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
