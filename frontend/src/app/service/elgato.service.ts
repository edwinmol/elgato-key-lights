import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ElgatoKeyLight,
  ElgatoKeyLightStatus,
} from '../model/elgato-key-light';

@Injectable({
  providedIn: 'root',
})
export class ElgatoService {
  baseUrl = '/elgato';

  constructor(private http: HttpClient) {}

  get(): Observable<ElgatoKeyLight[]> {
    return this.http.get<ElgatoKeyLight[]>(this.baseUrl);
  }

  update(id: string, status: ElgatoKeyLightStatus): Observable<ElgatoKeyLight> {
    return this.http.put<ElgatoKeyLight>(`${this.baseUrl}/${id}`, status);
  }

  updateAll(status: ElgatoKeyLightStatus): Observable<ElgatoKeyLight[]> {
    return this.http.put<ElgatoKeyLight[]>(`${this.baseUrl}`, status);
  }
}
