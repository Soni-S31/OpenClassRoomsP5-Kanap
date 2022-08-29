// recupérer panier du localstorage
let productInStorage = localStorage.getItem('basket');
let basket = JSON.parse(productInStorage);
console.log(productInStorage);

// recupération de la section pour insertion 'article'
let cartItems = document.querySelector('#cart__items');

////// function affichage du panier

function showProducts(item) {
    let unitArticle = '';
    // affichage article
    const itemArticle = document.createElement('article');
    itemArticle.className = 'cart__item';
    itemArticle.setAttribute('data-id', item.id);
    itemArticle.setAttribute('data-color', item.color);
    cartItems.appendChild(itemArticle);
    console.log('affichage article ok');

    //DIV img
    const itemDivImg = document.createElement('div');
    itemDivImg.className = 'cart__item__img';
    itemArticle.appendChild(itemDivImg);

    //img via API
    fetch('http://localhost:3000/api/products/' + item.id)
        .then((response) => response.json())
        .then(async function (resultatAPI) {
            unitArticle = await resultatAPI;
            //insertion
            const itemImg = document.createElement('img');
            itemImg.setAttribute('src', unitArticle.imageUrl);
            itemImg.setAttribute('alt', unitArticle.altTxt);
            itemDivImg.appendChild(itemImg);
        })
        .catch((error) => alert('Erreur : ' + error));

    //Div Content Description
    const itemDivContDesc = document.createElement('div');
    itemDivContDesc.className = 'cart__item__content';
    itemArticle.appendChild(itemDivContDesc);

    // Div description
    const itemDivDesc = document.createElement('div');
    itemDivDesc.className = 'cart__item__content__description';
    itemDivContDesc.appendChild(itemDivDesc);

    // h2 > nom
    const itemName = document.createElement('h2');
    itemName.textContent = item.name;
    itemDivDesc.appendChild(itemName);

    //couleur choisie
    let itemColor = document.createElement('p');
    itemColor.textContent = 'Couleur : ' + item.color;
    itemDivDesc.appendChild(itemColor);

    // Prix via api

    fetch('http://localhost:3000/api/products/' + item.id)
        .then((response) => response.json())
        .then(async function (resultatAPI) {
            unitArticle = await resultatAPI;
            //insertion
            const itemPrice = document.createElement('p');
            itemPrice.textContent =
                'Prix unitaire : ' + unitArticle.price + ' €';
            itemDivDesc.appendChild(itemPrice);
        })
        .catch((error) => alert('Erreur récupération prix' + error));

    // Div content setting
    const itemDivSet = document.createElement('div');
    itemDivSet.className = 'cart__item__content__settings';
    itemDivContDesc.appendChild(itemDivSet);

    // Div setting quantité
    const itemSetQuantity = document.createElement('div');
    itemSetQuantity.className = 'cart__item__content__settings__quantity';
    itemDivSet.appendChild(itemSetQuantity);

    // P > quantité
    const itemPQuantity = document.createElement('P');
    itemPQuantity.textContent = 'Qté :';
    itemSetQuantity.appendChild(itemPQuantity);

    // quantité souhaité
    const itemQuantity = document.createElement('input');
    itemQuantity.className = 'itemQuantity';
    itemQuantity.setAttribute('type', 'number');
    itemQuantity.setAttribute('name', 'itemQuantity');
    itemQuantity.setAttribute('min', 'O');
    itemQuantity.setAttribute('max', '100');
    itemQuantity.setAttribute('value', item.quantity);
    itemSetQuantity.appendChild(itemQuantity);

    // Div delete item
    const itemDivDelete = document.createElement('div');
    itemDivDelete.className = 'cart__item__content__settings__delete';
    itemDivSet.appendChild(itemDivDelete);
    // P Delete
    const itemPDelete = document.createElement('p');
    itemPDelete.className = 'deleteItem';
    itemPDelete.textContent = 'Supprimer';
    itemDivDelete.appendChild(itemPDelete);
}

//Appel de l'APi pour les infos produit
async function getProduct(id) {
    return fetch('http://localhost:3000/api/products/' + id)
        .then((response) => response.json())
        .catch((error) => alert('Erreur : ' + error));
}

//Affichage panier
let priceTotal = 0;
async function showBasket() {
    //si vide
    if (productInStorage == null) {
        let basketEmpty = document.createElement('p');
        basketEmpty.textContent = 'Le panier est vide';
        cartItems.appendChild(basketEmpty);
    }
    // SI PLEIN
    else {
        let totalPrice = 0;
        for (let i = 0; i < basket.length; i++) {
            productInBasket = basket[i];
            showProducts(productInBasket);
            let priceProduct = await getProduct(productInBasket.id);
            let quantityProduct = productInBasket.quantity;
            totalPrice += priceProduct.price * quantityProduct;
            let itemTotalPrice = document.querySelector('#totalPrice');
            itemTotalPrice.textContent = totalPrice;
        }
        let totalQuantity = document.querySelector('#totalQuantity');
        totalQuantity.textContent = basket.quantityTotal;
        deleteProduct();
        editQuantity();
    }
}

showBasket();

///////function Suppression
function deleteProduct() {
    //localisation du bouton supprimer
    let deleteP = document.querySelectorAll('.deleteItem');
    for (let j = 0; j < deleteP.length; j++) {
        deleteUnit = deleteP[j];
        //Ecoute du click de la suppression
        deleteUnit.addEventListener('click', function (event) {
            // identification de l'element dans HTML
            let articleDeleteID = event.target
                .closest('article')
                .getAttribute('data-id');
            let articleDeleteColor = event.target
                .closest('article')
                .getAttribute('data-color');
            //appel du localstorage
            let basket = JSON.parse(productInStorage);
            //definition de l'article à supprimer dans le localstorage
            productToDelete = basket.find(
                (item) =>
                    item.id == articleDeleteID &&
                    item.color == articleDeleteColor
            );
            // filtre
            result = basket.filter(
                (item) =>
                    item.id !== articleDeleteID ||
                    item.color !== articleDeleteColor
            );
            basket = result;
            // calcul de de la nouvelle quantité et prix total
            newQuantity = basket.totalQuantity - productToDelete.quantity;
            basket.totalQuantity = newQuantity;
            priceToDel = productToDelete.quantity * productToDelete.price;
            alert("L'article est supprimé du panier.");

            if (basket.totalQuantity == 0) {
                localStorage.clear();
                window.location.reload();
            } else {
                let line = JSON.stringify(basket);
                localStorage.setItem('basket', line);
                window.location.reload();
            }
        });
    }
}

/////Function modification quantité
function editQuantity() {
    let itemQuantity = document.querySelectorAll('.itemQuantity');
    for (let q = 0; q < itemQuantity.length; q++) {
        unitItemQuantity = itemQuantity[q];
        //Ecoute du changement
        unitItemQuantity.addEventListener('change', function (event) {
            for (let c = 0; c < basket.length; c++) {
                basketProduct = basket[c];
                // identification de l'element dans HTML
                let articleEditID = event.target
                    .closest('article')
                    .getAttribute('data-id');
                let articleEditColor = event.target
                    .closest('article')
                    .getAttribute('data-color');
                newQuantityValue = event.target.valueAsNumber;
                alert('La quantité a été mise à jour.');
                //si article Visé = article localstorage
                if (
                    basketProduct.id == articleEditID &&
                    basketProduct.color == articleEditColor
                ) {
                    //modification quantité
                    addQuantity = newQuantityValue - basketProduct.quantity;
                    basketProduct.quantity = newQuantityValue;
                    basket.totalQuantity = basket.totalQuantity + addQuantity;
                    let line = JSON.stringify(basket);
                    localStorage.setItem('basket', line);
                    window.location.reload();
                }
            }
        });
    }
}

////////////////Formulaire
//// Récupération des coordonnées du formulaires
// variables du formulaire
const formulaire = document.querySelector('.cart__order__form');
const formFirstName = document.getElementById('firstName');
const formLastName = document.getElementById('lastName');
const formAdress = document.getElementById('address');
const formCity = document.getElementById('city');
const formEmail = document.getElementById('email');
const formOrder = document.getElementById('order');

/// Regex controlés sur regex101.com
let regName = new RegExp('^[a-zA-ZéèàêëïÈÉÊËÌÍÎÏ]+$');
let regAdress = new RegExp("^[0-9,'a-zA-Zéèàêëï]+$");
let regMail = new RegExp('w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$');

/// vérification formulaire
