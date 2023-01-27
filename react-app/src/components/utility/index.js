
export function isNumber(n) {
    return typeof n === 'number' && isFinite(n);
}

export function isObjectEmpty(obj) {
    return Object.keys(obj).length === 0;
}

export function formatToCurrency(amount){
    if(amount === null || amount === undefined || amount === NaN) return '';

    if(!isNumber(amount)) return amount;

    return (amount).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); 
}
