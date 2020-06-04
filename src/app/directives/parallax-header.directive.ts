import { Directive, ElementRef, Renderer2, Input, AfterViewInit, NgModule } from '@angular/core';
import { DomController } from '@ionic/angular';

@Directive({
  selector: '[appParallaxHeader]',
	host: {
		'(ionScroll)': 'onContentScroll($event)'
	}
})
export class ParallaxHeaderDirective implements AfterViewInit {

	@Input('parallaxHeight') parallaxHeight: number = 59;

	private header: HTMLDivElement;
  private mainContent: HTMLDivElement;
  headerTopPosition = 0;
  currentPosition = 0;

	constructor(private element: ElementRef, private renderer: Renderer2, private domCtrl: DomController) {
  }
  
  ngAfterViewInit() {
    this.header = this.element.nativeElement.querySelector('.parallax-header');
    this.mainContent = this.element.nativeElement.querySelector('.main-content');

		this.domCtrl.write(() => {
      this.renderer.setStyle(this.header, 'position', 'fixed');
      this.renderer.setStyle(this.header, 'z-index', '99');
      this.renderer.setStyle(this.header, 'top', '0');
      this.renderer.setStyle(this.header, 'width', '100%');
      this.renderer.setStyle(this.header, 'height', this.parallaxHeight + 'px');

      this.renderer.setStyle(this.mainContent, 'padding-top', this.parallaxHeight + 'px');
		});

  }

  onContentScroll(ev: any) {
    const isDown = ev.detail.scrollTop > this.currentPosition;
    const distance = isDown ? ev.detail.scrollTop - this.currentPosition : this.currentPosition - ev.detail.scrollTop;
    this.headerTopPosition = isDown ? this.headerTopPosition - distance : this.headerTopPosition + distance;
    if (this.headerTopPosition < -this.parallaxHeight) this.headerTopPosition = -this.parallaxHeight;
    if (this.headerTopPosition > 0) this.headerTopPosition = 0;
    this.currentPosition = ev.detail.scrollTop;

    const position = this.headerTopPosition;
    this.renderPosition(position);
  }

  renderPosition(position: number) {
    this.domCtrl.write(() => {
      this.renderer.setStyle(this.header, 'top', `${position}px`);
    });
  }
}

@NgModule({
  declarations: [ ParallaxHeaderDirective ],
  exports: [ ParallaxHeaderDirective ]
})
export class ParallaxHeaderModule {}
