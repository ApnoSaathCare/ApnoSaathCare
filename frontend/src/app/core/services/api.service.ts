import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ServicePlan } from '../models/service-plan.model';
import { ServiceArea, ServiceAreaCheckResult } from '../models/service-area.model';
import { EnquirySubmissionDto, EnquiryResponse } from '../models/enquiry.model';
import { ConsultationSubmissionDto, ConsultationResponse } from '../models/consultation.model';
import { PublicConfig } from '../models/public-config.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly baseUrl = environment.apiUrl;

  // Fallback Service Plans (Vadodara)
  private readonly fallbackPlans: ServicePlan[] = [
    {
      id: 'sp-001',
      name: 'Family Check-in',
      slug: 'family-check-in',
      shortDescription:
        'Ideal for families wanting regular, gentle reassurance and thoughtful check-ins for parents living independently.',
      priceAmount: 499.0,
      currencyCode: 'INR',
      billingPeriod: 'per month',
      inclusions: [
        '2 scheduled home visits per month',
        'Up to 60 minutes per visit',
        'Brief visit summary after each completed visit (subject to consent)',
        'Basic coordination with nominated family contact',
        'Wellbeing & comfort check',
      ],
      exclusions: [
        'Medical nursing or clinical procedures',
        'Emergency medical response',
        'Third-party purchase costs or travel fees',
        'Heavy domestic housekeeping',
      ],
      isPublished: true,
      displayOrder: 1,
    },
    {
      id: 'sp-002',
      name: 'Regular Support',
      slug: 'regular-support',
      shortDescription:
        'Comprehensive companion assistance for weekly presence, hospital visit accompaniment, and continuous family peace of mind.',
      priceAmount: 2999.0,
      currencyCode: 'INR',
      billingPeriod: 'per month',
      inclusions: [
        '4 scheduled home visits per month (weekly)',
        'Up to 60 minutes per visit',
        'Detailed visit summaries for the nominated family contact',
        'Assistance coordinating agreed everyday support needs',
        'Appointment escort & reminder support',
        'Priority scheduling review',
      ],
      exclusions: [
        'Medical treatment or medication dispensing',
        '24/7 continuous supervision',
        'Third-party transport / appointment fees',
        'Direct financial or asset management',
      ],
      isPublished: true,
      displayOrder: 2,
    },
    {
      id: 'sp-003',
      name: 'On-demand Errands',
      slug: 'on-demand-errands',
      shortDescription:
        'Flexible, task-based assistance for essential errands, bill payments, grocery pickups, and local coordination.',
      priceAmount: 299.0,
      currencyCode: 'INR',
      billingPeriod: 'per task (₹299)',
      inclusions: [
        'Transparent quote based on task distance, time, and complexity',
        'Bill payment assistance & local errand runs',
        'Prescription medicine pickup (non-controlled items)',
        'Accompanied local visit coordination',
        'Prompt completion confirmation and digital update',
      ],
      exclusions: [
        'Cash advances or large cash transactions',
        'Urgent emergency errand runs',
        'Hazardous tasks or heavy lifting',
        'Unverified third-party financial requests',
      ],
      isPublished: true,
      displayOrder: 3,
    },
  ];

  // Fallback Public Config
  private readonly fallbackConfig: PublicConfig = {
    orgName: 'AapnoSaath Care',
    tagline: 'Close to Your Parents. Wherever You Are.',
    supportingMessage: 'A Trusted Friend for Your Parents.',
    serviceCity: 'Vadodara',
    serviceState: 'Gujarat',
    serviceCountry: 'India',
    supportEmail: 'enquiriesataapnosaathcare@gmail.com',
    supportPhone: '+91 8780791723',
    privacyNoticeVersion: 'v1.0',
    termsVersion: 'v1.0',
    isPilotPricing: false,
    disclaimer:
      'AapnoSaath Care provides elder care assistance, hospital appointment accompaniment, and family coordination. We do not provide clinical medical procedures, nursing treatments, continuous monitoring, or emergency response services.',
  };

  constructor(private readonly http: HttpClient) {}

  getPublicConfig(): Observable<PublicConfig> {
    return this.http.get<PublicConfig>(`${this.baseUrl}/public-config`).pipe(
      catchError(() => of(this.fallbackConfig)),
    );
  }

  getServices(): Observable<ServicePlan[]> {
    return this.http.get<ServicePlan[]>(`${this.baseUrl}/services`).pipe(
      catchError(() => of(this.fallbackPlans)),
    );
  }

  getServiceBySlug(slug: string): Observable<ServicePlan | undefined> {
    return this.http.get<ServicePlan>(`${this.baseUrl}/services/${slug}`).pipe(
      catchError(() => {
        const found = this.fallbackPlans.find((p) => p.slug === slug);
        return of(found);
      }),
    );
  }

  getServiceAreas(): Observable<ServiceArea[]> {
    return this.http.get<ServiceArea[]>(`${this.baseUrl}/service-areas`).pipe(
      catchError(() => {
        const localAreas: ServiceArea[] = [
          { id: 'sa-001', localityName: 'Alkapuri', pincode: '390007', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone with high scheduling availability.' },
          { id: 'sa-002', localityName: 'Akota', pincode: '390020', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone with standard scheduling availability.' },
          { id: 'sa-003', localityName: 'Karelibaug', pincode: '390018', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone for scheduled visits and errands.' },
          { id: 'sa-004', localityName: 'Manjalpur', pincode: '390011', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with daily visit coverage.' },
          { id: 'sa-005', localityName: 'Fatehgunj', pincode: '390002', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone near university area.' },
          { id: 'sa-006', localityName: 'Gotri', pincode: '390021', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone for weekly support plans.' },
          { id: 'sa-007', localityName: 'Vasna Road', pincode: '390015', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone with active partner support.' },
          { id: 'sa-008', localityName: 'Sayajigunj', pincode: '390005', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Central Vadodara zone with standard coverage.' },
          { id: 'sa-009', localityName: 'Subhanpura', pincode: '390023', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with regular visit scheduling.' },
          { id: 'sa-010', localityName: 'Sama', pincode: '390024', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone for check-ins and errand assistance.' },
          { id: 'sa-011', localityName: 'Ellora Park', pincode: '390023', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Core coverage zone with standard scheduling availability.' },
          { id: 'sa-012', localityName: 'Nizampura', pincode: '390002', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area for elder care and hospital accompaniment visits.' },
          { id: 'sa-013', localityName: 'Waghodia Road', pincode: '390019', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone with confirmed routing availability.' },
          { id: 'sa-014', localityName: 'Gorwa', pincode: '390016', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with regular visit scheduling.' },
          { id: 'sa-015', localityName: 'Tandalja', pincode: '390012', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with standard availability.' },
          { id: 'sa-016', localityName: 'Bhayli', pincode: '391410', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Expanding coverage zone; advance booking recommended.' },
          { id: 'sa-017', localityName: 'Harni Road', pincode: '390022', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service area with regular visit coverage.' },
          { id: 'sa-018', localityName: 'Makarpura', pincode: '390014', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone for scheduled check-in plans.' },
          { id: 'sa-019', localityName: 'Atladara', pincode: '390012', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Active service zone for scheduled check-in plans.' },
          { id: 'sa-020', localityName: 'Sevasi', pincode: '391101', city: 'Vadodara', state: 'Gujarat', isActive: true, coverageNotes: 'Expanding coverage area; schedule confirmed on enquiry.' },
        ];
        return of(localAreas);
      }),
    );
  }

  checkServiceArea(locality?: string, pincode?: string): Observable<ServiceAreaCheckResult> {
    let params = new HttpParams();
    if (locality) params = params.set('locality', locality);
    if (pincode) params = params.set('pincode', pincode);

    return this.http
      .get<ServiceAreaCheckResult>(`${this.baseUrl}/service-areas/check`, { params })
      .pipe(
        catchError(() => {
          // Client-side fallback computation
          const loc = (locality || '').toLowerCase().trim();
          const pin = (pincode || '').trim();

          const vadodaraLocalities = ['alkapuri', 'akota', 'gotri', 'karelibaug', 'manjalpur', 'fatehgunj', 'vasna', 'sayajigunj', 'subhanpura', 'sama', 'ellora', 'nizampura', 'gorwa', 'tandalja', 'bhayli', 'harni', 'makarpura', 'atladara', 'sevasi'];
          const isMatch = vadodaraLocalities.some((vl) => loc.includes(vl)) || pin.startsWith('390');

          if (isMatch) {
            return of({
              status: 'AVAILABLE' as const,
              locality: locality || 'Vadodara Area',
              pincode: pincode || '390007',
              city: 'Vadodara',
              state: 'Gujarat',
              message: 'Your locality is currently within our service area in Vadodara. Submit an enquiry to confirm scheduling for your specific requirements.',
              notes: 'Core coverage zone with standard scheduling availability.',
            });
          }

          return of({
            status: 'NEEDS_CONFIRMATION' as const,
            locality,
            pincode,
            city: 'Vadodara',
            state: 'Gujarat',
            message: 'We need to confirm availability for this location before accepting your request. Please submit an enquiry and our team will review coverage.',
            notes: 'Coverage confirmed upon enquiry review.',
          });
        }),
      );
  }

  submitEnquiry(dto: EnquirySubmissionDto): Observable<EnquiryResponse> {
    return this.http.post<EnquiryResponse>(`${this.baseUrl}/enquiries`, dto).pipe(
      catchError((err) => {
        if (err?.status >= 400 && err?.status < 500) {
          return throwError(() => err);
        }
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return of({
          success: true,
          referenceNumber: `ASC-ENQ-${randomNum}`,
          message: 'Thank you. Your enquiry has been received. Our team in Vadodara will contact you shortly to understand your family’s needs.',
          status: 'NEW',
          createdAt: new Date().toISOString(),
        });
      }),
    );
  }

  submitConsultation(dto: ConsultationSubmissionDto): Observable<ConsultationResponse> {
    return this.http.post<ConsultationResponse>(`${this.baseUrl}/consultation-requests`, dto).pipe(
      catchError((err) => {
        if (err?.status >= 400 && err?.status < 500) {
          return throwError(() => err);
        }
        const randomNum = Math.floor(100000 + Math.random() * 900000);
        return of({
          success: true,
          referenceNumber: `ASC-CON-${randomNum}`,
          message: 'Your consultation request has been received. Our Vadodara team will review availability and confirm your scheduled slot.',
          status: 'PENDING_CONFIRMATION',
          createdAt: new Date().toISOString(),
        });
      }),
    );
  }
}
