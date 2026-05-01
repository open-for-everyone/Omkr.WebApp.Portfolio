import { NgModule } from '@angular/core';
import { RouterModule, Routes, Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/general/not-found/not-found.component';
import { PrivacyPolicyComponent } from './components/general/legal/privacy-policy/privacy-policy.component';
import { TermsComponent } from './components/general/legal/terms/terms.component';
import { CookiePolicyComponent } from './components/general/legal/cookie-policy/cookie-policy.component';
import { DisclaimerComponent } from './components/general/legal/disclaimer/disclaimer.component';
import { filter, map, mergeMap } from 'rxjs/operators';
import { SeoService } from './services/general/seo.service';
import { RobotsComponent } from './components/general/robots/robots.component';
import { SitemapComponent } from './components/general/sitemap/sitemap.component';
import { ResumeComponent } from './components/general/resume/resume.component';
// import { MsalGuard } from '@azure/msal-angular';

const routes: Routes = [
  {
    path: '', component: HomeComponent, pathMatch: 'full', data: {
      title: 'Keshav Singh — Portfolio',
      description: 'Backend developer portfolio showcasing APIs, microservices, AWS, Azure DevOps and software engineering projects.'
    }
  },
  {
    path: 'privacy-policy', component: PrivacyPolicyComponent, data: {
      title: 'Privacy Policy — Keshav Singh',
      description: 'Read how personal data and analytics are handled on this portfolio website.'
    }
  },
  {
    path: 'terms', component: TermsComponent, data: {
      title: 'Terms & Conditions — Keshav Singh',
      description: 'Terms and conditions governing the use of this portfolio website.'
    }
  },
  {
    path: 'cookie-policy', component: CookiePolicyComponent, data: {
      title: 'Cookie Policy — Keshav Singh',
      description: 'Details on cookie usage, analytics consent and tracking preferences.'
    }
  },
  {
    path: 'disclaimer', component: DisclaimerComponent, data: {
      title: 'Disclaimer — Keshav Singh',
      description: 'General information disclaimer for content published on this site.'
    }
  },
  {
    path: 'robots', component: RobotsComponent, data: {
      title: 'Robots.txt — Keshav Singh',
      description: 'Human readable view of the robots.txt directives for this site.'
    }
  },
  { path: 'robots.txt', redirectTo: 'robots', pathMatch: 'full' },
  {
    path: 'sitemap', component: SitemapComponent, data: {
      title: 'Sitemap — Keshav Singh',
      description: 'Human readable list of indexed URLs for this site.'
    }
  },
  { path: 'sitemap.xml', redirectTo: 'sitemap', pathMatch: 'full' },
  {
    path: 'resume', component: ResumeComponent, data: {
      title: 'Resume — Keshav Singh',
      description: 'Printable resume highlighting experience, skills, education and key links.'
    }
  },
  { path: '404', component: NotFoundComponent, data: { title: 'Page Not Found — Keshav Singh', description: 'The page you are looking for could not be found.' } },
  { path: '**', redirectTo: '/404', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
  constructor(router: Router, activatedRoute: ActivatedRoute, seo: SeoService) {
    router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(() => activatedRoute),
      map(route => {
        while (route.firstChild) route = route.firstChild;
        return route;
      }),
      filter(route => route.outlet === 'primary'),
      mergeMap(route => route.data)
    ).subscribe(data => {
      if (data) {
        seo.update({
          title: data['title'],
          description: data['description'],
          canonicalUrl: 'https://keshavsingh.in' + router.url
        });
      }
    });
  }
}
