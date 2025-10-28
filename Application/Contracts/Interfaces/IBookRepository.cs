using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Contracts.Interfaces
{
    public interface IJourneyBookRepository
    {
        Task<Bookings?> BookSeatAsync(Bookings booking);
    }
}
