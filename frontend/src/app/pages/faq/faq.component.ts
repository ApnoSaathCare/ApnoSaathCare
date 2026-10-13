import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

export interface FaqItem {
  id: string;
  category: 'general' | 'pricing' | 'visits' | 'safety' | 'booking';
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss'],
})
export class FaqComponent implements OnInit {
  searchQuery = signal('');
  selectedCategory = signal<string>('all');
  openFaqId = signal<string | null>('faq-1');

  faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'general',
      question: 'Who can use AapnoSaath Care?',
      answer:
        'Families looking for local, non-medical support for elderly parents living in Vadodara can submit an enquiry. Service suitability, coordinator matching, and schedule availability will be confirmed individually before any service plan begins.',
    },
    {
      id: 'faq-2',
      category: 'general',
      question: 'Can I arrange support if I live outside India?',
      answer:
        'Yes, you can easily submit an enquiry remotely from anywhere in the world (USA, UK, Canada, UAE, Australia, or other Indian cities). We coordinate communication preferences, consent, schedules, and service arrangements via phone, email, or WhatsApp before confirming a plan.',
    },
    {
      id: 'faq-3',
      category: 'visits',
      question: 'What happens during a home visit?',
      answer:
        'A visit strictly follows the agreed scope and duration (up to 30 minutes for standard check-ins). It may include a warm conversation over tea, checking general comfort and wellbeing, and assisting with agreed practical tasks (e.g., organizing calendar reminders, light errand review). It is not a medical examination.',
    },
    {
      id: 'faq-4',
      category: 'visits',
      question: 'Will I receive updates after a visit?',
      answer:
        'Yes. Updates can be shared with the nominated family contact according to the agreed communication plan and subject to your parent’s explicit consent and personal comfort.',
    },
    {
      id: 'faq-5',
      category: 'safety',
      question: 'Do you provide medical or emergency services?',
      answer:
        'No. The service is non-medical and does not replace healthcare professionals, nurses, doctors, or emergency rescue services. In medical emergencies, emergency medical services (such as dialing 108 in India) must be contacted directly.',
    },
    {
      id: 'faq-6',
      category: 'general',
      question: 'Is every locality in Vadodara covered?',
      answer:
        'Coverage depends on the specific locality, visit schedule, and available service personnel in Vadodara. Please use our interactive service-area checker or submit an enquiry for your parents’ locality.',
    },
    {
      id: 'faq-7',
      category: 'pricing',
      question: 'How much does the service cost?',
      answer:
        'Our proposed pilot pricing plans start at ₹999/month for Family Check-in (2 visits) and ₹1,499/month for Regular Support (4 visits). On-demand errands range between ₹199–₹499 per task depending on time and distance. Third-party expenses and transport are quoted separately.',
    },
    {
      id: 'faq-8',
      category: 'booking',
      question: 'Can I cancel or change a booking?',
      answer:
        'Visits may be rescheduled with at least 24 hours advance notice. Our final commercial cancellation policy is currently under pilot confirmation and will be provided in writing before confirming service activation.',
    },
    {
      id: 'faq-9',
      category: 'booking',
      question: 'How do I get started?',
      answer:
        'Getting started is simple: submit an enquiry or book a consultation request on our website. Our Vadodara team will reach out to understand your family’s requirements, discuss pricing, and confirm schedule availability.',
    },
  ];

  filteredFaqs = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.faqs.filter((faq) => {
      const matchesCategory = cat === 'all' || faq.category === cat;
      const matchesQuery =
        !q ||
        faq.question.toLowerCase().includes(q) ||
        faq.answer.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  });

  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Frequently Asked Questions',
      'Common questions and answers regarding non-medical elder care check-ins, errand assistance, pricing, and safety standards in Vadodara.',
    );
  }

  toggleFaq(id: string): void {
    this.openFaqId.update((current) => (current === id ? null : id));
  }

  setCategory(cat: string): void {
    this.selectedCategory.set(cat);
  }
}
