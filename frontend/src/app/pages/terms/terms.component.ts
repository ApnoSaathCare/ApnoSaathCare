import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-terms',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss'],
})
export class TermsComponent implements OnInit {
  lastUpdated = 'October 2026';

  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Terms of Service (Draft)',
      'Draft Terms of Service for AapnoSaath Care elder-care support in Vadodara, Gujarat. Subject to formal legal review prior to launch.',
    );
  }
}
