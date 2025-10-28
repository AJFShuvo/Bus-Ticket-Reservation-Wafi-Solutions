using Application.DTOs;
using Domain.Entities;


namespace Domain.Interfaces
{
    public interface IJourneySeatRepository
    {
        Task<List<JourneySeatDto>> GetSeatsForJourneyAsync (Guid journeyId);
        Task<JourneySeatBooking?> BookSeatAsync (JourneySeatBooking booking);
    }
}
