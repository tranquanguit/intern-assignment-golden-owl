$(document).ready(function() {
    // Load products from JSON file
    $.getJSON('./static/data/shoes.json', function(data) {
        var products = data.shoes;
        var cart = [];

        // Display all products in Our Products section
        function displayProducts() {
            var productSection = $('.productList');
            productSection.empty();

            for (var i = 0; i < products.length; i++) {
                var product = products[i];
                var addButton = $('<button class="add-to-cart" data-product-id="' + product.id + '">ADD TO CART</button>').click(addToCart(product));
                var image = $('<img class="product-image">').attr('src', product.image);
                var name = $('<h3 class="product-name">').text(product.name);
                var description = $('<p class="product-description">').text(product.description);
                var price = $('<p class="product-price">').text('$' + product.price.toFixed(2));
                var productDivChild2 = $('<div class="prdImg">')
                    .append(image);
                var productDivChild = $('<div class="product-price-add">')
                    .append(price, addButton);
                var productDiv = $('<div class="product">')
                    .append(productDivChild2, name, description, productDivChild);

                productSection.append(productDiv);
            }
        }

        // Add product to cart
        function addToCart(product) {
            return function() {
                event.preventDefault(); // Ngăn chặn sự kiện click mặc định của nút "ADD TO CART"
                event.stopPropagation(); // Ngăn chặn sự kiện click lan truyền lên các phần tử cha
        
                var existingItem = cart.find(function(cartItem) {
                    return cartItem.id === product.id;
                });
            
                if (existingItem) {
                    return;
                } else {
                    var newItem = {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    amount: 1
                    };
                    cart.push(newItem);
                }
            
                updateCart();

                // Disable the add-to-cart button and replace with check icon
                var addToCartButton = $(this);
                addToCartButton.html('<img class="icon-check" src="./static/assets/check.png">').attr('disabled', true);
            };
        }
  
        // Update cart UI
        function updateCart() {
            var cartSection = $('.cart-items');
            cartSection.empty();

            if (cart.length === 0) {
                $('.cart-empty').show();
                $('.total-price').text('Total: $0.00');
                return;
            } else {
                $('.cart-empty').hide();
            }

            var totalPrice = 0;

            for (var i = 0; i < cart.length; i++) {
                var cartItem = cart[i];
                var increaseButton = $('<img src="./static/assets/plus.png">').click(increaseAmount(cartItem));
                var decreaseButton = $('<img src="./static/assets/minus.png">').click(decreaseAmount(cartItem));
                var removeButton = $('<img src="./static/assets/trash.png">').click(removeFromCart(cartItem));
                var image = $('<img>').attr('src', cartItem.image);
                var name = $('<h3>').text(cartItem.name);
                var price = $('<p class="cart-price">').text('$' + cartItem.price.toFixed(2));
                var amount = $('<p>').text('' + cartItem.amount); // Hiển thị số lượng sản phẩm từ thuộc tính amount của đối tượng cartItem
                
                var amountNum = $('<div class="amount">')
                    .append(amount);
                var buttonDelete = $('<div class="buttonDelete">')
                    .append(removeButton);
                var buttonInDe = $('<div class="buttonInDe">')
                    .append(increaseButton, amountNum, decreaseButton);
                var buttons = $('<div class="buttons">')
                    .append(buttonInDe, buttonDelete);
                var imageCart = $('<div class="imageCart">')
                    .append(image);
                var itemDiv = $('<div class="cart-item">')
                  .append(imageCart,
                    $('<div class="info">').append(name, price, buttons));
            
                cartSection.append(itemDiv);
                totalPrice += cartItem.price * cartItem.amount; // Tính tổng tiền bằng cách nhân giá sản phẩm với số lượng sản phẩm
            
            }
            
            $('.total-price').text('$' + totalPrice.toFixed(2));
        }

        // Increase product amount in cart
        function increaseAmount(product) {
            return function() {
                product.amount = (product.amount || 1) + 1;
                updateCart();
            };
        }

        // Decrease product amount in cart
        function decreaseAmount(product) {
            return function() {
                if (product.amount) {
                    product.amount -= 1;
                }

                if (product.amount === 0) {
                    cart = cart.filter(function(item) {
                        return item !== product;
                    });
                    // Restore the add-to-cart button
                    var addToCartButton = $('.add-to-cart[data-product-id="' + product.id + '"]');
                    addToCartButton.html('ADD TO CART').attr('disabled', false);
                }

                updateCart();
            };
        }

        // Remove product from cart
        function removeFromCart(product) {
            return function() {
                cart = cart.filter(function(item) {
                    return item !== product;
                });

                updateCart();

                // Restore the add-to-cart button
                var addToCartButton = $('.add-to-cart[data-product-id="' + product.id + '"]');
                addToCartButton.html('ADD TO CART').attr('disabled', false);
            };
        }

        // Load cart from local storage
        function loadCartFromLocalStorage() {
            var savedCart = localStorage.getItem('cart');

            if (savedCart) {
                cart = JSON.parse(savedCart);
                updateCart();
            }
        }

        // Save cart to local storage
        function saveCartToLocalStorage() {
            localStorage.setItem('cart', JSON.stringify(cart));
        }

        // Initialize the application
        function initialize() {
            displayProducts();
            loadCartFromLocalStorage();

            $('.add-to-cart').click(function() {
                var productId = $(this).data('product-id');
                var product = products.find(function(p) {
                    return p.id === productId;
                });
                addToCart(product).call(this);
            });

            $(window).on('beforeunload', function() {
                saveCartToLocalStorage();
            });
        }

        initialize();
    });
});
