import { animate, query, state, stagger, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedinIn, faTwitter, faInstagram, faYoutube, faFacebookF, faStackOverflow } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faUser } from '@fortawesome/free-solid-svg-icons';
import { AnalyticService } from 'src/app/services/Analytics/analytic.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css'],
  animations: [
    trigger("animateFooter", [
      transition(":enter", [
        query("*", [
          style({ opacity: 0, transform: "translateY(100%)" }),
          stagger(50, [
            animate(
              "250ms cubic-bezier(0.35, 0, 0.25, 1)",
              style({ opacity: 1, transform: "none" })
            )
          ])
        ])
      ])
    ])
  ]
})

export class FooterComponent implements OnInit {
  state: unknown;

  constructor(public analyticsService: AnalyticService, private library: FaIconLibrary) {
    this.state = state; // Initialize the state property
    // Add the user icon to the library so it can be used in the template
    library.addIcons(faUser);
    library.addIcons(faGithub);
    library.addIcons(faLinkedinIn);
    library.addIcons(faEnvelope);
    library.addIcons(faTwitter);
    library.addIcons(faInstagram);
    library.addIcons(faYoutube);
    library.addIcons(faFacebookF);
    library.addIcons(faStackOverflow);
  }

  ngOnInit(): void {
    // hi
    console.log("Footer initialized.");
  }
}
