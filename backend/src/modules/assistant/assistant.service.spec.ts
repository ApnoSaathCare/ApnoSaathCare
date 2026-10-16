import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AssistantService } from './assistant.service';
import { ServicePlansService } from '../service-plans/service-plans.service';
import { ServiceAreasService } from '../service-areas/service-areas.service';
import { PublicConfigService } from '../public-config/public-config.service';
import { ChatRole } from './dto/chat-request.dto';

describe('AssistantService', () => {
  let service: AssistantService;

  const mockPlans = [
    {
      id: 'sp-001',
      name: 'Family Check-in',
      slug: 'family-check-in',
      shortDescription: 'Gentle check-ins for parents living independently.',
      priceAmount: 1199,
      currencyCode: 'INR',
      billingPeriod: 'per month',
      inclusions: ['2 scheduled home visits', 'Wellbeing check'],
      exclusions: ['Medical nursing', 'Emergency response'],
      isPublished: true,
      displayOrder: 1,
    },
  ];

  const mockAreas = [
    {
      id: 'sa-001',
      localityName: 'Alkapuri',
      pincode: '390007',
      city: 'Vadodara',
      state: 'Gujarat',
      isActive: true,
      coverageNotes: 'Core coverage zone.',
    },
  ];

  const mockPublicConfig = {
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
    disclaimer: 'Non-clinical elder companion support.',
  };

  beforeEach(async () => {
    process.env.NODE_ENV = 'test';
    process.env.GEMINI_API_KEY = '';
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AssistantService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, defaultValue?: any) => {
              if (key === 'GEMINI_API_KEY') return '';
              if (key === 'GEMINI_MODEL') return 'gemini-2.5-flash';
              return defaultValue;
            },
          },
        },
        {
          provide: ServicePlansService,
          useValue: {
            findAllPublished: vi.fn().mockResolvedValue(mockPlans),
          },
        },
        {
          provide: ServiceAreasService,
          useValue: {
            findAllActive: vi.fn().mockResolvedValue(mockAreas),
          },
        },
        {
          provide: PublicConfigService,
          useValue: {
            getPublicConfig: vi.fn().mockReturnValue(mockPublicConfig),
          },
        },
      ],
    }).compile();

    service = module.get<AssistantService>(AssistantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getQuickPrompts', () => {
    it('should return welcome greeting and starter prompts', async () => {
      const res = await service.getQuickPrompts();
      expect(res.welcomeMessage).toContain('AapnoSaath Care');
      expect(res.welcomeMessage).toContain('Vadodara');
      expect(res.tagline).toBe('Close to Your Parents. Wherever You Are.');
      expect(res.prompts.length).toBeGreaterThanOrEqual(4);
    });
  });

  describe('chat emergency detection', () => {
    it('should immediately intercept emergency and medical threat queries', async () => {
      const res = await service.chat({
        messages: [
          {
            role: ChatRole.USER,
            content: 'My father has severe chest pain and cannot breathe, please help!',
          },
        ],
      });

      expect(res.detectedIntent).toBe('emergency');
      expect(res.reply).toContain('112');
      expect(res.reply).toContain('108');
      expect(res.actionCta?.type).toBe('emergency');
    });

    it('should intercept Gujarati emergency queries', async () => {
      const res = await service.chat({
        messages: [
          {
            role: ChatRole.USER,
            content: 'મારા પિતાજીને છાતીમાં દુખાવો થાય છે',
          },
        ],
      });

      expect(res.detectedIntent).toBe('emergency');
      expect(res.reply).toContain('112');
    });
  });

  describe('chat grounded fallback mode', () => {
    it('should answer plan pricing inquiries accurately from grounded data', async () => {
      const res = await service.chat({
        messages: [
          {
            role: ChatRole.USER,
            content: 'What care plans and pricing do you offer?',
          },
        ],
      });

      expect(res.detectedIntent).toBe('pricing');
      expect(res.reply).toContain('Family Check-in');
      expect(res.reply).toContain('1199');
      expect(res.actionCta?.targetUrl).toBe('/services');
    });

    it('should answer Vadodara service area inquiries', async () => {
      const res = await service.chat({
        messages: [
          {
            role: ChatRole.USER,
            content: 'Do you cover Alkapuri and Gotri in Vadodara?',
          },
        ],
      });

      expect(res.detectedIntent).toBe('service_area');
      expect(res.reply).toContain('Vadodara');
      expect(res.actionCta?.targetUrl).toBe('/service-areas');
    });

    it('should guide consultation inquiries', async () => {
      const res = await service.chat({
        messages: [
          {
            role: ChatRole.USER,
            content: 'How do I book a consultation?',
          },
        ],
      });

      expect(res.detectedIntent).toBe('consultation');
      expect(res.reply).toContain('Free Initial Consultation');
      expect(res.actionCta?.targetUrl).toBe('/consultation');
    });
  });
});
