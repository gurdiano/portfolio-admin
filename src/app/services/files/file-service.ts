import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FileService {
  private http = inject(HttpClient);

  async getFile(url: string, fileName: string): Promise<File> {
    const blob = await firstValueFrom(
      this.http.get(url, { responseType: 'blob' })
    );
    return new File([blob], fileName, { type: blob.type });
  }
}