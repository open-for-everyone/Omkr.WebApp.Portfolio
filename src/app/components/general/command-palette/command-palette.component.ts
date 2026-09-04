import { Component, EventEmitter, HostListener, Input, Output, ElementRef, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

export interface CommandItem {
  id: string;
  label: string;
  hint?: string;
  action: () => void;
}

@Component({
  standalone: false,
  selector: 'app-command-palette',
  templateUrl: './command-palette.component.html',
  styleUrls: ['./command-palette.component.css']
})
export class CommandPaletteComponent implements OnChanges {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();
  @ViewChild('commandInput') commandInput?: ElementRef<HTMLInputElement>;

  private lastFocused?: HTMLElement | null;

  query = '';
  activeIndex = 0;
  items: CommandItem[] = [];

  setCommands(items: CommandItem[]) {
    this.items = items;
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes['open'] && this.open){
      this.lastFocused = document.activeElement as HTMLElement;
      setTimeout(()=> this.commandInput?.nativeElement.focus(), 0);
    }
  }

  get filtered() {
    const q = this.query.toLowerCase().trim();
    if (!q) return this.items;
    return this.items.filter(i => i.label.toLowerCase().includes(q) || (i.hint||'').toLowerCase().includes(q));
  }

  /** Closes only when the backdrop itself was clicked, not a descendant of the panel. */
  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }

  close(){
    this.open = false;
    this.openChange.emit(this.open);
    // restore focus if possible
    if(this.lastFocused && typeof this.lastFocused.focus === 'function'){
      setTimeout(()=> this.lastFocused?.focus(), 0);
    }
  }

  select(index: number){
    const list = this.filtered;
    if(index < 0 || index >= list.length) return;
    list[index].action();
    this.close();
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(ev: KeyboardEvent){
    if(!this.open) return;
    if(ev.key === 'Escape'){ this.close(); }
    else if(ev.key === 'Enter'){ this.select(this.activeIndex); ev.preventDefault(); }
    else if(ev.key === 'ArrowDown'){ this.activeIndex = Math.min(this.activeIndex+1, this.filtered.length-1); ev.preventDefault(); }
    else if(ev.key === 'ArrowUp'){ this.activeIndex = Math.max(this.activeIndex-1, 0); ev.preventDefault(); }
  }
}
