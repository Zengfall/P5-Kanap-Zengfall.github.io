//ID du produit
let kanapId = new URLSearchParams(window.location.search).get("id");
//Rechercher un produit par son ID
searchProduct();
async function searchProduct() {
  await fetch(`http://localhost:3000/api/products/${kanapId}`)
    			.then((res) => res.json())
    			.then((data) => details(data))
   				 .catch((error) => {
     			 console.log(error);
      			window.alert("Merci de choisir un produit à la page \'Accueil!'");
    });
	}
//Recharger les détails du produit
		function details(data) {
  			if (data != null) {
    		let kanapImg = document.querySelector(".item__img");
    		kanapImg.innerHTML += `<img src="${data.imageUrl}" alt="${data.altTxt}">`;

    		kanapName = document.querySelector("#product_name");
			
    		kanapName.textContent = data.name;
		
    		kanapPrice = document.querySelector("#price");
    		kanapPrice.textContent = data.price;

    		kanapSpeech = document.querySelector("#description");
    		kanapSpeech.textContent = data.description;
//Boucle pour la couleur
    	for (let i = 0; i < data.colors.length; i++) {
      		makeChoice(data.colors[i]);
   		 }
  	}
}
//Fonction pour le choix de la couleur
		function makeChoice(varChoice) {
  			const varOption = document.createElement("option");
  			varOption.value = varChoice;
  			varOption.textContent = varChoice;
  			const parent = document.querySelector("#colors");
  			parent.append(varOption);
}
//Bouton ajout de produits

			const button = document.getElementById("addToCart");

  //Les fonctions actionnées au clic du bouton "Ajouter au panier"
 	button.addEventListener("click", () =>
	 {
    		const KanapQuantity = document.querySelector("#quantity");
    		const KanapColor = document.querySelector("#colors");
        // Les caractéristiques de l'article mis dans le panier
    	    let basket = {
      		chosenProductId: kanapId,
      		chosenProductColor: KanapColor.value,
      		chosenProductQuantity: KanapQuantity,
      		chosenProductName: kanapName,
   		 };
        // Fonction 1: Recupération du panier dans le LS
    	function getBasket() {
      		let basket = JSON.parse(localStorage.getItem("kanapLs")); // Transforme les données en tableau dans le LS
      		if (basket === null) {
        	return []; //Si le LS est vide, on crée un tableau vide représentant un panier vide
      	}   else {
        	return basket; // Si le panier existe
      		}
    	}
  		//Fonction 2:  Ajout du produit
    	function addBasket(product) {
      		let basket = getBasket();
      		let foundProduct = basket.find(
  		// On définit foundProduct comme l'article à trouver avec les items 'Id et Color'
        	(item) =>
          		item.chosenProductId === product.chosenProductId &&
          		item.chosenProductColor === product.chosenProductColor
			); //Si les produits du panier et les produits du LS n'ont pas même ID et même couleur
      	// il retournera undefined
     	 	if (
        		foundProduct == undefined &&
        		KanapColor.value != "" &&              //Si l'article n'est pas présent , 
        		KanapQuantity.value > 0 &&
        		KanapQuantity.value <= 100
      		) {
        		product.quantity = KanapQuantity.value; //On l'ajoute au panier
        		basket.push(product); //On l'envoie dans le LS
      		  } else {  // Si l'article est déjà présent on incrémente la quantité
        		let newQuantity =
          		parseInt(foundProduct.quantity) + parseInt(KanapQuantity.value);
        		foundProduct.quantity = newQuantity;
      		  }
      			saveBasket(basket);
				
			  		if (KanapQuantity.value <=1) {  // Message de confirmation de l'ajout du produit dans le panier
					alert(
						`Le canapé ${kanapName.textContent} ${KanapColor.value} a été ajouté en ${KanapQuantity.value} exemplaire à votre panier !`
						 );
						}
					else {
						alert(
							`Le canapé ${kanapName.textContent} ${KanapColor.value} a été ajouté en ${KanapQuantity.value} exemplaires à votre panier !`
							 );
					}
    	}
  		//Fonction 3: Sauvegarde du panier
    	function saveBasket(basket) {
      		localStorage.setItem("kanapLs", JSON.stringify(basket));
   		 }
  		// Contrôle de la couleur
    		if (KanapColor.value === "") {
      			alert("Veuillez choisir une couleur, SVP");
    		}
  		// Contrôle de la quantité
    		else if (KanapQuantity.value <= 0 || KanapQuantity.value > 100) {
      			alert("Veuillez sélectionner une quantité correcte, SVP");
    		} else {
  		//Si tout est OK, on envoie le panier au LS
      				addBasket(basket);
    			   }
 	});