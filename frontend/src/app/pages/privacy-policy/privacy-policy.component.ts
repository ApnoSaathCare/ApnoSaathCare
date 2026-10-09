import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss'],
})
export class PrivacyPolicyComponent implements OnInit {
  lastUpdated = 'October 2026';

  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Privacy Policy (Draft)',
      'Draft Privacy Policy for AapnoSaath Care elder-care support in Vadodara, Gujarat. Subject to formal legal review prior to commercial launch.',
    );
  }
}
