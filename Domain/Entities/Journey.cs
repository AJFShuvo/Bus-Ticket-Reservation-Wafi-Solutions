namespace Domain.Entities
{
    public class Journey
    {
        public Guid Id { get; set; }
        public string BusNumber { get; set; } = null!;
        public string From { get; set; } = null!;
        public string To { get; set; } = null!;
        public DateTime JourneyDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public decimal Fare { get; set; }
        public int TotalSeats { get; set; }
    }
}
