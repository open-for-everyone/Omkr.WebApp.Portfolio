import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Input, Output, ViewChild } from '@angular/core';

export type QuickLink = { label: string; targetId?: string; href?: string; icon?: string };

@Component({
  selector: 'app-quick-links-rail',
  templateUrl: './quick-links-rail.component.html',
  styleUrls: ['./quick-links-rail.component.css']
})
export class QuickLinksRailComponent implements AfterViewInit {
  @Input() links: QuickLink[] = [];
  @Input() show = false;
  @Output() showChange = new EventEmitter<boolean>();

  @ViewChild('scroller', { static: true }) scroller!: ElementRef<HTMLDivElement>;

  canScrollLeft = false;
  canScrollRight = false;

  ngAfterViewInit(): void { this.updateScrollButtons(); }

  toggle(){
    this.show = !this.show; this.showChange.emit(this.show);
  }

  @HostListener('window:resize') onResize(){ this.updateScrollButtons(); }
  onScroll(){ this.updateScrollButtons(); }

  private updateScrollButtons(){
    const el = this.scroller?.nativeElement;
    if(!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    this.canScrollLeft = scrollLeft > 0;
    this.canScrollRight = scrollLeft + clientWidth < scrollWidth - 1;
  }

  scrollBy(dx: number){
    this.scroller.nativeElement.scrollBy({ left: dx, behavior: 'smooth' });
  }

  navigate(link: QuickLink){
    if(link.href){ window.open(link.href, '_blank', 'noopener'); return; }
    if(link.targetId){ document.getElementById(link.targetId)?.scrollIntoView({ behavior: 'smooth' }); }
  }
}
