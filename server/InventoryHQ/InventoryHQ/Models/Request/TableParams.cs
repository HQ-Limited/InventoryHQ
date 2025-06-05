namespace InventoryHQ.Models.Request
{
    public class TableParams
    {
        public TablePagination? Pagination { get; set; }

        public string? SortField { get; set; }

        public string? SortOrder { get; set; }

        public TableFilter? Filter { get; set; }
    }
}
