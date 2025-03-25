import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../models/order.type';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = 'https://shopdemo-production.up.railway.app/orders';

  constructor(private http: HttpClient) {}

  placeOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(this.apiUrl, order);
  }

  getOrderById(id: number): Observable<Order> {
    return this.http.get<Order>(`${this.apiUrl}/${id}`);
  }
}
