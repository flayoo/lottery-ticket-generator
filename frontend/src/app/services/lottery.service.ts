import { Injectable, inject } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Ticket } from '../models/ticket.model';
import { LoginService } from './login.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LotteryService {

  #http = inject(HttpClient)
  #loginService  = inject(LoginService)

  private apiBaseUrl = environment.apiBaseUrl;

  constructor() { }

  generateLottoFields(n: number): Observable<number[][]> {
    return of(null).pipe(
      map(() => {
        let lottoFields: number[][] = [];
        let attempts = 0;

        while (lottoFields.length < n && attempts < 1000) {
          const newField = this.generateUniqueLottoField();
          if (!this.fieldExists(lottoFields, newField)) {
            lottoFields.push(newField);
          }
          attempts++;
        }

        return lottoFields;
      })
    );
  }

  private generateUniqueLottoField(): number[] {
    const field = new Set<number>();
    while (field.size < 6) {
      const randomNumber = Math.floor(Math.random() * 49) + 1;
      field.add(randomNumber);
    }
    return Array.from(field).sort((a, b) => a - b);
  }

  private fieldExists(lottoFields: number[][], newField: number[]): boolean {
    return lottoFields.some(field =>
      field.every((num, index) => num === newField[index])
    );
  }

  countNumberFrequencies(lottoFields: number[][]): Observable<{ [key: number]: number }> {
    return of(lottoFields).pipe(
      map(fields => {
        const frequencies: { [key: number]: number } = {};

        fields.flat().forEach(number => {
          if (frequencies[number]) {
            frequencies[number]++;
          } else {
            frequencies[number] = 1;
          }
        });

        return frequencies;
      })
    );
  }

  generateRandomNumber(max = 9, currentNumber = -1) {
    let randomNumber;
    do {
      randomNumber = Math.floor(Math.random() * max);
    } while (randomNumber === currentNumber);
    return randomNumber;
  }

  createTicket(ticket: Ticket): Observable<any> {
    const token = this.#loginService.getToken();
    const url = `${this.apiBaseUrl}/ticket`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.#http.post(url, { ticket }, httpOptions);
  }

  loadTickets() {
    const token = this.#loginService.getToken();
    const url = `${this.apiBaseUrl}/tickets`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Authorization': `Bearer ${token}`
      })
    };
    return this.#http.get(url, httpOptions);
  }
}
