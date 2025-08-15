using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryHQ.Migrations
{
    /// <inheritdoc />
    public partial class ProductChanges2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Packages_Locations_LocationId",
                table: "Packages");

            migrationBuilder.AlterColumn<int>(
                name: "LocationId",
                table: "Packages",
                type: "integer",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "integer");

            migrationBuilder.AddForeignKey(
                name: "FK_Packages_Locations_LocationId",
                table: "Packages",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Packages_Locations_LocationId",
                table: "Packages");

            migrationBuilder.AlterColumn<int>(
                name: "LocationId",
                table: "Packages",
                type: "integer",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "integer",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Packages_Locations_LocationId",
                table: "Packages",
                column: "LocationId",
                principalTable: "Locations",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
