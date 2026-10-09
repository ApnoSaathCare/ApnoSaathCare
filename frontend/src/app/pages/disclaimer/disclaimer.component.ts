import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-disclaimer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './disclaimer.component.html',
  styleUrls: ['./disclaimer.component.scss'],
})
export class DisclaimerComponent implements OnInit {
  lastUpdated = 'October 2026';

  constructor(private readonly seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Non-Medical Service Disclaimer',
      'Non-medical elder care service disclaimer for AapnoSaath Care Vadodara, Gujarat. Explaining non-clinical scope and emergency procedures.',
    );
  }
}
