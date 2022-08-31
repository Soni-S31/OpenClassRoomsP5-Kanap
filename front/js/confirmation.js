//Récupèration de idOrder passé dans l'URL
let str = window.location.href;
let url = new URL(str);
let idOrderUrl = url.searchParams.get('id');
console.log(idOrderUrl);

//affichage du numero
let orderNumber = document.querySelector('#orderId');
orderNumber.innerHTML = idOrderUrl;
