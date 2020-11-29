import { Component, Input, OnInit } from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';
import { AngularFireStorage } from '@angular/fire/storage';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent implements OnInit {

  @Input() product: IProduct;

  constructor(private firestore: AngularFireStorage) { }

  ngOnInit(): void {
    this.getUrlImg();
  }

  getUrlImg(){
    this.firestore.ref(this.product.imgUrl).getDownloadURL().subscribe((resp:string)=>{
      this.product.imgUrl = resp;
    });
  }

}
