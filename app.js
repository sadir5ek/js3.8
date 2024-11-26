document.addEventListener('DOMContentLoaded', () => {
    const cartKeyPrefix = 'shoppingCartItem_'; 
    const cartBadge = document.getElementById('cart-badge');
    const cartModal = document.getElementById('cart-modal');
    const cartBtn = document.getElementById('cart-container');
    const backToProductsBtn = document.getElementById('back-to-products');
    const clearCartBtn = document.getElementById('clear-cart');
    const productList = document.getElementById('product-list');
    const cartItemsContainer = document.getElementById('cart-items');
    const fetchProducts = async () => {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        const data = await res.json();
        renderProducts(data.slice(0, 6)); 
    };
    // Продукт карталарын бетке чыгаруу
    const renderProducts = (products) => {
        productList.innerHTML = ''; // Тизмени тазалоо
        products.forEach((product) => {
            const productCard = document.createElement('div');
            productCard.classList.add('bg-white', 'p-5', 'rounded-lg', 'shadow-lg', 'hover:scale-105', 'transition-all', 'duration-300');
            productCard.innerHTML = `
                <h3 class="text-xl font-semibold mb-2">${product.title}</h3>
                <p class="text-gray-600 mb-4">${product.body.slice(0, 100)}...</p>
                <button class="add-to-cart bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600" data-product='${JSON.stringify(product)}'>
                    удалить
                </button>
            `;
            productList.appendChild(productCard);
        });
        setupCartButtons();
    };
    const setupCartButtons = () => {
        const addButtons = document.querySelectorAll('.add-to-cart');
        addButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const product = JSON.parse(e.target.getAttribute('data-product'));
                addToCart(product);
            });
        });
    };
    const addToCart = (product) => {
        const productKey = cartKeyPrefix + product.id; 
        let cartItem = JSON.parse(localStorage.getItem(productKey)) || null;
        if (cartItem) {
            cartItem.quantity++;
        } else {
            cartItem = {...product, quantity: 1};
        }
        localStorage.setItem(productKey, JSON.stringify(cartItem));
        renderCart();
        updateCartBadge();  
    };
    const renderCart = () => {
        cartItemsContainer.innerHTML = ''; 
        let cartItems = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(cartKeyPrefix)) {
                const item = JSON.parse(localStorage.getItem(key));
                cartItems.push(item);
            }
        }
        if (cartItems.length === 0) {
            cartItemsContainer.innerHTML = `<p class="text-gray-500">Карзинка бош.</p>`;
        } else {
            cartItems.forEach((item) => {
                const cartItem = document.createElement('div');
                cartItem.classList.add('bg-white', 'p-4', 'rounded-md', 'shadow-md', 'flex', 'justify-between', 'items-center');
                cartItem.innerHTML = `
                    <div>
                        <h4 class="text-xl font-semibold">${item.title}</h4>
                        <p class="text-gray-600">${item.body.slice(0, 50)}...</p>
                        <p>Саны: ${item.quantity}</p>
                    </div>
                    <button class="remove-from-cart text-red-500" data-key="${cartKeyPrefix + item.id}">Удалить</button>
                `;
                cartItemsContainer.appendChild(cartItem);
            });
        }

        setupRemoveButtons();
    };
    const removeFromCart = (key) => {
        const item = JSON.parse(localStorage.getItem(key));

        if (item) {
            item.quantity--; 
            if (item.quantity > 0) {
                localStorage.setItem(key, JSON.stringify(item));
            } else {
                localStorage.removeItem(key); 
            }
        }

        renderCart();
        updateCartBadge(); 
    };
    const setupRemoveButtons = () => {
        const removeButtons = document.querySelectorAll('.remove-from-cart');
        removeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const productKey = e.target.getAttribute('data-key');
                removeFromCart(productKey);
            });
        });
    };
    const updateCartBadge = () => {
        let count = 0;
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(cartKeyPrefix)) {
                const item = JSON.parse(localStorage.getItem(key));
                count += item.quantity;
            }
        }
        if (count > 0) {
            cartBadge.textContent = `${count}+`; 
            cartBadge.classList.remove('hidden');
        } else {
            cartBadge.classList.add('hidden');
        }
    };
    const clearCart = () => {
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.startsWith(cartKeyPrefix)) {
                localStorage.removeItem(key);
            }
        }
        renderCart();
        updateCartBadge();
    };

    cartBtn.addEventListener('click', () => {
        cartModal.classList.remove('hidden');
        renderCart();
    });
    backToProductsBtn.addEventListener('click', () => {
        cartModal.classList.add('hidden');
    });
    fetchProducts();
    updateCartBadge();
});
