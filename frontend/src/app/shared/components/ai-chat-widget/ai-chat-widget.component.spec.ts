import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AiChatWidgetComponent } from './ai-chat-widget.component';
import { ApiService } from '../../../core/services/api.service';

describe('AiChatWidgetComponent', () => {
  let component: AiChatWidgetComponent;
  let fixture: ComponentFixture<AiChatWidgetComponent>;
  let mockApiService: any;
  let mockRouter: any;

  beforeEach(async () => {
    mockApiService = {
      getAssistantQuickPrompts: vi.fn().mockReturnValue(
        of({
          welcomeMessage: 'Namaste! Welcome to AapnoSaath Care.',
          tagline: 'Close to Your Parents. Wherever You Are.',
          serviceArea: 'Vadodara, Gujarat',
          prompts: [
            { label: 'Care Plans', prompt: 'Tell me about care plans', icon: 'layers' },
          ],
        }),
      ),
      sendAssistantChat: vi.fn().mockReturnValue(
        of({
          reply: 'Here are our care plans in Vadodara.',
          suggestedActions: ['Book a Consultation', 'Check Areas'],
          detectedIntent: 'pricing',
          actionCta: {
            label: 'Book Free Consultation',
            targetUrl: '/consultation',
            type: 'consultation',
          },
          timestamp: new Date().toISOString(),
        }),
      ),
    };

    mockRouter = {
      navigateByUrl: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [AiChatWidgetComponent],
      providers: [
        { provide: ApiService, useValue: mockApiService },
        { provide: Router, useValue: mockRouter },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AiChatWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeDefined();
  });

  it('should toggle chat open and closed', () => {
    expect(component.isOpen).toBe(false);
    component.toggleChat();
    expect(component.isOpen).toBe(true);
    component.closeChat();
    expect(component.isOpen).toBe(false);
  });

  it('should send a message and append response', () => {
    component.userInput = 'What are your rates?';
    component.sendMessage();

    expect(mockApiService.sendAssistantChat).toHaveBeenCalled();
    expect(component.messages.length).toBeGreaterThanOrEqual(2);
    expect(component.messages[component.messages.length - 1].role).toBe('assistant');
  });

  it('should correctly format markdown bold and lists', () => {
    const raw = '**Vadodara** services:\n* Plan A\n* Plan B';
    const formatted = component.formatMarkdown(raw);
    const htmlString = (formatted as any)?.changingThisBreaksApplicationSecurity || String(formatted);
    expect(htmlString).toContain('<strong>Vadodara</strong>');
    expect(htmlString).toContain('<ul class="chat-list">');
    expect(htmlString).toContain('<li>Plan A</li>');
  });

  it('should navigate when handling action CTA', () => {
    component.handleActionCta({
      label: 'Book Consultation',
      targetUrl: '/consultation',
      type: 'consultation',
    });

    expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/consultation');
    expect(component.isOpen).toBe(false);
  });
});
