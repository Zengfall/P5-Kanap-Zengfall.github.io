// Appel de l'API pour recupérer les produits

// Ajout des produits sur la page d'accueil
addProducts();
//
async function addProducts() {
    await fetch('http://localhost:3000/api/products')
        .then((res) => res.json())
        .then((data) => {
            // Boucle nous permettant d'afficher tous les produits
            for (let i = 0; i < data.length; i++) {
                product = data[i];
                document.querySelector('#items').innerHTML += `
                    <a href="./product.html?id=${product._id}">
                        <article>
                            <img src="${product.imageUrl}" alt="${product.altTxt}">
                            <h3 class="productName">${product.name}</h3>
                            <p class="productDescription">${product.description}</p>
                        </article>
                    </a>`;
            }
        })
        .catch((error) => {
            console.log( error);
            window.alert('Connexion au serveur impossible !');
        });
}

