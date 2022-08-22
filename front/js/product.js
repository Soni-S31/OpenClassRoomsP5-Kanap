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

//........variables pour le localstorage
let choiceColor = document.getElementById('colors');
let choiceQuantity = document.getElementById('quantity');
let btnAddProduct = document.getElementById('addToCart');
//let valueColor = choiceColor.value; // récupération couleur choisie
//let valueQuantity = choiceQuantity.value; // récupértion quantité choisie

//let unitArticle = '';

/*let choiceProduct = {
    id: unitArticle._id,
    name: unitArticle.name,
    color: valueColor,
    quantity: Number(valueQuantity),
    
};*/

/////////////////////////////////////////////////
//au click ajout au panier
btnAddProduct.addEventListener('click', () => {
    let valueColor = choiceColor.value; // récupération couleur choisie
    let valueQuantity = choiceQuantity.value; // récupértion quantité choisie
    let basket = {
        totalQuantity: 0,
        totalProducts: [],
    };
    // contrôle si les choix sont définis
    if (valueColor == '') {
        alert('Veuiller choisir une couleur'); // si couleur non selectionnée
    } else if (valueQuantity == 0) {
        alert('Veuillez choisir une quantité'); // si quantité non selectionnée
    } else {
        //je crée mon produit choisi
        let choiceProduct = {
            id: unitArticle._id,
            name: unitArticle.name,
            color: valueColor,
            quantity: Number(valueQuantity),
        };
        // recupére un article si présent dans le localstorage
        let productInStorage = JSON.parse(localStorage.getItem('basket'));

        if (productInStorage) {
            //controle si article dans panier pour ajouter quantité
            const getProductStorage = productInStorage.find(
                (p) =>
                    p.id == choiceProduct.id && p.color == choiceProduct.color
            );
            if (getProductStorage) {
                getProductStorage.quantity =
                    getProductStorage.quantity + choiceProduct.quantity;
                localStorage.setItem(
                    'basket',
                    JSON.stringify(productInStorage)
                );
                return;
            }
            productInStorage.push(choiceProduct);
            localStorage.setItem('basket', JSON.stringify(productInStorage));
        } else {
            productInStorage = [];
            productInStorage.push(choiceProduct);
            localStorage.setItem('basket', JSON.stringify(productInStorage));
            console.log(productInStorage);
        }
    }
});
