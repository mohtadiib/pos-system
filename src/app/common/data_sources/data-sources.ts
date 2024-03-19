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
      title: "الوارد",
      icon:"pie-chart",
      router: "/income",
      path:"income",
      tableData: {
        // modelAddType:true,
        router: { main:"/income"},
        customApiBody:{
          table:"incoming",
          foreignFields:[
            {field:"supplier_id",table:"users"},
            {field:"product_id",table:"products"},
          ],
          innerItem2: {
            conditionFiled: { pay_type: 2 },
            table:"debts",
            data: {
              client_id: "supplier_id",
              money_value: "total_cost"
            }
          }
        },
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "المورد", type: "online_list", innerTableName: "users", where: " role = 2 " },
          { name: "العنصر", type: "online_list", innerTableName: "products" },
          { name: "الكمية", type: "" },
          { name: "التكلفة", type: "" },
          { name: "الدفع", type: "tags_list",
            values:[
              {name:'كاش',value:'0',color:'#71b649'},
              {name:'بنكك',value:'1',color:'#deae47'},
              {name:'دين',value:'2',color:'#888888'},
            ]
          },
          { name: "الحالة", type: "tags_list",
            values: [
              {name:'لم يتم',value:'0',color:'#737373'},
              {name:'تم',value:'1',color:'#45ce00'},
              {name:'ملغي',value:'2',color:'#ff0000'},
            ]
          },
          { name: "تاريخ الإنشاء", type: "", disabled: true },
          { name: "تاريخ التعديل", type: "", disabled: true },
        ],
        model:{
          doc_id: '',
          supplier_id: '',
          product_id: '',
          quantity: '',
          total_cost: '',
          pay_type: '0',
          status: '1',
          created_at: Date.now(),
          updated_at: Date.now(),
        }
      },
      // permissions:[2]
    },
    {
      title: "الأصناف",
      router: "/products",
      path:"products",
      icon:'compress',
      tableData: {
        // modelAddType:true,
        router: { main:"/products"},
        table:"products",
        customApiBody:{
          table:"products",
          foreignFields: [
            { field: "category_id", table:"categories"},
            { field:"unit_id",table:"units" },
          ],
        },
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "الفئة", type: "online_list", innerTableName: "categories", categoryPrice: { keyItem: "category_id" } },
          { name: "المنتج", type: "" },
          { name: "المقاس", type: "", categoryPrice: { keyItem: "price" }  },
          { name: "الوحدة", type: "online_list", innerTableName: "units" },
          { name: "السعر", type: "", hidden: true},
          { name: "الكمية", type: "", hidden: true },
          { name: "اقل كمية", type: "" },
          { name: "الصورة", type: "image_view" },
          { name: "الحالة", type: "tag", values:[{name:'معلق',value:'0'}, {name:'نشط',value:'1'}]},
        ],
        model: {
          doc_id: '',
          category_id: '',
          name: '',
          size: '',
          unit_id: '',
          price: '',
          quantity: '',
          minimum_qty: '',
          product_image: '',
          active: '1',
        }
      }
    },
    {
      title: "الوحدات",
      icon:"pie-chart",
      router: "/units",
      path:"units",
      tableData: {
        router: { main:"/units"},
        table:"units",
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "اسم الوحدة", type: "" },
          { name: "الحالة", type: "tag", values:[{name:'معلق',value:'0'}, {name:'نشط',value:'1'}]},
        ],
        model:{
          doc_id: '',
          name: '',
          active: '1',
        }
      },
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
          { name: "سعر المتر", type: "" },
          { name: "الصورة", type: "image_view" },
          { name: "الحالة", type: "tag", values:[{name:'نشط',value:'1'}, {name:'معلق',value:'0'}]},
        ],
        model:{
          doc_id: '',
          name: '',
          price: '',
          category_image: '',
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
          foreignFields: [
            {field:"client_id",table:"users"},
            {field:"user_id",table:"users"}
          ],
          inner_tables:{foreignField:"sale_id",tables:["sales_items"],"get_length":true},
          // where: {field:"returned",value:"0"}
        },
        customCrud:["return"],
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "العميل", type: "online_list" },
          { name: "الموظف", type: "online_list" },
          { name: "الاجمالي", type: "" },
          { name: "التخفيض", type: "" },
          { name: "الدفع", type: "tags_list",
            values:[
              {name:'كاش',value:'0',color:'#71b649'},
              {name:'بنكك',value:'1',color:'#deae47'},
              {name:'دين',value:'2',color:'#888888'},
            ]
          },
          { name: "الحالة", type: "tags_list",
            values: [
              {name:'لم يتم',value:'0',color:'#737373'},
              {name:'تم',value:'1',color:'#45ce00'},
              {name:'ملغي',value:'2',color:'#ff0000'},
            ]
          },
          { name: "التاريخ", type: "", hidden: true },
          { name: "الاصناف", type: "list",
            innerModel: {
              title: "الاصناف",
              router: { main:"/sales_items"},
              customApiBody: {
                table:"sales_items",
                foreignField: {sale_id:""},
                foreignFields: [{field:"product_id",table:"products"}],
              },
              customCrud:[],
              headers: [
                { name: "الرقم", type: "", hidden: true },
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
        model: {
          doc_id: '',
          client_id: '',
          user_id: '',
          total: '',
          discount: '',
          pay_type: '0',
          status: '0',
          created_at: '0',
          sales_items: undefined,
        }
      }
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
          { name: "الإسم", type: "" },
          { name: "اسم المستخدم", type: "" },
          { name: "كلمة المرور", type: "" },
          { name: "الصلاحية", type: "tags_list",
            values:[
              {name:'مبيعات',value:'0',color:'#1388c7'},
              {name:'مدير',value:'1',color:'#deae47'},
              {name:'مورد',value:'2',color:'#6c6c6c'},
            ]
          },
          { name: "الحالة", type: "tag", values:[{name:'معلق',value:'0'}, {name:'نشط',value:'1'}]},
        ],
        model:{
          doc_id: '',
          name: '',
          username: '',
          password: '',
          role: '',
          active: '1',
        }
      },
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
        customCrud: ["add","return","edit"],
        customApiBody:{
          table:"outputs",
          foreignFields:[{field:"item_id",table:"items"},{field:"employee_id",table:"users"}],
        },
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "البند", type: "online_list", innerTableName: "items" },
          { name: "التكلفة", type: "" },
          { name: "الزمن", type: "" },
          { name: "الحالة", type: "tags_list",
            values:[
              {name:'مسجل',value:'0',color:'#1388c7'},
              {name:'مسجل',value:'1',color:'#1388c7'},
              {name:'ملغي',value:'2',color:'#ff0000'},
            ]
          },
        ],
        model:{
          doc_id: '',
          item_id: '',
          moneyValue: '',
          timestamp: undefined,
          status: '0',
        }
      }
    },
    {
      title: "الديون",
      router: "/debts",
      path:"debts",
      icon:'switcher',
      tableData: {
        router: { main:"/debts"},
        customApiBody:{
          table:"debts",
          foreignFields:[{field:"user_id",table:"users"},{field:"client_id",table:"users"}],
        },
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "دائن / مدين", type: "icons_list",
            values:[
              {name:'دائن',value:'0',color:'#27a100',icon:"arrow-down"},
              {name:'مدين',value:'1',color:'#ff0000',icon:"arrow-up"},
            ],
            disabled: true
          },
          { name: "المبلغ", type: "", completeModel: {title: "دفع الدين",placeholder:"ادخل المبلغ المدفوع"} },
          { name: "المدفوع", type: "", disabled: true},
          { name: "رقم العملية", type: "", disabled: true },
          { name: "الموظف", type: "online_list", innerTableName: "users", disabled: true },
          { name: "العميل", type: "online_list", innerTableName: "users" },
          { name: "الحالة", type: "tags_list",
            values:[
              {name:'غير مسدد',value:'0',color:'#a9a9a9'},
              {name:'مسدد',value:'1',color:'#27a100'},
              {name:'ملغي',value:'2',color:'#ff0000'}
            ],
          },
          { name: "الانشاء", type: "", disabled: true  },
          { name: "التعديل", type: "", disabled: true  },
        ],
        model:{
          doc_id: '',
          income: '0',
          money_value: '',
          payed: '',
          sale_id: '',
          user_id: '',
          client_id: '',
          debt_status: '',
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
    },
    {
      title: "العمليات",
      router: "/transactions",
      path:"transactions",
      icon:'transactions',
      tableData: {
          title: "العمليات",
          router: { main:"/transactions"},
          customApiBody: {
            table:"transactions",
            limit: 5
          },
          customCrud:["add"],
          headers: [
            { name: "الرقم", type: "", hidden: true },
            { name: "المبلغ", type: "" },
            { name: "نوع العملية", type: "tags_list",
              values:[
                {name:'مبيعات',value:'0',color:'#77b470'},
                {name:'منصرفات',value:'1',color:'#c26c6c'},
                {name:'وارد',value:'2',color:'#c9852c'},
                {name:'رصيد',value:'3',color:'#0029ff'},
              ],
              disabled: true
            },
            { name: "دائن / مدين", type: "icons_list",
              values:[
                {name:'دائن',value:'0',color:'#ff0000',icon:"arrow-up"},
                {name:'مدين',value:'1',color:'#27a100',icon:"arrow-down"},
              ],
              disabled: true
            },
            { name: "تاريخ الانشاء", type: "", hidden: true },
            // { name: "تاريخ التعديل", type: "", hidden: true },
          ],
          model:{
            doc_id: '',
            amount: '',
            type: '',
            income: '',
            created_at: '',
            // updated_at: '',
          }
        }
    }
    ]
}

export default DataSources
// {
//   title: "Wallets",
//     router: "/wallets",
//   path:"wallets",
//   icon:'shopping-cart',
//   tableData:{
//   router: { main:"/wallets"},
//   customApiBody:{
//     table:"wallets",
//       foreignFields: [
//       {field:"wallet_user_id",table:"users"}
//     ],
//       inner_tables:{foreignField:"wallet_id",tables:["wallet_transactions"],"get_length":true},
//   },
//   // customCrud:["return"],
//   headers: [
//     { name: "الرقم", type: "", hidden: true },
//     { name: "المستخدم", type: "online_list", innerTableName: "users" },
//     { name: "الرصيد", type: "" },
//     { name: "تاريخ الإنشاء", type: "", disabled: true },
//     { name: "تاريخ التعديل", type: "", disabled: true },
//     { name: "الحالة", type: "tags_list",
//       values: [
//         {name:'موقوفة',value:'0',color:'#737373'},
//         {name:'نشطة',value:'1',color:'#45ce00'},
//       ]
//     },
//     { name: "العمليات", type: "list",
//       innerModel: {
//         title: "العمليات",
//         router: { main:"/wallet_transactions"},
//         customApiBody: {
//           table:"wallet_transactions",
//           foreignField: {wallet_id:""},
//         },
//         customCrud:[],
//         headers: [
//           { name: "الرقم", type: "", hidden: true },
//           { name: "المبلغ", type: "", hidden: true },
//           { name: "نوع العملية", type: "", hidden: true },
//           { name: "تاريخ الانشاء", type: "", hidden: true },
//           { name: "تاريخ التعديل", type: "", hidden: true },
//         ],
//         model:{
//           doc_id: '',
//           amount: '',
//           type: '',
//           created_at: '',
//           updated_at: '',
//         }
//       }
//     },
//   ],
//     model: {
//     doc_id: '',
//       wallet_user_id: '',
//       balance: '',
//       created_at: '',
//       updated_at: '',
//       active: '1',
//       wallet_transactions: undefined,
//   }
// }
// },
// {
//   title: "الصلاحيات",
//     icon:"block",
//   router: "/departments",
//   path:"departments",
//   tableData: {
//   router: { main:"/departments"},
//   table:"departments",
//     headers: [
//     { name: "الرقم", type: "", hidden: true },
//     { name: "الاسم", type: "" },
//     { name: "الصلاحية", type: "tags_list",
//       values:[
//         {name:'مبيعات',value:'0',color:'#1388c7'},
//         {name:'مدير',value:'1',color:'#deae47'},
//         {name:'مورد',value:'2',color:'#6c6c6c'},
//       ]
//     },
//     { name: "الحالة", type: "tag", values:[{name:'معلق',value:'0'}, {name:'نشط',value:'1'}]},
//   ],
//     model:{
//     doc_id: '',
//       name: '',
//       type: '',
//       active: '1',
//   }
// },
// },
