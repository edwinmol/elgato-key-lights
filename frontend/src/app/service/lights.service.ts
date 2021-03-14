import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { ElgatoKeyLight, ElgatoKeyLightStatus } from '../model/elgato-key-light'

@Injectable({
  providedIn: 'root'
})
export class LightsService {

  baseUrl = '/api/light';

  constructor(private http: HttpClient) { }

  get(): Observable<ElgatoKeyLight[]>  {
    return this.http.get<ElgatoKeyLight[]>(this.baseUrl);
  }

  update(id: string, status: ElgatoKeyLightStatus): Observable<ElgatoKeyLight> {
    return this.http.put<ElgatoKeyLight>(`${this.baseUrl}/${id}`,status);
  }

  updateAll(ids: number[], status: ElgatoKeyLightStatus): Observable<ElgatoKeyLight> {
    return this.http.put<ElgatoKeyLight>(`${this.baseUrl}`,status);
  }

}
