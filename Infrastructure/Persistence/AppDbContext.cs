using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Reflection.Emit;

namespace Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext (DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Journey> Journeys { get; set; } = null!;
        public DbSet<JourneySeatBooking> JourneySeatBookings { get; set; }

        protected override void OnModelCreating (ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Journey>(entity =>
            {
                entity.ToTable("journeys");

                entity.HasKey(j => j.Id);

                entity.Property(j => j.Id)
                      .HasColumnName("id");

                entity.Property(j => j.BusNumber)
                      .HasColumnName("bus_number")
                      .IsRequired();

                entity.Property(j => j.From)
                      .HasColumnName("from_location")
                      .IsRequired();

                entity.Property(j => j.To)
                      .HasColumnName("to_location")
                      .IsRequired();

                entity.Property(j => j.JourneyDate)
                      .HasColumnName("journey_date")
                      .IsRequired();

                entity.Property(j => j.StartTime)
                      .HasColumnName("start_time")
                      .IsRequired();

                entity.Property(j => j.Fare)
                      .HasColumnName("fare")
                      .HasColumnType("decimal(10,2)")
                      .IsRequired();

                entity.Property(j => j.TotalSeats)
                      .HasColumnName("total_seats")
                      .IsRequired();
            });
        }
    }
}
