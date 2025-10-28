namespace Application.DTOs
{
    public class SearchJourneyResponseDto
    {
        public Guid JourneyId { get; set; }
        public string BusNumber { get; set; } = null!;
        public string From { get; set; } = null!;
        public string To { get; set; } = null!;
        public DateTime JourneyDate { get; set; }
        public string StartTime { get; set; } = null!;
        public decimal Fare { get; set; }
        public int TotalSeats { get; set; }
    }
}
