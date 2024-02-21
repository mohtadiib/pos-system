
export interface SideModel {
  title: string;
  icon: string;
  router:string,
  submenu: SubMenuModel[]
}
export interface SubMenuModel {
  title: string;
  router: string;
  path:string
  index:number,
  tableData: TableData,
  component?:any
}

export interface TableData {
  title?:        string;
  router?:      {main:string,second?:string,editRoute?:string,docId?:string};
  index?:number
  table?:  string;
  foreignField?:  string;
  customApiBody?:any
  customCrud?:string[],
  customHeaders?:any
  headers?:any[];
  model?:any
  modelAddType?:boolean
  customAddButton?:any
  actionButtons?:any
}

