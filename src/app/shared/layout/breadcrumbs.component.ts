import {Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '@shared/common/app-component-base';

@Component({
    templateUrl: './breadcrumbs.component.html',
    selector: 'breadcrumbs-bar'
})
export class BreadCrumbsComponent extends AppComponentBase implements OnInit {
    constructor(
        injector: Injector,
    ) {
        super(injector);
    }

    private titleLeft = '首页';
    private titleRight1 = '新闻';
    private titleRight2 = '新闻列表';
    private hrefUrl;

    ngOnInit(): void {
        let url = location.pathname;
        if (url.indexOf('main/news') > 0) {
        } else if (url.indexOf('main/onenews') > 0) {
            this.titleLeft = '首页';
            this.titleRight1 = '新闻';
            this.titleRight2 = '单篇新闻';
        } else if (url.indexOf('author/mytopics') > 0) {
            this.titleLeft = '作者';
            this.titleRight1 = '作者';
            this.titleRight2 = '我的投稿列表';
        } else if (url.indexOf('author/mytopicneworedit') > 0) {
            this.titleLeft = '作者';
            this.titleRight1 = '作者';
            this.titleRight2 = '编辑投稿';
        }
    }
}
