export const numberFormat = function (number:number) {
  return (number || "")
    .toString()
    .replace(/^0|\./g, "")
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
export const priceFormat = function (number:number) {
  return number ? ` ${numberFormat(number)} جنيه ` : ``;
}

export const convertArabicToEng = function (num:string) {
  const rules = {
    "٠": 0,
    "٩": 9,
    "٨": 8,
    "٧": 7,
    "٦": 6,
    "٥": 5,
    "٤": 4,
    "٣": 3,
    "٢": 2,
    "١": 1
  }

  let res = "";
  const romans = Object.keys(rules);
  const eng = Object.values(rules);

  for (let i = 0; i < romans.length; ++i) {
      if(num == romans[i]){
        res = eng[i].toString();
      }
  }
  return res;
};
