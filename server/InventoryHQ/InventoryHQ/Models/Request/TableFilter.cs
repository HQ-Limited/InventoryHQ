using System.Text.Json;

namespace InventoryHQ.Models.Request
{
    public class TableFilter
    {
        public string FieldName { get; set; }

        public string Operator { get; set; }

        public JsonElement Value { get; set; }
    }
}
