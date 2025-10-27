import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../core/alert.service';
import { AvailableBusDto } from '../../core/models';

interface SearchParams {
  from: string;
  to: string;
  journeyDate: string;
}

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.scss']
})
export class ResultsComponent implements OnInit {
  buses: AvailableBusDto[] = [];
  searchParams: SearchParams | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private alertService: AlertService
  ) {
    // Get data from navigation state
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.buses = navigation.extras.state['buses'] || [];
      this.searchParams = navigation.extras.state['searchParams'] || null;
    }
  }

  ngOnInit(): void {
    // Check if we have data, if not redirect to search
    if (!this.buses || this.buses.length === 0) {
      // Try to get from history state (for page refresh)
      const state = history.state;
      if (state && state.buses) {
        this.buses = state.buses;
        this.searchParams = state.searchParams;
      } else {
        // No data available, show alert and redirect to search
        this.alertService.info('No search results found. Please search again.');
        this.router.navigate(['/search']);
      }
    }
  }

  /**
   * Navigate to seat map for selected bus
   * @param bus - Selected bus details
   */
  viewSeats(bus: AvailableBusDto): void {
    // Navigate to seatmap with bus number as :id route parameter and full bus details in state
    this.router.navigate(['/seatmap', bus.busNumber], {
      state: {
        bus: bus,
        searchParams: this.searchParams
      }
    });
  }

  /**
   * Navigate back to search page
   */
  backToSearch(): void {
    this.router.navigate(['/search']);
  }

  /**
   * Format date string to readable format
   * @param dateString - ISO date string
   * @returns Formatted date and time
   */
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  /**
   * Calculate duration between departure and arrival
   * @param departure - Departure time
   * @param arrival - Arrival time
   * @returns Duration string
   */
  calculateDuration(departure: string, arrival: string): string {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diffMs = arr.getTime() - dep.getTime();
    const hours = Math.floor(diffMs / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  }

  /**
   * Get availability status class
   * @param availableSeats - Number of available seats
   * @param totalSeats - Total seats
   * @returns CSS class name
   */
  getAvailabilityClass(availableSeats: number, totalSeats: number): string {
    const percentage = (availableSeats / totalSeats) * 100;
    if (percentage > 50) return 'high';
    if (percentage > 20) return 'medium';
    return 'low';
  }

  /**
   * Get availability status text
   * @param availableSeats - Number of available seats
   * @returns Status text
   */
  getAvailabilityText(availableSeats: number): string {
    if (availableSeats > 10) return 'Available';
    if (availableSeats > 0) return 'Filling Fast';
    return 'Sold Out';
  }
}
