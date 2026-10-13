import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { ServicePlan } from '../../core/models/service-plan.model';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent implements OnInit {
  plans = signal<ServicePlan[]>([]);
  isLoading = signal(true);

  constructor(
    private readonly apiService: ApiService,
    private readonly seoService: SeoService,
  ) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Services & Transparent Pricing',
      'Clear, honest non-medical elder care plans in Vadodara: Family Check-in (₹999/mo), Regular Support (₹1,499/mo), and On-demand Errands (₹299–₹699/task).',
    );

    this.apiService.getServices().subscribe({
      next: (data) => {
        this.plans.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
