import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, delay } from 'rxjs/operators';
import { ApiService } from '../../core/api.service';
import { AvailableBusDto } from '../../core/models';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private apiService: ApiService,
    private http: HttpClient
  ) {}

  /**
   * Search for available buses based on route and date
   * @param from - Origin city/station
   * @param to - Destination city/station
   * @param journeyDate - Date of journey (YYYY-MM-DD format)
   * @returns Observable of available buses
   */
  searchAvailableBuses(from: string, to: string, journeyDate: string): Observable<AvailableBusDto[]> {
    // Check if mock data mode is enabled
    if (environment.useMockData) {
      return this.searchAvailableBusesMock(from, to, journeyDate);
    }

    // Real API call
    const params = {
      from: from,
      to: to,
      journeyDate: journeyDate
    };

    return this.apiService.get<AvailableBusDto[]>('/search', { params }).pipe(
      map((response: AvailableBusDto[]) => {
        // Validate and transform response if needed
        if (!Array.isArray(response)) {
          throw new Error('Invalid response format from server');
        }
        return response;
      }),
      catchError((error) => {
        // Handle different error types
        let errorMessage = 'An error occurred while searching for buses';
        
        if (error.status === 0) {
          errorMessage = 'Unable to connect to the server. Please check your connection.';
        } else if (error.status === 404) {
          errorMessage = 'No buses found for the selected route and date.';
        } else if (error.status === 400) {
          errorMessage = error.error?.message || 'Invalid search parameters.';
        } else if (error.status === 500) {
          errorMessage = 'Server error. Please try again later.';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        }

        console.error('Search error:', error);
        return throwError(() => new Error(errorMessage));
      })
    );
  }

  /**
   * Mock implementation: Search for available buses using static JSON data
   * @param from - Origin city/station
   * @param to - Destination city/station
   * @param journeyDate - Date of journey (YYYY-MM-DD format)
   * @returns Observable of available buses with simulated delay
   */
  private searchAvailableBusesMock(from: string, to: string, journeyDate: string): Observable<AvailableBusDto[]> {
    console.log('🎭 Mock Mode: Attempting to load bus data...');
    console.log('🎭 From:', from, 'To:', to, 'Date:', journeyDate);
    
    // Try multiple paths for mock data
    const mockPath = '/assets/mocks/available-buses.json';
    console.log('🎭 Loading from path:', mockPath);
    
    return this.http.get<AvailableBusDto[]>(mockPath).pipe(
      delay(800), // Simulate network latency (800ms)
      map((buses: AvailableBusDto[]) => {
        console.log('🎭 Mock Mode: Successfully loaded', buses?.length || 0, 'buses');
        
        if (!buses || !Array.isArray(buses)) {
          console.error('🎭 Mock Mode: Invalid data format', buses);
          return [];
        }
        
        // Filter buses based on origin and destination (case-insensitive)
        const filteredBuses = buses.filter(bus => 
          bus.origin.toLowerCase().includes(from.toLowerCase()) &&
          bus.destination.toLowerCase().includes(to.toLowerCase())
        );

        console.log(`🎭 Mock Mode: Found ${filteredBuses.length} buses matching criteria`);
        console.log('🎭 Filtered buses:', filteredBuses);
        
        // If no buses found after filtering, return all buses for testing
        if (filteredBuses.length === 0) {
          console.warn('🎭 Mock Mode: No matches found, returning all buses for testing');
          return buses;
        }
        
        return filteredBuses;
      }),
      catchError((error) => {
        console.error('❌ Error loading mock data:', error);
        console.error('❌ Error details:', {
          status: error.status,
          statusText: error.statusText,
          url: error.url,
          message: error.message
        });
        return throwError(() => new Error('Failed to load mock bus data. Check console for details.'));
      })
    );
  }

  /**
   * Get popular routes (optional helper method)
   * @returns Observable of popular routes
   */
  getPopularRoutes(): Observable<any[]> {
    return this.apiService.get<any[]>('/routes/popular').pipe(
      catchError((error) => {
        console.error('Error fetching popular routes:', error);
        return throwError(() => new Error('Failed to load popular routes'));
      })
    );
  }
}
