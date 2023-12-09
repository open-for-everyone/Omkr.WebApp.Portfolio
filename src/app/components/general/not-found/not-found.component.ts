import { Component, OnInit, Renderer2 } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.css']
})
export class NotFoundComponent implements OnInit {

  /**
   *
   */
  constructor(private renderer2: Renderer2,private location: Location) {

  }
  ngOnInit(): void {
    this.renderer2.setStyle(document.body, "background-color", "#0a192f");
    this.renderer2.setStyle(document.body, "overflow", "hidden");

  }
  goBack(): void {
    this.location.back();
  }
}
