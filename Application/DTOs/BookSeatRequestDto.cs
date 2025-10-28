using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.DTOs;
 public class BookSeatRequestDto
{
    public Guid JourneyId { get; set; }
    public int SeatNumber { get; set; }
    public string? Email { get; set; }
}