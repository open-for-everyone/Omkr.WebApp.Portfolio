import { Component, EventEmitter, Input, Output } from '@angular/core';
import type { QuickLink } from '../quick-links-rail/quick-links-rail.component';

@Component({
  selector: 'app-side-dock',
  templateUrl: './side-dock.component.html',
  styleUrls: ['./side-dock.component.css']
})
export class SideDockComponent {
  @Input() side: 'left'|'right' = 'right';
  @Input() links: QuickLink[] = [];
  @Input() showLinks = false;
  @Output() showLinksChange = new EventEmitter<boolean>();

  toggleLinks(){
    this.showLinks = !this.showLinks;
    this.showLinksChange.emit(this.showLinks);
  }
}
