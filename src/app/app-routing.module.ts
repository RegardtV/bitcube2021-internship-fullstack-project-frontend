import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { AccountAuthGuard } from './_guards/account-auth.guard';

const publicModule = () => import('./public/public.module').then(x => x.PublicModule);
const accountModule = () => import('./account/account.module').then(x => x.AccountModule);
const userAccountModule = () => import('./user_account/user-account.module').then(x => x.UserAccountModule);

const routes: Routes = [
    { path: '', component: HomeComponent},
    { path: 'for-sale', loadChildren: publicModule},
    { path: 'account', loadChildren: accountModule},
    { path: 'my-adverts', loadChildren: userAccountModule, canActivate: [AccountAuthGuard]},

    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }