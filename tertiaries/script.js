// Function to open a modal
function openModal(modalId) {
    document.getElementById(modalId).style.display = "block";
}

// Function to close a modal
function closeModal(modalId) {
    document.getElementById(modalId).style.display = "none";
}

// Adding event listeners to "Get Form" buttons
document.querySelectorAll('button').forEach((button, index) => {
    if (button.textContent === 'Get Form') {
        button.addEventListener('click', () => {
            // Get the corresponding row data
            const row = button.closest('tr');
            const name = row.querySelector('td').textContent.trim();
            const logoSrc = row.querySelector('img').src;
            const description = "Short description for " + name; // Placeholder description
            
            // Populate the modal with data
            document.getElementById('institutionName').textContent = name;
            document.getElementById('institutionLogo').src = logoSrc;
            document.getElementById('institutionDescription').textContent = description;
            
            // Open the institution details modal
            openModal('institutionModal');
        });
    }
});