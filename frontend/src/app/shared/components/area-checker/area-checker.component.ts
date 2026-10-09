import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ServiceAreaCheckResult } from '../../../core/models/service-area.model';

@Component({
  selector: 'app-area-checker',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './area-checker.component.html',
  styleUrls: ['./area-checker.component.scss'],
})
export class AreaCheckerComponent implements OnInit {
  localityInput = '';
  pincodeInput = '';
  isLoading = signal(false);
  checkResult = signal<ServiceAreaCheckResult | null>(null);

  // Popular localities for quick click
  popularAreas = ['Alkapuri', 'Akota', 'Gotri', 'Manjalpur', 'Karelibaug', 'Fatehgunj', 'Vasna Road'];

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {}

  checkArea(quickLocality?: string): void {
    if (quickLocality) {
      this.localityInput = quickLocality;
    }

    if (!this.localityInput.trim() && !this.pincodeInput.trim()) {
      return;
    }

    this.isLoading.set(true);
    this.checkResult.set(null);

    this.apiService
      .checkServiceArea(this.localityInput.trim(), this.pincodeInput.trim())
      .subscribe({
        next: (res) => {
          this.checkResult.set(res);
          this.isLoading.set(false);
        },
        error: () => {
          this.isLoading.set(false);
        },
      });
  }

  reset(): void {
    this.localityInput = '';
    this.pincodeInput = '';
    this.checkResult.set(null);
  }
}
