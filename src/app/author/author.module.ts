import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppCommonModule } from '@app/shared/common/app-common.module';
import { UtilsModule } from '@shared/utils/utils.module';
import { ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { AuthorRoutingModule } from './author-routing.module';
import { AutoCompleteModule, EditorModule, FileUploadModule as PrimeNgFileUploadModule, InputMaskModule, PaginatorModule } from 'primeng/primeng';
import { TableModule } from 'primeng/table';
import { MytopicListComponent } from './mytopic-list/mytopic-list.component';
import { MytopicNeworeditComponent } from './mytopic-neworedit/mytopic-neworedit.component';
import { NgxSummernoteModule } from 'ngx-summernote';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        TabsModule,
        TooltipModule,
        AppCommonModule,
        UtilsModule,
        AuthorRoutingModule,
        TableModule,
        PaginatorModule,
        PrimeNgFileUploadModule,
        AutoCompleteModule,
        EditorModule,
        InputMaskModule,
        NgxSummernoteModule
    ],
    declarations: [
        MytopicListComponent,
        MytopicNeworeditComponent
    ]
})
export class AuthorModule { }
