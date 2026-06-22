document.addEventListener('DOMContentLoaded', () => {
    const blurOverlay = document.getElementById('profileBlurOverlay');
    const birdPopup = document.getElementById('birdPopup');
    const birdForm = document.getElementById('birdForm');
    const popupTitle = document.getElementById('birdPopupTitle');

    const popupPreviewImg = document.getElementById('popupBirdPreview');
    const fileInput = document.getElementById('birdImageFileInput');
    const nameInput = document.getElementById('birdNameInput');
    const locationInput = document.getElementById('birdLocationInput');

    const addBirdCard = document.getElementById('addBirdCard');
    const editButtons = document.querySelectorAll('.card-edit-btn');
    const closePopupBtn = document.getElementById('closeBirdPopupBtn');

    // Дефолтна заглушка, якщо фото ще не завантажили
    const defaultPlaceholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%2394A3B8'%3E%3Cpath d='M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z'/%3E%3C/svg%3E";

    function openPopup() {
        blurOverlay.classList.add('active');
        birdPopup.classList.add('active');
    }

    function closePopup() {
        blurOverlay.classList.remove('active');
        birdPopup.classList.remove('active');
        birdForm.reset();
    }

    // РЕДАКЦІЯ: Натискання на олівчик картки
    editButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = btn.closest('.bird-card');

            // Зчитуємо поточні дані з дата-атрибутів картки
            const name = card.getAttribute('data-name');
            const loc = card.getAttribute('data-location');
            const img = card.getAttribute('data-image');

            popupTitle.textContent = "Edit Bird";
            nameInput.value = name;
            locationInput.value = loc;
            popupPreviewImg.src = img;

            openPopup();
        });
    });

    // СТВОРЕННЯ: Натискання на картку "+"
    if (addBirdCard) {
        addBirdCard.addEventListener('click', () => {
            popupTitle.textContent = "Add New Bird";
            popupPreviewImg.src = defaultPlaceholder;
            nameInput.value = '';
            locationInput.value = '';

            openPopup();
        });
    }

    // Обробка завантаження локального фото з пристрою
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                popupPreviewImg.src = event.target.result; // міняємо прев'ю на завантажене фото
            };
            reader.readAsDataURL(file);
        }
    });

    // Закриття попапу
    closePopupBtn.addEventListener('click', closePopup);
    blurOverlay.addEventListener('click', closePopup);

    // Натискання на кнопку Save
    birdForm.addEventListener('submit', (e) => {
        e.preventDefault();
        // Тут пізніше буде AJAX/Fetch запис у базу даних Flask
        closePopup();
    });
});