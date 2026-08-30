import { inject, Injectable } from '@angular/core';
import { CommonHttpService } from '../../services/common/common-http.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { CreateUserDto, UpdateUserDto, UserDto } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MasterApiService {
  private readonly http = inject(CommonHttpService);

  // User

  getAllUsers(): Observable<ApiResponse<UserDto[]>> {
    return this.http.getData(environment.serverUrlV1, 'User');
  }

  getUserById(userId: string): Observable<ApiResponse<UserDto>> {
    return this.http.getData(environment.serverUrlV1, `User/${userId}`);
  }

  createUser(user: CreateUserDto): Observable<ApiResponse<UserDto>> {
    return this.http.postData(environment.serverUrlV1, 'User', user);
  }

  updateUser(user: UpdateUserDto): Observable<ApiResponse<UserDto>> {
    return this.http.putData(environment.serverUrlV1, `User/${user.id}`, user);
  }

  deleteUser(userId: string): Observable<ApiResponse<boolean>> {
    return this.http.deleteData(environment.serverUrlV1, `User/${userId}`);
  }
}
