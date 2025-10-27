using Application.Contracts.DTOs;
using Application.Services;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace WebApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BookController : ControllerBase
    {

        private readonly JourneySeatService _seatService;

        public BookController(JourneySeatService seatService)
        {
            _seatService = seatService;
        }

        public async Task<ActionResult> Book([FromBody] BookSeatRequestDto request)
        {
            bool success = await _seatService.BookSeatAsync(request);
            if (!success)
                return BadRequest("Seat is already booked or invalid.");
            return Ok("Seat booked successfully.");
        }
    }
}