/**
 * DTO representing an available bus on a specific route
 */
export interface AvailableBusDto {
  /**
   * Unique identifier for the bus
   */
  busNumber: string;

  /**
   * Route number/identifier
   */
  routeNumber: string;

  /**
   * Origin city/station
   */
  origin: string;

  /**
   * Destination city/station
   */
  destination: string;

  /**
   * Departure date and time (ISO 8601 format)
   */
  departureTime: string;

  /**
   * Arrival date and time (ISO 8601 format)
   */
  arrivalTime: string;

  /**
   * Total number of seats in the bus
   */
  totalSeats: number;

  /**
   * Number of available (unbooked) seats
   */
  availableSeats: number;

  /**
   * Ticket price per seat
   */
  price: number;

  /**
   * Bus type (e.g., "AC", "Non-AC", "Sleeper", "Seater")
   */
  busType?: string;

  /**
   * Operator/company name
   */
  operatorName?: string;
}

