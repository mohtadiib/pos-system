import {SideModel} from "./side-model";
import {PosComponent} from "../../pages/pos/pos.component";
import {DashboardComponent} from "../../pages/dashboard/dashboard.component";

class DataSources{
  pagesDataTable: any[] = [
    {
      title: "الرئيسية",
      router: "/dashboard",
      path:"dashboard",
      icon:'home',
      component: DashboardComponent,
      tableData: {
        router: { main:"/dashboard"},
        table:"dashboard",
        headers: [
          { name: "اسم الفئة", type: "" },
          { name: "الحالة", type: "", values:[{name:'نشط',value:'1'}, {name:'معلق',value:'0'}]},
        ],
        model:{
          doc_id: '',
          name: '',
          active: '1',
        }
      }
    },
    {
      title: "الفئات",
      router: "/categories",
      path:"categories",
      icon:'border-inner',
      tableData: {
        router: { main:"/categories"},
        table:"categories",
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "اسم الفئة", type: "" },
          { name: "الحالة", type: "tag", values:[{name:'نشط',value:'1'}, {name:'معلق',value:'0'}]},
        ],
        model:{
          doc_id: '',
          name: '',
          active: '1',
        }
      }
    },
    {
      title: "المنتجات",
      router: "/products",
      path:"products",
      icon:'compress',
      tableData: {
        router: { main:"/products"},
        table:"products",
        customApiBody:{
          table:"products",
          foreignFields: [ { field: "category_id", table:"categories" }],
        },
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "المنتج", type: "" },
          { name: "الفئة", type: "online_list", innerTableName: "categories" },
          { name: "السعر", type: "" },
          { name: "الصورة", type: "image_view" },
          { name: "الحالة", type: "tag", values:[{name:'معلق',value:'0'}, {name:'نشط',value:'1'}]},
        ],
        model:{
          doc_id: '',
          name: '',
          category_id: '',
          price: '',
          product_image: '',
          active: '1',
        }
      }
    },
    {
      title: "POS",
      router: "/pos",
      path:"pos",
      icon:'up-circle',
      component: PosComponent,
      tableData: {
        table: "products",
        customApiBody:{
          table:"products",
          foreignField: { foreignKeys: ["category_id"]},
          inner_tables:[ "categories" ]
        },
        headers: [
          { name: "المنتج", type: "" },
          { name: "الفئة", type: "online_list", innerTableName: "categories" },
          { name: "السعر", type: "" },
          { name: "الصورة", type: "" },
          { name: "الحالة", type: "tag", values:[{name:'نشط',value:'1'}, {name:'معلق',value:'0'}]},
        ],
        model:{
          doc_id: '',
          product_name: '',
          category_id: '',
          price: '',
          product_image: '',
          active: '1',
        }
      }
    },
    {
      title: "ادارة المبيعات",
      router: "/sales",
      path:"sales",
      icon:'shopping-cart',
      tableData:{
        router: { main:"/sales"},
        customApiBody:{
          table:"sales",
          foreignFields:[
            {field:"client_id",table:"users"},
            {field:"user_id",table:"users"}
          ],
          inner_tables:{foreignField:"doc_id",tables:["sales_items"]},
          // where: {field:"returned",value:"0"}
        },
        customCrud:['return'],
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "العميل", type: "online_list" },
          { name: "الموظف", type: "online_list" },
          { name: "الاجمالي", type: "" },
          { name: "التخفيض", type: "" },
          { name: "الدفع", type: "fill_tag", values:[{name:'بنكك',value:'0',color:""}, {name:'كاش',value:'1',color:""}] },
          { name: "الحالة", type: "fill_tag", values:[{name:'لم يتم',value:'0',color:""}, {name:'تم',value:'1',color:""}] },
          { name: "الاصناف", type: "list",
            innerModel: {
              title: "الاصناف",
              router: { main:"/sales_items"},
              customApiBody:{
                table:"sales_items",
                foreignKey: {sale_id:""},
                foreignFields: [{field:"product_id",table:"products"}],
              },
              customCrud:[],
              headers: [
                { name: "اسم المنتج", type: "online_list", innerTableName: "products" },
                { name: "الكمية", type: "" },
              ],
              model:{
                doc_id: '',
                product_id: '',
                quantity: '',
              }
            }
          },
        ],
        model:{
          doc_id: '',
          client_id: '',
          user_id: '',
          total: '',
          discount: '',
          pay_type: '0',
          status: '0',
          sales_items: undefined,
        }
      }
    },
    {
      title: "الصلاحيات",
      icon:"block",
      router: "/departments",
      path:"departments",
      tableData: {
        router: { main:"/departments"},
        table:"departments",
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "الاسم", type: "" },
          { name: "الصلاحية", type: "tags_list",
            values:[
              {name:'مبيعات',value:'0',color:'#1388c7'},
              {name:'مدير',value:'1',color:'#deae47'},
              {name:'مبيعات',value:'2',color:'#39c23e'},
            ]
          },
          { name: "الحالة", type: "tag", values:[{name:'معلق',value:'0'}, {name:'نشط',value:'1'}]},
        ],
        model:{
          doc_id: '',
          name: '',
          type: '',
          active: '1',
        }
      },
    },
    {
      title: "المستخدمين",
      icon:"block",
      router: "/users",
      path:"users",
      tableData: {
        router: { main:"/users"},
        customApiBody:{
          table:"users",
          foreignFields:[
            {field:"department_id",table:"departments"},
          ],
          // withAdmin:true
        },
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "القسم", type: "online_list", innerTableName: "departments" },
          { name: "الإسم", type: "" },
          { name: "اسم المستخدم", type: "" },
          { name: "كلمة المرور", type: "" },
          { name: "الحالة", type: "tag", values:[{name:'معلق',value:'0'}, {name:'نشط',value:'1'}]},
        ],
        model:{
          doc_id: '',
          department_id: '',
          name: '',
          username: '',
          password: '',
          active: '1',
        }
      },
      permissions:[1]
    },
    {
      title: "بنود الصرف",
      router: "/items",
      path:"items",
      icon:'rotate-right',
      tableData: {
        router: { main:"/items"},
        table:"items",
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "اسم البند", type: "" },
          { name: "الحالة", type: "tag", values:[{name:'معلق',value:'0'}, {name:'نشط',value:'1'}]},
        ],
        model:{
          doc_id: '',
          name: '',
          active: '1',
        }
      }
    },
    {
      title: "المنصرفات",
      router: "/outputs",
      path:"outputs",
      icon:'switcher',
      tableData: {
        router: { main:"/outputs"},
        table:"outputs",
        customApiBody:{
          table:"outputs",
          foreignFields:[{field:"item_id",table:"items"},{field:"employee_id",table:"users"}],
        },
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "البند", type: "online_list", innerTableName: "items" },
          { name: "التكلفة", type: "" },
          { name: "الزمن", type: "" },
          { name: "الحالة", type: "tag", values:[{name:'معلق',value:'0'}, {name:'نشط',value:'1'}]},
        ],
        model:{
          doc_id: '',
          item_id: '',
          moneyValue: '',
          timestamp: undefined,
          active: '1',
        }
      }
    },
    {
      title: "الديون",
      router: "/depts",
      path:"depts",
      icon:'switcher',
      tableData: {
        router: { main:"/depts"},
        customApiBody:{
          table:"depts",
          foreignFields:[{field:"user_id",table:"users"},{field:"client_id",table:"users"}],
        },
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "الحالة", type: "tags_list",
            values:[
              {name:'غير مسدد',value:'0',color:'#a9a9a9'},
              {name:'مسدد',value:'1',color:'#27a100'}
            ]
          },
          { name: "المبلغ", type: "" },
          { name: "رقم العملية", type: "", disabled: true },
          { name: "الموظف", type: "online_list", innerTableName: "users", disabled: true },
          { name: "العميل", type: "online_list", innerTableName: "users" },
          { name: "الانشاء", type: "", disabled: true  },
          { name: "التعديل", type: "", disabled: true  },
        ],
        model:{
          doc_id: '',
          debt_status: '',
          many_value: '',

          sale_id: '',
          user_id: '',
          client_id: '',

          created_at: Date.now(),
          updated_at: Date.now(),
        }
      }
    },
    {
      title: "التقارير",
      router: "/report",
      path:"report",
      icon:'snippets',
      component: DashboardComponent,
      tableData: {
        router: { main:"/dashboard"},
        table:"dashboard",
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "اسم الفئة", type: "" },
          { name: "الحالة", type: "", values:[{name:'نشط',value:'1'}, {name:'معلق',value:'0'}]},
        ],
        model:{
          doc_id: '',
          name: '',
          active: '1',
        }
      }
    }
  ]
}

export default DataSources
