import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewsComponent } from './news/news.component';
import { OneNewsComponent } from './one-news/one-news.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'news', component: NewsComponent },
                    { path: 'onenews', component: OneNewsComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MainRoutingModule { }
