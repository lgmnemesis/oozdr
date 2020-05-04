import { Directive, ElementRef, NgModule } from '@angular/core';
import { SharedService } from '../services/shared.service';

@Directive({
  selector: '[appScrollbarTheme]'
})
export class ScrollbarThemeDirective {

  constructor(private el: ElementRef,
    private sharedService: SharedService) {
    this.styleIonScrollbars(el);
   }

   styleIonScrollbars(element: ElementRef): boolean {
    if (!element || this.sharedService.isMobileApp()) {
      return false;
    }
    try {
      const stylesheet = `
        ::-webkit-scrollbar {
          width: 8px;
          background: var(--ion-color-minor);
        }
        ::-webkit-scrollbar,
        ::-webkit-scrollbar-thumb {
          overflow: visible;
        }
        ::-webkit-scrollbar-thumb {
          background: var(--ion-color-light-shade);
        }
      `;

      const styleElement = element.nativeElement.shadowRoot.querySelector('style');

      if (styleElement) {
        styleElement.append(stylesheet);
      } else {
        const barStyle = document.createElement('style');
        barStyle.append(stylesheet);
        element.nativeElement.shadowRoot.appendChild(barStyle);
      }
    } catch (error) {
      console.error(error);
      return false;
    }
    return true;
  }
}

@NgModule({
  declarations: [ ScrollbarThemeDirective ],
  exports: [ ScrollbarThemeDirective ]
})
export class ScrollbarThemeModule {}
