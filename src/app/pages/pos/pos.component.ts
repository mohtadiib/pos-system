import {Component, OnInit} from '@angular/core';
import {TableDataService} from "../../components/table-data/table-data.service";
import {AuthService} from "../../services/auth.service";
import {ImagesGridService} from "../../components/table-data/images-grid/images-grid.service";
import {Router} from "@angular/router";
import {priceFormat} from "../../common/math";

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit{
  categoryId:string = '';
  nzSelectStatusError = false
  linkWithStock: boolean = false
  constructor(private router: Router,public dataService:TableDataService, public authService:AuthService, public imagesGridService:ImagesGridService) {
    this.time = null as any
  }
  isIncoming = () => this.router.url == "/incoming"
  getPriceKeyItem = () => this.isIncoming()? "cost":"price"
  getProductName = (product:any) => product.category_id.name
  receiveMessage($event:any) {
    this.categoryId = $event
  }
  ngOnInit(): void {
   this.loadProducts()
  }
  // db: { addProduct: (product: any) => Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]>; getProducts: () => Promise<StoreValue<unknown, string>[]>; deleteProduct: (product: any) => Promise<void>; db: IDBPDatabase<unknown>; editProduct: (product: any) => Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]> }
  time: Date
  saleArgs: any = {clientId:"",paymentType:""}
  products: any[] = []
  users: any[] = []
  keyword: string = ""
  cart: any[] = []
  discount: number = 0
  total: number = 0
  isShowModalReceipt: boolean = false
  receiptNo: string = ""
  receiptDate: string = ""
  async loadProducts() {
    let where = ""
    if (!this.isIncoming()){
      // where = "quantity > 0"
    }
    let body = {
      table: 'products',
      where: where,
      foreignFields: [
        { field: "category_id", table:"categories"},
        { field:"unit_id",table:"units" },
      ],
    }
    this.dataService.getData(body).subscribe(res=> {
      console.log(res)
      this.products = res;
      this.loadUsers()
    })
  }
  async loadUsers() {
    let body = {table: 'users', where: ` role = ${+this.isIncoming()?'2':'2'} ` }
    this.dataService.getData(body).subscribe(res=>{
      console.log(res)
      this.users = res;
    })
  }

  filteredProducts() {
    let list = this.products
    if (this.categoryId){
      list = this.products.filter(value => value.category_id.doc_id == this.categoryId)
    }
    const rg = this.keyword ? new RegExp(this.keyword, "gi") : null;
    return list.filter((p) => !rg || p.name.match(rg));
  }
  addToCart(product:any) {
    const index = this.findCartIndex(product);
    if (index === -1) {
      this.cart.push({
        doc_id: product.doc_id,
        image: product.product_image,
        category: product.category_id.name,
        name: this.getProductName(product),
        price: product[this.getPriceKeyItem()],
        option: product.option,
        qty: 1,
      });
    } else {
      if (+this.products[index].quantity > +this.cart[index].qty || this.isIncoming() || !this.linkWithStock){
         this.cart[index].qty += 1;
      }else {
        this.cart[index].qty = +this.products[index].quantity;
        this.dataService.createMessage("warning","الكمية في المخزن غير كافية")
      }
    }
    this.beep();
  }

  quantityChange(product:any,event:any) {
    let quantity = event.target.value
    const index = this.findCartIndex(product);
    if (+quantity < 1){
      event.target.value = 1;
      quantity = 1
    }
    if (+this.products[index].quantity > +quantity || this.isIncoming() || !this.linkWithStock){
      this.cart[index].qty = +quantity;
    }else {
      event.target.value = +this.products[index].quantity;
      this.cart[index].qty = +this.products[index].quantity;
      this.dataService.createMessage("warning","الكمية في المخزن غير كافية")
    }
    this.beep();
  }

  findCartIndex(product:any) {
    return this.cart.findIndex((p) => p.doc_id === product.doc_id);
  }
  addQty(item:any, qty:any) {
    const index = this.cart.findIndex((i) => i.doc_id === item.doc_id);
    if (index === -1) {
      return;
    }
    const afterAdd = item.qty + qty;
    if (afterAdd === 0) {
      this.cart.splice(index, 1);
      this.clearSound();
    } else {
      if (qty < 0){
        this.cart[index].qty = afterAdd;
      }else {
        if (+this.products[index].quantity > +this.cart[index].qty || this.isIncoming()){
          this.cart[index].qty = afterAdd;
        }else {
          this.cart[index].qty = +this.products[index].quantity;
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
    console.log("value");
    // this.discount = parseFloat(value.replace(/[^0-9]+/g, ""));
    // this.updateTotal();
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
  submit() {
    const time = new Date();
    this.receiptNo = `${Math.round(time.getTime() / 1000)}`;
    this.receiptDate = this.dateFormat(time);
    let total = this.getTotalPrice() -  this.discount
    let body: any = {
      client_id: this.saleArgs.clientId,
      total: total,
      discount: this.discount,
      pay_type: this.saleArgs.paymentType,
      incoming: this.isIncoming()?1:0
    }
    let innerItemData:any[] = []
    let innerItemData2:any[] = []
    this.cart.forEach(value => {
      innerItemData.push(
        {
          product_id:value.doc_id,
          quantity:value.qty,
          // sale_id: body.doc_id
        }
      )
    })
    body.innerItem = {table:"sales_items",data: innerItemData };
    if (+body.pay_type == 2){
      body.innerItem2 = {
          table:"debts",
          where: { field:"client_id", value:"client_id"},
          data: {
            client_id: "client_id",
            money_value: "total",
            income: this.isIncoming()?1:0
          }
      }
    }
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
        if (res.msg == true){
          if (this.isIncoming()){
            this.dataService.createMessage('success',`تمت العملية بنجاح`)
            this.router.navigate(["/incoming-management"])
          }else {
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
  }
  closeModalReceipt() {
    this.isShowModalReceipt = false;
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

    const receiptContent = document.getElementById('receipt-content');
    const titleBefore = document.title;
    const printArea = document.getElementById('print-area');
    if (printArea === null) {
      return
    }
    if (receiptContent === null) {
      return
    }
    printArea.innerHTML = receiptContent.innerHTML;
    document.title = this.receiptNo;

    window.print();
    this.isShowModalReceipt = false;

    printArea.innerHTML = '';
    document.title = titleBefore;

    // TODO save sale data to database
    this.clear();
  }

  priceFormat = (price:number) => priceFormat(price);
}

