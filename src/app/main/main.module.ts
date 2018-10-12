import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {AppCommonModule} from '@app/shared/common/app-common.module';
import {UtilsModule} from '@shared/utils/utils.module';
import {ModalModule, TabsModule, TooltipModule} from 'ngx-bootstrap';
import {NewsComponent} from './news/news.component';
import {MainRoutingModule} from './main-routing.module';
import {PaginatorModule} from 'primeng/primeng';
import {OneNewsComponent} from './one-news/one-news.component';
import {MarketComponent} from './layout/market.component';
import {SliderComponent} from './layout/slider.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        MainRoutingModule,
        PaginatorModule,
    ],
    declarations: [
        NewsComponent,
        MarketComponent,
        OneNewsComponent,
        SliderComponent
    ]
})

export class MainModule {
}
