import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * HTTP GET request
   * @param endpoint - API endpoint path
   * @param options - Optional HttpClient options (params, headers, etc.)
   * @returns Observable of response data
   */
  get<T>(endpoint: string, options?: { params?: any; headers?: HttpHeaders }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    // Convert params object to HttpParams if needed
    let httpParams = new HttpParams();
    if (options?.params) {
      Object.keys(options.params).forEach(key => {
        httpParams = httpParams.append(key, options.params[key]);
      });
    }
    
    return this.http.get<T>(url, {
      params: httpParams,
      headers: options?.headers
    });
  }

  /**
   * HTTP POST request
   * @param endpoint - API endpoint path
   * @param data - Request payload
   * @param options - Optional HttpClient options
   * @returns Observable of response data
   */
  post<T>(endpoint: string, data: any, options?: { headers?: HttpHeaders }): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });
    
    const httpOptions = {
      headers: options?.headers || headers
    };

    return this.http.post<T>(url, data, httpOptions);
  }

  /**
   * Update the base URL for API calls
   * @param url - New base URL
   */
  setBaseUrl(url: string): void {
    this.baseUrl = url;
  }

  /**
   * Get the current base URL
   * @returns Current base URL
   */
  getBaseUrl(): string {
    return this.baseUrl;
  }
}

