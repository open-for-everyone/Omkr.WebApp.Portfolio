import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideCommonTestServices } from 'src/testing/test-support';
import { AppComponent } from './app.component';

/**
 * Smoke tests for the app shell.
 *
 * What was here before was the untouched Angular CLI scaffold: it asserted the title equals
 * `'Omkr.WebApp.Portfolio'` (the component has said `'Keshav Singh Portfolio'` for as long as it has
 * existed) and looked for a `.content span` reading "app is running!", which no version of this
 * template ever rendered. Both failed.
 *
 * `NO_ERRORS_SCHEMA` because the shell composes a dozen child components that are declared by
 * AppModule; this spec is about the shell itself, not about them.
 */
describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [provideCommonTestServices()],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders a single main landmark with the skip-link target', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const mains = compiled.querySelectorAll('main');

    expect(mains.length).toBe(1);
    expect(mains[0].id).toBe('main-content');
  });

  it('puts the skip link first so it is the first tab stop', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const skip = compiled.querySelector('a.skip-link');

    expect(skip).toBeTruthy();
    expect(skip?.getAttribute('href')).toBe('#main-content');
  });
});
