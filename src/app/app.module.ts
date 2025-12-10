import {importProvidersFrom, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {ButtonDirective} from "primeng/button";
import {MenubarModule} from "primeng/menubar";
import {TreeTableModule} from "primeng/treetable";
import {CardModule} from "primeng/card";
import {InputGroupModule} from "primeng/inputgroup";
import {Ripple} from "primeng/ripple";
import {KeyFilterModule} from "primeng/keyfilter";
import {TreeSelectModule} from "primeng/treeselect";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CheckboxModule} from "primeng/checkbox";
import {RadioButtonModule} from "primeng/radiobutton";
import {InputTextModule} from "primeng/inputtext";
import {DialogModule} from "primeng/dialog";
import {ListboxModule} from "primeng/listbox";
import {CalendarModule} from "primeng/calendar";
import {InputTextareaModule} from "primeng/inputtextarea";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MenubarComponent} from "./components/menubar/menubar.component";
import {DynamicTreeTableComponent} from "./intermediary-components/dynamic-tree-table/dynamic-tree-table.component";
import {DynamicDialogFormComponent} from "./intermediary-components/dynamic-dialog-form/dynamic-dialog-form.component";
import {DynamicDialogConfirmComponent} from "./intermediary-components/dynamic-dialog-confirm/dynamic-dialog-confirm.component";
import {ToDoOneToManyComponent} from "./components/to-do-one-to-many/to-do-one-to-many.component";
import {DynamicIconFormComponent} from "./intermediary-components/dynamic-icon-form/dynamic-icon-form.component";

@NgModule({
  declarations: [
    AppComponent,
    MenubarComponent,
    ToDoOneToManyComponent,
    DynamicTreeTableComponent,
    DynamicIconFormComponent,
    DynamicDialogFormComponent,
    DynamicDialogConfirmComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenubarModule,
    TreeTableModule,
    CardModule,
    InputGroupModule,
    ButtonDirective,
    Ripple,
    RadioButtonModule,
    CheckboxModule,
    ReactiveFormsModule,
    TreeSelectModule,
    KeyFilterModule,
    InputTextModule,
    InputGroupAddonModule,
    InputTextareaModule,
    CalendarModule,
    FormsModule,
    ListboxModule,
    DialogModule
  ],
  providers: [
    // for http client
    importProvidersFrom([BrowserAnimationsModule]), // works for DialogModule
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
