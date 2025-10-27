import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from './search.service';
import { AlertService } from '../../core/alert.service';
import { AvailableBusDto } from '../../core/models';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  searchForm!: FormGroup;
  isLoading = false;
  errorMessage = '';
  minDate: string;

  constructor(
    private fb: FormBuilder,
    private searchService: SearchService,
    private router: Router,
    private alertService: AlertService
  ) {
    // Set minimum date to today
    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.initializeForm();
  }

  /**
   * Initialize the search form with validation
   */
  private initializeForm(): void {
    this.searchForm = this.fb.group({
      from: ['', [Validators.required, Validators.minLength(2)]],
      to: ['', [Validators.required, Validators.minLength(2)]],
      journeyDate: ['', [Validators.required]]
    });
  }

  /**
   * Get form control for easy access in template
   */
  get f() {
    return this.searchForm.controls;
  }

  /**
   * Check if a form field has an error
   */
  hasError(fieldName: string, errorType: string): boolean {
    const field = this.searchForm.get(fieldName);
    return !!(field && field.hasError(errorType) && (field.dirty || field.touched));
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    console.log('Form submitted!', this.searchForm.value);
    console.log('Form valid:', this.searchForm.valid);
    console.log('Form errors:', this.searchForm.errors);
    
    // Mark all fields as touched to show validation errors
    if (this.searchForm.invalid) {
      console.log('Form is invalid!');
      Object.keys(this.searchForm.controls).forEach(key => {
        const control = this.searchForm.get(key);
        control?.markAsTouched();
        console.log(`${key} errors:`, control?.errors);
      });
      this.alertService.warning('Please fill in all required fields');
      return;
    }

    // Reset error message
    this.errorMessage = '';
    this.isLoading = true;

    const { from, to, journeyDate } = this.searchForm.value;
    console.log('Searching buses:', { from, to, journeyDate });

    // Validate that from and to are different
    if (from && to && from.toLowerCase() === to.toLowerCase()) {
      this.errorMessage = 'Origin and destination must be different';
      this.alertService.warning('Origin and destination must be different');
      this.isLoading = false;
      return;
    }

    this.searchService.searchAvailableBuses(from, to, journeyDate).subscribe({
      next: (buses: AvailableBusDto[]) => {
        this.isLoading = false;
        console.log('Buses found:', buses.length);
        
        // Navigate to results page with data
        this.router.navigate(['/results'], {
          state: {
            buses: buses,
            searchParams: { from, to, journeyDate }
          }
        });
      },
      error: (error: Error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'An error occurred while searching for buses';
        
        // Show error alert
        this.alertService.handleApiError(error, 'Failed to search buses. Please try again.');
        
        console.error('Search error:', error);
      }
    });
  }

  /**
   * Reset the form
   */
  resetForm(): void {
    this.searchForm.reset();
    this.errorMessage = '';
  }

  /**
   * Swap origin and destination
   */
  swapLocations(): void {
    const from = this.searchForm.get('from')?.value;
    const to = this.searchForm.get('to')?.value;
    
    this.searchForm.patchValue({
      from: to,
      to: from
    });
  }

  /**
   * Quick search from trending routes
   */
  quickSearch(from: string, to: string): void {
    this.searchForm.patchValue({
      from: from,
      to: to
    });
    
    // Focus on date field
    setTimeout(() => {
      const dateInput = document.getElementById('journeyDate') as HTMLInputElement;
      if (dateInput) {
        dateInput.focus();
      }
    }, 100);
  }
}
