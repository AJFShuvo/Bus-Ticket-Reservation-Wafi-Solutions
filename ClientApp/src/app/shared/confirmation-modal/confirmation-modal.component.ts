import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent {
  @Input() show: boolean = false;
  @Input() title: string = 'Confirmation';
  @Input() message: string = 'Are you sure?';
  @Input() confirmText: string = 'Confirm';
  @Input() cancelText: string = 'Cancel';
  @Input() type: 'info' | 'warning' | 'danger' = 'info';

  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  onConfirm(): void {
    this.confirmed.emit();
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  onBackdropClick(): void {
    this.onCancel();
  }

  getIconClass(): string {
    switch (this.type) {
      case 'warning':
        return 'bi-exclamation-triangle text-warning';
      case 'danger':
        return 'bi-exclamation-circle text-danger';
      default:
        return 'bi-info-circle text-info';
    }
  }
}

