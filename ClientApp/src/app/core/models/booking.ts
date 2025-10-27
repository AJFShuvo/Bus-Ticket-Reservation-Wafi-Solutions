/**
 * DTO for passenger information
 */
export interface PassengerDto {
  /**
   * Passenger's full name
   */
  name: string;

  /**
   * Passenger's age
   */
  age: number;

  /**
   * Passenger's gender
   */
  gender: 'Male' | 'Female' | 'Other';

  /**
   * Contact phone number
   */
  phoneNumber?: string;

  /**
   * Contact email address
   */
  email?: string;
}

/**
 * DTO for booking seat input request
 */
export interface BookSeatInputDto {
  /**
   * Bus number/identifier
   */
  busNumber: string;

  /**
   * Route number
   */
  routeNumber: string;

  /**
   * Array of seat numbers to book
   */
  seatNumbers: string[];

  /**
   * Passenger information
   */
  passenger: PassengerDto;

  /**
   * Travel date (ISO 8601 format)
   */
  travelDate: string;

  /**
   * Payment method
   */
  paymentMethod?: string;

  /**
   * Total amount paid
   */
  totalAmount: number;
}

/**
 * DTO for booking seat result response
 */
export interface BookSeatResultDto {
  /**
   * Unique booking/PNR number
   */
  bookingId: string;

  /**
   * Booking status
   */
  status: 'Confirmed' | 'Pending' | 'Failed' | 'Cancelled';

  /**
   * Bus number
   */
  busNumber: string;

  /**
   * Route number
   */
  routeNumber: string;

  /**
   * Booked seat numbers
   */
  seatNumbers: string[];

  /**
   * Passenger details
   */
  passenger: PassengerDto;

  /**
   * Origin city/station
   */
  origin: string;

  /**
   * Destination city/station
   */
  destination: string;

  /**
   * Departure date and time
   */
  departureTime: string;

  /**
   * Arrival date and time
   */
  arrivalTime: string;

  /**
   * Total amount paid
   */
  totalAmount: number;

  /**
   * Booking timestamp
   */
  bookingDate: string;

  /**
   * Error message (if booking failed)
   */
  errorMessage?: string;

  /**
   * Additional booking details
   */
  remarks?: string;
}

