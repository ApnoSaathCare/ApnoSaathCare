import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiService, provideHttpClient()],
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default services list on fallback', async () => {
    const plans = await firstValueFrom(service.getServices());
    expect(plans.length).toBeGreaterThanOrEqual(3);
    expect(plans[0].name).toBe('Family Check-in');
  });

  it('should check service area and match Alkapuri', async () => {
    const res = await firstValueFrom(service.checkServiceArea('Alkapuri', '390007'));
    expect(res.status).toBe('AVAILABLE');
    expect(res.city).toBe('Vadodara');
  });
});
