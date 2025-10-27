import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeatDto } from '../../core/models';

@Component({
  selector: 'app-seat-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-box.component.html',
  styleUrls: ['./seat-box.component.scss']
})
export class SeatBoxComponent {
  /**
   * Seat data object
   */
  @Input() seat!: SeatDto;

  /**
   * Whether this seat is currently selected
   */
  @Input() selected: boolean = false;

  /**
   * Event emitted when seat is clicked/toggled
   */
  @Output() toggle = new EventEmitter<SeatDto>();

  /**
   * Handle seat click
   */
  onSeatClick(): void {
    if (this.isDisabled()) {
      return;
    }
    this.toggle.emit(this.seat);
  }

  /**
   * Check if seat should be disabled
   * @returns true if seat is booked or unavailable
   */
  isDisabled(): boolean {
    return this.seat.isBooked || this.seat.isAvailable === false;
  }

  /**
   * Get the CSS class for seat status
   * @returns CSS class name based on seat state
   */
  getSeatClass(): string {
    if (this.selected) {
      return 'seat-selected';
    }
    if (this.seat.isBooked) {
      return 'seat-booked';
    }
    if (this.seat.isAvailable === false) {
      return 'seat-sold';
    }
    return 'seat-available';
  }

  /**
   * Get aria-label for accessibility
   * @returns Descriptive label for screen readers
   */
  getAriaLabel(): string {
    const seatNumber = this.seat.seatNumber;
    const seatType = this.seat.seatType || 'Standard';
    
    if (this.selected) {
      return `Seat ${seatNumber}, ${seatType}, Currently selected. Click to deselect.`;
    }
    if (this.seat.isBooked) {
      return `Seat ${seatNumber}, ${seatType}, Booked. Not available.`;
    }
    if (this.seat.isAvailable === false) {
      return `Seat ${seatNumber}, ${seatType}, Sold out. Not available.`;
    }
    return `Seat ${seatNumber}, ${seatType}, Available. Click to select.`;
  }

  /**
   * Get icon class based on seat type
   * @returns Bootstrap icon class
   */
  getSeatIcon(): string {
    const seatType = this.seat.seatType?.toLowerCase() || '';
    
    if (seatType.includes('window')) {
      return 'bi-window';
    }
    if (seatType.includes('aisle')) {
      return 'bi-arrow-left-right';
    }
    return 'bi-person-fill';
  }
}

