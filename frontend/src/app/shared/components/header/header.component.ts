import { Component, HostListener, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  isMobileMenuOpen = signal(false);
  isScrolled = signal(false);

  constructor(private readonly router: Router) {
    // Close mobile menu on page navigation
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        this.isMobileMenuOpen.set(false);
      });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu() {
    const next = !this.isMobileMenuOpen();
    this.isMobileMenuOpen.set(next);
    if (typeof document !== 'undefined') {
      document.body.classList.toggle('menu-open', next);
    }
  }

  closeMobileMenu() {
    this.isMobileMenuOpen.set(false);
    if (typeof document !== 'undefined') {
      document.body.classList.remove('menu-open');
    }
  }
}
