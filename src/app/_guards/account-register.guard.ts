import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { RegisterComponent } from '@app/account/register.component';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AccountRegisterGuard implements CanDeactivate<RegisterComponent> {
  canDeactivate(component: RegisterComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.form.dirty) {
      return confirm('Leaving this page will clear the registration form and all of its content.');
    }
    return true;
  }
}
