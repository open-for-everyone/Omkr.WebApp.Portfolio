/// <reference types="@angular/localize" />

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

function dismissBootLoader(): void {
  const el = document.getElementById('boot-loader');
  const style = document.getElementById('boot-loader-style');
  document.documentElement.classList.remove('pf-light-boot');
  if (el) {
    el.classList.add('boot-hide');
    setTimeout(() => {
      el.remove();
      style?.remove();
    }, 240);
  } else {
    style?.remove();
  }
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .then(() => dismissBootLoader())
  .catch(err => {
    dismissBootLoader();
    console.error(err);
  });
