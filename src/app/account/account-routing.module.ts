import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AccountRegisterGuard } from '@app/_guards/account-register.guard';

import { AccountLayoutComponent } from './account-layout.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';

const routes: Routes = [
    {
        path: '', component: AccountLayoutComponent,
        children: [
            { path: 'login', component: LoginComponent },
            { path: 'register', canDeactivate: [AccountRegisterGuard], component: RegisterComponent }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class AccountRoutingModule { }