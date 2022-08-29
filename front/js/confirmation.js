//Récupèration de orderId passé dans l'URL
let str = window.location.href;
let url = new URL(str);
let idOrderUrl = url.searchParams.get('id');
console.log(idOrderUrl);

//afficha du numero
let orderNumber = document.querySelector('#orderId');
orderNumber.innerHTML = idOrderUrl;
