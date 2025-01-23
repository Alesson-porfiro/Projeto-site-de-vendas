const menu = document.getElementById("menu")
const cartBtn = document.getElementById("cart-btn")
const cartModal = document.getElementById("cart-modal")
const cartItemsContainer = document.getElementById("cart-items")
const cartTotal = document.getElementById("cart-total")
const checkOutBtn = document.getElementById("checkOut-btn")
const closeModalBtn = document.getElementById("close-modal-btn")
const cartCounter = document.getElementById("cart-count")
const addressInput = document.getElementById("address")
const addressWarn = document.getElementById("address-warn")


let cart = [];

//Abrir o modal do carrinho
cartBtn.addEventListener("click", function () {
    
    cartModal.style.display = "flex"
})

//Fechar o modal quando clicar fora

cartModal.addEventListener("click", function (event) {
    if (event.target === cartModal) {
        cartModal.style.display = "none"
    }
})

closeModalBtn.addEventListener("click", function () {
    cartModal.style.display = "none"
})

menu.addEventListener("click", function (event) {
    //console.log(event.target)

    let parentButton = event.target.closest(".add-to-cart-btn")

    if (parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))
        addToCart(name, price)
    }
})

//Função para adicionar no carrinho

function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name)

    if (existingItem) {
        //Se existe, aumenta a quantidade +1
        existingItem.quantity += 1;
    } else {
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    updateCartModal()
}

//Atualiza o carrinho
function updateCartModal(){
    cartItemsContainer.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemElement.innerHTML = `
        <div class="flex items-center justify-between">

         <div>
            <p class="font-bold">${item.name}</p>
            <p>Qtd: ${item.quantity}</p>
            <p class=""font-medium mt-2>R$ ${item.price.toFixed(2)}</p>
         </div>
         
         
            <button class="remove-from-cart-btn text-red-600" data-name="${item.name}">
             Remover
            </button>
      

        </div>
        `
        
        total += item.price * item.quantity;

        cartItemsContainer.appendChild(cartItemElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-br",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
} 

//Função para remover o item do carrinho
cartItemsContainer.addEventListener("click", function(event){
    if(event.target.classList.contains("remove-from-cart-btn")){
        const name = event.target.getAttribute("data-name")

        removeItemCart(name);
    }
})

function removeItemCart(name){
    const index = cart.findIndex(item => item.name === name);

    if(index !== -1){
        const item = cart[index];
        console.log(item);

        if(item.quantity > 1){
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", function(event){
    let inputValue = event.target.value;

    if(inputValue !== ""){
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
})

//Finalizar pedido
checkOutBtn.addEventListener("click", function () {

    // Verificar se o restaurante esta aberto ou não (descomentado se você quiser usar)
    // const isOpen = checkRestaurantOpen();
    // if (!isOpen) {
    //     alert("RESTAURANTE FECHADO NO MOMENTO!");
    //     return;
    // }

    // Verifica se o carrinho está vazio
    if (cart.length === 0) {
        alert("Seu carrinho está vazio!");
        return;
    }

    // Verifica se o endereço foi preenchido
    if (addressInput.value === "") {
        addressWarn.classList.remove("hidden");
        addressInput.classList.add("border-red-500");
        return;
    }

    // Monta a mensagem do pedido
    const cartItems = cart.map((item) => {
        return ` ${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price.toFixed(2)} Total: R$${item.price}`;
    }).join("\n");

    // Codifica a mensagem para o WhatsApp
    const message = encodeURIComponent(cartItems);
    const phone = "+5511954771805";
    


    // Cria o link para o WhatsApp
    const whatsappUrl = `https://wa.me/${phone}?text=${message}%0AEndereço: ${addressInput.value}`;



    // Abre o link do WhatsApp
    window.open(whatsappUrl, "_blank");

    // Limpeza ou feedback após envio (opcional)
    console.log("Pedido enviado para o WhatsApp: ", cartItems);
    alert("Seu pedido foi enviado para o WhatsApp!");

    cart = [];
    updateCartModal();
})





//verificar a hora e manipular o card horario
function checkRestaurantOpen(){

    const data = new Date();
    const hora = data.getHours();
    return hora >= 18 && hora > 22;
}


const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen){
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-green-600")
}