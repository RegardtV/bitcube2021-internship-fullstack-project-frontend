import { Component, Input, OnInit } from '@angular/core';
import { Advert } from '@app/_models';

@Component({
    selector: 'app-for-sale-list',
    templateUrl: './for-sale-list.component.html'
})
export class ForSaleListComponent implements OnInit {

    @Input() advert: Advert | undefined;
    
    constructor() { }

    ngOnInit(): void {}

}
