using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace InventoryHQ.Migrations
{
    /// <inheritdoc />
    public partial class MoveDateToPackages : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpirationDate",
                table: "InventoryUnits");

            migrationBuilder.DropColumn(
                name: "LotNumber",
                table: "InventoryUnits");

            migrationBuilder.AddColumn<DateOnly>(
                name: "ExpirationDate",
                table: "Packages",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LotNumber",
                table: "Packages",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ExpirationDate",
                table: "Packages");

            migrationBuilder.DropColumn(
                name: "LotNumber",
                table: "Packages");

            migrationBuilder.AddColumn<DateOnly>(
                name: "ExpirationDate",
                table: "InventoryUnits",
                type: "date",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "LotNumber",
                table: "InventoryUnits",
                type: "text",
                nullable: true);
        }
    }
}
