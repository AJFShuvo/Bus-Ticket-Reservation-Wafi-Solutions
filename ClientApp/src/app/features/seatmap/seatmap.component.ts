import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SeatPlanService } from './seatplan.service';
import { BookingService } from '../booking/booking.service';
import { SeatBoxComponent } from './seat-box.component';
import { AlertService } from '../../core/alert.service';
import { ConfirmationModalComponent } from '../../shared/confirmation-modal/confirmation-modal.component';
import { AvailableBusDto, SeatPlanDto, SeatDto, BookSeatInputDto } from '../../core/models';

@Component({
  selector: 'app-seatmap',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SeatBoxComponent, ConfirmationModalComponent],
  templateUrl: './seatmap.component.html',
  styleUrls: ['./seatmap.component.scss']
})
export class SeatmapComponent implements OnInit {
  busScheduleId: string = '';
  bus: AvailableBusDto | null = null;
  seatPlan: SeatPlanDto | null = null;
  seatRows: SeatDto[][] = [];
  selectedSeats: SeatDto[] = [];
  
  bookingForm!: FormGroup;
  isLoading = false;
  isFetchingSeats = false;
  errorMessage = '';
  successMessage = '';
  
  // Modal properties
  showConflictModal = false;
  conflictModalMessage = '';
  
  // Dropdown options (these would normally come from API)
  boardingPoints: string[] = [];
  droppingPoints: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private seatPlanService: SeatPlanService,
    private bookingService: BookingService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadBusAndSeatPlan();
  }

  /**
   * Load bus information and seat plan
   */
  private loadBusAndSeatPlan(): void {
    // Get bus schedule ID from route params
    this.busScheduleId = this.route.snapshot.params['id'] || '';
    
    // Get bus details from navigation state
    const state = history.state;
    if (state && state.bus) {
      this.bus = state.bus;
      this.initializeBoardingPoints();
    }

    // Fetch seat plan
    if (this.busScheduleId) {
      this.fetchSeatPlan();
    } else {
      this.errorMessage = 'Invalid bus schedule ID';
      setTimeout(() => this.router.navigate(['/search']), 3000);
    }
  }

  /**
   * Fetch seat plan from API
   */
  fetchSeatPlan(): void {
    this.isFetchingSeats = true;
    this.errorMessage = '';
    
    this.seatPlanService.getSeatPlan(this.busScheduleId).subscribe({
      next: (seatPlan: SeatPlanDto) => {
        this.seatPlan = seatPlan;
        this.organizeSeatLayout();
        this.isFetchingSeats = false;
      },
      error: (error: Error) => {
        this.errorMessage = error.message || 'Failed to load seat plan';
        this.isFetchingSeats = false;
      }
    });
  }

  /**
   * Organize seats into rows for display
   */
  private organizeSeatLayout(): void {
    if (!this.seatPlan) return;
    
    this.seatRows = this.seatPlanService.organizeSeatsByRow(
      this.seatPlan.seats,
      this.seatPlan.totalColumns
    );
  }

  /**
   * Initialize boarding and dropping points
   */
  private initializeBoardingPoints(): void {
    if (this.bus) {
      this.boardingPoints = [this.bus.origin, 'City Center', 'Bus Terminal'];
      this.droppingPoints = [this.bus.destination, 'City Center', 'Bus Terminal'];
    }
  }

  /**
   * Initialize booking form
   */
  private initializeForm(): void {
    this.bookingForm = this.fb.group({
      boardingPoint: ['', [Validators.required]],
      droppingPoint: ['', [Validators.required]],
      passengerName: ['', [Validators.required, Validators.minLength(2)]],
      passengerMobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]]
    });
  }

  /**
   * Handle seat selection toggle
   */
  onSeatToggle(seat: SeatDto): void {
    const index = this.selectedSeats.findIndex(s => s.seatNumber === seat.seatNumber);
    
    if (index > -1) {
      // Deselect seat
      this.selectedSeats.splice(index, 1);
    } else {
      // Select seat (limit to 6 seats)
      if (this.selectedSeats.length < 6) {
        this.selectedSeats.push(seat);
      } else {
        alert('You can select a maximum of 6 seats at a time.');
      }
    }
  }

  /**
   * Check if a seat is selected
   */
  isSeatSelected(seat: SeatDto): boolean {
    return this.selectedSeats.some(s => s.seatNumber === seat.seatNumber);
  }

  /**
   * Get form control for validation
   */
  get f() {
    return this.bookingForm.controls;
  }

  /**
   * Check if form field has error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.bookingForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Calculate total price
   */
  getTotalPrice(): number {
    if (!this.bus) return 0;
    return this.seatPlanService.calculateTotalPrice(this.selectedSeats, this.bus.price);
  }

  /**
   * Submit booking form
   */
  onSubmit(): void {
    // Validate form
    if (this.bookingForm.invalid) {
      Object.keys(this.bookingForm.controls).forEach(key => {
        this.bookingForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Validate seat selection
    if (this.selectedSeats.length === 0) {
      this.errorMessage = 'Please select at least one seat';
      return;
    }

    if (!this.bus) {
      this.errorMessage = 'Bus information not available';
      return;
    }

    // Prepare booking data
    const formValue = this.bookingForm.value;
    const bookingData: BookSeatInputDto = {
      busNumber: this.bus.busNumber,
      routeNumber: this.bus.routeNumber,
      seatNumbers: this.selectedSeats.map(s => s.seatNumber),
      passenger: {
        name: formValue.passengerName,
        age: 0, // Could add age field if needed
        gender: 'Other', // Could add gender field if needed
        phoneNumber: formValue.passengerMobile,
        email: ''
      },
      travelDate: this.bus.departureTime.split('T')[0],
      totalAmount: this.getTotalPrice()
    };

    // Submit booking
    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.bookingService.bookSeats(bookingData).subscribe({
      next: (result) => {
        this.isLoading = false;
        
        // Show success alert
        this.alertService.success(`Booking successful! Your PNR is: ${result.bookingId}`, true, 10000);
        this.successMessage = `Booking successful! Your PNR is: ${result.bookingId}`;
        
        // Reset form and selections
        this.bookingForm.reset();
        this.selectedSeats = [];
        
        // Scroll to success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: (error: Error) => {
        this.isLoading = false;
        const errorMsg = error.message || 'Booking failed. Please try again.';
        
        // Check if it's a seat conflict error
        if (errorMsg.toLowerCase().includes('conflict') || 
            errorMsg.toLowerCase().includes('no longer available') ||
            errorMsg.toLowerCase().includes('already booked')) {
          
          // Show conflict modal
          this.conflictModalMessage = errorMsg;
          this.showConflictModal = true;
          
          // Also show warning alert
          this.alertService.handleBookingConflict(error);
          
        } else {
          // Regular error - show error alert
          this.alertService.error(errorMsg, false);
          this.errorMessage = errorMsg;
        }
        
        // Clear selections
        this.selectedSeats = [];
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    });
  }

  /**
   * Navigate back to results
   */
  goBack(): void {
    this.router.navigate(['/results'], {
      state: history.state
    });
  }

  /**
   * Clear selections
   */
  clearSelections(): void {
    this.selectedSeats = [];
  }

  /**
   * Handle conflict modal confirmation
   */
  onConflictConfirmed(): void {
    this.showConflictModal = false;
    // Refresh seat plan to get updated availability
    this.fetchSeatPlan();
  }

  /**
   * Handle conflict modal cancellation
   */
  onConflictCancelled(): void {
    this.showConflictModal = false;
    // Optionally refresh seat plan
    this.fetchSeatPlan();
  }
}
