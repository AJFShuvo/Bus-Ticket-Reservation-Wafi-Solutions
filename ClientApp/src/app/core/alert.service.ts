import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export enum AlertType {
  Success = 'success',
  Error = 'danger',
  Warning = 'warning',
  Info = 'info'
}

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  dismissible: boolean;
  autoClose: boolean;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alertSubject = new BehaviorSubject<Alert[]>([]);
  public alerts$: Observable<Alert[]> = this.alertSubject.asObservable();
  private alertId = 0;

  /**
   * Show a success alert
   * @param message - Success message to display
   * @param autoClose - Whether to auto-dismiss after duration
   * @param duration - Duration in milliseconds before auto-close (default: 5000)
   */
  success(message: string, autoClose: boolean = true, duration: number = 5000): void {
    this.showAlert(AlertType.Success, message, true, autoClose, duration);
  }

  /**
   * Show an error alert
   * @param message - Error message to display
   * @param autoClose - Whether to auto-dismiss after duration
   * @param duration - Duration in milliseconds before auto-close (default: 0 - no auto-close)
   */
  error(message: string, autoClose: boolean = false, duration: number = 0): void {
    this.showAlert(AlertType.Error, message, true, autoClose, duration);
  }

  /**
   * Show a warning alert
   * @param message - Warning message to display
   * @param autoClose - Whether to auto-dismiss after duration
   * @param duration - Duration in milliseconds before auto-close (default: 7000)
   */
  warning(message: string, autoClose: boolean = true, duration: number = 7000): void {
    this.showAlert(AlertType.Warning, message, true, autoClose, duration);
  }

  /**
   * Show an info alert
   * @param message - Info message to display
   * @param autoClose - Whether to auto-dismiss after duration
   * @param duration - Duration in milliseconds before auto-close (default: 5000)
   */
  info(message: string, autoClose: boolean = true, duration: number = 5000): void {
    this.showAlert(AlertType.Info, message, true, autoClose, duration);
  }

  /**
   * Show an alert with custom configuration
   */
  private showAlert(
    type: AlertType,
    message: string,
    dismissible: boolean = true,
    autoClose: boolean = false,
    duration: number = 5000
  ): void {
    const alert: Alert = {
      id: `alert-${this.alertId++}`,
      type,
      message,
      dismissible,
      autoClose,
      duration
    };

    const currentAlerts = this.alertSubject.value;
    this.alertSubject.next([...currentAlerts, alert]);

    // Auto-close if enabled
    if (autoClose && duration > 0) {
      setTimeout(() => this.remove(alert.id), duration);
    }
  }

  /**
   * Remove a specific alert by ID
   * @param id - Alert ID to remove
   */
  remove(id: string): void {
    const currentAlerts = this.alertSubject.value;
    this.alertSubject.next(currentAlerts.filter(alert => alert.id !== id));
  }

  /**
   * Clear all alerts
   */
  clear(): void {
    this.alertSubject.next([]);
  }

  /**
   * Handle API error and show appropriate alert
   * @param error - Error object from API
   * @param customMessage - Optional custom message to override default
   */
  handleApiError(error: any, customMessage?: string): void {
    let errorMessage = customMessage || 'An unexpected error occurred';

    if (error?.message) {
      errorMessage = error.message;
    } else if (error?.error?.message) {
      errorMessage = error.error.message;
    } else if (error?.status === 0) {
      errorMessage = 'Unable to connect to the server. Please check your connection.';
    } else if (error?.status === 404) {
      errorMessage = 'The requested resource was not found.';
    } else if (error?.status === 500) {
      errorMessage = 'Server error. Please try again later.';
    }

    this.error(errorMessage);
  }

  /**
   * Handle booking conflict error specifically
   * @param error - Error object from booking API
   */
  handleBookingConflict(error: any): void {
    const message = error?.message || 
      'One or more selected seats are no longer available. The seat map will be refreshed.';
    this.warning(message, true, 8000);
  }
}

