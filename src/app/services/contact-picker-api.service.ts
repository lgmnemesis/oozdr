import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ContactPickerApiService {

  contactProps = ['name', 'email', 'tel', 'address', 'icon'];
  contactOpts = {multiple: false};
  supported = ('contacts' in navigator && 'ContactsManager' in window);
  supportedProps: any[] = null;

  constructor() {}

  async getContacts(props?: any, opts?: any) {
    if (!this.supported) {
      return null;
    }
    try {
      const pr: any[] = props || this.contactProps;
      const op = opts || this.contactOpts;
      const finalProps = [];
      const nav: any = navigator;
      if (!this.supportedProps) {
        this.supportedProps = await nav.contacts.getProperties();
      }
      pr.forEach((p) => {
        const isFound = this.supportedProps.findIndex((s) => s === p) > -1;
        if (isFound) finalProps.push(p);
      });
      return nav.contacts.select(finalProps, op);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
