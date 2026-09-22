import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import {
  Department,
  DepartmentRequest,
  User,
  UserRequest,
  ApiResponse
} from '../models/user.models';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {

  private readonly baseUrl = 'https://abjms.duckdns.org/api';

  constructor(private http: HttpClient) {}

  // -------------------------
  // Departments
  // -------------------------

  getDepartments(): Observable<Department[]> {
    return this.http
      .get<ApiResponse<Department[]>>(
        `${this.baseUrl}/department/departments`
      )
      .pipe(
        map(response => response.result)
      );
  }

  addDepartment(
    department: DepartmentRequest
  ): Observable<Department> {

    return this.http
      .post<ApiResponse<Department>>(
        `${this.baseUrl}/department/departments`,
        department
      )
      .pipe(
        map(response => response.result)
      );
  }

  updateDepartment(
    id: number,
    department: DepartmentRequest
  ): Observable<Department> {

    return this.http
      .put<ApiResponse<Department>>(
        `${this.baseUrl}/department/departments/${id}`,
        department
      )
      .pipe(
        map(response => response.result)
      );
  }

  deleteDepartment(id: number): Observable<void> {

    return this.http
      .delete<ApiResponse<void>>(
        `${this.baseUrl}/department/departments/${id}`
      )
      .pipe(
        map(() => undefined)
      );
  }


  // -------------------------
  // Users
  // -------------------------

  getUsersByDepartment(
    departmentId: number
  ): Observable<User[]> {

    const params = new HttpParams()
      .set('departmentId', departmentId);

    return this.http
      .get<ApiResponse<User[]>>(
        `${this.baseUrl}/user/users`,
        { params }
      )
      .pipe(
        map(response => response.result)
      );
  }

  addUser(
    user: UserRequest
  ): Observable<User> {

    return this.http
      .post<ApiResponse<User>>(
        `${this.baseUrl}/user/users`,
        user
      )
      .pipe(
        map(response => response.result)
      );
  }

  updateUser(
    id: number,
    user: UserRequest
  ): Observable<User> {

    return this.http
      .put<ApiResponse<User>>(
        `${this.baseUrl}/user/users/${id}`,
        user
      )
      .pipe(
        map(response => response.result)
      );
  }

  deleteUser(id: number): Observable<void> {

    return this.http
      .delete<ApiResponse<void>>(
        `${this.baseUrl}/user/users/${id}`
      )
      .pipe(
        map(() => undefined)
      );
  }
}

