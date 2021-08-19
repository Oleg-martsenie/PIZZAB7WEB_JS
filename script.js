const QS = (e) =>{
    return document.querySelector(e)
};
const QSA = (e) =>{
    return document.querySelectorAll(e)
}

let cart = [];
let modalQtd = 1;
let modalKey = 0;


//Listagem das pizzas
pizzaJson.map((item, index)=>{
    let pizzaItem = QS('.models .pizza-item').cloneNode(true)  //Para clonar um item usamos a função => cloneNode

    pizzaItem.setAttribute('data-key', index);
    pizzaItem.querySelector('.pizza-item--img img').src = item.img
    pizzaItem.querySelector('.pizza-item--price').innerHTML = `$ ${item.price.toFixed(2)}`;
    pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name;
    pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description;

    pizzaItem.querySelector('.pizza-item a').addEventListener('click',(e)=> {
        e.preventDefault();
        let key = e.target.closest('.pizza-item').getAttribute('data-key');
        modalQtd = 1;
        modalKey = key

        QS('.pizzaBig img').src = pizzaJson[key].img;
        QS('.pizzaInfo h1').innerHTML = pizzaJson[key].name;
        QS('.pizzaInfo--desc').innerHTML = pizzaJson[key].description;
        QS('.pizzaInfo--actualPrice').innerHTML = `$ ${pizzaJson[key].price.toFixed(2)}`
    
        QS('.pizzaInfo--size.selected').classList.remove('selected')
        
        QSA('.pizzaInfo--size').forEach((size, sizeindex)=>{
            if(sizeindex== 2) {
                size.classList.add('selected')
            } 
            size.querySelector('span').innerHTML = pizzaJson[key].sizes[sizeindex]
        });

        QS('.pizzaInfo--qt').innerHTML = modalQtd;


        QS('.pizzaWindowArea').style.opacity = 0;
        QS('.pizzaWindowArea').style.display = 'flex';
        setTimeout(()=> {
            QS('.pizzaWindowArea').style.opacity = 1;
        },200)
    })

    QS('.pizza-area').append( pizzaItem );
});

//Eventos do modal
function closeModal() {
    QS('.pizzaWindowArea').style.opacity = 0;
    setTimeout(()=>{
        QS('.pizzaWindowArea').style.display = 'none';
    },500)
}

QSA('.pizzaInfo--cancelButton, .pizzaInfo--cancelMobileButton ').forEach((item)=>{
    item.addEventListener('click', closeModal)
})

QS('.pizzaInfo--qtmenos').addEventListener('click',()=>{
    if(modalQtd > 1) {
        modalQtd--
        QS('.pizzaInfo--qt').innerHTML = modalQtd;
    }
});

QS('.pizzaInfo--qtmais').addEventListener('click',()=>{
    modalQtd++;
    QS('.pizzaInfo--qt').innerHTML = modalQtd
});

QSA('.pizzaInfo--size').forEach((size, sizeindex)=>{
    size.addEventListener('click', (e)=>{
        QS('.pizzaInfo--size.selected').classList.remove('selected')
        size.classList.add('selected') //Essa lógica é usada , bascimante, p/ todos os sistemas q precisa clicar em apenas um e desmarcar o resto
    })
});

QS('.pizzaInfo--addButton').addEventListener('click', ()=> {
//Reunido as informação da pizza
    let size = parseInt(QS('.pizzaInfo--size.selected').getAttribute('data-key'));
    let indentifier = pizzaJson[modalKey].id+'@'+size;
    let key = cart.findIndex((item)=>{
        return item.indentifier == indentifier //VERIFICAÇÃO NÃO SUBSTITUIÇÃO POR ISSO O (==)
    });

    if(key > -1){
        cart[key].quantidade += modalQtd
    } else {
    cart.push({
        indentifier,
        id: pizzaJson[modalKey].id,
        size: size,
        quantidade: modalQtd
     });
    }

    updateCart();
    closeModal()
});

QS('.menu-openner').addEventListener('click', () => {
    if(cart.length > 0) {
        QS('aside').style.left = '0';
    }
})

QS('.menu-closer').addEventListener('click', () => {
    QS('aside').style.left = '100vw'
});
function updateCart() {
    QS('.menu-openner span').innerHTML = cart.length

    if(cart.length > 0) {
        QS('aside').classList.add('show')
        QS('.cart').innerHTML = '';

        let subtotal = 0;
        let discount = 0;
        let toal = 0;

        for(let i in cart) {
            let pizzaItem = pizzaJson.find((item)=> item.id == cart[i].id);
            subtotal += pizzaItem.price * cart[i].quantidade;

            let cartItem = QS('.models .cart--item').cloneNode(true);

            let pizzaSizeName;
            switch(cart[i].size) {
                case 0:
                    pizzaSizeName = 'P'
                    break;
                case 1:
                    pizzaSizeName = 'M'
                    break;
                case 2:
                    pizzaSizeName = 'G'
                    break;
            }
            let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`
            
            cartItem.querySelector('img').src = pizzaItem.img;
            cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].quantidade
            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
                if( cart[i].quantidade > 1) {
                    cart[i].quantidade--
                } else {
                    cart.splice(i, 1);
                }
                updateCart()
            });
            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
                cart[i].quantidade++;
                updateCart()
            });


            QS('.cart').append(cartItem);
        }

        discount = subtotal * 0.1;
        total = subtotal - discount;

        QS('.subtotal span:last-child').innerHTML = `$ ${subtotal.toFixed(2)}`
        QS('.desconto span:last-child').innerHTML = `$ ${discount.toFixed(2)}`
        QS('.total span:last-child').innerHTML = `$ ${total.toFixed(2)}`

    } else {
        QS('aside').classList.remove('show')
        QS('aside').style.left = '100vw'

    }

}