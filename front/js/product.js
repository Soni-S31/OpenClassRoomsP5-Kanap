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

//Appel de l'ID dans l'URL
let str = window.location.href;
let url = new URL(str);
let idUrl = url.searchParams.get('id');
console.log(idUrl);

//Appel API avec l'ID
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

//Affichage de l'article page produit
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
    let colorsChoice = product.colors;
    let colorsItem = document.querySelector('#colors');

    for (let i = 0; i < colorsChoice.length; i++) {
        let color = colorsChoice[i];
        let optionColors = document.createElement('option');
        optionColors.setAttribute('value', product.colors);
        optionColors.textContent = color;
        colorsItem.appendChild(optionColors);
    }
}