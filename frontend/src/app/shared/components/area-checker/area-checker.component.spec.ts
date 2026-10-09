import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AreaCheckerComponent } from './area-checker.component';

describe('AreaCheckerComponent', () => {
  let component: AreaCheckerComponent;
  let fixture: ComponentFixture<AreaCheckerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AreaCheckerComponent],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AreaCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check area when button or quick area is clicked', () => {
    component.checkArea('Gotri');
    expect(component.localityInput).toBe('Gotri');
    expect(component.checkResult).toBeDefined();
  });
});
