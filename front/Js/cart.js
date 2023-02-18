// On déclare les variables à utiliser
// Variable qui va contenir les produits ajoutés
let addedProducts= JSON.parse(localStorage.getItem("kanapLs"));
//Localisation sur la page html des produits
const productsLocationHtml = document.getElementById("cart__items");
//Déclaration des variables de la page panier
let productsInBasket = [];
// Les variables pour calculer la quantité totale d'articles et le prix total du panier
let myBasket = [];
const findProducts = 0;
let totalPrice = 0;  
let totalQuantity = 0;
let quantityProductBasket = 0;
let priceProductBasket = 0;
let totalProductPriceBasket = 0;
//On déclare les variables à utiliser dans la fonction supprimer
let idDelete = 0;
let colorDelete = 0;
//Les variables à utiliser pour la validation du panier-
const buttonCommander = document.getElementById("order");
let errorFormulaireFirstName = true;
let errorFormulaireLastName = true;
let errorFormulaireAddress = true;
let errorFormulaireCity = true;
let errorFormulaireEmail = true;

//___________________________________Affichage des produits du LocalStorage__________________________________________________________

//--------------Si le panier est vide (le localStorage est vide ou le tableau qu'il contient est vide), on affiche "Le panier est vide"------------
if(addedProducts === null || addedProducts.length === 0){
    messagePanierVide(); 
    //Si le client clique quand même sur le bouton commander, on lui rappelle que le panier est vide
    buttonCommander.addEventListener("click", (event)=>{
        alert("Votre panier est vide !");
        event.preventDefault();
    });
}

//-----------------------------------Si le panier n'est pas vide alors, on affiche le contenu du localStorage-------------------------------------

else {

    fetch("http://localhost:3000/api/products")
        .then(response => response.json())
        .then(data => {
            myBasket = data;
            // on récupère la couleur, la quantité et l'id des produits contenus dans le localstorage et on les met dans des variables
            for(let i = 0; i < addedProducts.length; i++){
                let colorProductBasket = addedProducts[i].chosenProductColor;
                let idProductBasket = addedProducts[i].chosenProductId;
                quantityProductBasket = addedProducts[i].quantity
				;
                //on ne récupère que les données des canapés dont les _id (de l'api) correspondent aux id dans le localStorage
                const productsInBasket = data.find((element) => element._id === idProductBasket);
                    //console.log(addedProducts);
                // Récupération du prix de chaque produit que l'on met dans une variable priceProductPanier
                priceProductBasket = productsInBasket.price;
				 //console.log(productsInBasket.price);

                //---------------On cré les éléments html manquants de la page cart.html, dans la <section id="cart__items">...--------------------
                //-----------------------------...et on y insère les infos du localstorage----------------------------------------------------------
				let newProduct = document.createElement('article');
                newProduct.setAttribute("class","cart__item");
                newProduct.setAttribute("data-id",`${idProductBasket}`);
                newProduct.setAttribute("data-color",`${colorProductBasket}`);
                productsLocationHtml.appendChild(newProduct);

                    //----------------------------------Création de la div avec pour classe cart__item__img----------------------------------------------
                    let newDivImg = document.createElement('div');
                    newDivImg.setAttribute("class", "cart__item__img");
                    newProduct.appendChild(newDivImg);

                        //--------------------------Création de la balise image qui contiendra la photo de chaque canapé----------------------------------
                        let newImg = document.createElement('img');
                        newImg.setAttribute("src", productsInBasket.imageUrl);
                        newImg.setAttribute("alt", productsInBasket.altTxt);
                        newDivImg.appendChild(newImg);

                    //--------------------------------Création de la div avec pour classe cart__item__content-----------------------------------------
                    let newDivContent = document.createElement('div');
                    newDivContent.setAttribute("class", "cart__item__content");
                    newProduct.appendChild(newDivContent);   

                        //----------------------------Création de la div avec pour classe cart__item__content__description--------------------------------
                        let newDivContentDescription = document.createElement('div');
                        newDivContentDescription.setAttribute("class", "cart__item__content__description");
                        newDivContent.appendChild(newDivContentDescription);

                            //-------------------Création d'une balise titre h2 qui indique le nom du produit --------------
                            let newH2 = document.createElement('h2');
                            newH2.innerText = productsInBasket.name;
                            newDivContentDescription.appendChild(newH2);

                            //--------------------Création d'une balise p qui indique la couleur choisie ------------------------
                            let newPColor = document.createElement('p');
                            newPColor.innerText = colorProductBasket;
                            newDivContentDescription.appendChild(newPColor);

                            //--------------------------Création d'une balise p qui indique le prix du canapé-------------------------------------
                            let newPPrice = document.createElement('p');
                            newPPrice.innerText = productsInBasket.price + " €";
                            newDivContentDescription.appendChild(newPPrice);

                        //------------------------Création de la div avec pour classe cart__item__content__settings------------------------------
                        let newDivContentSettings = document.createElement('div');
                        newDivContentSettings.setAttribute("class", "cart__item__content__settings");
                        newDivContent.appendChild(newDivContentSettings);

                            //--------------------Création de la div avec pour classe cart__item__content__settings__quantity--------------------
                            let newDivContentSettingsQuantity = document.createElement('div');
                            newDivContentSettingsQuantity.setAttribute("class", "cart__item__content__settings__quantity");
                            newDivContentSettings.appendChild(newDivContentSettingsQuantity);

                                //-----------------------------Création d'une balise p qui indique le texte "Quantité :"-------------------------------
                                let newPQuantity = document.createElement('p');
                                newPQuantity.innerText = "Quantité :";
                                newDivContentSettingsQuantity.appendChild(newPQuantity);

                                //------------Création d'une balise input avec la classe "itemQuantity" qui permet de modifier la quantité-------
                                let newPInput = document.createElement('input');
                                newPInput.setAttribute("type", "number");
                                newPInput.setAttribute("class", "itemQuantity");
                                newPInput.setAttribute("name", "itemQuantity");
                                newPInput.setAttribute("min", "1");
                                newPInput.setAttribute("max", "100");
                                newPInput.setAttribute("value", `${quantityProductBasket}`);
                                newDivContentSettingsQuantity.appendChild(newPInput);

                            //------------------Création de la div avec pour classe cart__item__content__settings__delete-------------------------
                            let newDivContentSettingsDelete = document.createElement('div');
                            newDivContentSettingsDelete.setAttribute("class", "cart__item__content__settings__delete");
                            newDivContentSettings.appendChild(newDivContentSettingsDelete);

                                //------------------------Création d'une balise p qui indique le prix du canapé-----------------------------------
                                let newPDelete = document.createElement('p');
                                newPDelete.setAttribute("class", "deleteItem");
                                newPDelete.innerText = "Supprimer";
                                newDivContentSettingsDelete.appendChild(newPDelete);
                
                //_____________________________________________Fin Ajout Balises html____________________________________________________________
				 //__Appel de la fonction pour calculer la qtité totale de produits & le prix total du panier, au chargement de la page Panier.html______
				 totals();
				}//for
				//___________________________________________Appel de la fonction Supprimer un produit__________________________________________________________
				deleteProduct();
				//_____________________________________Appel de le fonction Modifier la quantité d'un produit____________________________________________________
				ModifyQuantity(); 
	
			});	
}

//----------------------------------Fonction 1: Suppression d'un article du panier--------------------------------------------------
function deleteProduct() {
    let selectSupprimer = document.querySelectorAll(".deleteItem");
    selectSupprimer.forEach((selectSupprimer) => {
            selectSupprimer.addEventListener("click" , (event) => {
                event.preventDefault();
                            
                // On pointe le parent hiérarchique <article> du lien "supprimer"
                let myArticle = selectSupprimer.closest('article');
                // on filtre les éléments du localStorage pour ne garder que ceux qui sont différents de l'élément qu'on supprime
                addedProducts = addedProducts.filter
                ( element => element.chosenProductId !== myArticle.dataset.id || element.chosenProductColor !== myArticle.dataset.color );
                
                // On met à jour le localStorage
                localStorage.setItem("kanapLs", JSON.stringify(addedProducts));
                
                //Alerte produit supprimé
                alert("Ce produit va être supprimé du panier.");
                            
                // On supprime physiquement la balise <article> du produit que l'on supprime depuis son parent, si elle existe
                if (myArticle.parentNode) {
                    myArticle.parentNode.removeChild(myArticle);
                }
                //-----Si, du coup, le panier est vide (le localStorage est vide ou le tableau qu'il contient est vide),...
                //...on affiche "Le panier est vide"-------------------------------------------------------------------
                if(addedProducts === null || addedProducts.length === 0){
                    messagePanierVide();
                }
                else{
                // Et, on calculatione la quantité et le prix total du panier
                calculationtotalQuantity();
                calculationTotalPrice();
                }
            }); 
    })
}
//----------------------------------Fonction 2:  Modifier la quantité d'un article du panier--------------------------------------------------
let messageErrorQuantity = false;
function ModifyQuantity() {
    // On sélectionne l'élément html (input) dans lequel la quantité est modifiée
    let ModifyQuantity = document.querySelectorAll(".itemQuantity");
    ModifyQuantity.forEach((item) => {
        //On écoute le changement sur l'input "itemQuantity"
        item.addEventListener("change", (event) => {
            event.preventDefault();
            choiceQuantity = Number(item.value);
            // On pointe le parent hiérarchique <article> de l'input "itemQuantity"
            let myArticle = item.closest('article');
                //console.log(myArticle);
            // On récupère dans le localStorage l'élément (même id et même couleur) dont on veut modifier la quantité
            let selectMyArticleInLocalStorage = addedProducts.find
            ( element => element.chosenProductId === myArticle.dataset.id && element.chosenProductColor === myArticle.dataset.color );
            
            // Si la quantité est comprise entre 1 et 100 et que c'est un nombre entier,...
            //...on met à jour la quantité dans le localStorage et le DOM
            if(choiceQuantity > 0 && choiceQuantity <= 100 && Number.isInteger(choiceQuantity)){
                parseChoiceQuantity = parseInt(choiceQuantity);
                selectMyArticleInLocalStorage.quantity = parseChoiceQuantity;
                localStorage.setItem("kanapLs", JSON.stringify(addedProducts));
                // Et, on calculatione la quantité et le prix total du panier
                calculationtotalQuantity();
                calculationTotalPrice();
                messageErrorQuantity = false;
            }
            // Sinon, on remet dans le DOM la quantité indiquée dans le localStorage et on indique un message d'erreur
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
//----------Fonction 3: Calcul du montant total du panier, lors de la modification de la quantité ou de la suppression d'un article-------------
function calculationTotalPrice() {
    let newTotalPrice = 0;
    //(1) On fait une boucle sur le addedProducts et dans cette boucle, 
    for (const item of addedProducts) {
        const idProductsLocalStorage = item.chosenProductId;
        const quantityProductsLocalStorage = item.quantity;
        //(2) on vérifie si l'id correspond
        const findProducts = myBasket.find((element) => element._id === idProductsLocalStorage);
            //console.log(findProducts);
        //(3) et si c'est le cas, on récupère le prix.
        if (findProducts) {
            const newTotalProductPriceBasket = findProducts.price * quantityProductsLocalStorage;
            newTotalPrice += newTotalProductPriceBasket;
                //console.log("Nouveau prix total panier",newTotalPrice);
        }
    //On affichage le nouveau prix total du panier dans le html
    document.getElementById("totalPrice").innerText = newTotalPrice;
    } 
}
//---Fonction calculation de la quantité total d'articles dans le panier, lors de la modification de la quantité ou de la suppression d'un article---
function calculationtotalQuantity() {
    let newtotalQuantity = 0;
    for (const item of addedProducts) {
        //On calcul le nombre de quantité total de produits dans le localStorage
        newtotalQuantity += parseInt(item.quantity);
    }
        //console.log("Nouvelle quantité totale panier",newtotalQuantity);
    //On affichage la nouvelle quantité totale de produits dans le html
    document.getElementById("totalQuantity").innerText = newtotalQuantity;
}
//-------------------------------Fonction 4:  Calcul du montant total du panier, au chargement de la page Panier.html-------------------------------
function totalProductsPrice (){
    // Calcul du prix total de chaque produit en multipliant la quantité par le prix unitaire
    totalProductPriceBasket = quantityProductBasket * priceProductBasket;
    // console.log(totalProductPricePanier);
    // Calcul du prix total du panier
    totalPrice += totalProductPriceBasket;
    //console.log("Total prix panier",totalPrice);
    document.getElementById("totalPrice").innerText = totalPrice; 
    }

function totals (){
    totalProductsQuantity();
    totalProductsPrice();
}
//----------------------Fonction 5:  Calcul de la quantité total d'articles dans le panier, au chargement de la page Panier.html-----------------
function totalProductsQuantity(){
    totalQuantity += parseInt(quantityProductBasket);
    //console.log("Total quantité panier",totalQuantity);
    document.getElementById("totalQuantity").innerText = totalQuantity;
}
//----------------------------------Fonction 6:  Pour afficher la phrase "Le panier est vide !"--------------------------------------------------
function messagePanierVide() {
    productsInBasket = 'Le panier est vide !';
    let newH2 = document.createElement('h2');
    productsLocationHtml.appendChild(newH2);
    newH2.innerText = productsInBasket;
    // On insère 0 dans le html pour la quantité et le prix du panier
    document.getElementById("totalQuantity").innerText = 0;
    document.getElementById("totalPrice").innerText = 0;
}



//___________________________________Contrôle des infos avec Regex et Récupération des données du formulaire____________________________________
    
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
  
        // Ecoute du contenu du champ "prénom", Vérification du prénom et affichage d'un message si celui-ci n'est pas correct
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

        // Ecoute du contenu du champ "nom", Vérification du nom et affichage d'un message si celui-ci n'est pas correct
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

        // Ecoute du contenu du champ "adresse", Vérification de l'adresse et affichage d'un message si celle-ci n'est pas correcte
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

        // Ecoute du contenu du champ "ville", Vérification de la ville et affichage d'un message si celle-ci n'est pas correcte
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

        // Ecoute du contenu du champ "email", Vérification de l'email et affichage d'un message si celui-ci n'est pas correct
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
        event.preventDefault();// Empêche le rechargement de la page
        if(addedProducts === null || addedProducts.length === 0){ 
              alert("Votre panier est vide !");
        }
        else{
          
  
          //__________________________________________Gestion du formulaire de contact et validation de la commande________________________________________
          
          // On vérifie que tous les champs sont bien renseignés, sinon on indique un message à l'utilisateur
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
              //Récupération des id des produits du panier, dans le localStorage
              let idProducts = [];
              for (let l = 0; l<addedProducts.length;l++) {
                  idProducts.push(addedProducts[l].chosenProductId);
              }
                  //console.log(idProducts);
              // On cré un objet dans lequel on met les infos "Contact" et les infos "Produits du panier" (l'id)
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
                 //console.log(order);
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
              //----------------------------------------------On vide le localStorage---------------------------------------------------------------
              localStorage.clear();
          }; //fin else
        }
      }); //fin écoute bouton Commander
   //fin else