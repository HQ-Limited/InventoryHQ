using Microsoft.AspNetCore.Mvc;
using System.Text.Json;

namespace InventoryHQ.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class VATController : ControllerBase
    {
        private readonly HttpClient _httpClient;
        private readonly ILogger<VATController> _logger;

        public VATController(HttpClient httpClient, ILogger<VATController> logger)
        {
            _httpClient = httpClient;
            _logger = logger;
        }

        [HttpPost("check")]
        public async Task<IActionResult> CheckVAT([FromBody] CheckVATRequest request)
        {
            try
            {
                var payload = new
                {
                    countryCode = request.CountryCode,
                    vatNumber = request.VATNumber
                };

                var json = JsonSerializer.Serialize(payload);
                var content = new StringContent(json, System.Text.Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(
                    "https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number",
                    content
                );

                if (response.IsSuccessStatusCode)
                {
                    var responseContent = await response.Content.ReadAsStringAsync();
                    return Ok(responseContent);
                }
                else
                {
                    _logger.LogWarning("VAT API returned error: {StatusCode}", response.StatusCode);
                    return BadRequest(new { error = "Failed to validate VAT number" });
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error checking VAT number");
                return StatusCode(500, new { error = "Internal server error" });
            }
        }
    }

    public class CheckVATRequest
    {
        public string CountryCode { get; set; } = string.Empty;
        public string VATNumber { get; set; } = string.Empty;
    }

    public class CheckVATResponse
    {
        public string CountryCode { get; set; } = string.Empty;
        public string VATNumber { get; set; } = string.Empty;
        public bool Valid { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
    }
}
