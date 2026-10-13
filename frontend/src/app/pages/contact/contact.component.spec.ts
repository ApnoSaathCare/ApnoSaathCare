import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { ContactComponent } from './contact.component';

describe('ContactComponent', () => {
  let component: ContactComponent;
  let fixture: ComponentFixture<ContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create contact component', () => {
    expect(component).toBeTruthy();
  });

  it('should validate enquiry form required fields', () => {
    expect(component.enquiryForm.valid).toBeFalsy();

    component.enquiryForm.patchValue({
      fullName: 'Manoj Patel',
      email: 'rahul@example.com',
      phone: '+91 98765 43210',
      relationshipToParent: 'Son',
      parentLocality: 'Alkapuri',
      serviceOfInterest: 'regular-support',
      contactConsent: true,
    });

    expect(component.enquiryForm.valid).toBeTruthy();
  });

  it('should validate consultation form required fields', () => {
    expect(component.consultationForm.valid).toBeFalsy();

    component.consultationForm.patchValue({
      fullName: 'Ananya Patel',
      email: 'ananya@example.com',
      phone: '+91 91234 56789',
      preferredDate: component.minDate,
      preferredTimeWindow: 'Morning (9:00 AM - 12:00 PM IST)',
      consultationMethod: 'PHONE',
    });

    expect(component.consultationForm.valid).toBeTruthy();
  });

  it('should invalidate past date for consultation preferredDate', () => {
    component.consultationForm.get('preferredDate')?.setValue('2020-01-01');
    expect(component.consultationForm.get('preferredDate')?.hasError('pastDate')).toBe(true);
    expect(component.consultationForm.get('preferredDate')?.valid).toBe(false);

    component.consultationForm.get('preferredDate')?.setValue(component.minDate);
    expect(component.consultationForm.get('preferredDate')?.valid).toBe(true);
  });
});
