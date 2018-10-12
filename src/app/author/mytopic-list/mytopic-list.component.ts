import {Component, OnInit, AfterViewInit, Injector, ViewChild, ViewEncapsulation} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';
import {IconizFinanceServiceProxy} from '@shared/service-proxies/service-proxies';
import {LazyLoadEvent} from 'primeng/components/common/lazyloadevent';
import {Paginator} from 'primeng/components/paginator/paginator';
import {Table} from 'primeng/components/table/table';
import {appModuleAnimation} from '@shared/animations/routerTransition';

@Component({
    templateUrl: './mytopic-list.component.html',
    styleUrls: ['./mytopic-list.component.css'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class MytopicListComponent extends AppComponentBase implements OnInit, AfterViewInit {
    @ViewChild('dataTable') dataTable: Table;
    @ViewChild('paginator') paginator: Paginator;

    constructor(
        injector: Injector,
        private _iconizFinanceServiceProxy: IconizFinanceServiceProxy,
    ) {
        super(injector);
    }

    keyword = '';

    ngOnInit() {
    }

    ngAfterViewInit(): void {
        this.getMyTopicList(undefined);
    }

    getMyTopicList(event?: LazyLoadEvent): void {
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
        }
        abp.ui.setBusy();
        this._iconizFinanceServiceProxy.getMyTopics(
            this.keyword,
            undefined,
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            abp.ui.clearBusy();
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;
            this.primengTableHelper.hideLoadingIndicator();
        });
    }
}
