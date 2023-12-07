import { Component,OnInit,Renderer2  } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  /**
   *
   */
  constructor(private renderer2:Renderer2) {

  }
  ngOnInit(): void {
    this.renderer2.setStyle(document.body,"background-color","#0a192f");
  }
}
