import { Injectable } from '@angular/core';
import { DictionaryEnglish } from '../../locales/dictionary_english';
import { DictionaryHebrew } from '../../locales/dictionary_hebrew';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  lang = 'en';
  dir = 'ltr';
  isRightToLeft = false;
  dictionary = DictionaryEnglish;
  backArrow = 'arrow-back-outline';
  canShowToggleLangButton = true;
  preferHeb = false;

  constructor() {
  }

  isBrowserSupportHeb(): boolean {
    this.preferHeb = false;
    try {
      const langs = navigator.languages;
      if (langs[0].includes('he')) this.preferHeb = true;
      return langs.findIndex(l => l.includes('he')) > -1;
    } catch (error) {
      console.error(error);
    }
    return false;
  }

  setDefaultLang() {
    try {
      let lang = localStorage.getItem('lang');
      const supportHeb = this.isBrowserSupportHeb();
      if (!lang && this.preferHeb) lang = 'he';
      if (lang !== 'en' && lang !== 'he') lang = 'en';
      // this.canShowToggleLangButton = supportHeb || lang === 'he';
      this.setLang(lang);
    } catch (error) {
      console.error(error);
    }
  }

  toggleLang() {
    const lang = this.lang === 'en' ? 'he' : 'en';
    try {
      localStorage.setItem('lang', lang);
      location.reload();
    } catch (error) {
      console.error(error);
    }
  }

  private setLang(lang: string) {
    this.lang = lang;
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
