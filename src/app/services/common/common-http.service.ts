import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonHttpService {
  private readonly httpClient = inject(HttpClient);

  isLoading = false;
  pendingRequests = 0;

  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token, content-type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS,DELETE,PUT',
  });

  private readonly options = { headers: this.headers };

  getData(url: string, route: string): Observable<any> {
    return this.handleRequest(this.httpClient.get(url + route, this.options));
  }

  postData(url: string, route: string, data: any): Observable<any> {
    return this.handleRequest(
      this.httpClient.post(url + route, JSON.stringify(data), this.options),
    );
  }

  putData(url: string, route: string, data: any): Observable<any> {
    return this.handleRequest(this.httpClient.put(url + route, JSON.stringify(data), this.options));
  }

  deleteData(url: string, route: string): Observable<any> {
    return this.handleRequest(this.httpClient.delete(url + route, this.options));
  }

  deleteDataWithBody(url: string, route: string, data: any): Observable<any> {
    const optionsWithBody = {
      ...this.options,
      body: data,
    };
    return this.handleRequest(this.httpClient.delete(url + route, optionsWithBody));
  }

  patchData(url: string, route: string): Observable<any> {
    return this.handleRequest(this.httpClient.patch(url + route, this.options));
  }

  private handleRequest(obs: Observable<any>): Observable<any> {
    this.turnOnModal();
    return obs.pipe(
      tap({
        error: () => this.turnOffModal(),
      }),
      finalize(() => this.turnOffModal()),
    );
  }

  private turnOnModal() {
    this.pendingRequests++;
    if (!this.isLoading) {
      this.isLoading = true;
    }
  }

  private turnOffModal() {
    this.pendingRequests--;
    if (this.pendingRequests <= 0) {
      this.isLoading = false;
    }
  }
}
