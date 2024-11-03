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

export const getCurrentDate = function (){
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  let yyyy = today.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}


export const numberToArabicWords = function (num:number) {
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
  const teens = ["", "أحد عشر", "اثنا عشر", "ثلاثة عشر", "أربعة عشر", "خمسة عشر", "ستة عشر", "سبعة عشر", "ثمانية عشر", "تسعة عشر"];
  const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const hundreds = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
  const scales = ["", "ألف", "مليون", "مليار", "تريليون"];

  if (num === 0) return "صفر جنيه سوداني";

  let parts = [];
  let scaleIndex = 0;

  while (num > 0) {
      let part = num % 1000;
      if (part > 0) {
          let partText = convertPartToWords(part);
          if (scaleIndex > 0) {
              partText += " " + scales[scaleIndex];
          }
          parts.unshift(partText.trim());
      }
      num = Math.floor(num / 1000);
      scaleIndex++;
  }

  return parts.join(" و ") + " جنيه سوداني";

  function convertPartToWords(part:number) {
      let result = "";

      if (Math.floor(part / 100) > 0) {
          result += hundreds[Math.floor(part / 100)];
          part %= 100;
          if (part > 0) result += " و ";
      }

      if (part >= 20) {
          result += tens[Math.floor(part / 10)];
          part %= 10;
          if (part > 0) result += " و ";
      }

      if (part > 10 && part < 20) {
          result += teens[part - 10];
      } else if (part > 0) {
          result += ones[part];
      }

      return result.trim();
  }
}



