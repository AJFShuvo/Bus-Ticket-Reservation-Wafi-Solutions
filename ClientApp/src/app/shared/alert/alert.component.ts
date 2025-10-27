import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlertService, Alert } from '../../core/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit, OnDestroy {
  alerts: Alert[] = [];
  private subscription!: Subscription;

  constructor(private alertService: AlertService) {}

  ngOnInit(): void {
    this.subscription = this.alertService.alerts$.subscribe(alerts => {
      this.alerts = alerts;
    });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  close(alert: Alert): void {
    this.alertService.remove(alert.id);
  }

  getIconClass(type: string): string {
    switch (type) {
      case 'success':
        return 'bi-check-circle-fill';
      case 'danger':
        return 'bi-exclamation-triangle-fill';
      case 'warning':
        return 'bi-exclamation-circle-fill';
      case 'info':
        return 'bi-info-circle-fill';
      default:
        return 'bi-info-circle';
    }
  }
}

