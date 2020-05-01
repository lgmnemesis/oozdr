import { Injectable } from '@angular/core';
import { BasicInfo } from '../interfaces/profile';

@Injectable({
  providedIn: 'root'
})
export class WelcomeService {

  private useLocalStorage = false;
  private infoStore: BasicInfo = null;

  constructor() { }

  private getInfoFromStore(): BasicInfo {
    if (!this.useLocalStorage) {
      return this.infoStore;
    }
    try {
      return JSON.parse(localStorage.getItem('basic_info'));
    } catch (error) {
      console.error(error);
    }
    return null;
  }

  private createNewInfo(): BasicInfo {
    this.infoStore = {
      name: '',
      gender: '',
      email: '',
      birthday: '',
      mobile: '',
      profilePhoto: '',
      profilePhotoOrg: ''
    }
    return this.infoStore;
  }

  getInfo() {
    const info = this.getInfoFromStore();
    if (!info) {
      return this.createNewInfo();
    }
    return info;
  }

  storeInfo(info: BasicInfo) {
    try {
      localStorage.setItem('basic_info', JSON.stringify(info));
    } catch (error) {
      console.error(error);
    }
  }

  deleteInfoFromStore() {
    try {
      localStorage.removeItem('basic_info');
    } catch (error) {
      console.error(error);
    }
  }
}
