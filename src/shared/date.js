export function formatDate (date, fmt,type) {
    let result = '';
    switch(type){
        case 0: 
            result = transformToDate(date,fmt);
        break;
        case 1:
            result =  returnDateWithFormat(date,fmt);
            break;
        default: break;
    }
    return result;
};

/**
 * 字符串格式转换
 */
function transformToDate(date,fmt){
    return date;
}
 
/**
 * 时间格式转换
 */
function returnDateWithFormat(date,fmt){
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (let k in o) {
        if (new RegExp(`(${k})`).test(fmt)) {
            let str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
}
function padLeftZero (str) {
    return ('00' + str).substr(str.length);
};