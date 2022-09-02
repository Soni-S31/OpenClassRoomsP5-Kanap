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
    .then(async function (resultatProduct) {
        unitArticle = await resultatProduct;
        showArticle(unitArticle);
    })
    .catch(function (error) {
        alert('Erreur affichage : merci de revenir plus tard'); // Une erreur est survenue
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
        optionColors.setAttribute('value', color);
        optionColors.textContent = color;
        colorsItem.appendChild(optionColors);
    }
}
//...................local storage..................

let btnAddProduct = document.querySelector('#addToCart');

/////////////////////////au click ajout au panier///////////////
btnAddProduct.addEventListener('click', () => {
    let valueColor = document.querySelector('#colors').value; // récupération couleur choisie
    let valueQuantity = document.querySelector('#quantity').value; // récupération quantité choisie

    // contrôle si les choix sont définis
    if (valueColor == '') {
        alert('Veuiller choisir une couleur'); // si couleur non selectionnée
    } else if (valueQuantity <= 0 || valueQuantity > 100) {
        alert('Veuillez choisir une quantité entre 1 et 100'); // si quantité mal selectionnée
    } else {
        // recupérer panier si présent dans le localstorage
        let productInStorage = JSON.parse(localStorage.getItem('basket'));
        if (productInStorage == null) {
            let basket = {
                quantityTotal: 0,
                products: [],
            }; // création tableau panier
        }
        //Création produit choisi
        let choiceProduct = {
            id: unitArticle._id,
            name: unitArticle.name,
            color: valueColor,
            quantity: Number(valueQuantity),
        };

        if (productInStorage) {
            //controle si article dans panier pour ajouter quantité
            const getProductStorage = productInStorage.find(
                (p) =>
                    p.id == choiceProduct.id && p.color == choiceProduct.color
            );
            // si produit déja présent dans le panier
            if (getProductStorage) {
                getProductStorage.quantity =
                    getProductStorage.quantity + choiceProduct.quantity;
            }
            productInStorage.push(choiceProduct);
            localStorage.setItem('basket', JSON.stringify(productInStorage));
            alert('Le panier est à jour');
            window.location.reload();
            // sinon
        } else {
            productInStorage = [];
            productInStorage.push(choiceProduct);
            localStorage.setItem('basket', JSON.stringify(productInStorage));
            alert("L'article a été ajouté au panier");
            window.location.reload();
        }
    }
});
