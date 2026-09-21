import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { NgZone } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import {
  Department,
  DepartmentRequest,
  User,
  UserRequest
} from '../models/user.models';

import { UserApiService } from '../services/user-api.service';

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

  userForm: FormGroup;
  departmentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private api: UserApiService,
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


  // =====================================================
  // Departments
  // =====================================================

  loadDepartments(): void {

    this.api.getDepartments().subscribe({

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
        this.errorMessage =
          'Could not load departments.';
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


    operation.subscribe({

      next: department => {

        this.message =
          this.editingDepartmentId !== null
            ? 'Department updated.'
            : 'Department added.';


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

        this.errorMessage =
          'Could not save department.';
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

    if (
      !confirm(
        `Delete ${department.departmentName}?`
      )
    ) {
      return;
    }


    this.api
      .deleteDepartment(
        department.departmentId
      )
      .subscribe({

        next: () => {

          this.message =
            'Department deleted.';

          this.departments =
            this.departments.filter(
              d =>
                d.departmentId !==
                department.departmentId
            );


          if (
            this.selectedDepartmentId ===
            department.departmentId
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

          this.errorMessage =
            'Could not delete department.';
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


    this.api
      .getUsersByDepartment(
        this.selectedDepartmentId
      )
      .subscribe({
        next: users => {
          this.users = users;
          this.cdr.markForCheck();
        },

        error: () => {

          this.errorMessage =
            'Could not load users.';
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


    operation.subscribe({

      next: () => {

        this.message =
          this.editingUserId !== null
            ? 'User updated.'
            : 'User added.';


        this.resetUserForm();

        this.loadUsers();
      },

      error: () => {

        this.errorMessage =
          'Could not save user.';
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

    if (
      !confirm(
        `Delete ${user.name}?`
      )
    ) {
      return;
    }


    this.api
      .deleteUser(user.id)
      .subscribe({

        next: () => {

          this.message =
            'User deleted.';

          this.loadUsers();
        },

        error: () => {

          this.errorMessage =
            'Could not delete user.';
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

