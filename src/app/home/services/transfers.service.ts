import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Transfer } from '../models/transfer.model';

@Injectable({
  providedIn: 'root'
})
export class TransfersService {

  constructor(
    private http: HttpClient
  ) { }

  getTransfers(): Observable<Transfer[]> {
    const url = 'http://' + window.location.host + '/assets/mock-data/transfers.json';
    return this.http.get<Transfer[]>(url);
  }
}
