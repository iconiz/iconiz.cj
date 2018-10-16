import {AfterViewInit, OnInit, Component, Injector, ViewEncapsulation, ViewChild, ElementRef} from '@angular/core';
import {appModuleAnimation} from '@shared/animations/routerTransition';
import {AppComponentBase} from '@shared/common/app-component-base';
import {IconizFinanceServiceProxy, IconizTopicSummaryDto, JinseLiveMappingFromSourceDtoListLives} from '@shared/service-proxies/service-proxies';
import * as moment from 'moment';
import {Paginator} from 'primeng/components/paginator/paginator';
import {LazyLoadEvent} from 'primeng/components/common/lazyloadevent';
import {Router} from '@angular/router';

@Component({
    templateUrl: './news.component.html',
    styleUrls: ['./news.component.less'],
    encapsulation: ViewEncapsulation.None,
    animations: [appModuleAnimation()]
})
export class NewsComponent extends AppComponentBase implements OnInit, AfterViewInit {

    @ViewChild('news') news: ElementRef;
    @ViewChild('lives') lives: ElementRef;
    @ViewChild('paginator') paginator: Paginator;

    constructor(
        injector: Injector,
        private _router: Router,
        private _iconizFinanceServiceProxy: IconizFinanceServiceProxy,
    ) {
        super(injector);
    }

    keyword = '';
    liveItems: JinseLiveMappingFromSourceDtoListLives[];
    topicList1: IconizTopicSummaryDto[];
    topicList2: IconizTopicSummaryDto[];
    topicList3: IconizTopicSummaryDto[];

    ngOnInit(): void {
    }

    ngAfterViewInit(): void {
        this.getTopicList(undefined);
        this.getLive();
    }

    getTopicList(event?: LazyLoadEvent): void {
        abp.ui.setBusy(this.news.nativeElement);
        if (this.primengTableHelper.shouldResetPaging(event)) {
            this.paginator.changePage(0);
        }

        this._iconizFinanceServiceProxy.getIconizTopics(
            this.keyword,
            undefined,
            this.primengTableHelper.getMaxResultCount(this.paginator, event),
            this.primengTableHelper.getSkipCount(this.paginator, event)
        ).subscribe(result => {
            abp.ui.clearBusy(this.news.nativeElement);
            this.primengTableHelper.totalRecordsCount = result.totalCount;
            this.primengTableHelper.records = result.items;

            this.topicList1 = [];
            this.topicList2 = [];
            this.topicList3 = [];

            result.items.forEach((item, index) => {
                if (index % 3 === 1) {
                    this.topicList1.push(item);
                } else if (index % 3 === 2) {
                    this.topicList2.push(item);
                } else {
                    this.topicList3.push(item);
                }
            });
            this.primengTableHelper.hideLoadingIndicator();
        });
    }

    getLive(): void {
        abp.ui.setBusy(this.lives.nativeElement);
        this._iconizFinanceServiceProxy.getJinseLive().subscribe(result => {
            abp.ui.clearBusy(this.lives.nativeElement);
            this.liveItems = result.list[0].lives;
        });
        //$.ajax({
        //    url: 'https://api.jinse.com/live/list',
        //    success: function (data) {
        //        this.liveItems = JinseLiveOutput.fromJS(data);
        //    }
        //});
    }

    getTime(input): moment.Moment {
        if (input === undefined) {
            return moment();
        }
        return moment.unix(input);
    }
}

