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
    }
}

showBasket();

//Supprimer un article
// list produit des bouton supprimer en tableau
let deleteSelection = [document.querySelectorAll('deleteItem')];

// création tableau pour récupérer le basket et vérifier la suppression
let arrayDeleteControl = [];

async function deleteProduct() {
    arrayDeleteControl = basket;
    for (let i = 0; i < deleteSelection.lengt; i++) {
        //écoute au click
        deleteSelection[i].addEventListener('click', () => {
            arrayDeleteControl.splice([i], 1); // supprime un article à chaque index[i] écouté
            deleteSelection[i].parentElement.style.display = 'none'; //supprime l'article de l'écran
            //MAJ du  localStorage
            basket = localStorage.setItem(
                'basket',
                JSON.stringify(arrayDeleteControl)
            );
        });
    }
}

/*
    let items = getItem();
    for (i = 0; i < items.length; i++){
        if id == items[i]
    }
    const deleteProduct = document.querySelector('.deleteItem');
    deleteProduct.addEventListener('click', function () {
        window.localStorage.removeItem('basket');
    });*/

//saveBasket(basket);

// sauvegarder le panier
function saveBasket(basket) {
    localStorage.setItem('basket', JSON.stringify(basket));
}

//récupérer un article du panier
function getItem() {
    let products = [];
    if (localStorage.getItem('basket') != null) {
        products = JSON.parse(localStorage.getItem('basket'));
    }
}
