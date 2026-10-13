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
      a: 'Families looking for local elder care support, hospital visit accompaniment, and errand assistance for elderly parents in Vadodara can submit an enquiry. Service suitability and availability will be confirmed individually before any arrangement is confirmed.',
    },
    {
      q: 'Can I arrange support if I live outside India or in another city?',
      a: 'Yes, absolutely. Adult children living overseas (NRI) or in other Indian cities can coordinate services remotely. We discuss communication preferences, parental consent, schedules, and service plans directly with you.',
    },
    {
      q: 'What happens during a home visit?',
      a: 'A visit follows the agreed scope and duration (up to 60 minutes for standard check-ins). It includes a friendly conversation, a general comfort and wellbeing check, and assistance with agreed practical tasks or appointment planning. It provides personal companion and daily living support.',
    },
    {
      q: 'Do you provide hospital accompaniment and emergency services?',
      a: 'We gladly accompany elderly parents to hospital visits and doctor appointments — assisting with transport logistics, clinic waiting, and medicine pickups. However, our coordinators do not perform clinical medical procedures, nursing care, or emergency ambulance rescue; medical treatments remain with qualified healthcare professionals.',
    },
  ];

  constructor(
    private readonly apiService: ApiService,
    private readonly seoService: SeoService,
  ) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Home',
      'Close to Your Parents. Wherever You Are. Elder care check-ins, hospital visit accompaniment, errand assistance, and family coordination in Vadodara, Gujarat.',
    );

    this.apiService.getServices().subscribe((data) => {
      this.plans.set(data);
    });
  }

  toggleFaq(index: number): void {
    this.activeFaqIndex.update((current) => (current === index ? null : index));
  }
}
