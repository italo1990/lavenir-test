import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductService } from '../../shared/services/product.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {

  public productList : IProduct[] = [];

  constructor(private productService:ProductService) { 
  }

  ngOnInit(): void {
    this.productService.getAllProduct().subscribe({
      next:(response)=>{
        this.productList = response;
      },
      error:(error)=>{
        console.log(error);
      }
    });    
  }
  nextPage(){
    this.productService.nextPage().subscribe(resp=>{
      this.productList = resp;
    });
  }
  previousPage(){
    this.productService.previousPage().subscribe(resp=>{
      this.productList = resp;
    });
  }
}
