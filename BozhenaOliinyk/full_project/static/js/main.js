document.addEventListener('DOMContentLoaded', () => {
    // Application Global State (Simulated Backend Session)
    let state = {
        isLoggedIn: false,
        authMode: 'login', // 'login' or 'signup'
        favorites: new Set() // stores bird IDs as integers or strings
    };

    // DOM Element Declarations
    const signInBtn = document.getElementById('signInBtn');
    const authContainer = document.getElementById('authContainer');
    const headerFavBtn = document.getElementById('headerFavBtn');

    // 1. ВИПРАВЛЕНО: Прибрано подвійне constconst
    const signupUsernameGroup = document.getElementById('signupUsernameGroup');
    const authUsernameInput = document.getElementById('authUsernameInput');

    const blurOverlay = document.getElementById('blurOverlay');
    const authPopup = document.getElementById('authPopup');
    const closeAuthBtn = document.getElementById('closeAuthBtn');

    const authForm = document.getElementById('authForm');
    const popupTitle = document.getElementById('popupTitle');
    const authSubmitBtn = document.getElementById('authSubmitBtn');
    const toggleAuthMode = document.getElementById('toggleAuthMode');
    const togglePrefixText = document.getElementById('togglePrefixText');

    const favoritesSidebar = document.getElementById('favoritesSidebar');
    const closeFavBtn = document.getElementById('closeFavBtn');
    const favSidebarContent = document.getElementById('favSidebarContent');

    const authToast = document.getElementById('authToast');
    const birdCards = document.querySelectorAll('.bird-card');

    // --- POPUP & OVERLAY INTERACTION WORKFLOW ---
    function openAuthPopup() {
        closeFavorites();
        blurOverlay.classList.add('active');
        authPopup.classList.add('active');
    }

    function closeAuthPopup() {
        blurOverlay.classList.remove('active');
        authPopup.classList.remove('active');
        authForm.reset();
    }

    function openFavorites() {
        closeAuthPopup();
        blurOverlay.classList.add('active');
        favoritesSidebar.classList.add('active');
        renderFavorites();
    }

    function closeFavorites() {
        blurOverlay.classList.remove('active');
        favoritesSidebar.classList.remove('active');
    }

    // Toggle between Sign In / Sign Up modes
    if (toggleAuthMode) {
        toggleAuthMode.addEventListener('click', () => {
            if (state.authMode === 'login') {
                state.authMode = 'signup';
                popupTitle.textContent = 'Sign Up';
                authSubmitBtn.textContent = 'Sign Up';
                toggleAuthMode.textContent = 'Sign In';
                signupUsernameGroup.style.display = "block";
                authUsernameInput.setAttribute('required', 'required');
                togglePrefixText.textContent = 'Already have an account? ';
            } else {
                state.authMode = 'login';
                popupTitle.textContent = 'Sign In';
                authSubmitBtn.textContent = 'Sign In';
                toggleAuthMode.textContent = 'Sign Up';
                signupUsernameGroup.style.display = "none";
                authUsernameInput.removeAttribute('required');
                togglePrefixText.textContent = "Don't have an account? ";
            }
        });
    }

    // Event Bindings for Close triggers
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuthPopup);
    if (closeFavBtn) closeFavBtn.addEventListener('click', closeFavorites);
    if (blurOverlay) {
        blurOverlay.addEventListener('click', () => {
            closeAuthPopup();
            closeFavorites();
        });
    }

    // --- TOAST NOTIFICATION ---
    function triggerToast(message) {
        if (!authToast) return;
        authToast.textContent = message;
        authToast.classList.add('show');
        setTimeout(() => {
            authToast.classList.remove('show');
        }, 3000);
    }

    // --- AUTHENTICATION FLOW SIMULATION ---
    // Handle Sign In trigger button from header
    if (signInBtn) {
        signInBtn.addEventListener('click', openAuthPopup);
    }

    // Dynamic Header View Switcher
    function updateHeaderAuthDOM() {
        if (!authContainer) return;

        if (state.isLoggedIn) {
            // Тепер при кліку на аватарку автоматично перекидає в профіль
            authContainer.innerHTML = `<button class="profile-avatar-btn" id="profileMenuBtn" title="My Profile" onclick="window.location.href='/profile'">BW</button>`;
        } else {
            authContainer.innerHTML = `<button class="sign-in-text" id="signInBtn">Sign In</button>`;
            document.getElementById('signInBtn').addEventListener('click', openAuthPopup);
        }
    }

    // Handle Auth form action
    if (authForm) {
        authForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // 2. ВИПРАВЛЕНО: Отримання значень за новими правильними ID інпутів
            const emailVal = document.getElementById('authEmailInput').value.trim();
            const passVal = document.getElementById('authPasswordInput').value.trim();

            if (emailVal && passVal) {
                state.isLoggedIn = true;
                updateHeaderAuthDOM();
                closeAuthPopup();
                triggerToast(state.authMode === 'login' ? 'Successfully logged in! Redirecting...' : 'Account registered successfully! Redirecting...');

                // Перенаправлення на сторінку профілю після успішного входу
                setTimeout(() => {
                    window.location.href = '/profile';
                }, 1000);
            }
        });
    }

    // --- FAVORITES MANAGEMENT LOGIC ---
    if (headerFavBtn) {
        headerFavBtn.addEventListener('click', openFavorites);
    }

    // Catalog item card heart click action
    birdCards.forEach(card => {
        const heartBtn = card.querySelector('.bottom-heart-btn') || card.querySelector('.card-heart-btn');
        const birdId = card.getAttribute('data-id');

        if (heartBtn) {
            heartBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Stop card bubbling triggers

                if (!state.isLoggedIn) {
                    triggerToast("You need to sign in first");
                    openAuthPopup();
                    return;
                }

                if (state.favorites.has(birdId)) {
                    state.favorites.delete(birdId);
                    heartBtn.classList.remove('liked');
                } else {
                    state.favorites.add(birdId);
                    heartBtn.classList.add('liked');
                }
            });
        }
    });

    // Render Favorites list into Sidebar Drawer
    function renderFavorites() {
        if (!favSidebarContent) return;
        favSidebarContent.innerHTML = '';

        if (!state.isLoggedIn) {
            favSidebarContent.innerHTML = `<p class="fav-status-message">You need to sign in first to view your custom favorites list.</p>`;
            return;
        }

        if (state.favorites.size === 0) {
            favSidebarContent.innerHTML = `<p class="fav-status-message">Your list is empty.<br>Start adding birds from the main catalog!</p>`;
            return;
        }

        state.favorites.forEach(id => {
            const sourceCard = document.querySelector(`.bird-card[data-id="${id}"]`);
            if (sourceCard) {
                const name = sourceCard.getAttribute('data-name') || sourceCard.querySelector('.bird-species').textContent;
                const img = sourceCard.getAttribute('data-image') || sourceCard.querySelector('.bird-image').src;

                const favRow = document.createElement('div');
                favRow.className = 'fav-item';
                favRow.innerHTML = `
                    <div class="fav-item-left">
                        <img src="${img}" alt="${name}" class="fav-item-img">
                        <span class="fav-item-name">${name}</span>
                    </div>
                    <button class="fav-item-heart-btn" aria-label="Remove from favorites">
                        <svg class="heart-icon" viewBox="0 0 24 24">
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                    </button>
                `;

                favRow.querySelector('.fav-item-heart-btn').addEventListener('click', () => {
                    state.favorites.delete(id);
                    const heartBtn = sourceCard.querySelector('.bottom-heart-btn') || sourceCard.querySelector('.card-heart-btn');
                    if (heartBtn) heartBtn.classList.remove('liked');
                    renderFavorites();
                });

                favSidebarContent.appendChild(favRow);
            }
        });
    }
});