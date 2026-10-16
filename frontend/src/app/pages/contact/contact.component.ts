import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { EnquiryResponse } from '../../core/models/enquiry.model';
import { ConsultationResponse } from '../../core/models/consultation.model';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  activeTab = signal<'enquiry' | 'consultation'>('enquiry');

  // Form States
  enquiryForm!: FormGroup;
  consultationForm!: FormGroup;

  isSubmittingEnquiry = signal(false);
  isSubmittingConsultation = signal(false);

  enquirySuccess = signal<EnquiryResponse | null>(null);
  consultationSuccess = signal<ConsultationResponse | null>(null);

  submittedEnquiryEmail = signal<string>('');
  submittedConsultationEmail = signal<string>('');

  enquiryError = signal<string | null>(null);
  consultationError = signal<string | null>(null);

  // Time windows
  timeWindows = [
    'Morning (9:00 AM - 12:00 PM IST)',
    'Afternoon (12:00 PM - 3:00 PM IST)',
    'Evening (3:00 PM - 6:00 PM IST)',
    'Night (8:00 PM - 10:00 PM IST for US/Europe NRIs)',
  ];

  // Relationship options
  relationships = ['Son', 'Daughter', 'Son-in-law', 'Daughter-in-law', 'Relative', 'Family Friend', 'Self (Parent)'];

  // Plans of interest
  servicesList = [
    { value: 'family-check-in', label: 'Family Check-in Plan (2 visits/mo - ₹499)' },
    { value: 'regular-support', label: 'Regular Support Plan (4 visits/mo - ₹899)' },
    { value: 'on-demand-errands', label: 'On-demand Errands (₹299/task)' },
    { value: 'general-inquiry', label: 'General / Custom Requirement' },
  ];

  // Minimum selectable date (today in local YYYY-MM-DD format)
  readonly minDate = this.getTodayDateString();

  private getTodayDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  constructor(
    private readonly fb: FormBuilder,
    private readonly route: ActivatedRoute,
    private readonly apiService: ApiService,
    private readonly seoService: SeoService,
  ) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Contact Us & Enquiries',
      'Contact AapnoSaath Care or request a free consultation call for elder care support and hospital appointment accompaniment for parents living in Vadodara, Gujarat.',
    );

    this.initForms();
    this.handleQueryParams();
  }

  private initForms(): void {
    // Enquiry Form
    this.enquiryForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]],
      relationshipToParent: ['', [Validators.required]],
      parentCity: ['Vadodara', [Validators.required]],
      parentLocality: ['', [Validators.required, Validators.maxLength(120)]],
      parentPincode: ['', [Validators.maxLength(10)]],
      parentPreferredName: ['', [Validators.maxLength(100)]],
      serviceOfInterest: ['regular-support', [Validators.required]],
      preferredContactMethod: ['PHONE', [Validators.required]],
      preferredConsultationDate: [''],
      preferredTimeWindow: [''],
      message: ['', [Validators.maxLength(1000)]],
      contactConsent: [false, [Validators.requiredTrue]],
      botHoneypot: [''],
    });

    // Consultation Request Form
    this.consultationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(120)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      phone: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(30)]],
      preferredDate: [
        '',
        [
          Validators.required,
          (control: AbstractControl) => {
            if (!control.value) return null;
            return control.value < this.minDate ? { pastDate: true } : null;
          },
        ],
      ],
      preferredTimeWindow: ['', [Validators.required]],
      consultationMethod: ['PHONE', [Validators.required]],
      supportRequirements: ['', [Validators.maxLength(1000)]],
      botHoneypot: [''],
    });
  }

  private handleQueryParams(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['tab'] === 'consultation') {
        this.activeTab.set('consultation');
      } else if (params['tab'] === 'enquiry') {
        this.activeTab.set('enquiry');
      }

      if (params['plan']) {
        this.enquiryForm.patchValue({ serviceOfInterest: params['plan'] });
      }

      if (params['locality']) {
        this.enquiryForm.patchValue({ parentLocality: params['locality'] });
      }

      if (params['pincode']) {
        this.enquiryForm.patchValue({ parentPincode: params['pincode'] });
      }
    });
  }

  setTab(tab: 'enquiry' | 'consultation'): void {
    this.activeTab.set(tab);
  }

  submitEnquiry(): void {
    if (this.enquiryForm.invalid) {
      this.enquiryForm.markAllAsTouched();
      this.scrollToFirstInvalidControl('enquiry-form');
      return;
    }

    this.isSubmittingEnquiry.set(true);
    this.enquiryError.set(null);
    const emailVal = this.enquiryForm.get('email')?.value || '';

    this.apiService.submitEnquiry(this.enquiryForm.value).subscribe({
      next: (res) => {
        this.isSubmittingEnquiry.set(false);
        this.submittedEnquiryEmail.set(emailVal);
        this.enquirySuccess.set(res);
        this.scrollToTarget('enquiry-success-card');
      },
      error: (err) => {
        this.isSubmittingEnquiry.set(false);
        const errorMsg = err?.error?.message;
        this.enquiryError.set(
          Array.isArray(errorMsg)
            ? errorMsg.join('. ')
            : (errorMsg || 'Unable to submit your enquiry at this moment. Please call us directly.')
        );
        this.scrollToTarget('contact-form-top');
      },
    });
  }

  submitConsultation(): void {
    if (this.consultationForm.invalid) {
      this.consultationForm.markAllAsTouched();
      this.scrollToFirstInvalidControl('consultation-form');
      return;
    }

    this.isSubmittingConsultation.set(true);
    this.consultationError.set(null);
    const emailVal = this.consultationForm.get('email')?.value || '';

    this.apiService.submitConsultation(this.consultationForm.value).subscribe({
      next: (res) => {
        this.isSubmittingConsultation.set(false);
        this.submittedConsultationEmail.set(emailVal);
        this.consultationSuccess.set(res);
        this.scrollToTarget('consultation-success-card');
      },
      error: (err) => {
        this.isSubmittingConsultation.set(false);
        const errorMsg = err?.error?.message;
        this.consultationError.set(
          Array.isArray(errorMsg)
            ? errorMsg.join('. ')
            : (errorMsg || 'Unable to submit your consultation request. Please call us directly.')
        );
        this.scrollToTarget('contact-form-top');
      },
    });
  }

  resetEnquiryForm(): void {
    this.enquirySuccess.set(null);
    this.submittedEnquiryEmail.set('');
    this.enquiryForm.reset({
      parentCity: 'Vadodara',
      serviceOfInterest: 'regular-support',
      preferredContactMethod: 'PHONE',
      contactConsent: false,
    });
    this.scrollToTarget('contact-form-top');
  }

  resetConsultationForm(): void {
    this.consultationSuccess.set(null);
    this.submittedConsultationEmail.set('');
    this.consultationForm.reset({
      consultationMethod: 'PHONE',
    });
    this.scrollToTarget('contact-form-top');
  }

  private scrollToTarget(targetId: string): void {
    if (typeof window === 'undefined') return;

    // First scroll pass after DOM mounts the success card
    setTimeout(() => {
      const el = document.getElementById(targetId) || document.getElementById('contact-form-top');
      if (el) {
        const headerOffset = 90;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        });

        try {
          el.setAttribute('tabindex', '-1');
          el.focus({ preventScroll: true });
        } catch {
          // Ignore focus errors
        }
      }
    }, 60);

    // Secondary scroll pass in case of dynamic layout or mobile keyboard collapse
    setTimeout(() => {
      const el = document.getElementById(targetId);
      if (el) {
        const headerOffset = 90;
        const currentTop = el.getBoundingClientRect().top;
        if (Math.abs(currentTop - headerOffset) > 25) {
          const offsetPosition = currentTop + window.pageYOffset - headerOffset;
          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: 'smooth',
          });
        }
      }
    }, 220);
  }

  private scrollToFirstInvalidControl(formId: string): void {
    if (typeof window === 'undefined') return;

    setTimeout(() => {
      const formEl = document.getElementById(formId);
      if (!formEl) return;
      const firstInvalid = formEl.querySelector('.is-invalid, input:invalid, select:invalid, textarea:invalid') as HTMLElement;
      if (firstInvalid) {
        const headerOffset = 110;
        const elementPosition = firstInvalid.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: 'smooth',
        });
        firstInvalid.focus({ preventScroll: true });
      }
    }, 60);
  }
}
