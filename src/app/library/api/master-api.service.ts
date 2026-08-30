import { inject, Injectable } from '@angular/core';
import { CommonHttpService } from '../../services/common/common-http.service';
import { Observable } from 'rxjs';
import { ApiResponse } from '../models/common.model';
import { CreateUserDto, UpdateUserDto, UserDto } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { CreateRoleDto, RoleDto, UpdateRoleDto } from '../models/role.model';
import { TenantPermissionDto } from '../models/permission.model';

@Injectable({
  providedIn: 'root',
})
export class MasterApiService {
  private readonly http = inject(CommonHttpService);

  // Permissions

  getAllPermissions(): Observable<ApiResponse<TenantPermissionDto[]>> {
    return this.http.getData(environment.serverUrlV1, 'TenantPermission');
  }

  getPermissoinById(permissionId: string): Observable<ApiResponse<TenantPermissionDto>> {
    return this.http.getData(environment.serverUrlV1, `TenantPermission/${permissionId}`);
  }

  // Roles

  getAllRoles(): Observable<ApiResponse<RoleDto[]>> {
    return this.http.getData(environment.serverUrlV1, 'Role');
  }

  getRoleById(roleId: string): Observable<ApiResponse<RoleDto>> {
    return this.http.getData(environment.serverUrlV1, `Role/${roleId}`);
  }

  createRole(role: CreateRoleDto): Observable<ApiResponse<RoleDto>> {
    return this.http.postData(environment.serverUrlV1, 'Role', role);
  }

  updateRole(role: UpdateRoleDto): Observable<ApiResponse<RoleDto>> {
    return this.http.putData(environment.serverUrlV1, `Role/${role.id}`, role);
  }

  deleteRole(roleId: string): Observable<ApiResponse<boolean>> {
    return this.http.deleteData(environment.serverUrlV1, `Role/${roleId}`);
  }

  // Users

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
