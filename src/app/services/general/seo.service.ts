import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoData {
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  image?: string;
  type?: string; // og:type
}

@Injectable({ providedIn: 'root' })
export class SeoService {
  private default: Required<Pick<SeoData, 'image' | 'type'>> = {
    image: 'https://keshavsingh.net/assets/images/keshav-singh-portfolio-preview.png',
    type: 'website'
  };

  constructor(private meta: Meta, private title: Title, @Inject(DOCUMENT) private doc: Document) { }

  update(data: SeoData) {
    if (data.title) {
      this.title.setTitle(data.title);
      this.setTag('og:title', data.title, true);
      this.setTag('twitter:title', data.title, true);
    }
    if (data.description) {
      this.setNameTag('description', data.description);
      this.setTag('og:description', data.description, true);
      this.setTag('twitter:description', data.description, true);
    }
    if (data.keywords) {
      this.setNameTag('keywords', data.keywords);
    }
    const image = data.image || this.default.image;
    this.setTag('og:image', image, true);
    this.setTag('twitter:image', image, true);
    const type = data.type || this.default.type;
    this.setTag('og:type', type, true);

    if (data.canonicalUrl) {
      this.setCanonical(data.canonicalUrl);
    }
  }

  private setNameTag(name: string, content: string) {
    const tag = this.meta.getTag(`name='${name}'`);
    if (tag) {
      this.meta.updateTag({ name, content });
    } else {
      this.meta.addTag({ name, content });
    }
  }

  private setTag(property: string, content: string, isProperty = false) {
    const attr = isProperty ? 'property' : 'name';
    const selector = `${attr}='${property}'`;
    const tag = this.meta.getTag(selector);
    if (tag) {
      this.meta.updateTag({ [attr]: property, content });
    } else {
      this.meta.addTag({ [attr]: property, content });
    }
  }

  private setCanonical(url: string) {
    let linkEl: HTMLLinkElement | null = this.doc.querySelector("link[rel='canonical']");
    if (!linkEl) {
      linkEl = this.doc.createElement('link');
      linkEl.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(linkEl);
    }
    linkEl.setAttribute('href', url);
  }
}
