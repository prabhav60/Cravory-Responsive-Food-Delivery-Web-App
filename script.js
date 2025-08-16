// Carousel functionality
const leftBtn = document.querySelector('.carousel-btn.left');
const rightBtn = document.querySelector('.carousel-btn.right');
const carouselTrack = document.querySelector('.carousel-track');

if (leftBtn && rightBtn && carouselTrack) {
    leftBtn.addEventListener('click', () => {
        carouselTrack.scrollBy({ left: -300, behavior: 'smooth' });
    });
    rightBtn.addEventListener('click', () => {
        carouselTrack.scrollBy({ left: 300, behavior: 'smooth' });
    });
}

// Cart functionality
let cartItems = [];
let cartCount = 0;

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart');
const cartIcon = document.querySelector('.cart-icon');

addToCartButtons.forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Get the food card that contains this button
        const foodCard = button.closest('.food-card');
        const foodName = foodCard.querySelector('h3').textContent;
        const foodPrice = foodCard.querySelector('.price').textContent;
        const foodImage = foodCard.querySelector('img').src;
        
        // Add item to cart
        addToCart(foodName, foodPrice, foodImage);
        
        // Show success message
        showCartNotification(foodName);
    });
});

function addToCart(name, price, image) {
    // Check if item already exists in cart
    const existingItem = cartItems.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    cartCount += 1;
    updateCartDisplay();
}

function updateCartDisplay() {
    // Update cart icon with count
    if (cartIcon) {
        // Remove existing count badge if any
        const existingBadge = cartIcon.querySelector('.cart-badge');
        if (existingBadge) {
            existingBadge.remove();
        }
        
        // Add new count badge
        if (cartCount > 0) {
            const badge = document.createElement('span');
            badge.className = 'cart-badge';
            badge.textContent = cartCount;
            cartIcon.appendChild(badge);
        }
    }
}

function showCartNotification(foodName) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <span>✓ ${foodName} added to cart!</span>
        </div>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Cart icon click handler
if (cartIcon) {
    cartIcon.addEventListener('click', () => {
        if (cartItems.length > 0) {
            showCartModal();
        } else {
            alert('Your cart is empty!');
        }
    });
}

function showCartModal() {
    // Create cart modal
    const cartModal = document.createElement('div');
    cartModal.className = 'modal-overlay active';
    cartModal.id = 'cartModal';
    
    let cartHTML = `
        <div class="modal">
            <div class="modal-header">
                <h3>Your Cart (${cartCount} items)</h3>
                <button class="modal-close" onclick="closeCartModal()">&times;</button>
            </div>
            <div class="modal-body">
                <div class="cart-items">
    `;
    
    let totalPrice = 0;
    
    cartItems.forEach(item => {
        const price = parseInt(item.price.replace('₹', ''));
        const itemTotal = price * item.quantity;
        totalPrice += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price} × ${item.quantity}</p>
                </div>
                <div class="cart-item-actions">
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity('${item.name}', 1)">+</button>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
                </div>
                <div class="cart-total">
                    <h4>Total: ₹${totalPrice}</h4>
                </div>
                <div class="modal-actions">
                    <button class="btn-cancel" onclick="closeCartModal()">Continue Shopping</button>
                    <button class="btn-submit" onclick="checkout()">Checkout</button>
                </div>
            </div>
        </div>
    `;
    
    cartModal.innerHTML = cartHTML;
    document.body.appendChild(cartModal);
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const cartModal = document.querySelector('#cartModal');
    if (cartModal) {
        cartModal.remove();
        document.body.style.overflow = '';
    }
}

function updateQuantity(itemName, change) {
    const item = cartItems.find(item => item.name === itemName);
    if (item) {
        item.quantity += change;
        cartCount += change;
        
        if (item.quantity <= 0) {
            // Remove item from cart
            const index = cartItems.indexOf(item);
            cartItems.splice(index, 1);
        }
        
        updateCartDisplay();
        
        // Refresh cart modal
        closeCartModal();
        if (cartItems.length > 0) {
            showCartModal();
        }
    }
}

function checkout() {
    alert('Thank you for your order! Your food will be delivered soon.');
    cartItems = [];
    cartCount = 0;
    updateCartDisplay();
    closeCartModal();
}

// Video functionality
const playBtn = document.querySelector('#playBtn');
const foodVideo = document.querySelector('#foodVideo');

if (playBtn && foodVideo) {
    playBtn.addEventListener('click', toggleVideo);
    foodVideo.addEventListener('click', toggleVideo);
    
    // Show play button when video ends
    foodVideo.addEventListener('ended', () => {
        playBtn.classList.remove('hidden');
    });
    
    // Show play button when video is paused
    foodVideo.addEventListener('pause', () => {
        playBtn.classList.remove('hidden');
    });
    
    // Hide play button when video is playing
    foodVideo.addEventListener('play', () => {
        playBtn.classList.add('hidden');
    });
}

function toggleVideo() {
    if (foodVideo.paused) {
        foodVideo.play();
        playBtn.classList.add('hidden');
    } else {
        foodVideo.pause();
        playBtn.classList.remove('hidden');
    }
}

// Modal functionality
const requestDishBtn = document.querySelector('.request-dish');
const modal = document.querySelector('#requestModal');
const modalClose = document.querySelector('.modal-close');
const modalCancel = document.querySelector('.btn-cancel');
const requestForm = document.querySelector('#requestForm');

// Open modal
if (requestDishBtn && modal) {
    requestDishBtn.addEventListener('click', () => {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent body scroll
    });
}

// Close modal functions
function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Restore body scroll
    requestForm.reset(); // Reset form
}

// Close modal on close button
if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

// Close modal on cancel button
if (modalCancel) {
    modalCancel.addEventListener('click', closeModal);
}

// Close modal on overlay click
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// Close modal on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
    }
});

// Handle form submission
if (requestForm) {
    requestForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const dishName = requestForm.querySelector('#dishName').value;
        const dishDescription = requestForm.querySelector('#dishDescription').value;
        const contactEmail = requestForm.querySelector('#contactEmail').value;
        
        if (dishName && contactEmail) {
            alert(`Thank you! We've received your request for "${dishName}". We'll get back to you soon at ${contactEmail}!`);
            closeModal();
        } else {
            alert('Please fill in all required fields.');
        }
    });
}

// Search functionality
const searchInput = document.querySelector('.search-bar input');
const searchBtn = document.querySelector('.search-bar button');
const foodCards = document.querySelectorAll('.food-card');

if (searchInput && searchBtn) {
    searchBtn.addEventListener('click', performSearch);
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}

function performSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        // Show all cards if search is empty
        foodCards.forEach(card => {
            card.style.display = 'block';
        });
        return;
    }
    
    foodCards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        if (title.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Contact form functionality
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = contactForm.querySelector('input[type="text"]').value;
        const email = contactForm.querySelector('input[type="email"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        if (name && email && message) {
            alert('Thank you for your message! We\'ll get back to you soon.');
            contactForm.reset();
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Add smooth scrolling for navigation links
const navLinks = document.querySelectorAll('nav a, footer nav a');
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add hover effects for food cards
foodCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-5px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
}); 