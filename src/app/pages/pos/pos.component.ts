import {Component, OnInit} from '@angular/core';
import {TableDataService} from "../../components/table-data/table-data.service";
import {AuthService} from "../../services/auth.service";
import {Router} from "@angular/router";
import {numberFormat, priceFormat} from "../../common/math";
import { GlobalVariable } from 'src/app/common/consts';

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit{
  categoryId:string = '';
  nzSelectStatusError = false
  linkWithStock: boolean = true
  imageUrl: string = GlobalVariable.BASE_API_URL_IMAGES
  limitRange = { start: 1, limitTo: 10 }
  time: Date
  saleArgs: any = {clientId:"",paymentType:""}
  products: any[] = []
  users: any[] = []
  keyword: string = ""
  cart: any[] = []
  discount: number = 0
  payed: number = 0
  total: number = 0
  isShowModalReceipt: boolean = false
  receiptNo: string = ""
  receiptDate: string = ""

  constructor(
    private router: Router,
    public dataService:TableDataService,
    public authService:AuthService
    ) {
    this.time = null as any
  }
  isIncoming = () => this.router.url == "/incoming"
  getPriceKeyItem = () => this.isIncoming()? "cost":"price"
  getProductName = (product:any) => product.product

  isSalseAccount = () => this.authService.isSales() && this.isIncoming()
  isSalseAccountPos = () => this.authService.isSales() && !this.isIncoming()

  isStockAccount = () => this.authService.isStock() && this.isIncoming()
  isStockAccountPos = () => this.authService.isStock() && !this.isIncoming()
  
  isAdminAccount = () => this.authService.isManager() && this.isIncoming()

  getQuantity(product: any) {
    let quantity: number = 0
    if(this.isStockAccount() || this.isAdminAccount()){
      quantity = +product.quantity_per_unit
    }else{
      quantity = +product.quantity
    }
    return quantity.toFixed(0)
  }
  getUnit = (product: any) => this.isStockAccount() || this.isAdminAccount()? 
                                product.unit:product.unit_item_qty>1?"قطعة":product.unit
  
  getProductImage = (product:any) => product.product_image?this.imageUrl+product.product_image:"./assets/img/logo_grey.png"
  getProductCartImage = (product:any) => product.image?this.imageUrl+product.image:"./assets/img/logo_grey.png"
  
  receiveMessage($event:any) {
    this.categoryId = $event
  }

  ngOnInit(): void {
    if(this.isSalseAccount())
      this.saleArgs.clientId = "marketid"
   this.loadProducts()
  }
  
  async loadProducts() {
    const start = this.limitRange.start
    const limitTo = this.limitRange.start
    let urlPath = `customs/products/pos/stock/`;
    if(this.isSalseAccountPos()){
      urlPath = `customs/products/pos/`;
    }
    // let urlPath = `customs/products/pos/?start=${start}&limitTo=${limitTo}`;
    this.dataService.getDataWithGet(urlPath).subscribe((res:any)=> {
      this.products = res;
      this.loadUsers()
    })
  }

  async loadUsers() {
    let body = {table: 'users', where: ` role = ${+this.isIncoming()?'2':'3'} ` }
    this.dataService.getData(body).subscribe(res=>{
      // console.log(res)
      this.users = res;
    })
  }

  filteredProducts() {
    let list = this.products
    if (this.categoryId){
      list = this.products.filter(value => value?.category_id == this.categoryId)
    }
    const rg = this.keyword ? new RegExp(this.keyword, "gi") : null;
    return list.filter((p) => !rg || p.product.match(rg));
  }
  //Add item to Cart
  addToCart(product:any) {
    const index = this.findCartIndex(product);
    if(+product[this.getPriceKeyItem()] || this.isIncoming()){
      if (index === -1) {
        if(+product.quantity > 0 || this.isStockAccount() || !this.linkWithStock){
          this.cart.push({
            doc_id: product.doc_id,
            image: product.product_image,
            category: product?.category,
            name: this.getProductName(product),
            price: product[this.getPriceKeyItem()],
            option: product.option,
            qty: 1,
          });
        }else {
          this.dataService.createMessage("warning","الكمية في المخزن غير كافية")
        }
      } else {
        if (+product.quantity > +this.cart[index].qty || this.isStockAccount() || !this.linkWithStock){
           this.cart[index].qty += 1;
        }else {
          this.dataService.createMessage("warning","الكمية في المخزن غير كافية")
        }
      }
      this.beep();
    }else{
      this.dataService.createMessage("warning","لم تقم بتحديد سعر للمنتج")
    }
  }

  quantityChange(cartItem:any,event:any) {
    let quantity = event.target.value
    const index = this.findCartIndex(cartItem);
    const productIndex = this.findProductIndex(cartItem);
    if (+quantity < 1){
      event.target.value = 1;
      quantity = 1
    }
    const productQty = +this.products[productIndex].quantity

    if (productQty > +quantity || this.isStockAccount() || !this.linkWithStock){
      this.cart[index].qty = +quantity;
    }else {
      event.target.value = productQty;
      this.cart[index].qty = productQty;
      if(+quantity < 1){
        this.dataService.createMessage("warning","لا يمكن ادخال الرقم")
      }else{
        this.dataService.createMessage("warning","الكمية في المخزن غير كافية")
      }
    }
    this.beep();
  }

  findCartIndex(cartItem:any) {
    return this.cart.findIndex((p) => p.doc_id === cartItem.doc_id);
  }
  findProductIndex(product:any) {
    return this.products.findIndex((p) => p.doc_id === product.doc_id);
  }
  addQty(item:any, qty:any) {
    const productIndex = this.findProductIndex(item);
    const index = this.cart.findIndex((i) => i.doc_id === item.doc_id);
    if (index === -1) {
      return;
    }
    const afterAdd = item.qty + qty;
    if (afterAdd === 0) {
      this.cart.splice(index, 1);
      this.clearSound();
    } else {
      const productQty = +this.products[productIndex].quantity
      if (qty < 0){
        this.cart[index].qty = afterAdd;
      }else {
        if (productQty >= afterAdd || this.isStockAccount()){
          this.cart[index].qty = afterAdd;
        }else {
          this.dataService.createMessage("warning","الكمية في المخزن غير كافية")
        }
      }
      this.beep();
    }
  }
  addCash(amount:any) {
    this.discount = (this.discount || 0) + amount;
    this.beep();
  }
  getItemsCount() {
    return this.cart.reduce((count, item) => count + item.qty, 0);
  }
  getTotal() {
    return priceFormat( this.getTotalPrice() -  this.discount) ;
  }
  updateDiscount() {
    // const value = e.target
    // console.log("value");
    // this.discount = parseFloat(value.replace(/[^0-9]+/g, ""));
    // this.updateTotal();
  }
  updatePayed(e:any) {
    const value = e.target.value
    this.payed = parseFloat(value.replace(/[^0-9]+/g, ""));

    console.log(this.payed)
    
    const total = this.getTotalPrice() -  this.discount
    console.log(total)

    if (+this.payed > +total){
      this.dataService.createMessage("warning","المبلغ المدخل اكبر من الاجمالي")
      this.payed = total
    }

  }
  getTotalPrice() {
    return this.cart.reduce(
      (total, item) => total + item.qty * item.price,
      0
    );
  }
  submitable() {
    return this.total >= 0 && this.cart.length > 0;
  }

  getIncoming(){
    let incoming = 0
    if(this.isStockAccountPos()){
      incoming = 0
    }else if(this.isStockAccount()){
      incoming = 1
    }else if(this.isSalseAccount()){
      incoming = 2
    }else if(this.isSalseAccountPos()){
      incoming = 3
    }
    return incoming
  }
  submit() {
    const time = new Date();
    // this.receiptNo = `${Math.round(time.getTime() / 1000)}`;
    this.receiptDate = this.dateFormat(time);
    let total = this.getTotalPrice() -  this.discount
    let body: any = {
      client_id: this.saleArgs.clientId,
      total: total,
      discount: this.discount,
      payed: this.payed,
      pay_type: this.saleArgs.paymentType,
      incoming: this.getIncoming()
    }
    //if is transifer products to supermarket
    if(this.isSalseAccount()){
      body.isTransifer = true
    }
    let innerItemData: any[] = []
    this.cart.forEach(value => {
      innerItemData.push(
        {
          product_id:value.doc_id,
          quantity:value.qty,
          price:value.price,
          // sale_id: body.doc_id
        }
      )
    })
    body.innerItem = {table:"sales_items",data: innerItemData };
    // if (+body.pay_type == 2){
    //   body.innerItem2 = {
    //       table:"debts",
    //       where: { field:"client_id", value:"client_id"},
    //       data: {
    //         client_id: "client_id",
    //         money_value: "total",
    //         income: this.isIncoming()?1:0
    //       }
    //   }
    // }
    if (!body.client_id && this.isIncoming() && body.pay_type == 2){
      this.nzSelectStatusError = true
      this.dataService.createMessage('error',"قم باختيار مورد")
    }else {
      this.dataService.saveData(
        'sales',
        true,
        body,
        true
      ).subscribe((res:any)=>{
        // console.log(res)
        this.loadProducts()
        if (res.msg == true){
          if (this.isIncoming()){
            this.dataService.createMessage('success',`تمت العملية بنجاح`)
            this.router.navigate(["/incoming-management"])
          }else {
            if(res?.content){
              this.dataService.createMessage('warning',res?.content)
            }
            this.receiptNo = res.saleId??""
            this.isShowModalReceipt = true;
          }
        }else {
          if (res.msg == "Session Error"){
            this.dataService.createMessage('error',"خطا في الجلسة، قم باعادة تسجيل الدخول")
          }else {
            this.dataService.createMessage('error',res?.content)
          }
        }
      })
    }
  }
  //Select Client
  supplierSelect(event:any){
    console.log(event)
    if (!event && this.saleArgs.clientId){
        this.nzSelectStatusError = false
    }
    // console.log('clientId: ',this.saleArgs.clientId)
  }
  closeModalReceipt() {
    this.isShowModalReceipt = false;
    this.clear()
  }
  dateFormat(date:Date) {
    const formatter = new Intl.DateTimeFormat('id', { dateStyle: 'short', timeStyle: 'short'});
    return formatter.format(date);
  }
  clear() {
    this.discount = 0;
    this.cart = [];
    this.receiptNo = "";
    this.receiptDate = "";
    this.clearSound();
  }
  beep() {
    this.playSound("./assets/sound/beep-29.mp3");
  }
  clearSound() {
    this.playSound("./assets/sound/button-21.mp3");
  }
  playSound(src:any) {
    const sound = new Audio();
    sound.src = src;
    sound.play();
    // @ts-ignore
    // sound.onended = () => delete(sound);
  }
  printAndProceed() {
    this.router.navigate([`/pos/invoice/${this.receiptNo}`])
  }

  closeReciept(){
    this.isShowModalReceipt = false
    this.clear()
  }

  priceFormat = (price:number) => priceFormat(price);
  numberFormat = (price:number) => numberFormat(price);

  payTypeIsDebit = () => this.saleArgs.paymentType == '2'
  
  //product price
  priceChange(cartItem: any, event: any) {
    let inputPrice: number = +event.target.value.trim() || 0; // تحويل القيمة وإزالة الفراغات
    const index = this.findCartIndex(cartItem);
    const productIndex = this.findProductIndex(cartItem);
    
    let productPrice = +this.products[productIndex][this.getPriceKeyItem()];

    // التحقق من القيم غير الصفرية وعدم ترك الحقل فارغًا
    if (inputPrice < 1) {
        event.target.value = 1;
        this.dataService.createMessage("warning", "السعر لا يمكن أن يكون صفرًا أو فارغًا");
        this.cart[index][this.getPriceKeyItem()] = 1;
    } else if (5 < 4) {
    // } else if (inputPrice > productPrice) {
        this.dataService.createMessage("error", "السعر أكبر من سعر المنتج");
        this.cart[index][this.getPriceKeyItem()] = productPrice;
        event.target.value = productPrice;
    } else {
        this.cart[index][this.getPriceKeyItem()] = inputPrice;
    }
}

}

