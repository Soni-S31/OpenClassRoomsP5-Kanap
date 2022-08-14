/*Appel de l'API avec controle en console.log
const requestURL = 'http://localhost:3000/api/products/';
let allProducts = '';

fetch(requestURL)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (resultatAPI) {
        allProducts = resultatAPI;
        console.log(resultatAPI);
    })
    .catch(function (error) {
        alert('Erreur : ' + error); // Une erreur est survenue
    });
    */

//Appel de l'APi et Affichage de la fonction
const requestURL = 'http://localhost:3000/api/products/';
let allProducts = '';

fetch(requestURL)
    .then(function (response) {
        if (response.ok) {
            return response.json();
        }
    })
    .then(function (resultatAPI) {
        allProducts = resultatAPI;
        showAllProducts(allProducts);
    })
    .catch(function (error) {
        alert('Erreur : ' + error); // Une erreur est survenue
    });

//Affichage des produits

function showAllProducts(productSheet) {
    for (let i = 0; i < productSheet.length; i++) {
        product = allProducts[i];
        let listItem = document.querySelector('.items');

        //insertion du lien
        let lienItem = document.createElement('a'); //creation dans html
        lienItem.setAttribute('href', './product.html?id=' + product._id); //definition nom et valeur
        listItem.appendChild(lienItem); //renvoi l'enfant de listItem

        //insertion des articles
        let insertionArticle = document.createElement('article'); //creation dans html
        lienItem.appendChild(insertionArticle); //renvoi l'enfant de listItem

        //insertion img
        let insertionImg = document.createElement('img');
        insertionImg.setAttribute('src', product.imageUrl);
        insertionImg.setAttribute('alt', product.altTxt);
        insertionArticle.appendChild(insertionImg);

        //insertion H3
        let insertionH3 = document.createElement('h3');
        insertionH3.className = 'productName';
        insertionH3.textContent = product.name;
        insertionArticle.appendChild(insertionH3);

        //insertion descriptif
        let insertionDescriptif = document.createElement('p');
        insertionDescriptif.className = 'productDescription';
        insertionDescriptif.textContent = product.description;
        insertionArticle.appendChild(insertionDescriptif);
    }
}
