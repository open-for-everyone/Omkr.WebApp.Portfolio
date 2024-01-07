import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { trigger, transition, useAnimation } from '@angular/animations';
import { pulse } from 'ng-animate';

@Component({
  selector: 'app-oauth-button',
  templateUrl: './oauth-button.component.html',
  styleUrls: ['./oauth-button.component.css'],
  animations: [
    trigger('pulse', [
      transition(':enter', useAnimation(pulse, { params: { timing: 1 } })),
    ])
  ]
})
export class OauthButtonComponent {

  @Input() service = '';
  @Input() iconClass = '';
  @HostBinding('@pulse') pulse = true;
  @Output() loginRequested = new EventEmitter<string>();

  public login(event: Event): void {
    event.preventDefault(); // Prevent default anchor behavior
    console.log('Login requested for ' + this.service);
    this.loginRequested.emit(this.service);
  }
}
