import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {IconizFinanceServiceProxy, JinseTicker} from '@shared/service-proxies/service-proxies';

@Component({
    templateUrl: './market.component.html',
    styleUrls: ['./market.component.less'],
    selector: 'market-bar'
})
export class MarketComponent extends AppComponentBase implements OnInit {
    jinseTickers: JinseTicker[] = [];

    constructor(
        injector: Injector,
        private iconizFinanceServiceProxy: IconizFinanceServiceProxy
    ) {
        super(injector);
    }

    ngOnInit(): void {
        this.iconizFinanceServiceProxy.getJinseTickers().subscribe(result => {
            this.jinseTickers = result;
        });
    }
}
