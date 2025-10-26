using Application.Contracts.DTOs;
using Application.Contracts.Interfaces;
using Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Services
{
    public class JourneyBookService 
    {
        private readonly IJourneyBookRepository _repository;

        public JourneyBookService(IJourneyBookRepository repository)
        {
            _repository = repository;
        }

        public async Task<bool> BookSeatAsync(BookSeatRequestDto request)
        {
            var booking = new Bookings
            {
                JourneyId = request.JourneyId,
                SeatNumber = request.SeatNumber,
                BookedByUser = request.UserEmail
            };

            var result = await _repository.BookSeatAsync(booking);
            return result != null;
        }
    }
}
