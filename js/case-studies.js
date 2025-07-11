// Case Studies Interactive Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Modal functionality for case study details
    const modal = document.getElementById('caseStudyModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');
    
    // Add click handlers to case study cards
    const caseStudyCards = document.querySelectorAll('.success-story-card');
    caseStudyCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('h3').textContent;
            const type = this.querySelector('.story-type').textContent;
            const content = this.querySelector('.story-card-content p').textContent;
            
            // Populate modal with case study details
            modalContent.innerHTML = `
                <div class="modal-header">
                    <h2>${title}</h2>
                    <p class="modal-subtitle">${type}</p>
                </div>
                <div class="modal-body">
                    <p>${content}</p>
                    <div class="modal-metrics">
                        ${this.querySelector('.story-metrics').outerHTML}
                    </div>
                </div>
                <div class="modal-footer">
                    <a href="../contact/" class="btn">Get Similar Results</a>
                </div>
            `;
            
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close modal functionality
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // Smooth scrolling for anchor links
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 