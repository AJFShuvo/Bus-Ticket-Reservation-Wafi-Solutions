import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';
import { SeatPlanDto, SeatDto } from '../../core/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SeatPlanService {

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  /**
   * Get seat plan/layout for a specific bus
   * @param busScheduleId - Bus schedule identifier (bus number)
   * @returns Observable of seat plan with all seat details
   */
  getSeatPlan(busScheduleId: string): Observable<SeatPlanDto> {
    // Check if mock data mode is enabled
    if (environment.useMockData) {
      return this.getSeatPlanMock(busScheduleId);
    }

    // Real API call
    return this.apiService.get<SeatPlanDto>(`/seatplan/${busScheduleId}`).pipe(
      map((response: SeatPlanDto) => {
        // Validate response structure
        if (!response || !response.seats || !Array.isArray(response.seats)) {
          throw new Error('Invalid seat plan data received from server');
        }

        // Ensure all seats have required properties
        response.seats = response.seats.map((seat: SeatDto) => ({
          ...seat,
          isAvailable: seat.isAvailable !== undefined ? seat.isAvailable : !seat.isBooked,
          seatType: seat.seatType || 'Standard',
          gender: seat.gender || 'Any'
        }));

        return response;
      }),
      catchError((error) => {
        // Handle different error types
        let errorMessage = 'Failed to load seat plan';
        
        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your connection.';
        } else if (error.status === 404) {
          errorMessage = 'Seat plan not found for this bus.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'Invalid bus schedule ID.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        console.error('Seat plan error:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Mock implementation: Get seat plan using static JSON data
   * @param busScheduleId - Bus schedule identifier (bus number)
   * @returns Observable of seat plan with simulated delay
   */
  private getSeatPlanMock(busScheduleId: string): Observable<SeatPlanDto> {
    console.log(`🎭 Mock Mode: Loading seat plan for ${busScheduleId}`);
    
    // Try to load specific bus seat plan, fallback to default
    const specificPlanUrl = `assets/mocks/seat-plan-${busScheduleId}.json`;
    const defaultPlanUrl = 'assets/mocks/seat-plan-default.json';
    
    return this.http.get<SeatPlanDto>(specificPlanUrl).pipe(
      catchError(() => {
        console.log(`🎭 Mock Mode: Specific seat plan not found, using default`);
        return this.http.get<SeatPlanDto>(defaultPlanUrl);
      }),
      delay(600), // Simulate network latency (600ms)
      map((response: SeatPlanDto) => {
        // Update busNumber to match requested bus
        response.busNumber = busScheduleId;
        
        // Validate response structure
        if (!response || !response.seats || !Array.isArray(response.seats)) {
          throw new Error('Invalid seat plan data in mock file');
        }

        // Ensure all seats have required properties
        response.seats = response.seats.map((seat: SeatDto) => ({
          ...seat,
          isAvailable: seat.isAvailable !== undefined ? seat.isAvailable : !seat.isBooked,
          seatType: seat.seatType || 'Standard',
          gender: seat.gender || 'Any'
        }));

        console.log(`🎭 Mock Mode: Loaded seat plan with ${response.seats.length} seats`);
        return response;
      }),
      catchError((error) => {
        console.error('Error loading mock seat plan:', error);
        return throwError(() => new Error('Failed to load mock seat plan data'));
      })
    );
  }

  /**
   * Helper method to check if a seat is available for booking
   * @param seat - Seat object
   * @returns Boolean indicating availability
   */
  isSeatAvailable(seat: SeatDto): boolean {
    return seat.isAvailable !== false && !seat.isBooked;
  }

  /**
   * Helper method to get seat color class based on status
   * @param seat - Seat object
   * @returns CSS class name
   */
  getSeatStatusClass(seat: SeatDto): string {
    if (seat.isBooked) return 'booked';
    if (!this.isSeatAvailable(seat)) return 'unavailable';
    return 'available';
  }

  /**
   * Helper method to organize seats by row for display
   * @param seats - Array of all seats
   * @param totalColumns - Number of columns per row
   * @returns 2D array of seats organized by row
   */
  organizeSeatsByRow(seats: SeatDto[], totalColumns: number): SeatDto[][] {
    const rows: SeatDto[][] = [];
    const sortedSeats = [...seats].sort((a, b) => {
      if (a.row !== b.row) return a.row - b.row;
      return a.column - b.column;
    });

    let currentRow: SeatDto[] = [];
    let lastRowNumber = -1;

    sortedSeats.forEach(seat => {
      if (seat.row !== lastRowNumber) {
        if (currentRow.length > 0) {
          rows.push(currentRow);
        }
        currentRow = [];
        lastRowNumber = seat.row;
      }
      currentRow.push(seat);
    });

    if (currentRow.length > 0) {
      rows.push(currentRow);
    }

    return rows;
  }

  /**
   * Calculate total price for selected seats
   * @param selectedSeats - Array of selected seat objects
   * @param basePrice - Base price per seat
   * @returns Total price
   */
  calculateTotalPrice(selectedSeats: SeatDto[], basePrice: number): number {
    return selectedSeats.reduce((total, seat) => {
      const seatPrice = seat.price || basePrice;
      return total + seatPrice;
    }, 0);
  }
}

