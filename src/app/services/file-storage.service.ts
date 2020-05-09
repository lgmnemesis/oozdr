import { Injectable } from '@angular/core';
import * as exif from 'exif-js';
import { AngularFireUploadTask } from '@angular/fire/storage/task';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileStorageService {

  task: AngularFireUploadTask;

  constructor(private storage: AngularFireStorage) { }

  async uploadImgFile(dir: string, file: File) {
    // Client-side validation example
    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type');
      return;
    }

    // Main task
    let path = '';
    try {
      const fixedFile = await this.rotateImgFile(file);
      path = `${dir}/${fixedFile.name}`;
      this.task = this.storage.upload(path, fixedFile);
  
      // Progress monitoring
      const snapshot = await this.task.snapshotChanges().pipe(finalize(() => {})).toPromise();

      // Update file metadata
      const metadata = {
        cacheControl: 'public,max-age=15552000',
        contentType: 'image/jpeg'
      }
      const meta = await snapshot.ref.updateMetadata(metadata)
      
      // File's download URL
      return snapshot.ref.getDownloadURL();

    } catch (error) {
      console.error(error);
    }
  }

  async rotateImgFile(file: File): Promise<File> {
    const fileName = file.name;
    const readerAsDataURLAsync = new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        resolve(event);
      };
      reader.onerror = reject;

      reader.readAsDataURL(file);
    });
    const readerAsDataURLEvent: any = await readerAsDataURLAsync;

    const img = new Image();
    const imgAsync = new Promise((resolve, reject) => {
      img.src = readerAsDataURLEvent.target.result;
      img.onload = (event) => {
        resolve(event);
      };
      img.onerror = reject;
    });
    const imgEvent: any = await imgAsync;

    const el = document.createElement('canvas');
    el.width = img.width;
    el.height = img.height;
    const ctx = el.getContext('2d');
    try {
      const readerAsArrayAsync = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event);
        };
        reader.onerror = reject;

        reader.readAsArrayBuffer(file);
      });
      const readerAsArrayEvent: any = await readerAsArrayAsync;

      // Get file exif info
      const ex = exif.readFromBinaryFile(readerAsArrayEvent.target.result);
      const exifOrientation = ex.Orientation;

      if (4 < exifOrientation && exifOrientation < 9) {
        el.width = img.height;
        el.height = img.width;
      }

      switch (exifOrientation) {
        case 2:
          ctx.transform(-1, 0, 0, 1, img.width, 0);
          break;
        case 3:
          ctx.transform(-1, 0, 0, -1, img.width, img.height);
          break;
        case 4:
          ctx.transform(1, 0, 0, -1, 0, img.height);
          break;
        case 5:
          ctx.transform(0, 1, 1, 0, 0, 0);
          break;
        case 6:
          ctx.transform(0, 1, -1, 0, img.height, 0);
          break;
        case 7:
          ctx.transform(0, -1, -1, 0, img.height, img.width);
          break;
        case 8:
          ctx.transform(0, -1, 1, 0, 0, img.width);
          break;
        default:
          ctx.transform(1, 0, 0, 1, 0, 0);
      }

      ctx.drawImage(img, 0, 0);

      const toBlobAsync = new Promise((resolve, reject) => {
        ctx.canvas.toBlob((blob) => {
          resolve(blob);
        }, 'image/jpeg', 1);
      });

      return await toBlobAsync.then((blob) => {
        const f = new File([<any>blob], fileName, {
          type: 'image/jpeg',
          lastModified: Date.now()
        });
        return f;
      });
            
    } catch (error) {
      console.error(error);
    }
    return file;
  }
}
