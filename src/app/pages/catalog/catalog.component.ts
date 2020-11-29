import { Component, OnInit } from '@angular/core';
import { IProduct } from '../../shared/interfaces/iproduct';
import { ProductService } from '../../shared/services/product.service';
@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})
export class CatalogComponent implements OnInit {/*

  public productList : IProduct[] = [
    {imgUrl:'ps5.jpg',name:'Playstation 5', description: 'consola de última generación de sony', size:50},
    {imgUrl:'switch_lite.jpg',name:'Nintendo Switch Lite', description: 'Consola de nintendo, versión solo portatil', size:20},
    {imgUrl:'switch.jpg',name:'Nintendo Switch', description: 'Consola de última generación de Nintendo', size:30},
    {imgUrl:'xbox_series_x.jpg',name:'Xbox Series X', description: 'Consola de microsoft, versión con 4k nativos', size:40},
    {imgUrl:'xbox_series_s.jpg',name:'Xbox Series S', description: 'Consola de microsft, con resolución 2k', size:35},
  ];
*/

  public productList : IProduct[];
  constructor(private productService:ProductService) { }

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
