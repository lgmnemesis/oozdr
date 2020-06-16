import { Injectable } from '@angular/core';
import { DictionaryEnglish } from '../../locales/dictionary_english';
import { DictionaryHebrew } from '../../locales/dictionary_hebrew';
import { SharedService } from './shared.service';
import { SharedStoreService } from './shared-store.service';

@Injectable({
  providedIn: 'root'
})
export class LocaleService {

  lang = 'en';
  dir = 'ltr';
  isRightToLeft = false;
  dictionary = DictionaryEnglish;
  backArrow = 'arrow-back-outline';
  canShowToggleLangButton = false;
  preferHeb = false;

  constructor(private sharedService: SharedService,
    private sharedStoreService: SharedStoreService) {
  }

  updateCanShowToggleLangButton() {
    this.getCurrentLang();
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
      const lang = this.getCurrentLang();
      if (lang) this.setLang(lang);
    } catch (error) {
      console.error(error);
    }
  }

  private getCurrentLang(): string {
    try {
      let lang = localStorage.getItem('lang');
      const supportHeb = this.isBrowserSupportHeb();
      if (!lang && this.preferHeb) lang = 'he';
      if (lang !== 'en' && lang !== 'he') lang = 'en';
      const isIL = this.sharedService.getDefaultPhoneCountryCode() === 'IL';
      this.canShowToggleLangButton = supportHeb || lang === 'he' || isIL;
      return lang;
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  toggleLang() {
    const lang = this.lang === 'en' ? 'he' : 'en';
    try {
      localStorage.setItem('lang', lang);
      this.setLang(lang);
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
    this.backArrow = this.isRightToLeft ? 'arrow-forward-outline' : 'arrow-back-outline';
    this.sharedStoreService.markForCheckAppSubject.next(true);
   }
}
