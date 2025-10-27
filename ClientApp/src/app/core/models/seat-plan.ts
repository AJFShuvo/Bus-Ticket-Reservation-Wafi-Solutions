/**
 * DTO representing individual seat information
 */
export interface SeatDto {
  /**
   * Unique seat identifier/number (e.g., "A1", "B2")
   */
  seatNumber: string;

  /**
   * Row number in the bus layout
   */
  row: number;

  /**
   * Column number in the bus layout
   */
  column: number;

  /**
   * Whether the seat is currently booked
   */
  isBooked: boolean;

  /**
   * Seat type (e.g., "Window", "Aisle", "Middle")
   */
  seatType?: string;

  /**
   * Gender preference for the seat (if applicable)
   */
  gender?: 'Male' | 'Female' | 'Any';

  /**
   * Price for this specific seat (if different from base price)
   */
  price?: number;

  /**
   * Whether the seat is available for selection
   */
  isAvailable?: boolean;
}

/**
 * DTO representing the complete seat layout plan for a bus
 */
export interface SeatPlanDto {
  /**
   * Bus number/identifier
   */
  busNumber: string;

  /**
   * Total number of rows in the bus
   */
  totalRows: number;

  /**
   * Total number of columns (seats per row)
   */
  totalColumns: number;

  /**
   * Array of all seats in the bus
   */
  seats: SeatDto[];

  /**
   * Layout configuration (e.g., "2+2", "2+1")
   */
  layoutConfig?: string;

  /**
   * Deck configuration for multi-deck buses
   */
  deckType?: 'Single' | 'Double';

  /**
   * Current deck being displayed (for double-decker buses)
   */
  currentDeck?: 'Lower' | 'Upper';
}

