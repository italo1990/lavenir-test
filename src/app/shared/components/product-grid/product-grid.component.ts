import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { IProduct } from '../../interfaces/iproduct';
import { AngularFireStorage } from '@angular/fire/storage';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ProductService } from '../../services/product.service';

import { NotifierService } from "angular-notifier";

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.css']
})
export class ProductGridComponent implements OnInit {

  @Input() product: IProduct;

  public faTrash = faTrash;
  public faEdit = faEdit;
  modalRef: BsModalRef;

  private readonly notifier: NotifierService;

  constructor(
    private modalService: BsModalService,
    private productService: ProductService,
    private notifierService: NotifierService
  ) { 
    this.notifier = notifierService;
  }

  ngOnInit(): void {
  }

  deleteModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {class: 'modal-sm'});
  }

  confirm(){
    this.productService.deleteProduct(this.product.id).then(resp=>{
      this.modalRef.hide();
      this.notifier.notify("success", "Delete done");
    }).catch(error=>{
      this.notifier.notify("error", "System error");
      console.log(error);
      this.modalRef.hide();
    }); 
    this.modalRef.hide();
  }
  decline(): void {
    this.modalRef.hide();
  }

}
