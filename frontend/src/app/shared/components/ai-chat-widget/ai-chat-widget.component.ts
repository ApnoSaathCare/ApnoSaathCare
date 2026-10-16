import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  AfterViewChecked,
  ChangeDetectorRef,
  NgZone,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../core/services/api.service';
import {
  ChatMessage,
  QuickPromptsResponse,
  QuickPromptItem,
  ActionCta,
} from '../../../core/models/assistant.model';

export interface StarterCard {
  icon: string;
  title: string;
  badge?: string;
  desc: string;
  prompt: string;
}

@Component({
  selector: 'app-ai-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-chat-widget.component.html',
  styleUrls: ['./ai-chat-widget.component.scss'],
})
export class AiChatWidgetComponent implements OnInit, OnDestroy, AfterViewChecked {
  private readonly apiService = inject(ApiService);
  private readonly router = inject(Router);
  private readonly sanitizer = inject(DomSanitizer);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);

  @ViewChild('messagesContainer') private messagesContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('messageInput') private messageInput!: ElementRef<HTMLInputElement | HTMLTextAreaElement>;

  isOpen = false;
  isLoading = false;
  hasUnread = false;
  userInput = '';
  selectedLanguage: 'en' | 'gu' | 'hi' = 'en';

  quickPromptsData: QuickPromptsResponse | null = null;
  messages: ChatMessage[] = [];
  suggestedActions: string[] = [
    'What care plans do you offer?',
    'Do you cover Gotri & Alkapuri?',
    'Book a free consultation',
  ];

  quickActions = [
    {
      id: 'question',
      label: 'Ask a question',
      type: 'focus',
    },
    {
      id: 'areas',
      label: 'Check Vadodara localities & pincodes',
      prompt: 'Which localities and PIN codes in Vadodara do you cover?',
      type: 'send',
    },
    {
      id: 'plans',
      label: 'Explore monthly care plans',
      prompt: 'What care plans and pricing are available for elderly parents in Vadodara?',
      type: 'send',
    },
    {
      id: 'consultation',
      label: 'Arrange a free consultation',
      prompt: 'How do I arrange a free consultation for my parents?',
      type: 'send',
    },
  ];

  starterCards: StarterCard[] = [
    {
      icon: 'heart',
      title: 'Monthly Check-in',
      badge: '₹1,199/mo',
      desc: '2 scheduled visits, summaries & wellbeing check',
      prompt: 'Tell me about the Family Check-in plan and what it includes.',
    },
    {
      icon: 'calendar',
      title: 'Doctor Visits',
      badge: 'Popular',
      desc: 'Safe companion escort for clinic visits & check-ups',
      prompt: 'How does accompaniment for doctor appointments work?',
    },
    {
      icon: 'map-pin',
      title: 'Vadodara Areas',
      badge: '20+ Localities',
      desc: 'Alkapuri, Akota, Gotri, Manjalpur, Karelibaug...',
      prompt: 'Which localities and PIN codes in Vadodara do you cover?',
    },
    {
      icon: 'users',
      title: 'Free Consultation',
      badge: 'Zero Commitment',
      desc: 'Discuss care needs directly with our Vadodara team',
      prompt: 'How do I arrange a free consultation for my parents?',
    },
  ];

  private subscriptions = new Subscription();
  private shouldScrollToBottom = false;
  private readonly storageKey = 'aapnosaath_assistant_history_v2';

  ngOnInit(): void {
    this.loadSavedHistory();
    this.fetchQuickPrompts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.hasUnread = false;
      this.cdr.detectChanges();
      this.scrollToBottom();
      setTimeout(() => {
        this.messageInput?.nativeElement?.focus();
      }, 150);
    }
  }

  closeChat(): void {
    this.isOpen = false;
  }

  selectLanguage(lang: 'en' | 'gu' | 'hi'): void {
    this.selectedLanguage = lang;
    if (lang === 'gu') {
      this.sendPrompt('નમસ્તે, વડોદરામાં માતા-પિતાની સંભાળ માટે તમારી સેવાઓ અને ચાર્જ વિશે ગુજરાતીમાં માહિતી આપો.');
    } else if (lang === 'hi') {
      this.sendPrompt('नमस्ते, वડોदरा में बुजुर्ग माता-पिता की देखभाल के लिए आपकी सेवाओं की जानकारी दें।');
    }
  }

  sendPrompt(promptText: string): void {
    this.userInput = promptText;
    this.sendMessage();
  }

  onQuickActionClick(action: { type: string; prompt?: string }): void {
    if (action.type === 'focus') {
      this.focusInput();
    } else if (action.prompt) {
      this.sendPrompt(action.prompt);
    }
  }

  focusInput(): void {
    setTimeout(() => {
      this.messageInput?.nativeElement?.focus();
    }, 80);
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    } else if (event.key === 'Escape') {
      this.closeChat();
    }
  }

  sendMessage(): void {
    const text = this.userInput.trim();
    if (!text || this.isLoading) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    // Immutably append user message
    this.messages = [...this.messages, userMessage];
    this.userInput = '';
    this.isLoading = true;
    this.suggestedActions = [];
    this.saveHistory();
    this.cdr.detectChanges();
    this.scrollToBottom();

    // Prepare payload (max 10 recent messages for conversation context)
    const historyPayload = this.messages.slice(-10).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const sub = this.apiService
      .sendAssistantChat({ messages: historyPayload })
      .subscribe({
        next: (res) => {
          this.ngZone.run(() => {
            this.isLoading = false;
            const assistantMessage: ChatMessage = {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content: res.reply,
              timestamp: res.timestamp,
              suggestedActions: res.suggestedActions,
              actionCta: res.actionCta,
              detectedIntent: res.detectedIntent,
            };
            this.messages = [...this.messages, assistantMessage];
            this.suggestedActions = res.suggestedActions || [
              'Book a Free Consultation',
              'Check Vadodara Coverage',
              'View Care Plans',
            ];
            this.saveHistory();
            if (!this.isOpen) {
              this.hasUnread = true;
            }
            this.cdr.detectChanges();
            this.scrollToBottom();
          });
        },
        error: () => {
          this.ngZone.run(() => {
            this.isLoading = false;
            const errorMessage: ChatMessage = {
              id: `msg-${Date.now()}`,
              role: 'assistant',
              content:
                'Thank you for reaching out. We could not complete your request at this exact moment. Please feel free to call our Vadodara team at **+91 8780791723** or submit a consultation request.',
              timestamp: new Date().toISOString(),
              suggestedActions: ['Book a Free Consultation', 'View Care Plans'],
              actionCta: {
                label: 'Book Free Consultation',
                targetUrl: '/consultation',
                type: 'consultation',
              },
            };
            this.messages = [...this.messages, errorMessage];
            this.saveHistory();
            this.cdr.detectChanges();
            this.scrollToBottom();
          });
        },
      });

    this.subscriptions.add(sub);
  }

  clearConversation(): void {
    this.messages = [];
    this.suggestedActions = [];
    try {
      sessionStorage.removeItem(this.storageKey);
    } catch {
      // Ignore sessionStorage exceptions
    }
    this.initWelcomeMessage();
    this.cdr.detectChanges();
  }

  handleActionCta(cta: ActionCta): void {
    if (cta.targetUrl.startsWith('tel:')) {
      window.location.href = cta.targetUrl;
      return;
    }

    this.closeChat();
    this.router.navigateByUrl(cta.targetUrl);
  }

  formatMarkdown(content: string): SafeHtml {
    if (!content) return '';

    // Sanitize basic HTML tags to prevent XSS
    let escaped = content
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    // Markdown bold **text**
    escaped = escaped.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // Markdown italics *text*
    escaped = escaped.replace(/(^|[^*])\*(?!\*)(.*?)\*/g, '$1<em>$2</em>');

    // Bullet lists: Convert lines starting with * or - to styled list items
    const lines = escaped.split('\n');
    let inList = false;
    const formattedLines: string[] = [];

    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed.startsWith('* ') || trimmed.startsWith('- ')) {
        if (!inList) {
          formattedLines.push('<ul class="chat-list">');
          inList = true;
        }
        formattedLines.push(`<li>${trimmed.substring(2)}</li>`);
      } else {
        if (inList) {
          formattedLines.push('</ul>');
          inList = false;
        }
        if (trimmed) {
          formattedLines.push(`<p class="chat-p">${trimmed}</p>`);
        }
      }
    }

    if (inList) {
      formattedLines.push('</ul>');
    }

    return this.sanitizer.bypassSecurityTrustHtml(formattedLines.join(''));
  }

  private fetchQuickPrompts(): void {
    const sub = this.apiService.getAssistantQuickPrompts().subscribe({
      next: (data) => {
        this.quickPromptsData = data;
        if (this.messages.length === 0) {
          this.initWelcomeMessage();
        }
      },
      error: () => {
        if (this.messages.length === 0) {
          this.initWelcomeMessage();
        }
      },
    });
    this.subscriptions.add(sub);
  }

  get hasStartedConversation(): boolean {
    return this.messages.length > 0;
  }

  private initWelcomeMessage(): void {
    this.messages = [];
    this.suggestedActions = [
      'What care plans do you offer?',
      'Which areas in Vadodara do you cover?',
      'Book a free consultation',
    ];
  }

  private loadSavedHistory(): void {
    try {
      const saved = sessionStorage.getItem(this.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.messages = parsed;
          const lastMsg = this.messages[this.messages.length - 1];
          if (lastMsg?.suggestedActions) {
            this.suggestedActions = lastMsg.suggestedActions;
          }
        }
      }
    } catch {
      // Fallback if sessionStorage is disabled
    }
  }

  private saveHistory(): void {
    try {
      // Store up to 25 recent messages
      const toSave = this.messages.slice(-25);
      sessionStorage.setItem(this.storageKey, JSON.stringify(toSave));
    } catch {
      // Ignore storage quota errors
    }
  }

  private scrollToBottom(): void {
    this.doScroll();
    setTimeout(() => this.doScroll(), 40);
    setTimeout(() => this.doScroll(), 120);
  }

  private doScroll(): void {
    try {
      if (this.messagesContainer?.nativeElement) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch {
      // Ignore scroll calculation errors
    }
  }
}
