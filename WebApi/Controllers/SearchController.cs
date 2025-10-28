using Application.DTOs;
using Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SearchController : ControllerBase
    {
        private readonly IJourneySearchService _journeySearchService;

        public SearchController (IJourneySearchService journeySearchService)
        {
            _journeySearchService = journeySearchService;
        }

        [HttpPost("search")]
        public async Task<IActionResult> Search ([FromBody] SearchJourneyRequestDto request)
        {
            var result = await _journeySearchService.SearchAsync(request);
            if (!result.Any())
                return NotFound("No journeys found for the given route and date.");

            return Ok(result);
        }
    }
}
