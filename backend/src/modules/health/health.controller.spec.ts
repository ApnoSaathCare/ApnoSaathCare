import { describe, it, expect, beforeEach } from 'vitest';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  let controller: HealthController;

  beforeEach(() => {
    controller = new HealthController();
  });

  it('should return ok health status', () => {
    const result = controller.check();
    expect(result.status).toBe('ok');
    expect(result.service).toBe('AapnoSaath Care API');
    expect(result.version).toBe('1.0.0');
    expect(result.timestamp).toBeDefined();
  });
});
