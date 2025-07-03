
                // Slideshow JavaScript
                let slideIndex = 1;
        let slideTimer;
        
        // Initialize slideshow
        function showSlides(n) {
            const slides = document.getElementsByClassName("slide");
            const dots = document.getElementsByClassName("dot");
            
            if (n > slides.length) {slideIndex = 1}
            if (n < 1) {slideIndex = slides.length}
            
            // Hide all slides
            for (let i = 0; i < slides.length; i++) {
                slides[i].style.display = "none";
            }
            
            // Remove active class from all dots
            for (let i = 0; i < dots.length; i++) {
                dots[i].className = dots[i].className.replace(" active-dot", "");
            }
            
            // Show the current slide and activate the dot
            slides[slideIndex-1].style.display = "block";
            dots[slideIndex-1].className += " active-dot";
            
            // Reset the timer for automatic slideshow
            clearTimeout(slideTimer);
            slideTimer = setTimeout(() => plusSlides(1), 5000); // Change slide every 5 seconds
        }
        
        // Next/previous controls
        function plusSlides(n) {
            showSlides(slideIndex += n);
        }
        
        // Thumbnail controls
        function currentSlide(n) {
            showSlides(slideIndex = n);
        }
        
        // Start the slideshow when the page loads
        document.addEventListener('DOMContentLoaded', function() {
            showSlides(slideIndex);
        });

        // Mobile Menu Toggle
        document.getElementById('mobile-menu').addEventListener('click', function() {
            document.getElementById('nav-menu').classList.toggle('show');
        });

        // Cart Functionality
        let cart = [];
        const cartCount = document.querySelector('.cart-count');
        const cartItemsContainer = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        // Add to Cart Buttons
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.dataset.id;
                const name = this.dataset.name;
                const price = parseInt(this.dataset.price);
                const image = this.dataset.image;
                
                addToCart(id, name, price, image);
                showAlert(`${name} added to cart!`);
            });
        });

        // Add to Cart Function
        function addToCart(id, name, price, image, quantity = 1) {
            const existingItem = cart.find(item => item.id === id);
            
            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({
                    id,
                    name,
                    price,
                    image,
                    quantity
                });
            }
            
            updateCart();
        }

        // Update Cart
        function updateCart() {
            cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
            
            // Update cart modal
            cartItemsContainer.innerHTML = '';
            let total = 0;
            
            if (cart.length === 0) {
                cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            } else {
                cart.forEach(item => {
                    const itemTotal = item.price * item.quantity;
                    total += itemTotal;
                    
                    const cartItem = document.createElement('div');
                    cartItem.className = 'cart-item';
                    cartItem.innerHTML = `
                        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                        <div class="cart-item-details">
                            <h3 class="cart-item-title">${item.name}</h3>
                            <p class="cart-item-price">₹${item.price} × ${item.quantity}</p>
                        </div>
                        <div class="cart-item-actions">
                            <div class="quantity-selector">
                                <button class="quantity-btn decrease-cart-quantity" data-id="${item.id}">-</button>
                                <input type="number" class="quantity-input" value="${item.quantity}" readonly>
                                <button class="quantity-btn increase-cart-quantity" data-id="${item.id}">+</button>
                            </div>
                            <span class="remove-item" data-id="${item.id}"><i class="fas fa-trash"></i></span>
                        </div>
                    `;
                    
                    cartItemsContainer.appendChild(cartItem);
                });
            }
            
            cartTotal.textContent = `₹${total}`;
            
            // Add event listeners to quantity buttons and remove buttons
            document.querySelectorAll('.decrease-cart-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    updateItemQuantity(this.dataset.id, -1);
                });
            });
            
            document.querySelectorAll('.increase-cart-quantity').forEach(button => {
                button.addEventListener('click', function() {
                    updateItemQuantity(this.dataset.id, 1);
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    removeItem(this.dataset.id);
                });
            });
        }

        // Update Item Quantity
        function updateItemQuantity(id, change) {
            const item = cart.find(item => item.id === id);
            
            if (item) {
                item.quantity += change;
                
                if (item.quantity <= 0) {
                    removeItem(id);
                } else {
                    updateCart();
                }
            }
        }

        // Remove Item from Cart
        function removeItem(id) {
            cart = cart.filter(item => item.id !== id);
            updateCart();
        }

        // Show Custom Alert
        function showAlert(message, isError = false) {
            const alert = document.getElementById('custom-alert');
            alert.textContent = message;
            alert.className = isError ? 'custom-alert error show' : 'custom-alert show';
            
            setTimeout(() => {
                alert.className = 'custom-alert';
            }, 3000);
        }

        // Cart Modal
        document.getElementById('cart-button').addEventListener('click', function() {
            document.getElementById('cart-modal').style.display = 'flex';
        });

        document.getElementById('close-cart-modal').addEventListener('click', function() {
            document.getElementById('cart-modal').style.display = 'none';
        });

        document.getElementById('continue-shopping').addEventListener('click', function() {
            document.getElementById('cart-modal').style.display = 'none';
        });

        // Checkout Button
        document.getElementById('checkout-btn').addEventListener('click', function() {
            if (cart.length === 0) {
                showAlert('Your cart is empty!', true);
                return;
            }
            
            document.getElementById('cart-modal').style.display = 'none';
            document.getElementById('payment-modal').style.display = 'flex';
        });

        // Payment Modal
        document.getElementById('close-payment-modal').addEventListener('click', function() {
            document.getElementById('payment-modal').style.display = 'none';
        });

        // document.querySelectorAll('.payment-option').forEach(option => {
        //     option.addEventListener('click', function() {
        //         document.querySelectorAll('.payment-option').forEach(opt => {
        //             opt.classList.remove('active');
        //         });
        //         this.classList.add('active');
        //         this.querySelector('input').checked = true;
        //     });
        // });

        document.querySelectorAll('.payment-option').forEach(option => {
            option.addEventListener('click', function () {
                document.querySelectorAll('.payment-option').forEach(opt => {
                    opt.classList.remove('active');
                });
                this.classList.add('active');
                this.querySelector('input').checked = true;

                // Show/hide UPI fields
                const upiMethods = document.getElementById('upi-methods');
                if (this.id === 'upi-option') {
                    upiMethods.style.display = 'block';
                } else {
                    upiMethods.style.display = 'none';
                }
            });
        });

        // document.getElementById('complete-payment').addEventListener('click', function() {
        //     document.getElementById('payment-modal').style.display = 'none';
        //     showAlert('Order placed successfully! Thank you for shopping with us.');
        //     cart = [];
        //     updateCart();
        // });

        document.getElementById('complete-payment').addEventListener('click', function () {
            const selectedPayment = document.querySelector('input[name="payment"]:checked');
            if (!selectedPayment) {
                showAlert('Please select a payment method.', true);
                return;
            }

            if (selectedPayment.id === 'upi') {
                const upiID = document.getElementById('upi-id').value.trim();
                const upiMethod = document.querySelector('input[name="upi-method"]:checked');

                if (!upiMethod) {
                    showAlert('Please select a UPI method (Google Pay, PhonePe, etc.)', true);
                    return;
                }

                if (!upiID || !upiID.includes('@')) {
                    showAlert('Please enter a valid UPI ID.', true);
                    return;
                }
            }

            // Success
            document.getElementById('payment-modal').style.display = 'none';
            showAlert('Order placed successfully! Thank you for shopping with us.');
            cart = [];
            updateCart();
        });


        // Carousel Functionality
        const carousel = document.getElementById('featured-carousel');
        const prevBtn = document.getElementById('prev-btn');
        const nextBtn = document.getElementById('next-btn');
        const itemWidth = 330; // Width of each carousel item including margin
        let position = 0;

        nextBtn.addEventListener('click', function() {
            position -= itemWidth;
            const maxPosition = -(carousel.children.length * itemWidth - document.querySelector('.carousel-container').offsetWidth);
            
            if (position < maxPosition) {
                position = 0;
            }
            
            carousel.style.transform = `translateX(${position}px)`;
        });

        prevBtn.addEventListener('click', function() {
            position += itemWidth;
            
            if (position > 0) {
                const maxPosition = -(carousel.children.length * itemWidth - document.querySelector('.carousel-container').offsetWidth);
                position = maxPosition < 0 ? maxPosition : 0;
            }
            
            carousel.style.transform = `translateX(${position}px)`;
        });

        // Product Modal
        const productModal = document.getElementById('product-modal');
        const modalProductImage = document.getElementById('modal-product-image');
        const modalProductTitle = document.getElementById('modal-product-title');
        const modalProductPrice = document.getElementById('modal-product-price');
        const modalProductDesc = document.getElementById('modal-product-description');
        const productQuantity = document.getElementById('product-quantity');
        let currentProduct = {};

        document.querySelectorAll('.carousel-item').forEach(item => {
            item.addEventListener('click', function(e) {
                if (!e.target.classList.contains('add-to-cart')) {
                    const button = this.querySelector('.add-to-cart');
                    currentProduct = {
                        id: button.dataset.id,
                        name: button.dataset.name,
                        price: parseInt(button.dataset.price),
                        image: button.dataset.image
                    };
                    
                    modalProductImage.src = currentProduct.image;
                    modalProductTitle.textContent = currentProduct.name;
                    modalProductPrice.textContent = `₹${currentProduct.price}`;
                    
                    // Generate description based on product name
                    const descriptions = {
                        'Lemongrass Lush': 'A refreshing blend of lemongrass and citrus notes that energizes your space and enhances focus. Perfect for workspaces and kitchens. Burns for approximately 40 hours.',
                        'Vanilla Latte': 'The comforting aroma of freshly brewed coffee with sweet vanilla undertones. Creates a cozy atmosphere perfect for reading nooks and living rooms. Burns for approximately 45 hours.',
                        'Vanilla Blush': 'A delicate blend of vanilla with soft floral undertones for a calming and relaxing environment. Ideal for bedrooms and bathrooms. Burns for approximately 40 hours.',
                        'Lavender Dream': 'Pure lavender essential oil creates a soothing and calming atmosphere that helps reduce stress and anxiety. Perfect for bedrooms and relaxation spaces. Burns for approximately 45 hours.',
                        'Sandalwood Mystic': 'Rich, earthy sandalwood with mystical undertones creates a grounding atmosphere perfect for meditation and yoga spaces. Burns for approximately 50 hours.'
                    };
                    
                    modalProductDesc.textContent = descriptions[currentProduct.name] || 'A premium handcrafted candle made with natural soy wax and essential oils for a clean, long-lasting burn.';
                    
                    productQuantity.value = 1;
                    productModal.style.display = 'flex';
                }
            });
        });

        document.getElementById('close-product-modal').addEventListener('click', function() {
            productModal.style.display = 'none';
        });

        document.getElementById('decrease-quantity').addEventListener('click', function() {
            if (productQuantity.value > 1) {
                productQuantity.value = parseInt(productQuantity.value) - 1;
            }
        });

        document.getElementById('increase-quantity').addEventListener('click', function() {
            if (productQuantity.value < 10) {
                productQuantity.value = parseInt(productQuantity.value) + 1;
            }
        });

        document.getElementById('add-to-cart-modal').addEventListener('click', function() {
            addToCart(
                currentProduct.id,
                currentProduct.name,
                currentProduct.price,
                currentProduct.image,
                parseInt(productQuantity.value)
            );
            
            productModal.style.display = 'none';
            showAlert(`${currentProduct.name} added to cart!`);
        });

        // Close modals when clicking outside
        window.addEventListener('click', function(e) {
            if (e.target === productModal) {
                productModal.style.display = 'none';
            } else if (e.target === document.getElementById('cart-modal')) {
                document.getElementById('cart-modal').style.display = 'none';
            } else if (e.target === document.getElementById('payment-modal')) {
                document.getElementById('payment-modal').style.display = 'none';
            } else if (e.target === document.getElementById('feedback-modal')) {
                document.getElementById('feedback-modal').style.display = 'none';
            }
        });

        // Feedback Modal
        document.getElementById('close-feedback-modal').addEventListener('click', function() {
            document.getElementById('feedback-modal').style.display = 'none';
        });

        document.getElementById('feedback-form').addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('feedback-modal').style.display = 'none';
            showAlert('Thank you for your feedback!');
        });
    