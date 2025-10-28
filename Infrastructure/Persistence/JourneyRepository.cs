using Domain.Entities;
using Domain.Interfaces;
using Microsoft.EntityFrameworkCore;
using Application.Interfaces;

namespace Infrastructure.Persistence
{
    public class JourneyRepository : IJourneyRepository
    {
        private readonly AppDbContext _context;

        public JourneyRepository (AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<Journey>> SearchJourneysAsync (string from, string to, DateTime date)
        {
            return await _context.Journeys
                .Where(j => j.From.ToLower() == from.ToLower()
                         && j.To.ToLower() == to.ToLower()
                         && j.JourneyDate.Date == date.Date)
                .ToListAsync();
        }
    }
}
