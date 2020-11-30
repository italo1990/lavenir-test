import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { IProduct } from 'src/app/shared/interfaces/iproduct';
import { ProductService } from 'src/app/shared/services/product.service';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { NgxSpinnerService } from "ngx-bootstrap-spinner";

import { NotifierService } from "angular-notifier";


@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {

  @Input() product: IProduct;

  public img: File = null;
  public imgURL:any;
  registerForm: FormGroup;
  private isEdit:boolean = false;
  public editProduct:any;

  private readonly notifier: NotifierService;

  constructor(
    private productService:ProductService, 
    private spinner: NgxSpinnerService,
    private router:Router,
    notifierService: NotifierService) { 
      let currentUrl = this.router.getCurrentNavigation().extractedUrl.toString();
      let productUpdate = this.router.getCurrentNavigation().extras.state;
      if(currentUrl == '/edit-product'){
        if(productUpdate == undefined){
          this.router.navigateByUrl('/catalog');
          
        }else{
          this.isEdit = true;
          this.editProduct = productUpdate;
        }
      }
      this.notifier = notifierService;
    }

  ngOnInit(): void {  
    this.loadForm();
  }

  loadForm(): void {
    this.registerForm = new FormGroup(
      {        
        name: new FormControl(this.isEdit ? this.editProduct.name : '', [Validators.required]),
        size: new FormControl(this.isEdit ? this.editProduct.size : ''),
        description: new FormControl(this.isEdit ? this.editProduct.description : ''),
        image: new FormControl(null)
      }
    );
    if(this.isEdit){
      this.imgURL = this.editProduct.imgUrl;
    }
  }

  fileSelected(event){
    this.img = event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.img);
    reader.onload = (_event) => {
      this.imgURL = reader.result;
    }
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.registerForm.patchValue({
      image: file
    });
    this.registerForm.get('image').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.imgURL = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  
  onSubmit(){    
    this.spinner.show();  
    if(this.isEdit){
      this.productService.editProduct(this.registerForm.value,this.editProduct.id,this.editProduct.imgUrl);
      this.productService.appData.subscribe(resp=>{
        if(resp != null){          
          this.spinner.hide();
          this.notifier.notify("success", "New product");  
          this.productService.resetObserver();
        }
      });
    }else{
      this.productService.newProduct(this.registerForm.value).subscribe();
      this.productService.appData.subscribe(resp=>{
        if(resp != null){          
          this.spinner.hide(); 
          this.notifier.notify("success", "New product"); 
          this.productService.resetObserver();
          this.registerForm.reset();
          this.registerForm.reset(this.registerForm.value);
          this.imgURL = null;
        }
      });
    }    
  }
}
