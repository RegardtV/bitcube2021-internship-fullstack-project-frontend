import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { User } from '@app/_models';
import { AccountService, AlertService } from '@app/_services';
import { UserService } from '@app/_services/user.service';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html'
})
export class UserManagementComponent implements OnInit {

    pageTitle: string = 'Manage Users';
    listFilter: string = '';
    users: User[] = [];
    filteredUsers: User[] = [];
    pageOfUsers: User[] = [];
    loading: boolean = true;
    filterControl: FormControl = new FormControl('');
    noUsersMessage: string = '';
    form: FormGroup;
    userArray: FormArray = new FormArray([]);
    
    private user: User;

    constructor(private accountService: AccountService, 
                private userService: UserService,
                private alertService: AlertService) {
        this.accountService.user.subscribe(x => this.user = x);
    }

    ngOnInit(): void {
        this.getAllUsers();

        this.form = new FormGroup({
            userArray: this.userArray 
        })

        this.filterControl.valueChanges
            .subscribe((filterText: string) => {
                this.listFilter = filterText;
                this.filteredUsers = this.listFilter ? this.performFilter(this.listFilter) : this.users;
                if (!this.filteredUsers.length) {
                    this.noUsersMessage = 'No users to show'
                } else {
                    this.noUsersMessage = '';
                }   
            })
    }

    get f() { 
        const controlArray = this.form.get('userArray') as FormArray;
        return controlArray.controls;
    }
    
    onChangePage(pageOfUsers: User[]): void {
        // update current page of items
        this.pageOfUsers = pageOfUsers;
    }

    toggleLockUnlockUser(user: User): void {
        let message: string;
        user.locked ? message = 'Account unlock successful' : message = 'Account lock successful'
        if (user.locked) {
            user.locked = false;
            message = 'Account unlock successful'
        } else {
            user.locked = true;
            message = 'Account lock successful'
        }
        
        if (user.adminRole && user.locked) {
            if (confirm('Are you sure you want to lock this admin account? Only another admin account can unlock this account.')) {
                this.updateUser(user, message);
            } else {
                user.locked = false;
            }
        } else {
            
            this.updateUser(user, message);
        }
    }

    editEmail(user: User): void {

        this.f[user.id - 1].enabled ? this.f[user.id - 1].disable() : this.f[user.id - 1].enable()
    }

    saveEmail(user: User): void {

        user.email = this.f[user.id - 1].value;
        this.updateUser(user,'Email update successful');
    }

    private buildUserArray(): void {
        
        while (this.userArray.length !== 0) {
            this.userArray.removeAt(0)
          }

        this.users.forEach( () => {
            this.userArray.push(new FormControl())
        })
    }

    private populateUserArray(): void {

        for (let user of this.users){
            this.f[user.id-1].setValue(user.email);
            this.f[user.id-1].disable();
        }
    }

    
    // private method to pefrom filter based on filter input
    private performFilter(filterBy: string): User[] {
        filterBy = filterBy.toLocaleLowerCase();
        return this.users.filter((user) =>
            user.lastName.toLocaleLowerCase().indexOf(filterBy) !== -1);
    }

    private getAllUsers(): void {
        this.userService.getAllUsers().subscribe({
            next: (users: User[]) => {
                this.loading = false;
                this.users = users;
                this.buildUserArray();
                this.populateUserArray();
                this.filteredUsers= this.listFilter ? this.performFilter(this.listFilter) : this.users;
                if (!this.filteredUsers.length) {
                    this.noUsersMessage = 'No users to show'
                } else {
                    this.noUsersMessage = '';
                }         
            },
            error: (err: any) => {
                this.loading = false;
                this.alertService.error(err);
            }
        });
    }

    private updateUser(user: User, message: string): void {

        if (user.id === this.user.id) {

            this.accountService.updateAccount(user.id, user)
            .subscribe({
                next: () => {
                    this.getAllUsers();
                    this.f[user.id - 1].disable();
                    this.alertService.success(message, { autoClose: true, keepAfterRouteChange: true });
                    this.accountService.logout();
            },
             error: (err: any) => this.alertService.error(err)
            });   
        } else {

            this.userService.updateUser(user.id, user)            
            .subscribe({
                next: () => {
                    this.getAllUsers();
                    this.f[user.id - 1].disable();
                    this.alertService.success(message, { autoClose: true}); 
            },
            error: (err: any) => this.alertService.error(err)
            });
        }    
    }
}

