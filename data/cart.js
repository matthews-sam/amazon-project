export const cart = [];

export function addToCart(productId){
    let matchingItem;

    cart.forEach((cartitem) =>{
        if (productId === cartitem.productId){
            matchingItem = cartitem;
        }
    });

    if (matchingItem) {
        matchingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            quantity: 1
        });
    }   
}