import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductGridComponent } from './shared/components/product-grid/product-grid.component';
import { RouteRoutingModule } from './route-routing.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { NewProductComponent } from './pages/new-product/new-product.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgxSpinnerModule } from "ngx-bootstrap-spinner";
import { NotifierModule, NotifierOptions } from 'angular-notifier';

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
        position: 'right'
    },
    vertical: {
        position: 'top'
    }
},
}

@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    ProductGridComponent,
    NewProductComponent
  ],
  imports: [
    BrowserModule,
    RouteRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    ModalModule.forRoot(),
    NgxSpinnerModule,
    NotifierModule.withConfig(customNotifierOptions),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
