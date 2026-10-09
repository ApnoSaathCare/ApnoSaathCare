import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-trust-safety',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './trust-safety.component.html',
  styleUrls: ['./trust-safety.component.scss'],
})
export class TrustSafetyComponent implements OnInit {
  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Trust & Safety Standards',
      'Learn about AapnoSaath Care’s verification standards, non-medical service boundaries, consent protocols, and safety measures for elderly parents in Vadodara.',
    );
  }
}
