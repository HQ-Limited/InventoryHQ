using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace InventoryHQ.Migrations
{
    /// <inheritdoc />
    public partial class MakeLocationDescriptionNullable2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "VariationsAttributeValue");

            migrationBuilder.AddColumn<string>(
                name: "Description",
                table: "Products",
                type: "text",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "ProductAttribute",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ProductId = table.Column<int>(type: "integer", nullable: false),
                    AttributeId = table.Column<int>(type: "integer", nullable: false),
                    IsVariational = table.Column<bool>(type: "boolean", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductAttribute", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductAttribute_Attributes_AttributeId",
                        column: x => x.AttributeId,
                        principalTable: "Attributes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductAttribute_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "VariationsAttribute",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    VariationId = table.Column<int>(type: "integer", nullable: false),
                    AttributeValueId = table.Column<int>(type: "integer", nullable: false),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariationsAttribute", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariationsAttribute_AttributeValues_AttributeValueId",
                        column: x => x.AttributeValueId,
                        principalTable: "AttributeValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VariationsAttribute_Variations_VariationId",
                        column: x => x.VariationId,
                        principalTable: "Variations",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "AttributeValueProductAttribute",
                columns: table => new
                {
                    ProductAttributesId = table.Column<int>(type: "integer", nullable: false),
                    ValuesId = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AttributeValueProductAttribute", x => new { x.ProductAttributesId, x.ValuesId });
                    table.ForeignKey(
                        name: "FK_AttributeValueProductAttribute_AttributeValues_ValuesId",
                        column: x => x.ValuesId,
                        principalTable: "AttributeValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AttributeValueProductAttribute_ProductAttribute_ProductAttr~",
                        column: x => x.ProductAttributesId,
                        principalTable: "ProductAttribute",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AttributeValueProductAttribute_ValuesId",
                table: "AttributeValueProductAttribute",
                column: "ValuesId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttribute_AttributeId",
                table: "ProductAttribute",
                column: "AttributeId");

            migrationBuilder.CreateIndex(
                name: "IX_ProductAttribute_ProductId",
                table: "ProductAttribute",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_VariationsAttribute_AttributeValueId",
                table: "VariationsAttribute",
                column: "AttributeValueId");

            migrationBuilder.CreateIndex(
                name: "IX_VariationsAttribute_VariationId",
                table: "VariationsAttribute",
                column: "VariationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AttributeValueProductAttribute");

            migrationBuilder.DropTable(
                name: "VariationsAttribute");

            migrationBuilder.DropTable(
                name: "ProductAttribute");

            migrationBuilder.DropColumn(
                name: "Description",
                table: "Products");

            migrationBuilder.CreateTable(
                name: "VariationsAttributeValue",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    AttributeValueId = table.Column<int>(type: "integer", nullable: false),
                    ProductId = table.Column<int>(type: "integer", nullable: true),
                    VariationId = table.Column<int>(type: "integer", nullable: true),
                    CreatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    IsDeleted = table.Column<bool>(type: "boolean", nullable: false),
                    IsVariational = table.Column<bool>(type: "boolean", nullable: true),
                    UpdatedDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_VariationsAttributeValue", x => x.Id);
                    table.ForeignKey(
                        name: "FK_VariationsAttributeValue_AttributeValues_AttributeValueId",
                        column: x => x.AttributeValueId,
                        principalTable: "AttributeValues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_VariationsAttributeValue_Products_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Products",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_VariationsAttributeValue_Variations_VariationId",
                        column: x => x.VariationId,
                        principalTable: "Variations",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_VariationsAttributeValue_AttributeValueId",
                table: "VariationsAttributeValue",
                column: "AttributeValueId");

            migrationBuilder.CreateIndex(
                name: "IX_VariationsAttributeValue_ProductId",
                table: "VariationsAttributeValue",
                column: "ProductId");

            migrationBuilder.CreateIndex(
                name: "IX_VariationsAttributeValue_VariationId",
                table: "VariationsAttributeValue",
                column: "VariationId");
        }
    }
}
