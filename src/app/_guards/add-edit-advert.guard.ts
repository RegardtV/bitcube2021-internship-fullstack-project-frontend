import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { RegisterComponent } from '@app/account/register.component';
import { AddEditAdvertComponent } from '@app/user_account/add-edit-advert.component';

import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AddEditAdvertGuard implements CanDeactivate<AddEditAdvertComponent> {
  canDeactivate(component: AddEditAdvertComponent): Observable<boolean> | Promise<boolean> | boolean {
    if (component.form.dirty) {
      return confirm('Leaving this page will clear the advert form and all of its content.');
    }
    return true;
  }
}
