import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';
import { BookSeatInputDto, BookSeatResultDto } from '../../core/models';
import { environment } from '../../../environments/environment';

/**
 * API Response wrapper
 */
interface BookingApiResponse {
  success: boolean;
  data?: BookSeatResultDto;
  message?: string;
  error?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  /**
   * Book selected seats for a passenger
   * @param payload - Booking input with passenger and seat details
   * @returns Observable of booking result
   */
  bookSeats(payload: BookSeatInputDto): Observable<BookSeatResultDto> {
    // Check if mock data mode is enabled
    if (environment.useMockData) {
      return this.bookSeatsMock(payload);
    }

    // Real API call
    return this.apiService.post<BookingApiResponse>('/booking', payload).pipe(
      map((response: BookingApiResponse) => {
        // Handle success=true response
        if (response.success === true) {
          if (!response.data) {
            throw new Error('Booking succeeded but no booking data received');
          }
          return response.data;
        }
        
        // Handle success=false response (seat conflict or other issues)
        if (response.success === false) {
          const errorMessage = response.message || response.error || 
            'One or more selected seats are no longer available. Please select different seats.';
          throw new Error(errorMessage);
        }

        // Handle unexpected response format
        throw new Error('Invalid response format from booking API');
      }),
      catchError((error) => {
        // Handle different error types
        let errorMessage = 'Failed to complete booking';
        
        // If we already have an Error object with a message, use it
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your connection.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || error.error?.error || 
            'Invalid booking data. Please check your details.';
        } else if (error.status === 409) {
          errorMessage = 'Seat conflict: One or more selected seats are already booked. Please select different seats.';
        } else if (error.status === 422) {
          errorMessage = error.error?.message || 
            'Unable to process booking. Please verify your information.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.error?.error) {
          errorMessage = error.error.error;
        }

        console.error('Booking error:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Get booking details by booking ID
   * @param bookingId - Booking/PNR number
   * @returns Observable of booking details
   */
  getBookingDetails(bookingId: string): Observable<BookSeatResultDto> {
    return this.apiService.get<BookSeatResultDto>(`/booking/${bookingId}`).pipe(
      catchError((error) => {
        let errorMessage = 'Failed to fetch booking details';
        
        if (error.status === 404) {
          errorMessage = 'Booking not found. Please check your PNR number.';
        } else if (error.status === 0) {
          errorMessage = 'Unable to connect to the server.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        console.error('Error fetching booking details:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Cancel a booking
   * @param bookingId - Booking/PNR number
   * @returns Observable of cancellation result
   */
  cancelBooking(bookingId: string): Observable<any> {
    return this.apiService.post<any>(`/booking/${bookingId}/cancel`, {}).pipe(
      catchError((error) => {
        let errorMessage = 'Failed to cancel booking';
        
        if (error.status === 404) {
          errorMessage = 'Booking not found.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'Cannot cancel this booking.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        console.error('Cancellation error:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Mock implementation: Book seats using static JSON data
   * @param payload - Booking input with passenger and seat details
   * @returns Observable of booking result with simulated delay
   */
  private bookSeatsMock(payload: BookSeatInputDto): Observable<BookSeatResultDto> {
    console.log('🎭 Mock Mode: Processing booking...', payload);
    
    // Generate a random PNR
    const pnr = 'PNR' + Math.random().toString(36).substring(2, 12).toUpperCase();
    
    // Create mock booking result
    const mockResult: BookSeatResultDto = {
      bookingId: pnr,
      status: 'Confirmed',
      busNumber: payload.busNumber,
      routeNumber: payload.routeNumber,
      seatNumbers: payload.seatNumbers,
      passenger: payload.passenger,
      origin: 'Mock Origin', // In real scenario, this would come from bus data
      destination: 'Mock Destination',
      departureTime: new Date(payload.travelDate).toISOString(),
      arrivalTime: new Date(new Date(payload.travelDate).getTime() + 4 * 60 * 60 * 1000).toISOString(),
      totalAmount: payload.totalAmount,
      bookingDate: new Date().toISOString(),
      remarks: 'Mock booking confirmed successfully. Please arrive 30 minutes before departure.'
    };

    // Simulate booking with delay
    return of(mockResult).pipe(
      delay(1000), // Simulate network latency (1 second)
      map((result) => {
        console.log('🎭 Mock Mode: Booking successful!', result);
        return result;
      })
    );
    
    // Note: To simulate a booking conflict, you can randomly throw an error:
    // if (Math.random() > 0.8) {
    //   return throwError(() => new Error('One or more selected seats are no longer available')).pipe(delay(1000));
    // }
  }
}

