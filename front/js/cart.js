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
    console.log('ok');

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

//Affichage panier si vide
let priceTotal = 0;
async function showBasket() {
    if (productInStorage == null) {
        let basketEmpty = document.createElement('p');
        basketEmpty.textContent = 'Le panier est vide';
        cartItems.appendChild(basketEmpty);
    }
    // SI PANIER PLEIN AFFICHER
    else {
        for (let i = 0; i < basket.products.length; i++) {
            productInBasket = basket.products[i];
            showProducts(productInBasket);
            let priceProduct = await getProduct(productInBasket.id);
            let quantityProduct = productInBasket.quantity;
            priceTotal += priceProduct.price * quantityProduct;
            let itemTotalPrice = document.querySelector('#priceTotal');
            itemTotalPrice.textContent = priceTotal;
        }
        let quantityTotal = document.querySelector('#quantityTotal');
        quantityTotal.textContent = basket.quantityTotal;
    }
}

showBasket();
