
using Application.Contracts.DTOs;
using Application.Contracts.Interfaces;
using Domain.Entities;
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

            var bookedSeats = await _context.Bookingss
                .Where(sb => sb.JourneyId == journeyId)
                .Select(sb => sb.SeatNumber)
                .ToListAsync();

            int seatsPerRow = 4;
            int totalRows = 10;

            var seats = new List<JourneySeatDto>();

            for (int row = 0; row < totalRows; row++)
            {
                char rowLetter = (char)('A' + row);
                for (int seatNum = 1; seatNum <= seatsPerRow; seatNum++)
                {
                    string seatLabel = $"{rowLetter}{seatNum}";

                    seats.Add(new JourneySeatDto
                    {
                        SeatNumber = seatLabel,
                        IsBooked = bookedSeats.Contains(seatLabel)
                    });
                }
            }

            return seats;
        }
    }
}
