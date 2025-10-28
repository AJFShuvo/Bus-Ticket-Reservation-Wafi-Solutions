using Application.DTOs;
using Application.Interfaces;
using Domain.Entities;
using Domain.Interfaces;

namespace Application.Services
{
    public class JourneySearchService : IJourneySearchService
    {
        private readonly IJourneyRepository _journeyRepository;

        public JourneySearchService (IJourneyRepository journeyRepository)
        {
            _journeyRepository = journeyRepository;
        }

        public async Task<IEnumerable<Journey>> SearchAsync (SearchJourneyRequestDto request)
        {
            var journeys = await _journeyRepository.SearchJourneysAsync(
                request.From, request.To, request.JourneyDate);

          return journeys;
        }
    }
}
