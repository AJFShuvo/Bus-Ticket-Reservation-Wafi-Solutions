using Application.DTOs;
using Domain.Entities;

namespace Application.Interfaces
{
    public interface IJourneySearchService
    {
        Task<IEnumerable<Journey>> SearchAsync (SearchJourneyRequestDto request);
    }
}
