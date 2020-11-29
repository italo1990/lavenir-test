import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { IProduct } from '../interfaces/iproduct';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private fireStore: AngularFirestore) { }

  private firtsReference:any;
  private lastReference:any;
  private pagination:number = 3;
  private paginationLocation:number = 0;
  private previousIndex:any[] = [];

  public getAllProduct(){
    return this.fireStore.collection<IProduct>(`product`,
      ref=>ref
        .orderBy('createAt','asc')
        .limit(this.pagination)).snapshotChanges().pipe(
      map((element:any[]) => {
        this.firtsReference = element[0].payload.doc;
        this.lastReference = element[element.length-1].payload.doc;
        this.previousIndex.push(this.firtsReference);
        return element.map(item => {
          return item.payload.doc.data() as IProduct;
        });
      })
    );;
  }

  public nextPage(){
    return this.fireStore.collection<IProduct>(`product`,
      ref=>ref
        .limit(this.pagination)
        .orderBy('createAt','asc')
        .startAfter(this.lastReference)
      ).snapshotChanges().pipe(
      map((element:any[]) => {
        let newFirtsReference = element[0].payload.doc;
        if(this.previousElementArray(newFirtsReference) == undefined){
          this.previousIndex.push(newFirtsReference);
        }
        this.paginationLocation++;
        this.firtsReference = element[0].payload.doc;
        this.lastReference = element[element.length-1].payload.doc;
        return element.map(item => { 
          return item.payload.doc.data() as IProduct;
        });
      })
    );;
  }


  public previousPage(){
    return this.fireStore.collection<IProduct>('product',
      ref=>        
        ref
        .orderBy('createAt','asc')
        .startAt(this.previousIndex[this.paginationLocation-1])
        .endBefore(this.firtsReference)
        .limit(this.pagination)
        ).snapshotChanges()
        .pipe(take(1),
        map((element:any[]) => { console.log("dos veces");
        if(this.paginationLocation != 0){
          this.paginationLocation--;
        }
        this.firtsReference = element[0].payload.doc;
        this.lastReference = element[element.length-1].payload.doc;
        return element.map(item => {
          return item.payload.doc.data() as IProduct;
        });
      })
    );; 
  }
  private previousElementArray(newReference){
    return this.previousIndex.find(element => element.id == newReference.id);
  }
}
