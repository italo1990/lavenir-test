import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, map, take } from 'rxjs/operators';
import { IProduct } from '../interfaces/iproduct';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private fireStore: AngularFirestore, private storage: AngularFireStorage) { }

  private firtsReference:any;
  private lastReference:any;
  private pagination:number = 6;
  private paginationLocation:number = 0;
  private previousIndex:any[] = [];

  private $data: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  appData = this.$data.asObservable();

  public getAllProduct(){
    return this.fireStore.collection<IProduct>(`product`,
      ref=>ref
        .orderBy('createAt','asc')
        .limit(this.pagination)).snapshotChanges().pipe(
      map((element:any[]) => {
        if(element.length == 0){
          return [];
        }
        this.firtsReference = element[0].payload.doc;
        this.lastReference = element[element.length-1].payload.doc;
        this.previousIndex.push(this.firtsReference);
        return element.map(item => {
          const data = item.payload.doc.data();
          return {
            id: item.payload.doc.id,
            ...data as IProduct
          }
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
          const data = item.payload.doc.data();
          return {
            id: item.payload.doc.id,
            ...data as IProduct
          }
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
        map((element:any[]) => {
        if(this.paginationLocation != 0){
          this.paginationLocation--;
        }
        this.firtsReference = element[0].payload.doc;
        this.lastReference = element[element.length-1].payload.doc;
        return element.map(item => {
          const data = item.payload.doc.data();
          return {
            id: item.payload.doc.id,
            ...data as IProduct
          }
        });
      })
    );; 
  }
  private previousElementArray(newReference){
    return this.previousIndex.find(element => element.id == newReference.id);
  }

  public newProduct(data){
    let date = new Date;
    let imgUrl;
    let randomName = this.randomName();
    let refUrl = this.storage.ref(randomName);
    const imageProcess = this.storage.upload(randomName,data.image);
    return imageProcess.snapshotChanges().pipe(
      finalize(()=>{
        imgUrl = refUrl.getDownloadURL();
        imgUrl.subscribe(url =>{
          let newProduct:IProduct = {
            name:data.name,
            description:data.description,
            imgUrl:url,
            size: data.size,
            createAt: date.getTime().toString()
          };
          this.fireStore.collection('product').add(newProduct).then(resp=>{
            this.$data.next(this.randomName());
          });          
        });
      })
    );
  }

  public editProduct(data, id:string,deleteUrl){
    if(data.image == null){
      this.editDataDocument(data,id);
    }else{
        
      let randomName = this.randomName();
      let refUrl = this.storage.ref(randomName);

      const imageProcess = this.storage.upload(randomName,data.image);
      imageProcess.then(resp=>{
        let imgUrl = refUrl.getDownloadURL();
        imgUrl.subscribe(url =>{     
          this.editDataDocument(data,id,url,deleteUrl);
        });
      }).catch(error=>{
        console.log(error);
      });
    }
  }

  public editDataDocument(data, id:string,url?,deleteUrl?){
    delete data.image;
    let newData = data;
    if(url){
      newData.imgUrl = url;
    } console.log(newData);
    this.fireStore.collection('product').doc(id).update(newData).then(resp=>{
      if(url){
        this.storage.storage.refFromURL(deleteUrl).delete();        
      }else{
        this.$data.next(this.randomName());
      }      
    });
  }

  public deleteProduct(id:string):Promise<any>{
    return this.fireStore.collection('product').doc(id).delete();
  }

  private randomName(){
    const num = 8;
    let res = '';
    for(let i = 0; i < num; i++){
       const random = Math.floor(Math.random() * 27);
       res += String.fromCharCode(97 + random);
    };
    return res;
  }

  public resetObserver(){
    this.$data.next(null);
  }
}
