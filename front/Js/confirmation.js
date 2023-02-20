//_________________Récupération de la chaîne de requête dans l'URL et Extraction de l'orderId (numéro de commande) de l'URL_______________________
const orderIdKanap = new URLSearchParams(window.location.search).get("orderId");
// On affiche la confirmation de la commande et le numéro de commande________________________________________
// Sélection de l'élément html dans lequel on veut afficher le numéro de commande
    const zoneOrderId = document.getElementById("orderId");
// On insère le numéro de commande dans le html
    zoneOrderId.innerText = orderIdKanap;
//console.log(zoneOrderId);
////// On vide le LocalStorage /////////
localStorage.clear();