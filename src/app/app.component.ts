import { Component, HostListener, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { CommandPaletteComponent, CommandItem } from './components/general/command-palette/command-palette.component';
import { environment } from 'src/environments/environment';


import { VisitorDetail } from './models/admin/visitor/visitor-detail';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Keshav Singh Portfolio';
  showBackToTop = false;
  paletteOpen = false;
  // Side dock state
  showQuickLinks = false;
  quickLinks = [
    { label: 'Home', targetId: 'homeHeader', icon: 'home' },
    { label: 'About', targetId: 'about', icon: 'person' },
    { label: 'Skills', targetId: 'skills', icon: 'psychology' },
    { label: 'Experience', targetId: 'experience', icon: 'work' },
    { label: 'Projects', targetId: 'projects', icon: 'apps' },
    { label: 'Contact', targetId: 'contact', icon: 'mail' },
    { label: 'Blog', href: environment.blogUrl, icon: 'article' },
    { label: 'Admin', href: environment.adminUrl, icon: 'admin_panel_settings' },
  ];
  confetti = false;
  private konamiIndex = 0;
  private readonly konami = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  visitorData: VisitorDetail={
    userAgent: '',
    browserName: '',
    browserVersion: '',
    cookiesEnabled: false,
    platform: '',
    language: ''
  };

  @ViewChild(CommandPaletteComponent) palette?: CommandPaletteComponent;

  constructor(private titleService: Title,
    private metaService: Meta,
    private translateService: TranslateService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute) {
    translateService.setDefaultLang('en');
    // or
    translateService.use('en');

    this.visitorData = this.getVisitorInfo();
  }

  getVisitorInfo(): VisitorDetail {
    return {
      userAgent: navigator.userAgent,
      browserName: navigator.appName,
      browserVersion: navigator.appVersion,
      cookiesEnabled: navigator.cookieEnabled,
      platform: navigator.platform,
      language: navigator.language,
    };
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Toggle back-to-top visibility on scroll
  onWindowScroll = () => {
    this.showBackToTop = (window.scrollY || document.documentElement.scrollTop) > 400;
  };

  ngOnInit(): void {
    // Update title from route data on navigation
    const appTitle = 'Keshav Singh — Portfolio';
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let child = this.route.firstChild;
        while (child?.firstChild) {
          child = child.firstChild;
        }
        const routeTitle = child?.snapshot.data?.['title'] as string | undefined;
        this.titleService.setTitle(routeTitle || appTitle);
      }
    });
    window.addEventListener('scroll', this.onWindowScroll, { passive: true });

    // Initialize command palette items after first tick
    setTimeout(() => {
      const items: CommandItem[] = [
        { id:'home', label:'Go: Home', action: () => window.scrollTo({ top:0, behavior:'smooth' }) },
        { id:'about', label:'Go: About', action: () => document.getElementById('about')?.scrollIntoView({ behavior:'smooth' }) },
        { id:'experience', label:'Go: Experience', action: () => document.getElementById('experience')?.scrollIntoView({ behavior:'smooth' }) },
        { id:'contact', label:'Go: Contact', action: () => document.getElementById('contact')?.scrollIntoView({ behavior:'smooth' }) },
        { id:'blog', label:'Open Blog', hint: environment.blogUrl, action: () => window.open(environment.blogUrl, '_blank') },
        { id:'admin', label:'Open Admin', hint: environment.adminUrl, action: () => window.open(environment.adminUrl, '_blank') },
        { id:'resume', label:'Download Resume', action: () => document.querySelector('app-header a[title="resume"]')?.dispatchEvent(new MouseEvent('click', { bubbles:true })) },
        { id:'github', label:'Open GitHub', hint: 'github.com/keshavsingh4522', action: () => window.open('https://github.com/keshavsingh4522', '_blank') },
      ];
      this.palette?.setCommands(items);
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.onWindowScroll);
  }

  // Keyboard shortcuts: Ctrl+K or /
  @HostListener('document:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent){
    const isMac = navigator.platform.toUpperCase().includes('MAC');
    const ctrlOrCmd = isMac ? ev.metaKey : ev.ctrlKey;
    if((ctrlOrCmd && ev.key.toLowerCase() === 'k') || (!this.paletteOpen && ev.key === '/')){
      this.paletteOpen = !this.paletteOpen;
      ev.preventDefault();
    }

    // Konami code
    const expected = this.konami[this.konamiIndex];
    if(ev.key.toLowerCase() === expected.toLowerCase()){
      this.konamiIndex++;
      if(this.konamiIndex === this.konami.length){
        this.triggerConfetti();
        this.konamiIndex = 0;
      }
    } else {
      this.konamiIndex = 0;
    }
  }

  private triggerConfetti(){
    this.confetti = true;
    setTimeout(()=> this.confetti = false, 10000);
  }
}
