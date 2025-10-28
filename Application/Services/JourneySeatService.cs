using Application.Contracts.DTOs;
using Application.Contracts.Interfaces;
using Domain.Entities;
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
    }
}
