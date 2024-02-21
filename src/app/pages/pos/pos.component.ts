import {Component, OnInit} from '@angular/core';
import {TableDataService} from "../../components/table-data/table-data.service";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-pos',
  templateUrl: './pos.component.html',
  styleUrls: ['./pos.component.css']
})
export class PosComponent implements OnInit{
  categoryId:string = '';
  constructor(public dataService:TableDataService, public authService:AuthService) {
    this.time = null as any
  }
  receiveMessage($event:any) {
    this.categoryId = $event
  }
  ngOnInit(): void {
   this.loadProducts()
  }
  // db: { addProduct: (product: any) => Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]>; getProducts: () => Promise<StoreValue<unknown, string>[]>; deleteProduct: (product: any) => Promise<void>; db: IDBPDatabase<unknown>; editProduct: (product: any) => Promise<number | string | Date | ArrayBufferView | ArrayBuffer | IDBValidKey[]> }
  time: Date
  firstTime: boolean = true
  products: any[] = []
  keyword: string = ""
  cart: any[] = []
  discount: number = 0
  total: number = 0
  isShowModalReceipt: boolean = false
  receiptNo: string = ""
  receiptDate: string = ""
  async loadProducts() {
    let body = {table: 'products'}
    this.dataService.getData(body).subscribe(res=>{
      this.products = res;
    })
  }
  filteredProducts() {
    let list = this.products
    if (this.categoryId){
      list = this.products.filter(value => value.category_id == this.categoryId)
    }
    const rg = this.keyword ? new RegExp(this.keyword, "gi") : null;
    return list.filter((p) => !rg || p.name.match(rg));
  }
  addToCart(product:any) {
    const index = this.findCartIndex(product);
    if (index === -1) {
      this.cart.push({
        productId: product.id,
        docId: product.doc_id,
        image: product.product_image,
        name: product.name,
        price: product.price,
        option: product.option,
        qty: 1,
      });
    } else {
      this.cart[index].qty += 1;
    }
    this.beep();
  }
  findCartIndex(product:any) {
    return this.cart.findIndex((p) => p.productId === product.id);
  }
  addQty(item:any, qty:any) {
    const index = this.cart.findIndex((i) => i.productId === item.productId);
    if (index === -1) {
      return;
    }
    const afterAdd = item.qty + qty;
    if (afterAdd === 0) {
      this.cart.splice(index, 1);
      this.clearSound();
    } else {
      this.cart[index].qty = afterAdd;
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
    return this.priceFormat( this.getTotalPrice() -  this.discount) ;
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
      doc_id: `${Date.now()}`,
      client_id: "123",
      total: total,
      discount: this.discount,
      user_id: this.authService.getToken(),
      pay_type: "1",
      // company_id: "123",
    }
    let innerItemData:any[] = []
    this.cart.forEach(value => {
      innerItemData.push(
        {
          product_id:value.docId,
          quantity:value.qty,
          sale_id: body.doc_id
        }
      )
    })
    body.innerItem = {table:"sales_items",data: innerItemData };
    // console.log(body)
    this.dataService.saveData(
      'sales',
      true,
      body,
      true
    ).subscribe((res)=>{
      console.log(res)
      this.isShowModalReceipt = true;
      //close focusing input
    })
  }
  closeModalReceipt() {
    this.isShowModalReceipt = false;
  }
  dateFormat(date:Date) {
    const formatter = new Intl.DateTimeFormat('id', { dateStyle: 'short', timeStyle: 'short'});
    return formatter.format(date);
  }
  numberFormat(number:number) {
    return (number || "")
      .toString()
      .replace(/^0|\./g, "")
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
  }
  priceFormat(number:number) {
    return number ? ` ${this.numberFormat(number)} جنيه ` : ``;
  }
  clear() {
    this.discount = 0;
    this.cart = [];
    this.receiptNo = "";
    this.receiptDate = "";
    this.clearSound();
  }
  beep() {
    this.playSound("../assets/sound/beep-29.mp3");
  }
  clearSound() {
    this.playSound("../assets/sound/button-21.mp3");
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
}

