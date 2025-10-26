using Application.Contracts.Interfaces;
using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Infrastructure.Persistence
{
    public class JourneyBookRepository : IJourneyBookRepository
    {
        private readonly AppDbContext _context;

        public JourneyBookRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<Bookings?> BookSeatAsync(Bookings booking)
        {
            // Check if seat is already booked
            bool isBooked = await _context.Bookingss
                .AnyAsync(sb => sb.JourneyId == booking.JourneyId && sb.SeatNumber == booking.SeatNumber);

            if (isBooked)
                return null;

            _context.Bookingss.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }
    }
}
