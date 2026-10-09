import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})
export class SeoService {
  private readonly defaultTitle = 'AapnoSaath Care — Close to Your Parents. Wherever You Are.';
  private readonly defaultDescription =
    'Non-medical elder-care support and family-coordination service in Vadodara, Gujarat. Scheduled check-ins, errands, appointment accompaniment, and consent-based family updates.';

  constructor(
    private readonly titleService: Title,
    private readonly metaService: Meta,
  ) {}

  updateTitleAndMeta(title?: string, description?: string): void {
    const fullTitle = title ? `${title} | AapnoSaath Care` : this.defaultTitle;
    const desc = description || this.defaultDescription;

    this.titleService.setTitle(fullTitle);
    this.metaService.updateTag({ name: 'description', content: desc });
    this.metaService.updateTag({ property: 'og:title', content: fullTitle });
    this.metaService.updateTag({ property: 'og:description', content: desc });
  }
}
