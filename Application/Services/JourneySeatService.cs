using Application.DTOs;
using Domain.Entities;
using Domain.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Application.Services
{
    public class JourneySeatService
    {
        private readonly IJourneySeatRepository _repository;

        public JourneySeatService (IJourneySeatRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<JourneySeatDto>> GetSeatsForJourneyAsync (Guid journeyId)
        {
            return await _repository.GetSeatsForJourneyAsync(journeyId);
        }

        public async Task<bool> BookSeatAsync (BookSeatRequestDto request)
        {
            var booking = new JourneySeatBooking
            {
                JourneyId = request.JourneyId,
                SeatNumber = request.SeatNumber,
                Email = request.Email
            };

            var result = await _repository.BookSeatAsync(booking);
            return result != null;
        }
    }
}
