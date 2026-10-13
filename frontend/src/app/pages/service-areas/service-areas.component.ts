import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { SeoService } from '../../core/services/seo.service';
import { ServiceArea } from '../../core/models/service-area.model';
import { AreaCheckerComponent } from '../../shared/components/area-checker/area-checker.component';

@Component({
  selector: 'app-service-areas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, AreaCheckerComponent],
  templateUrl: './service-areas.component.html',
  styleUrls: ['./service-areas.component.scss'],
})
export class ServiceAreasComponent implements OnInit {
  areas = signal<ServiceArea[]>([]);
  searchQuery = signal('');
  isLoading = signal(true);

  filteredAreas = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.areas();
    return this.areas().filter(
      (a) =>
        a.localityName.toLowerCase().includes(q) ||
        (a.pincode && a.pincode.includes(q)) ||
        (a.coverageNotes && a.coverageNotes.toLowerCase().includes(q)),
    );
  });

  constructor(
    private readonly apiService: ApiService,
    private readonly seoService: SeoService,
  ) {}

  ngOnInit(): void {
    this.seoService.updateTitleAndMeta(
      'Vadodara Service Areas',
      'Check elder care and hospital appointment accompaniment coverage across Vadodara localities including Alkapuri, Akota, Gotri, Manjalpur, Fatehgunj, Karelibaug, and more.',
    );

    this.apiService.getServiceAreas().subscribe({
      next: (data) => {
        this.areas.set(data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }
}
