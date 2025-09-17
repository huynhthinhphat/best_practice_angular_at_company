import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  public saveData<T>(key: string, data: T) {
    localStorage.setItem(key, JSON.stringify(data));
  }

  public getData<T>(key: string): T | null {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }
}
