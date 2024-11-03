import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import fonts from '../../../common/fonts.json';

@Component({
  selector: 'app-download-btn',
  templateUrl: './download-btn.component.html',
  styleUrls: ['./download-btn.component.css']
})
export class DownloadBtnComponent {
  @Input() invoiceData: any = {}

  logo = fonts['logo']; // logo with Base64

  generatePDF() {
    const doc = new jsPDF('p', 'pt', 'a4');

    // إعداد الخط باستخدام البيانات من JSON
    doc.addFileToVFS("Amiri-Regular.ttf", fonts['Amiri-Regular']);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");

    // إضافة الشعار
    doc.addImage(this.logo, 'PNG', 40, 20, 50, 50); // x, y, العرض, الطول

    // عنوان الفاتورة
    doc.setFontSize(18);
    doc.text('فاتورة مبيعات', 300, 50, { align: 'center' });

    // معلومات الفاتورة
    doc.setFontSize(12);
    doc.text(`رقم الفاتورة: ${this.invoiceData.doc_id}`, 500, 80, { align: 'right' });
    doc.text(`التاريخ: ${this.invoiceData.created_at}`, 500, 100, { align: 'right' });
    doc.text(`اسم العميل: ${this.invoiceData.client_name}`, 500, 120, { align: 'right' });
    doc.text(`اسم المستخدم: ${this.invoiceData.user_name}`, 500, 140, { align: 'right' });
    doc.text(`طريقة الدفع: ${this.invoiceData.pay_type}`, 500, 160, { align: 'right' });

    // إعداد جدول المنتجات بحيث يظهر المنتج في العمود الأول
    const saleItems = this.invoiceData.saleItems.map((item:any) => [
      item.sum,
      item.quantity,
      item.price,
      item.product,
    ]);

    (doc as any).autoTable({
      head: [['المجموع', 'الكمية', 'السعر', 'المنتج']],
      body: saleItems,
      startY: 180,
      theme: 'grid',
      styles: { halign: 'center', font: 'Amiri' },
      headStyles: { fillColor: [243, 156, 18] },
      margin: { left: 40, right: 40 },
    });

    // إجمالي الفاتورة والملاحظات
    const finalY = (doc as any).autoTable.previous.finalY;
    doc.text(`الإجمالي: ${this.invoiceData.total} ريال`, 500, finalY + 20, { align: 'right' });
    doc.text(`الخصم: ${this.invoiceData.discount} ريال`, 500, finalY + 40, { align: 'right' });

    // حفظ ملف PDF
    doc.save('invoice.pdf');
  }

}
