import { Injectable } from '@angular/core';
import { DictionaryEnglish } from '../../locales/dictionary_english';
import { DictionaryHebrew } from '../../locales/dictionary_hebrew';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  lang = 'en';
  dir = 'ltr';
  browserLang: string; 
  isRightToLeft = false;
  dictionary = DictionaryEnglish;
  backArrow = 'arrow-back-outline';

  constructor() {
  }

  getBrowserLang(): string {
    try {
      this.browserLang = navigator.language;
      console.log('browser lang:', this.browserLang);
    } catch (error) {
      console.error(error);
    }
    return this.browserLang;
  }

  setDefaultLang() {
    const lang = this.getBrowserLang();
    this.setLang(lang);
  }

  setLang(lang: string) {
    this.lang = lang;
    // this.setCountry('IL', 'Israel');

    try {
      const html = document.getElementsByTagName('html')[0];
      const body = document.getElementsByTagName('body')[0];
      html.setAttribute('lang', lang);

      if (lang === 'he') {
        body.setAttribute('dir', 'rtl');
        this.isRightToLeft = true;
      } else {
        body.setAttribute('dir', 'ltr');
        this.isRightToLeft = false;
      }
    } catch (error) {
      console.error(error);
    }

    this.dictionary = this.isRightToLeft ? DictionaryHebrew : DictionaryEnglish;
    this.dir = this.isRightToLeft ? 'rtl' : 'ltr';
    this.backArrow = this.isRightToLeft ? 'arrow-forward-outline' : this.backArrow;
   }
}
