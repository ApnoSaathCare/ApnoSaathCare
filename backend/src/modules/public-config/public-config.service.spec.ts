import { describe, it, expect } from 'vitest';
import { ConfigService } from '@nestjs/config';
import { PublicConfigService } from './public-config.service';

describe('PublicConfigService', () => {
  it('should return configured public settings with Vadodara defaults', () => {
    const mockConfig = new ConfigService({
      PUBLIC_ORG_NAME: 'AapnoSaath Care',
      PUBLIC_SERVICE_CITY: 'Vadodara',
    });
    const service = new PublicConfigService(mockConfig);

    const config = service.getPublicConfig();
    expect(config.orgName).toBe('AapnoSaath Care');
    expect(config.serviceCity).toBe('Vadodara');
    expect(config.tagline).toBe('Close to Your Parents. Wherever You Are.');
    expect(config.isPilotPricing).toBe(false);
    expect(config.disclaimer).toContain('hospital appointment accompaniment');
  });
});
