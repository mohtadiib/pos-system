import { PosComponent } from '../../pages/pos/pos.component';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { Validators } from '@angular/forms';
import { SettingsComponent } from 'src/app/pages/settings/settings.component';
import { OutputsComponent } from 'src/app/pages/outputs/outputs.component';
import { TableData } from './side-model';

class DataSources {
  settingsList: any[] = [
    {
      title: 'المنتجات',
      router: 'products',
      path: 'products',
      icon: 'compress',
      hidAsBarButton: true,
      tableData: {
        // modelAddType:true,
        router: { main: '/products' },
        table: 'products',
        searchable: { keyFilter: 'name', placeholder: 'اسم المنتج' },
        customApiBody: {
          table: 'products',
          foreignFields: [
            { field: 'category_id', table: 'categories' },
            { field: 'unit_id', table: 'units' },
          ],
          limitRange: { start: 1, limitTo: 10 },
        },
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'المنتج', type: '', width: '18%' },
          { name: 'الكمية', type: '', hidden: true },
          { name: 'الوحدة', type: 'online_list', innerTableName: 'units' },
          { name: 'عدد القطع x الوحدة', type: '',width: '10%' },
          { name: 'الكمية بالقطعة', type: '',width: '10%' },
          { name: 'التكلفة', type: '' },
          { name: 'السعر', type: '' },
          { name: 'اقل كمية', type: '' },
          { name: 'الصورة', type: 'image_view' },
          {
            name: 'الحالة',
            type: 'tag',
            values: [
              { name: 'معلق', value: '0' },
              { name: 'نشط', value: '1' },
            ],
          },
        ],
        model: {
          doc_id: '',
          name: '',
          quantity_per_unit: '',
          unit_id: '',
          unit_item_qty: '',
          quantity: '',
          cost: '',
          price: '',
          minimum_qty: '',
          product_image: '',
          active: '1',
        },
      },
    },
    {
      title: 'المنتجات',
      router: 'categories',
      path: 'categories',
      icon: 'border-inner',
      tableData: {
        router: { main: '/categories' },
        customApiBody: {
          table: 'categories',
          limitRange: { start: 1, limitTo: 10 },
        },
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'اسم الفئة', type: '' },
          // { name: "سعر المتر", type: "" },
          { name: 'الصورة', type: 'image_view' },
          {
            name: 'الحالة',
            type: 'tag',
            values: [
              { name: 'نشط', value: '1' },
              { name: 'معلق', value: '0' },
            ],
          },
          { name: "المنتجات", type: "details", router: ['/category_products'], setName: true, disabled: true},
        ],
        model: {
          doc_id: '',
          name: '',
          // price: '',
          category_image: '',
          active: '1',
          category_products: undefined,
        },
      },
    },
    {
      title: 'الوحدات',
      icon: 'pie-chart',
      router: 'units',
      path: 'units',
      tableData: {
        router: { main: '/units' },
        table: 'units',
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          {
            name: 'اسم الوحدة',
            type: '',
            validators: {
              error: 'اسم الوحدة ضروري',
              values: [Validators.required],
            },
          },
          {
            name: 'الحالة',
            type: 'tag',
            values: [
              { name: 'معلق', value: '0' },
              { name: 'نشط', value: '1' },
            ],
          },
        ],
        model: {
          doc_id: '',
          name: '',
          active: '1',
        },
      },
    },
    {
      title: 'المستخدمين',
      icon: 'block',
      router: 'users',
      path: 'users',
      tableData: {
        router: { main: '/users' },
        customApiBody: {
          table: 'users',
          foreignFields: [{ field: 'department_id', table: 'departments' }],
          limitRange: { start: 1, limitTo: 10 },
        },
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'الإسم', type: '' },
          { name: 'اسم المستخدم', type: '' },
          { name: 'كلمة المرور', type: '' },
          {
            name: 'الصلاحية',
            type: 'tags_list',
            values: [
              { name: 'مبيعات', value: '0', color: '#1388c7' },
              { name: 'مدير', value: '1', color: '#deae47' },
              { name: 'مورد', value: '2', color: '#6c6c6c' },
              { name: 'عميل', value: '3', color: '#27a12b' },
              { name: 'مخزن', value: '4', color: '#e3950e' },
            ],
          },
          {
            name: 'الحالة',
            type: 'tag',
            values: [
              { name: 'معلق', value: '0' },
              { name: 'نشط', value: '1' },
            ],
          },
        ],
        model: {
          doc_id: '',
          name: '',
          username: '',
          password: '',
          role: '',
          active: '1',
        },
      },
    },
    {
      title: "الاعدادات",
      icon:"block",
      router: "configration",
      path:"configration",
      permissions: [0,2],
      tableData: {
        customCrud: [],
        router: { main:"configration"},
        table:"app_config",
        headers: [
          { name: "الرقم", type: "", hidden: true },
          { name: "ربط المخزن", type: "switch" }
        ],
        model:{
          doc_id: '',
          link_stock: '',
        }
      },
    },
  ];

  outputsList: any[] = [
    {
      title: 'المنصرفات',
      router: 'outputs',
      path: 'outputs',
      icon: 'switcher',
      tableData: {
        modelAddType: true,
        router: { main: '/outputs' },
        table: 'outputs',
        customCrud: ['add', 'return', 'edit'],
        customApiBody: {
          table: 'outputs',
          foreignFields: [
            { field: 'item_id', table: 'items' },
            { field: 'employee_id', table: 'users' },
          ],
          limitRange: { start: 1, limitTo: 10 },
        },
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'البند', type: 'online_list', innerTableName: 'items' },
          { name: 'التكلفة', type: '' },
          { name: 'الزمن', type: '' },
          {
            name: 'الحالة',
            type: 'tags_list',
            values: [
              { name: 'مسجل', value: '0', color: '#1388c7' },
              { name: 'مسجل', value: '1', color: '#1388c7' },
              { name: 'ملغي', value: '2', color: '#ff0000' },
            ],
          },
        ],
        model: {
          doc_id: '',
          item_id: '',
          moneyValue: '',
          timestamp: undefined,
          status: '0',
        },
      },
    },
    {
      title: 'بنود الصرف',
      router: 'items',
      path: 'items',
      icon: 'rotate-right',
      tableData: {
        router: { main: '/items' },
        table: 'items',
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'اسم البند', type: '' },
          {
            name: 'الحالة',
            type: 'tag',
            values: [
              { name: 'معلق', value: '0' },
              { name: 'نشط', value: '1' },
            ],
          },
        ],
        model: {
          doc_id: '',
          name: '',
          active: '1',
        },
      },
    },
  ];

  pagesDataTable: any[] = [
    {
      title: 'الرئيسية',
      router: '/dashboard',
      path: 'dashboard',
      icon: 'home',
      component: DashboardComponent,
      tableData: {
        router: { main: '/dashboard' },
        table: 'dashboard',
        headers: [
          { name: 'اسم الفئة', type: '' },
          {
            name: 'الحالة',
            type: '',
            values: [
              { name: 'نشط', value: '1' },
              { name: 'معلق', value: '0' },
            ],
          },
        ],
        model: {
          doc_id: '',
          name: '',
          active: '1',
        },
      },
    },
    {
      title: 'العملاء',
      icon: 'block',
      router: '/customers',
      path: 'customers',
      tableData: {
        searchable: { keyFilter: 'name', placeholder: "اكتب اسم العميل" },
        router: { main: '/customers' },
        customApiBody: {
          table: 'users',
          // foreignFields: [{ field: 'department_id', table: 'departments' }],
          limitRange: { start: 1, limitTo: 10 },
          where: "role = 3"
        },
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'الإسم', type: '' },
          { name: 'رقم الهاتف', type: '' },
          // { name: 'كلمة المرور', type: '' },
          {
            name: 'الحالة',
            type: 'tag',
            values: [
              { name: 'معلق', value: '0' },
              { name: 'نشط', value: '1' },
            ],
          },
          { name: "التفاصيل", type: "details", router:["/user_details"], setName: true, disabled: true}
        ],
        model: {
          doc_id: '',
          name: '',
          phone: '',
          // username: '',
          // password: '',
          // role: '',
          active: '1',
          user_details: undefined,
        },
      },
    },
    {
      title: 'نظام البيع',
      router: '/pos',
      path: 'pos',
      icon: 'up-circle',
      component: PosComponent,
    },
    {
      title: 'ادارة المبيعات',
      router: '/sales',
      path: 'sales',
      icon: 'shopping-cart',
      tableData: {
        router: { main: '/sales' },
        customApiBody: {
          table: 'sales',
          foreignFields: [
            { field: 'client_id', table: 'users' },
            { field: 'user_id', table: 'users' },
          ],
          inner_tables: {
            foreignField: 'sale_id',
            tables: ['sales_items'],
            get_length: true,
          },
          where: ' incoming = 0 ',
          withAdmin: true,
          limitRange: { start: 1, limitTo: 10 },
        },
        customCrud: ['return'],
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'العميل', type: 'online_list' },
          // { name: 'الموظف', type: 'online_list' },
          { name: 'الاجمالي', type: '' },
          { name: 'التخفيض', type: '' },
          {
            name: 'الدفع',
            type: 'tags_list',
            values: [
              { name: 'كاش', value: '0', color: '#71b649' },
              { name: 'بنكك', value: '1', color: '#deae47' },
              { name: 'دين', value: '2', color: '#888888' },
            ],
          },
          {
            name: 'حالة الاستلام',
            type: 'tags_list',
            values: [
              { name: 'لم يتم', value: '0', color: '#737373' },
              { name: 'تم', value: '1', color: '#45ce00' },
              { name: 'ملغي', value: '2', color: '#ff0000' },
            ],
          },
          { name: 'التاريخ', type: '', hidden: true },
          { name: "التفاصيل", type: "details", router:["/sale_details"], disabled: true}
        ],
        model: {
          doc_id: '',
          client_id: '',
          // user_id: '',
          total: '',
          discount: '',
          pay_type: '0',
          status: '0',
          created_at: '0',
          sales_items: undefined,
        },
      },
    },
    {
      title: 'المنصرفات',
      router: '/expenses/outputs',
      path: 'expenses',
      icon: 'switcher',
      component: OutputsComponent,
      children: this.outputsList,
      permissionsUserRole: [1],
    },
    {
      title: 'الوارد',
      icon: 'pie-chart',
      router: '/incoming',
      path: 'incoming',
      component: PosComponent,
      permissionsUserRole: [1],
    },
    {
      title: 'ادارة الوارد',
      router: '/incoming-management',
      path: 'incoming-management',
      icon: 'shopping-cart',
      tableData: {
        router: { main: '/incoming-management' },
        customApiBody: {
          table: 'sales',
          foreignFields: [
            { field: 'client_id', table: 'users' },
            { field: 'user_id', table: 'users' },
          ],
          inner_tables: {
            foreignField: 'sale_id',
            tables: ['sales_items'],
            get_length: true,
          },
          where: ' incoming = 1 ',
          limitRange: { start: 1, limitTo: 10 },
        },
        customCrud: ['return'],
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'المورد', type: 'online_list' },
          { name: 'الموظف', type: 'online_list' },
          { name: 'التكلفة', type: '' },
          { name: 'التخفيض', type: '' },
          {
            name: 'الدفع',
            type: 'tags_list',
            values: [
              { name: 'كاش', value: '0', color: '#71b649' },
              { name: 'بنكك', value: '1', color: '#deae47' },
              { name: 'دين', value: '2', color: '#888888' },
            ],
          },
          {
            name: 'الحالة',
            type: 'tags_list',
            values: [
              { name: 'لم يتم', value: '0', color: '#737373' },
              { name: 'تم', value: '1', color: '#45ce00' },
              { name: 'ملغي', value: '2', color: '#ff0000' },
            ],
          },
          { name: 'التاريخ', type: '', hidden: true },
          {
            name: 'الاصناف',
            type: 'list',
            innerModel: {
              title: 'الاصناف',
              router: { main: '/sales_items' },
              customApiBody: {
                table: 'sales_items',
                foreignField: { sale_id: '' },
                foreignFields: [{ field: 'product_id', table: 'products' }],
                withAdmin: true,
              },
              customCrud: [],
              headers: [
                { name: 'الرقم', type: '', hidden: true },
                {
                  name: 'اسم المنتج',
                  type: 'online_list',
                  innerTableName: 'products',
                },
                { name: 'الكمية', type: '' },
              ],
              model: {
                doc_id: '',
                product_id: '',
                quantity: '',
              },
            },
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
        },
      },
      permissionsUserRole: [1],
    },
    {
      title: 'الديون',
      router: '/debts',
      path: 'debts',
      icon: 'switcher',
      tableData: {
        router: { main: '/debts' },
        customApiBody: {
          table: 'debts',
          foreignFields: [
            { field: 'user_id', table: 'users' },
            { field: 'client_id', table: 'users' },
          ],
          limitRange: { start: 1, limitTo: 10 },
        },
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          {
            name: 'دائن / مدين',
            type: 'icons_list',
            values: [
              { name: 'مدين', value: '0', color: '#ff0000', icon: 'arrow-up' },
              {
                name: 'دائن',
                value: '1',
                color: '#27a100',
                icon: 'arrow-down',
              },
            ],
            disabled: true,
          },
          {
            name: 'المبلغ',
            type: '',
            completeModel: {
              title: 'دفع الدين',
              placeholder: 'ادخل المبلغ المدفوع',
              keyOfLinkedField: 'payed',
            },
          },
          { name: 'المدفوع', type: '', disabled: true },
          { name: 'رقم العملية', type: '', disabled: true },
          {
            name: 'الموظف',
            type: 'online_list',
            innerTableName: 'users',
            disabled: true,
          },
          {
            name: 'العميل / المورد',
            type: 'online_list',
            innerTableName: 'users',
          },
          {
            name: 'الحالة',
            type: 'tags_list',
            values: [
              { name: 'غير مسدد', value: '0', color: '#a9a9a9' },
              { name: 'مسدد', value: '1', color: '#27a100' },
              { name: 'ملغي', value: '2', color: '#ff0000' },
            ],
          },
          { name: 'الانشاء', type: '', disabled: true },
          { name: 'التعديل', type: '', disabled: true },
        ],
        searchable: { keyFilter: 'client_id' },
        model: {
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
        },
      },
      permissionsUserRole: [1],
    },
    {
      title: 'المحفظة',
      router: '/transactions',
      path: 'transactions',
      icon: 'swap',
      tableData: {
        title: 'العمليات',
        router: { main: '/transactions' },
        customApiBody: {
          table: 'transactions',
          // limit: 5
          limitRange: { start: 1, limitTo: 10 },
        },
        customCrud: ['add'],
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'المبلغ', type: '' },
          {
            name: 'نوع العملية',
            type: 'tags_list',
            values: [
              { name: 'مبيعات', value: '0', color: '#77b470' },
              { name: 'منصرفات', value: '1', color: '#e05050' },
              { name: 'وارد', value: '2', color: '#c9852c' },
              { name: 'رصيد', value: '3', color: '#0029ff' },
              { name: 'سداد دين', value: '4', color: '#e05050' },
            ],
            disabled: true,
          },
          {
            name: 'دائن / مدين',
            type: 'icons_list',
            values: [
              { name: 'دائن', value: '0', color: '#ff0000', icon: 'arrow-up' },
              {
                name: 'مدين',
                value: '1',
                color: '#27a100',
                icon: 'arrow-down',
              },
            ],
            disabled: true,
          },
          { name: 'تاريخ الانشاء', type: '', hidden: true },
          // { name: "تاريخ التعديل", type: "", hidden: true },
        ],
        model: {
          doc_id: '',
          amount: '',
          type: '',
          income: '',
          created_at: '',
          // updated_at: '',
        },
      },
      permissionsUserRole: [1],
    },
    {
      title: 'التقارير',
      router: '/report',
      path: 'report',
      icon: 'snippets',
      component: DashboardComponent,
      tableData: {
        router: { main: '/dashboard' },
        table: 'dashboard',
        headers: [
          { name: 'الرقم', type: '', hidden: true },
          { name: 'اسم الفئة', type: '' },
          {
            name: 'الحالة',
            type: '',
            values: [
              { name: 'نشط', value: '1' },
              { name: 'معلق', value: '0' },
            ],
          },
        ],
        model: {
          doc_id: '',
          name: '',
          active: '1',
        },
      },
      permissionsUserRole: [1],
    },
    {
      title: 'المخزن',
      router: '/settings/categories',
      path: 'settings',
      icon: 'setting',
      component: SettingsComponent,
      children: this.settingsList,
      permissionsUserRole: [1,4],
    },
  ];

  workerDeliverdModel: TableData = {
    router: { main:"/sale_delivery"},
    customApiBody:{
      table:"sale_delivery",
      foreignFields: [
        { field: 'worker_id', table: 'users' },
      ],
      // withAdmin:true
    },
    headers: [
      {
        name: 'اسم العامل',
        type: 'online_list',
        innerTableName: 'users',
        where:"",
        validators: { error: "Required", values: [Validators.required] }
      },
      { name: "ملاحظات", type: "" },
    ],
    model:{
      worker_id: '',
      remark: ''
    }
  }
}

export default DataSources;
