import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MytopicListComponent } from './mytopic-list/mytopic-list.component';
import { MytopicNeworeditComponent } from './mytopic-neworedit/mytopic-neworedit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                children: [
                    { path: 'mytopics', component: MytopicListComponent },
                    { path: 'mytopicneworedit', component: MytopicNeworeditComponent }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AuthorRoutingModule { }
