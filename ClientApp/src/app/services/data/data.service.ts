import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

// Service for all API requests
export class DataService {

  private baseUrl: string;

  constructor(
    private httpClient: HttpClient,
    @Inject('BASE_URL') baseUrl: string,
  ) {
    this.baseUrl = baseUrl;
  }

  getCities<T>(name?: string):Observable<T[]>{
    return this.httpClient.get<T[]>(`${this.baseUrl}cities/?name=${name}`)
    .pipe(catchError(this.handleError<T[]>('getCities', [])));
  }

  //// handleError for Http requests
  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} error: ${error.message}`);
      return of(result as T);
    };
  }


}

