import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable, finalize } from 'rxjs';

import {
  Department,
  DepartmentRequest,
  User,
  UserRequest
} from '../models/user.models';

import { UserApiService } from '../services/user-api.service';
import { AuthService } from '../services/auth-service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.css'],
  standalone: false
})
export class UserManagementComponent implements OnInit {

  departments: Department[] = [];
  users: User[] = [];

  selectedDepartmentId: number | null = null;

  editingUserId: number | null = null;
  editingDepartmentId: number | null = null;

  message = '';
  errorMessage = '';
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  dialogMessage = '';
  private pendingDialogAction: (() => void) | null = null;
  private loadingRequests = 0;
  private toastTimerId?: number;

  userForm: FormGroup;
  departmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: UserApiService,
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private zone: NgZone
  ) {

    // User Form
    this.userForm = this.fb.group({
      firstName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      lastName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],

      departmentId: [
        null,
        Validators.required
      ]
    });


    // Department Form
    this.departmentForm = this.fb.group({

      departmentName: [
        '',
        [
          Validators.required,
          Validators.minLength(2)
        ]
      ],

      departmentAddress: [
        '',
        Validators.required
      ],

      departmentCode: [
        '',
        Validators.required
      ]
    });
  }


  ngOnInit(): void {
    this.loadDepartments();
  }

  logout(): void {
    this.openDialog('Are you sure you want to logout?', () => {
      this.authService.logout();
      this.router.navigate(['/login'], { replaceUrl: true });
    });
  }

  confirmDialog(): void {
    const action = this.pendingDialogAction;
    this.closeDialog();

    action?.();
  }

  closeDialog(): void {
    this.dialogMessage = '';
    this.pendingDialogAction = null;
  }

  private openDialog(message: string, action: () => void): void {
    this.dialogMessage = message;
    this.pendingDialogAction = action;
  }

  get isLoading(): boolean {
    return this.loadingRequests > 0;
  }

  private track<T>(request: Observable<T>): Observable<T> {
    this.loadingRequests++;

    return request.pipe(
      finalize(() => this.loadingRequests--)
    );
  }

  private showToast(message: string, type: 'success' | 'error'): void {
    if (this.toastTimerId) {
      window.clearTimeout(this.toastTimerId);
    }

    this.toastMessage = message;
    this.toastType = type;

    this.toastTimerId = window.setTimeout(() => {
      this.toastMessage = '';
    }, 3500);
  }


  // =====================================================
  // Departments
  // =====================================================

  loadDepartments(): void {

    this.track(this.api.getDepartments()).subscribe({

      next: departments => {

        this.departments = departments;

        if (
          departments.length &&
          this.selectedDepartmentId === null
        ) {

          this.selectedDepartmentId =
            departments[0].departmentId;

          this.userForm.patchValue({
            departmentId:
              departments[0].departmentId
          });

          this.loadUsers();
        }
      },

      error: () => {
        this.showToast('Could not load departments.', 'error');
      }
    });
  }


  onDepartmentChange(): void {
    this.userForm.patchValue({
      departmentId:
        this.selectedDepartmentId
    });

    this.loadUsers();
  }


  addDepartment(): void {

    if (this.departmentForm.invalid) {

      this.departmentForm.markAllAsTouched();

      return;
    }

    const request: DepartmentRequest =
      this.departmentForm.value;

    const operation =
      this.editingDepartmentId !== null

        ? this.api.updateDepartment(
          this.editingDepartmentId,
          request
        )

        : this.api.addDepartment(request);


    this.track(operation).subscribe({

      next: department => {

        this.showToast(
          this.editingDepartmentId !== null
            ? 'Department updated.'
            : 'Department added.',
          'success'
        );


        if (this.editingDepartmentId !== null) {

          const index =
            this.departments.findIndex(
              d =>
                d.departmentId ===
                this.editingDepartmentId
            );

          if (index !== -1) {
            this.departments[index] =
              department;
          }

        } else {

          this.departments.push(department);
        }


        this.selectedDepartmentId =
          department.departmentId;


        this.userForm.patchValue({
          departmentId:
            department.departmentId
        });


        this.resetDepartmentForm();

        this.loadUsers();
      },

      error: () => {

        this.showToast('Could not save department.', 'error');
      }
    });
  }


  editDepartment(department: Department): void {

    this.editingDepartmentId =
      department.departmentId;

    this.departmentForm.patchValue({

      departmentName:
        department.departmentName,

      departmentAddress:
        department.departmentAddress,

      departmentCode:
        department.departmentCode
    });
  }


  deleteDepartment(department: Department): void {

    this.openDialog(
      `Delete ${department.departmentName}?`,
      () => this.deleteDepartmentConfirmed(department.departmentId)
    );
  }

  private deleteDepartmentConfirmed(departmentId: number): void {
    this.track(this.api.deleteDepartment(departmentId)).subscribe({

        next: () => {

          this.showToast('Department deleted.', 'success');

          this.departments =
            this.departments.filter(
              d => d.departmentId !== departmentId
            );


          if (
            this.selectedDepartmentId === departmentId
          ) {

            this.selectedDepartmentId =
              this.departments.length
                ? this.departments[0].departmentId
                : null;


            this.userForm.patchValue({
              departmentId:
                this.selectedDepartmentId
    });

            this.loadUsers();
          }
        },

        error: () => {

          this.showToast('Could not delete department.', 'error');
        }
      });
  }


  resetDepartmentForm(): void {

    this.editingDepartmentId = null;

    this.departmentForm.reset();
  }


  // =====================================================
  // Users
  // =====================================================

  loadUsers(): void {

    if (this.selectedDepartmentId === null) {

      this.users = [];

      return;
    }


    this.track(this.api
      .getUsersByDepartment(
        this.selectedDepartmentId
      ))
      .subscribe({
        next: users => {
          this.users = users;
          this.cdr.markForCheck();
        },

        error: () => {

          this.showToast('Could not load users.', 'error');
        }
      });
  }


  submitUser(): void {

    if (this.userForm.invalid) {

      this.userForm.markAllAsTouched();

      return;
    }


    const request: UserRequest =
      this.userForm.value;


    const operation =
      this.editingUserId !== null

        ? this.api.updateUser(
          this.editingUserId,
          request
        )

        : this.api.addUser(request);


    this.track(operation).subscribe({

      next: () => {

        this.showToast(
          this.editingUserId !== null ? 'User updated.' : 'User added.',
          'success'
        );


        this.resetUserForm();

        this.loadUsers();
      },

      error: () => {

        this.showToast('Could not save user.', 'error');
      }
    });
  }


  editUser(user: User): void {

    this.editingUserId = user.id;


    const nameParts =
      user.name.trim().split(/\s+/);


    const firstName =
      nameParts[0] || '';


    const lastName =
      nameParts.slice(1).join(' ');


    this.userForm.patchValue({

      firstName,

      lastName,

      email: user.email,

      departmentId:
        user.departmentId
    });
  }


  deleteUser(user: User): void {

    this.openDialog(
      `Delete ${user.name}?`,
      () => this.deleteUserConfirmed(user.id)
    );
  }

  private deleteUserConfirmed(userId: number): void {
    this.track(this.api.deleteUser(userId)).subscribe({

        next: () => {

          this.showToast('User deleted.', 'success');

          this.loadUsers();
        },

        error: () => {

          this.showToast('Could not delete user.', 'error');
        }
    });
  }


  resetUserForm(): void {

    this.editingUserId = null;

    this.userForm.reset({

      departmentId:
        this.selectedDepartmentId
    });
  }


  departmentName(
    id: number | null
  ): string {

    return this.departments.find(
      department =>
        department.departmentId === id
    )?.departmentName || 'Unknown';
  }
}
