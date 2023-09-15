module.exports = (temp, prd) => {

    let output = temp.replace(/{%PRODUCT_NAME%}/g, prd.productName);
    output = output.replace(/{%IMAGE%}/g, prd.image);
    output = output.replace(/{%PRICE%}/g, prd.price);
    output = output.replace(/{%FROM%}/g, prd.from);
    output = output.replace(/{%NUTRIENTS%}/g, prd.nutrients);
    output = output.replace(/{%QUANTITY%}/g, prd.quantity);
    output = output.replace(/{%DESCRIPTION%}/g, prd.description);
    output = output.replace(/{%ID%}/g, prd.id);

    if(!prd.organic){
        output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic');
    }

    return output;
}

