import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { ServicePlan } from '../../core/models/service-plan.model';
import { AreaCheckerComponent } from '../../shared/components/area-checker/area-checker.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, AreaCheckerComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  plans = signal<ServicePlan[]>([]);
  activeFaqIndex = signal<number | null>(0);

  // Key FAQs for Home preview
  previewFaqs = [
    {
      q: 'Who can use AapnoSaath Care?',
      a: 'Families looking for local, non-medical support for elderly parents living in Vadodara can submit an enquiry. Service suitability and availability will be confirmed individually before any arrangement is confirmed.',
    },
    {
      q: 'Can I arrange support if I live outside India or in another city?',
      a: 'Yes, absolutely. Adult children living overseas (NRI) or in other Indian cities can coordinate services remotely. We discuss communication preferences, parental consent, schedules, and service plans directly with you.',
    },
    {
      q: 'What happens during a home visit?',
      a: 'A visit follows the agreed scope and duration (up to 30 minutes for standard check-ins). It includes a friendly conversation, a general comfort and wellbeing check, and assistance with agreed practical tasks. It is strictly non-medical.',
    },
    {
      q: 'Do you provide emergency or medical services?',
      a: 'No. AapnoSaath Care is strictly a non-medical support and family coordination service. We do not provide doctor visits, nursing, continuous medical monitoring, or emergency response services.',
    },
  ];

  constructor(
    private readonly apiService: ApiService,
    private readonly seoService: SeoService,
  ) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Home',
      'Close to Your Parents. Wherever You Are. Non-medical elder care check-ins, errand assistance, and family coordination in Vadodara, Gujarat.',
    );

    this.apiService.getServices().subscribe((data) => {
      this.plans.set(data);
    });
  }

  toggleFaq(index: number): void {
    this.activeFaqIndex.update((current) => (current === index ? null : index));
  }
}
