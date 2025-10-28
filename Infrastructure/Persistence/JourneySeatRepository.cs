
using Application.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Repositories
{
    public class JourneySeatRepository : IJourneySeatRepository
    {
        private readonly AppDbContext _context;

        public JourneySeatRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<JourneySeatDto>> GetSeatsForJourneyAsync (Guid journeyId)
        {
            var journey = await _context.Journeys
                .AsNoTracking()
                .FirstOrDefaultAsync(j => j.Id == journeyId);

            if (journey == null)
                return new List<JourneySeatDto>();

            var bookedSeats = await _context.JourneySeatBookings
                .Where(sb => sb.JourneyId == journeyId)
                .Select(sb => sb.SeatNumber)
                .ToListAsync();

            var seats = Enumerable.Range(1, journey.TotalSeats)
                .Select(seatNumber => new JourneySeatDto
                {
                    SeatNumber = seatNumber,
                    IsBooked = bookedSeats.Contains(seatNumber)
                }).ToList();

            return seats;
        }

        public async Task<JourneySeatBooking?> BookSeatAsync (JourneySeatBooking booking)
        {
            // Check if seat is already booked
            bool isBooked = await _context.JourneySeatBookings
                .AnyAsync(sb => sb.JourneyId == booking.JourneyId && sb.SeatNumber == booking.SeatNumber);

            if (isBooked)
                return null;

            _context.JourneySeatBookings.Add(booking);
            await _context.SaveChangesAsync();
            return booking;
        }
    }
}
