import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { UserManagementComponent } from './pages/user-management.component';
import { routes } from './app.routes';
import { AuthInterceptor } from './services/auth.interceptor';
import { LoginComponent } from './pages/login.component';


@NgModule({
  declarations: [
    AppComponent,
    UserManagementComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
             }],
  bootstrap: [AppComponent]
})
export class AppModule {}
