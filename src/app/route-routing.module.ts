import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { NewProductComponent } from './pages/new-product/new-product.component';

const routes: Routes = [
  {path : 'catalog', component : CatalogComponent},
  {path : 'new-product', component : NewProductComponent},
  {path : 'edit-product', component : NewProductComponent},
  {path:'',redirectTo:'catalog', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class RouteRoutingModule { }
