import { Component, Input, OnInit } from '@angular/core';
import { Advert } from '@app/_models';

@Component({
    selector: 'app-my-adverts-list',
    templateUrl: './my-adverts-list.component.html'
})
export class MyAdvertsListComponent implements OnInit {

    @Input() advert: Advert | undefined;
    
    constructor() { }

    ngOnInit(): void {}

}
