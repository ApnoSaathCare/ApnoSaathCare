import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { PublicConfig } from '../../../core/models/public-config.model';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  currentYear = new Date().getFullYear();
  config = signal<PublicConfig | null>(null);

  constructor(private readonly apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getPublicConfig().subscribe((cfg) => {
      this.config.set(cfg);
    });
  }
}
