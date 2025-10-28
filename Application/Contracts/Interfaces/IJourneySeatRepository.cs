using Application.Contracts.DTOs;
using Domain.Entities;


namespace Application.Contracts.Interfaces
{
    public interface IJourneySeatRepository
    {
        Task<List<JourneySeatDto>> GetSeatsForJourneyAsync (Guid journeyId);
    }
}
