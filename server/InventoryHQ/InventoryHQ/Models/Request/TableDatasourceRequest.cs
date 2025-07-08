namespace InventoryHQ.Models.Request
{
    public class TableDatasourceRequest
    {
        public TablePagination? Pagination { get; set; }

        public string? SortField { get; set; }

        public string? SortOrder { get; set; }

        public List<TableFilter>? Filters { get; set; }
    }
}
