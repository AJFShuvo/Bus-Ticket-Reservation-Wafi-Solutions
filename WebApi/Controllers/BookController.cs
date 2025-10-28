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

        private readonly JourneyBookService _bookService;

        public BookController(JourneyBookService bookService)
        {
            _bookService = bookService;
        }

        public async Task<ActionResult> BookS([FromBody] BookSeatRequestDto request)
        {
            bool success = await _bookService.BookSeatAsync(request);
            if (!success)
                return BadRequest("Seat is already booked or invalid.");
            return Ok("Seat booked successfully.");
        }
    }
}
