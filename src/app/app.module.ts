import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { ProductGridComponent } from './shared/components/product-grid/product-grid.component';
import { RouteRoutingModule } from './route-routing.module';
import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';

@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    ProductGridComponent
  ],
  imports: [
    BrowserModule,
    RouteRoutingModule,
    AngularFireModule.initializeApp(environment.firebase)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
