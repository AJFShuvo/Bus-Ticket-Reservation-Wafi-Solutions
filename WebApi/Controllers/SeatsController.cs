using Application.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Mvc;


namespace WebAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeatsController : ControllerBase
    {
        private readonly JourneySeatService _seatService;

        public SeatsController (JourneySeatService seatService)
        {
            _seatService = seatService;
        }

        [HttpGet("{journeyId}")]
        public async Task<ActionResult<List<JourneySeatDto>>> GetSeats (Guid journeyId)
        {
            var seats = await _seatService.GetSeatsForJourneyAsync(journeyId);
            if (seats == null || seats.Count == 0)
                return NotFound("Journey not found or no seats available.");
            return Ok(seats);
        }

        
    }
}
