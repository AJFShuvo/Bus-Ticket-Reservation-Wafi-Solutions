namespace Application.DTOs
{
    public class SearchJourneyRequestDto
    {
        public string From { get; set; } = null!;
        public string To { get; set; } = null!;
        public DateTime JourneyDate { get; set; }
    }
}
