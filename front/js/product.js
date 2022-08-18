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
const requestURLProduct = 'http://localhost:3000/api/products/' + idUrl;
fetch(requestURLProduct)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (resultatProduct) {
        let unitArticle = '';
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

//...................création du panier
class Basket {
    constructor() {
        let basket = localStorage.getItem('basket');
        if (basket == null) {
            this.basket = [];
        } else {
            this.basket = JSON.parse(basket);
        }
    }
    //sauvegarder le panier
    saveBasket() {
        localStorage.setItem('basket', JSON.stringify(this.basket));
    }
    //ajouter un article
    addBasket(product) {
        let foundProduct = this.basket.find((p) => p.id == product.id); //recherche si le produit et present dans le panier
        if (foundProduct != undefined) {
            foundProduct.quantity++;
        } else {
            product.quantity = 1; //definition de quantité a 1 par défaut
            this.basket.push(product);
        }
        this.saveBasket();
    }

    //modfier la quantité
    changeQuantity(product, quantity) {
        let foundProduct = this.basket.find((p) => p.id == product.id); //recherche si le produit et present dans le panier
        if (foundProduct != undefined) {
            foundProduct.quantity += quantity;
            if (foundProduct.quantity <= 0) {
                removeFromBasket(foundProduct);
            } else this.saveBasket();
        }
    }
    //supprimer un article
    removeFromBasket(product) {
        let basket = getBasket();
        basket = basket.filter((p) => p.id != product.id);
        saveBasket();
    }
}

//........création variables pour le localstorage
let choiceColor = document.querySelector('#colors');
let choiceQuantity = document.querySelector('#quantity');
let btnAddProduct = document.querySelector('#addToCart');
const productName = document.querySelector('#title');

//............Ecoute du click pour l'ajout au panier
btnAddProduct.addEventListener('click', function (event) {
    let valueColor = choiceColor.value; // récupération couleur choisie
    let valueQuantity = choiceQuantity.value; // récupértion quantité choisie
    if (valueColor == '') {
        alert('Veuiller choisir une couleur'); // si couleur non selectionnée
    } else if (valueQuantity == 0) {
        alert('Veuillez choisir une quantité'); // si quantité non selectionnée
    }
    // récupération du panier
    else Basket;
});
