/*Appel de l'API avec controle en console.log pour un article
const requestURLProduct =
    'http://localhost:3000/api/products/107fb5b75607497b96722bda5b504926';

fetch(requestURLProduct)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (resultatProduct) {
        let product = '';
        product = resultatProduct;
        console.log(product);
    })
    .catch(function (error) {
        alert('Erreur : ' + error); // Une erreur est survenue
    });
*/

//...............................Appel de l'ID dans l'URL.....................
let str = window.location.href;
let url = new URL(str);
let idUrl = url.searchParams.get('id');
console.log(idUrl);

//.............................Appel API avec l'ID............................
let unitArticle = '';
let requestURLProduct = 'http://localhost:3000/api/products/' + idUrl;
fetch(requestURLProduct)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (resultatProduct) {
        unitArticle = resultatProduct;
        showArticle(unitArticle);
    })
    .catch(function (error) {
        alert('Erreur : ' + error); // Une erreur est survenue
    });

//................................Affichage de l'article page produit..........
function showArticle(product) {
    document.title = product.name;
    let itemImg = document.querySelector('.item__img');

    //insertion img
    let pictureItem = document.createElement('img');
    pictureItem.setAttribute('src', product.imageUrl);
    pictureItem.setAttribute('alt', product.altTxt);
    itemImg.appendChild(pictureItem);

    // insertion du nom
    let itemH1 = document.querySelector('#title');
    itemH1.textContent = product.name;

    // Insertion du prix
    let priceItem = document.querySelector('#price');
    priceItem.textContent = product.price;

    // Insertion de la description
    let contentItem = document.querySelector('#description');
    contentItem.textContent = product.description;

    //Insertion choix couleur
    let colors = product.colors;
    let colorsItem = document.querySelector('#colors');

    for (let i = 0; i < colors.length; i++) {
        let color = colors[i];
        let optionColors = document.createElement('option');
        optionColors.setAttribute('value', product.colors);
        optionColors.textContent = color;
        colorsItem.appendChild(optionColors);
    }
}

//...................local storage..................

//........variables pour le localstorage et function
let choiceColor = document.querySelector('#colors');
let choiceQuantity = document.querySelector('#quantity');
let btnAddProduct = document.querySelector('#addToCart');
let basket = {
    quantityTotal: 0,
    totalProducts: [],
};

function saveBasket(basket) {
    localStorage.setItem('basket', JSON.stringify(basket));
}

//............Ecoute du click pour l'ajout au panier
btnAddProduct.addEventListener('click', function (event) {
    let valueColor = choiceColor.value; // récupération couleur choisie
    let valueQuantity = choiceQuantity.value; // récupértion quantité choisie

    if (valueColor == '') {
        alert('Veuiller choisir une couleur'); // si couleur non selectionnée
    } else if (valueQuantity == 0) {
        alert('Veuillez choisir une quantité'); // si quantité non selectionnée
    } else {
        // récuperer ou creer le panier

        let storageBasket = localStorage.getItem('basket');
        if (storageBasket == null) {
            basket;
        } else {
            let basket = JSON.parse(storageBasket);
        }

        // définition canape à envoyer dans le local storage
        let product = {
            id: unitArticle._id,
            name: unitArticle.name,
            color: valueColor,
            quantity: Number(valueQuantity),
            img: unitArticle.imageUrl,
        };

        //controle si article dans le panier
        for (var i = 0; i < basket.totalProducts.length; i++) {
            basketProduct = basket.totalProducts[i];

            //ajouter un article deja présent dans le panier

            if (
                basketProduct.id == product.id &&
                basketProduct.color == product.color
            ) {
                newQuantity = basketProduct.quantity + product.quantity;
                basketProduct.quantity = newQuantity;
                basket.quantityTotal = product.quantity + basket.quantityTotal;
            }
        }

        if (
            basketProduct.id !== product.id &&
            basketProduct.color !== product.color
        ) {
            basket.totalProducts.push(product);
            newQuantity = basket.quantityTotal + product.quantity;
            basket.quantityTotal = newQuantity;
        }

        alert('Votre panier est à jour');
        saveBasket;
        window.location.reload();
    }
});
