import { Component, Input, OnInit } from '@angular/core';
import { Advert } from '@app/_models';

@Component({
    selector: 'app-advert-detail',
    templateUrl: './advert-detail.component.html'
})
export class AdvertDetailComponent implements OnInit {

    @Input() advert: Advert | undefined;
    
    constructor() { }

    ngOnInit(): void {}

}
