import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import fonts from '../../../common/fonts.json';

@Component({
  selector: 'app-pdf-reports',
  templateUrl: './pdf-reports.component.html',
  styleUrls: ['./pdf-reports.component.css']
})
export class PdfReportsComponent {
  @Input() listOfData: any[] = [];
  @Input() listOfKeys: any[] = []; // إضافة نوع مع المفتاح لسهولة المعالجة
  @Input() keysEditModel: string[] = [];
  @Input() title: string = "";
  headers: string[] = [];
  saleItems: any[][] = []; // مصفوفة ثنائية الأبعاد تمثل الصفوف

  logo = fonts['logo']; // الشعار بصيغة Base64

  generatePDF() {
    // إنشاء رؤوس الجدول
    this.headers = this.listOfKeys.map((element) => element.name);
    console.log('Headers:', this.headers);

    // تجهيز بيانات الجدول من خلال مطابقة المفاتيح وإضافتها كصفوف
    this.saleItems = this.listOfData.map((item) => {
      return this.keysEditModel.map((key) => item[key] || ''); // استخدام قيمة فارغة إذا لم يكن المفتاح موجوداً
    });

    console.log('Sale Items:', this.saleItems);

    const doc = new jsPDF('p', 'pt', 'a4');

    // إعداد الخط باستخدام البيانات من JSON
    doc.addFileToVFS("Amiri-Regular.ttf", fonts['Amiri-Regular']);
    doc.addFont("Amiri-Regular.ttf", "Amiri", "normal");
    doc.setFont("Amiri");

    // إضافة الشعار
    doc.addImage(this.logo, 'PNG', 40, 20, 50, 50); // x, y, العرض, الطول

    // عنوان الفاتورة
    doc.setFontSize(18);
    doc.text(this.title ?? "", 300, 50, { align: 'center' });

    // إنشاء جدول PDF باستخدام autoTable
    (doc as any).autoTable({
      head: [this.headers],
      body: this.saleItems,
      startY: 100, // تعديل الموضع لعدم التداخل مع الشعار
      theme: 'grid',
      styles: { halign: 'center', font: 'Amiri' },
      headStyles: { fillColor: [243, 156, 18] },
      margin: { left: 40, right: 40 },
    });

    // حفظ ملف PDF
    doc.save('invoice.pdf');
  }
}
