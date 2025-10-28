using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class JourneySeatBooking
    {
        public Guid JourneyId { get; set; }
        public int SeatNumber { get; set; }
        public string? BookedByUser { get; set; }
        public DateTime BookedAt { get; set; } = DateTime.UtcNow;
        public string? Email { get; set; }
    }
}
