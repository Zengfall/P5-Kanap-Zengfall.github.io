// Variable pour recupérer les produits ajoutés
let addedProducts= JSON.parse(localStorage.getItem("kanapLs"));
//Localisation sur la page html des produits
const productsLocationHtml = document.getElementById("cart__items");
//Déclaration des variables de la page panier
let productsInBasket = []; // Array qui va contenir les produits du LS
// Les variables pour calculer la quantité totale d'articles et le prix total du panier
let myBasket = []; //Array des produits de l'API
const findProducts = 0;
let totalPrice = 0;  
let totalQuantity = 0;
let quantityProductBasket = 0;
let priceProductBasket = 0;
let totalProductPriceBasket = 0;
//Affichage des produits du LocalStorage

//Si le LS est vide , on affiche "Votre panier est vide"------------
if(addedProducts === null || addedProducts.length === 0){
    messagePanierVide(); 
    //Si le client clique sur le bouton commander, on lui rappelle que le panier est vide
    buttonCommander.addEventListener("click", (event)=>{
        alert("Votre panier est vide !");
        event.preventDefault();
    });
}

//Si le panier n'est pas vide alors, on affiche les produits contenus dans le LS

else {

    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(data => {
            myBasket = data;
                // Recupèration de la couleur, la quantité et l'id des produits contenus dans le LS 
            for(let i = 0; i < addedProducts.length; i++){
                let colorProductBasket = addedProducts[i].chosenProductColor;
                let idProductBasket = addedProducts[i].chosenProductId;
                quantityProductBasket = addedProducts[i].quantity
				;
                //Recupèration des canapés dont les _id (de l'api) correspondent aux id dans le LS
                const productsInBasket = data.find((element) => element._id === idProductBasket);
                // Récupération du prix de chaque produit 
                priceProductBasket = productsInBasket.price;
                //Création des éléments html manquants de la page cart.html, dans la <section id="cart__items">...
                //Insertion des infos du LS
				let newProduct = document.createElement('article');
                newProduct.setAttribute("class","cart__item");
                newProduct.setAttribute("data-id",`${idProductBasket}`);
                newProduct.setAttribute("data-color",`${colorProductBasket}`);
                productsLocationHtml.appendChild(newProduct);
                //Création de la div avec pour classe cart__item__img
                    let newDivImg = document.createElement('div');
                    newDivImg.setAttribute("class", "cart__item__img");
                    newProduct.appendChild(newDivImg);
                        //Création de la balise image qui contiendra la photo de chaque canapé
                        let newImg = document.createElement('img');
                        newImg.setAttribute("src", productsInBasket.imageUrl);
                        newImg.setAttribute("alt", productsInBasket.altTxt);
                        newDivImg.appendChild(newImg);
                        //Création de la div avec pour classe cart__item__content
                        let newDivContent = document.createElement('div');
                        newDivContent.setAttribute("class", "cart__item__content");
                        newProduct.appendChild(newDivContent);   
                        //Création de la div avec pour classe cart__item__content__description
                        let newDivContentDescription = document.createElement('div');
                        newDivContentDescription.setAttribute("class", "cart__item__content__description");
                        newDivContent.appendChild(newDivContentDescription);
                            //Création d'une balise titre h2 qui indique le nom du produit
                            let newH2 = document.createElement('h2');
                            newH2.innerText = productsInBasket.name;
                            newDivContentDescription.appendChild(newH2);
                            //Création d'une balise p qui indique la couleur choisie
                            let newPColor = document.createElement('p');
                            newPColor.innerText = colorProductBasket;
                            newDivContentDescription.appendChild(newPColor);
                            //Création d'une balise p qui indique le prix du canapé
                            let newPPrice = document.createElement('p');
                            newPPrice.innerText = productsInBasket.price + " €";
                            newDivContentDescription.appendChild(newPPrice);
                        //Création de la div avec pour classe cart__item__content__settings
                        let newDivContentSettings = document.createElement('div');
                        newDivContentSettings.setAttribute("class", "cart__item__content__settings");
                        newDivContent.appendChild(newDivContentSettings);
                            //Création de la div avec pour classe cart__item__content__settings__quantity
                            let newDivContentSettingsQuantity = document.createElement('div');
                            newDivContentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
                            newDivContentSettings.appendChild(newDivContentSettingsQuantity);
                                //Création d'une balise p qui indique le texte "Quantité :"
                                let newPQuantity = document.createElement('p');
                                newPQuantity.innerText = "Quantité :";
                                newDivContentSettingsQuantity.appendChild(newPQuantity);
                                //Création d'une balise input avec la classe "itemQuantity" qui permet de modifier la quantité
                                let newPInput = document.createElement('input');
                                newPInput.setAttribute("type", "number");
                                newPInput.setAttribute("class", "itemQuantity");
                                newPInput.setAttribute("name", "itemQuantity");
                                newPInput.setAttribute("min", "1");
                                newPInput.setAttribute("max", "100");
                                newPInput.setAttribute("value", `${quantityProductBasket}`);
                                newDivContentSettingsQuantity.appendChild(newPInput);
                            //Création de la div avec pour classe cart__item__content__settings__delete
                            let newDivContentSettingsDelete = document.createElement('div');
                            newDivContentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
                            newDivContentSettings.appendChild(newDivContentSettingsDelete);
                                //Création d'une balise p qui indique le prix du canapé
                                let newPDelete = document.createElement('p');
                                newPDelete.setAttribute("class", "deleteItem");
                                newPDelete.innerText = "Supprimer";
                                newDivContentSettingsDelete.appendChild(newPDelete);
                                       //Fin Ajout Balises html
				 //Appel de la fonction pour calculer la quantité totale de produits & le prix total du panier au chargement de la page
				 totals();
				}//for
				//Appel de la fonction Supprimer un produit
				deleteProduct();
				//Appel de le fonction Modifier la quantité d'un produit
				ModifyQuantity(); 
			});	
}

//Fonction 1: Suppression d'un article du panier
function deleteProduct() {
    let selectSupprimer = document.querySelectorAll(".deleteItem");
    selectSupprimer.forEach((selectSupprimer) => {
            selectSupprimer.addEventListener("click" , (event) => {
                event.preventDefault();
                // On pointe le parent hiérarchique <article> du lien "supprimer"
                let myArticle = selectSupprimer.closest('article');
                // On filtre les éléments du LS à garder
                addedProducts = addedProducts.filter
                ( element => element.chosenProductId !== myArticle.dataset.id || element.chosenProductColor !== myArticle.dataset.color );
                // On met à jour le LS
                localStorage.setItem("kanapLs", JSON.stringify(addedProducts));                
                // Alerte produit supprimé
                alert("Ce produit va être supprimé du panier.");                            
                // On supprime physiquement la balise <article> du produit que l'on supprime depuis son parent, si elle existe
                if (myArticle.parentNode) {
                    myArticle.parentNode.removeChild(myArticle);
                }
                //Si le panier est vide, on affiche "Le panier est vide
                if(addedProducts === null || addedProducts.length === 0){
                    messagePanierVide();
                }
                else{
                //Sinon, on calcule la quantité et le prix total du panier
                calculationTotalQuantity();
                calculationTotalPrice();
                }
            }); 
    })
}
//Fonction 2: Modifier la quantité d'un article du panier
let messageErrorQuantity = false;
function ModifyQuantity() {
    // On sélectionne l'élément html (input) sur lequel la quantité est modifiée
    let ModifyQuantity = document.querySelectorAll(".itemQuantity");
    ModifyQuantity.forEach((item) => {
        //On écoute le changement sur l'input "itemQuantity"
        item.addEventListener("change", (event) => {
            event.preventDefault();
            choiceQuantity = Number(item.value);
            // On pointe le parent hiérarchique <article> de l'input "itemQuantity"
            let myArticle = item.closest('article');
            // On récupère dans le LS l'élément (même id et même couleur) dont on veut modifier la quantité
            let selectMyArticleInLocalStorage = addedProducts.find
            ( element => element.chosenProductId === myArticle.dataset.id && element.chosenProductColor === myArticle.dataset.color );
            // Si la quantité est ok, on met à jour la quantité dans le LS et le DOM
            if(choiceQuantity > 0 && choiceQuantity <= 100 && Number.isInteger(choiceQuantity)){
                parseChoiceQuantity = parseInt(choiceQuantity);
                selectMyArticleInLocalStorage.quantity = parseChoiceQuantity;
                localStorage.setItem("kanapLs", JSON.stringify(addedProducts));
                // Et, on calcule la quantité et le prix total du panier
                calculationTotalQuantity();
                calculationTotalPrice();
                messageErrorQuantity = false;
            }
            // Sinon, on indique un message d'erreur
            else{
                item.value = selectMyArticleInLocalStorage.quantity;
                messageErrorQuantity = true;
            }
            if(messageErrorQuantity){       
                alert("La quantité d'un article (même référence et même couleur) doit être comprise entre 1 et 100 et être un nombre entier. Merci de rectifier la quantité choisie.");
            } 
        });
    });
}
//Fonction 3: Calcul du montant total du panier, lors de la modification de la quantité ou de la suppression d'un article
function calculationTotalPrice() {
    let newTotalPrice = 0;
    //(1) On fait une boucle sur le addedProducts et dans cette boucle, 
    for (const item of addedProducts) {
        const idProductsLocalStorage = item.chosenProductId;
        const quantityProductsLocalStorage = item.quantity;
        //(2) on vérifie si l'id correspond
        const findProducts = myBasket.find((element) => element._id === idProductsLocalStorage);
        //(3) et si c'est le cas, on récupère le prix.
        if (findProducts) {
            const newTotalProductPriceBasket = findProducts.price * quantityProductsLocalStorage;
            newTotalPrice += newTotalProductPriceBasket;
        }
    //On affiche le nouveau prix total du panier dans le html
    document.getElementById("totalPrice").innerText = newTotalPrice;
    } 
}
//Fonction 4 calcul de la quantité totale d'articles dans le panier, lors de la modification de la quantité ou de la suppression d'un article
function calculationTotalQuantity() {
    let newtotalQuantity = 0;
    for (const item of addedProducts) {
        //On calcule le nombre de quantité total de produits dans le LS
        newtotalQuantity += parseInt(item.quantity);
    }
    //On affiche la nouvelle quantité totale de produits dans le html
    document.getElementById("totalQuantity").innerText = newtotalQuantity;
}
//Fonction 5:  Calcul de la quantité totale d'articles dans le panier, au chargement de la page Panier
function totalProductsQuantity(){
    totalQuantity += parseInt(quantityProductBasket);
    document.getElementById("totalQuantity").innerText = totalQuantity;
}
//Fonction 6:  Calcul du montant total du panier, au chargement de la page Panier
function totalProductsPrice (){
    // Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
    totalProductPriceBasket = quantityProductBasket * priceProductBasket;
    // Calcul du prix total du panier
    totalPrice += totalProductPriceBasket;
    document.getElementById("totalPrice").innerText = totalPrice; 
    }
//Fonction 7 pour calculer la quantité totale de produits & le prix total du panier au chargement de la page Panier
function totals (){
    totalProductsQuantity();
    totalProductsPrice();
}
//Fonction 8:  Pour afficher la phrase "Le panier est vide !"
function messagePanierVide() {
    productsInBasket = 'Votre panier est vide !';
    let newH2 = document.createElement('h2');
    productsLocationHtml.appendChild(newH2);
    newH2.innerText = productsInBasket;
    // On insère 0 dans le html pour la quantité et le prix du panier
    document.getElementById("totalQuantity").innerText = 0;
    document.getElementById("totalPrice").innerText = 0;
}
//Contrôle des infos avec Regex
        //Les variables à utiliser pour la validation du panier
        const buttonCommander = document.getElementById("order");
        let errorFormulaireFirstName = true;
        let errorFormulaireLastName = true;
        let errorFormulaireAddress = true;
        let errorFormulaireCity = true;
        let errorFormulaireEmail = true;    
        //Création des expressions régulières pour contrôler les infos entrées par l'utilisateur
        let textRegex = new RegExp("^[^.?!:;,/\\/_-]([. '-]?[a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");
        let addressRegex = new RegExp("^[^.?!:;,/\\/_-]([, .:;'-]?[0-9a-zA-Zàâäéèêëïîôöùûüç])+[^.?!:;,/\\/_-]$");
        let emailRegex = new RegExp("^[^. ?!:;,/\\/_-]([._-]?[a-z0-9])+[^.?!: ;,/\\/_-][@][a-z0-9]+[.][a-z][a-z]+$");
        //Récupération des coordonnées du formulaire client et mise en variable
        let inputFirstName = document.getElementById('firstName');
        let inputLastName = document.getElementById('lastName');
        let inputAddress = document.getElementById('address');
        let inputCity = document.getElementById('city');
        let inputEmail = document.getElementById('email');
        //Déclaration des variables pour vérifier la bonne valeur des champs du formulaire
        let checkValueFirstName;
        let checkValueLastName;
        let checkValueAddress;
        let checkValueCity;
        let checkValueEmail; 
        //Ecoute du contenu du champ "prénom", Vérification du prénom et affichage d'un message si celui-ci n'est pas correct
        inputFirstName.addEventListener('change', function() {
            let firstNameErrorMsg = inputFirstName.nextElementSibling;
            checkValueFirstName = textRegex.test(inputFirstName.value);
            if (checkValueFirstName) {
                firstNameErrorMsg.innerText = '';
                errorFormulaireFirstName = false;
            } 
            else {
                firstNameErrorMsg.innerText = 'Veuillez indiquer un prénom.';
                errorFormulaireFirstName = true;
            }
        });
        // Ecoute le contenu du champ "nom", Vérification du nom et affichage d'un message si celui-ci n'est pas correct
        inputLastName.addEventListener('change', function() {
            let lastNameErrorMsg = inputLastName.nextElementSibling;
            checkValueLastName = textRegex.test(inputLastName.value);
            if (checkValueLastName) {
                lastNameErrorMsg.innerText = '';
                errorFormulaireLastName = false;
            }
            else {
                lastNameErrorMsg.innerText = 'Veuillez indiquer un nom de famille.';
                errorFormulaireLastName = true;
            }
        });
        // Ecoute le contenu du champ "adresse", Vérification de l'adresse et affichage d'un message si celle-ci n'est pas correcte
        inputAddress.addEventListener('change', function() {
            let addressErrorMsg = inputAddress.nextElementSibling;
            checkValueAddress = addressRegex.test(inputAddress.value);
            if (checkValueAddress) {
                addressErrorMsg.innerText = '';
                errorFormulaireAddress = false;
            }
            else {
                addressErrorMsg.innerText = 'Veuillez indiquer une adresse.';
                errorFormulaireAddress = true;
            }
        });
        // Ecoute le contenu du champ "ville", Vérification de la ville et affichage d'un message si celle-ci n'est pas correcte
        inputCity.addEventListener('change', function() {
            let cityErrorMsg = inputCity.nextElementSibling;
            checkValueCity = textRegex.test(inputCity.value);
            if (checkValueCity) {
                cityErrorMsg.innerText = '';
                errorFormulaireCity = false;
            } else {
                cityErrorMsg.innerText = 'Veuillez indiquer le nom d\'une ville.';
                errorFormulaireCity = true;
            }
        });
        // Ecoute le contenu du champ "email", Vérification de l'email et affichage d'un message si celui-ci n'est pas correct
        inputEmail.addEventListener('change', function() {
            let emailErrorMsg = inputEmail.nextElementSibling;
            checkValueEmail = emailRegex.test(inputEmail.value);
            if (checkValueEmail) {
                emailErrorMsg.innerText = '';
                errorFormulaireEmail = false;
            }
            else {
                emailErrorMsg.innerText = 'Veuillez renseigner un email correct.';
                errorFormulaireEmail = true;
            }
        });
        //Ecoute du bouton Commander 
        buttonCommander.addEventListener("click", (event)=>{
        event.preventDefault();
        if(addedProducts === null || addedProducts.length === 0){ 
              alert("Votre panier est vide !");
        }
        else{
        //Gestion du formulaire de contact et validation de la commande 
          // On vérifie qu'aucun champ n'est vide
          if(!inputFirstName.value || !inputLastName.value || !inputAddress.value || !inputCity.value || !inputEmail.value){
              alert("Vous devez renseigner tous les champs !");
              event.preventDefault();
          }
          // On vérifie que les champs sont correctement remplis suivant les regex mises en place
          else if(errorFormulaireFirstName === true || errorFormulaireLastName === true || errorFormulaireAddress === true
               ||errorFormulaireCity === true || errorFormulaireEmail === true){
              alert("Veuillez vérifier les champs du formulaire et les remplir correctement !");
              event.preventDefault();
          }
          else{
          //Récupération des id des produits du panier, dans le LS
              let idProducts = [];
              for (let l = 0; l<addedProducts.length;l++) {
                  idProducts.push(addedProducts[l].chosenProductId);
              }
              // Création d'un objet dans lequel on met les infos "Contact" et les infos "Produits du panier" (l'id)
              const order = {
                  contact: {
                      firstName: inputFirstName.value,
                      lastName: inputLastName.value,
                      address: inputAddress.value,
                      city: inputCity.value,
                      email: inputEmail.value,
                  },
                  products: idProducts,
              } 
              // On indique la méthode d'envoi des données
              const options = {
                  method: 'POST',
                  headers: {
                      'Accept': 'application/json', 
                      'Content-Type': 'application/json' 
                  },
                  body: JSON.stringify(order)
              };
                  //console.log(options);
              // on envoie les données Contact et l'id des produits à l'API
              fetch("http://localhost:3000/api/products/order", options)
              .then((response) => response.json())
              .then((data) => {
                      //console.log(data);
                  // on redirige vers la page de confirmation de commande en passant l'orderId (numéro de commande) dans l'URL
                  document.location.href = `confirmation.html?orderId=${data.orderId}`;
              })
              .catch((err) => {
                  console.log("Erreur Fetch product.js", err);
                  alert ("Un problème a été rencontré lors de l'envoi du formulaire.");
              });
              //----------------------------------------------On vide le LS---------------------------------------------------------------
              localStorage.clear();
          }; 
        }
      }); 
   