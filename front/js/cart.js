// récupération du panier du localstorage
let productInStorage = localStorage.getItem('basket');
let basket = JSON.parse(productInStorage);
console.log(productInStorage);

// récupération de la section pour insertion 'article'
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
        .catch((error) => alert('Erreur récupération prix  ' + error));

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

////Appel de l'APi pour les infos produit
async function getProduct(id) {
    return fetch('http://localhost:3000/api/products/' + id)
        .then((response) => response.json())
        .catch((error) => alert('Erreur : ' + error));
}

////Affichage panier
let priceTotal = 0;
async function showBasket() {
    //SI VIDE
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
            // identification de l'Élement dans HTML
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
            // calcul de la nouvelle quantité et du prix total
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
                // identification de l'élèment dans HTML
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

//////////////////////Formulaire
// variables du formulaire
const formulaire = document.querySelector('.cart__order__form');
const formFirstName = document.getElementById('firstName');
const formLastName = document.getElementById('lastName');
const formAdress = document.getElementById('address');
const formCity = document.getElementById('city');
const formEmail = document.getElementById('email');
const formOrder = document.getElementById('order');

/// Regex controlés sur regex101.com
let regName = new RegExp("^[a-zA-ZéèàêëïÈÉÊËÌÍÎÏ,.' -]+$");
let regAdress = new RegExp("^[A-zÀ-ú0-9 ,.'-]+$");
let regMail = new RegExp('^[a-zA-Z0-9_. -]+@[a-zA-Z.-]+[.]{1}[a-z]{2,10}$');

/// controle formulaire
// firstName
const errorFirstName = document.querySelector('#firstNameErrorMsg');
formFirstName.addEventListener('change', function (event) {
    let value = event.target.value;
    if (regName.test(value)) {
        errorFirstName.innerHTML = '';
    } else {
        formFirstName.style.border = '2px solid red';
        errorFirstName.innerHTML =
            'Champ invalide, veuillez vérifier votre prénom !';
    }
});
//lastName
const errorLastName = document.querySelector('#lastNameErrorMsg');
formLastName.addEventListener('change', function (event) {
    let value = event.target.value;
    if (regName.test(value)) {
        errorLastName.innerHTML = '';
    } else {
        formLastName.style.border = '2px solid red';
        errorLastName.innerHTML =
            'Champ invalide, veuillez vérifier votre nom !';
    }
});

//Adresse
const errorAdress = document.querySelector('#addressErrorMsg');
formAdress.addEventListener('change', function (event) {
    let value = event.target.value;
    if (regAdress.test(value)) {
        errorAdress.innerHTML = '';
    } else {
        formAdress.style.border = '2px solid red';
        errorAdress.innerHTML =
            'Champ invalide, veuillez vérifier votre adresse !';
    }
});

//Ville
const errorCity = document.querySelector('#cityErrorMsg');
formCity.addEventListener('change', function (event) {
    let value = event.target.value;
    if (regAdress.test(value)) {
        errorCity.innerHTML = '';
    } else {
        formCity.style.border = '2px solid red';
        errorCity.innerHTML = 'Champ invalide, veuillez vérifier votre ville !';
    }
});

//Email
const errorMail = document.querySelector('#emailErrorMsg');
formEmail.addEventListener('change', function (event) {
    let value = event.target.value;
    if (regMail.test(value)) {
        errorMail.innerHTML = '';
    } else {
        formEmail.style.border = '2px solid red';
        errorMail.innerHTML = 'Champ invalide, veuillez vérifier votre email !';
    }
});

///////////Valider la commande
const btnOrder = document.querySelector('#order');

// Ecoute du bouton Order
btnOrder.addEventListener('click', function (c) {
    //pour éviter le rechargement de la page qui vide les champs et interrompt la requete post avant la réponse du serveur
    c.preventDefault();
    //si formulaire non rempli > alert
    if (
        formFirstName.value === '' ||
        formLastName.value === '' ||
        formAdress.value === '' ||
        formCity.value === '' ||
        formEmail.value === ''
    ) {
        alert('Veuillez renseigner vos coordonnées pour passer commande !');
    }
    //si panier vide > alert
    else if (productInStorage == null) {
        alert('Votre panier doit contenir des articles pour passer commande !');
    } else {
        //récupération et envoie du panier
        productId = [];
        for (let p = 0; p < basket.length; p++) {
            productId.push(basket[p].id);
        }
        requetePost();
    }
});

//Requete Post a envoyer a l'Api pour obtenir l'ID de commande
function requetePost(request) {
    console.log(request);
    //formulaire à envoyer
    const order = {
        contact: {
            firstName: formFirstName.value,
            lastName: formLastName.value,
            address: formAdress.value,
            city: formCity.value,
            email: formEmail.value,
        },
        products: productId,
    };
    //En-tête de la requete
    const heading = {
        method: 'POST',
        headers: {
            Accept: 'application.json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
    };

    fetch('http://localhost:3000/api/products/order', heading)
        .then((response) => response.json())
        .then(function (server) {
            localStorage.clear();
            orderId = server.orderId;
            if (server.orderId != '') {
                console.log(orderId);
                location.href = 'confirmation.html?id=' + server.orderId;
            }
            console.log(orderId);
        })
        .catch((err) => {
            console.log('Problème avec fetch : ' + err.message);
        });
}
