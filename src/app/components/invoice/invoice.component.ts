import { Component, OnInit } from '@angular/core';
import { TableDataService } from '../table-data/table-data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { numberToArabicWords, priceFormat } from 'src/app/common/math';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.css']
})
export class InvoiceComponent {

  id: string = ''
  loading: boolean = false
  sale: any = {}
  isInvoice = () => this.activatedRoute.snapshot.url[1].path == 'invoice'

  constructor(
    private router: Router,
    public activatedRoute: ActivatedRoute,
    public tableDataService:TableDataService,
  ){
    this.id = this.activatedRoute.snapshot.paramMap.get('id')!
  }

  ngOnInit(){
    this.getSaleDetails()
    // let url = this.activatedRoute.snapshot.url[1].path
    // console.log(url[1].path)
  }

  getSaleDetails(){
    this.loading = true
    const path = `customs/sales/sale_details/?id=${this.id}`
    this.tableDataService.getDataWithGet(path).subscribe(res => {
      console.log(res)
      // console.log(JSON.stringify(res))
      this.loading = false
      this.sale = res
    })
  }

  // invoiceData = {
  //   doc_id: "3016427",
  //   user_id: "0946563",
  //   client_id: "3029407",
  //   total: "23004",
  //   discount: "0",
  //   status: "تم",
  //   pay_type: "كاش",
  //   incoming: "0",
  //   created_at: "2024-10-30 21:08:16",
  //   updated_at: "2024-10-30 21:08:16",
  //   client_name: "المهتدي حسن اعلي",
  //   user_name: "مهتدي",
  //   saleItems: [
  //     { product: "جلبة 1 بوصة - حديد", price: "5000", quantity: "3", sum: "15000" },
  //     { product: "جلبة 2 بوصة - حديد", price: "4000", quantity: "2", sum: "8000" },
  //     { product: "كوع 2 بوصة - حديد", price: "1", quantity: "4", sum: "4" }
  //   ]
  // };

  goToFullScreen(){
    this.router.navigate([`/pos/invoice/${this.id}`])
  }

  print() {
    window.print()
  }

  totalByText = (total:number) => numberToArabicWords(total)
  totalWithPriceFormat = (total:number) => priceFormat(total)

}
