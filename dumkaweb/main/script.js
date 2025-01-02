document.addEventListener('DOMContentLoaded', function() {
    // Handle intro
    const urlParams = new URLSearchParams(window.location.search);
    const noIntro = urlParams.get('nointro');
    const intro = document.querySelector('.intro');
    
    if (noIntro === 'true' && intro) {
        intro.style.display = 'none';
    }

    // Theme toggle functionality
    const themeToggle = document.querySelector('.theme-toggle');
    const body = document.body;

    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    body.classList.add(`${savedTheme}-theme`);

    // Theme toggle click handler
    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('dark-theme')) {
            body.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('theme', 'light');
        } else {
            body.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // DateTime functionality
    function updateDateTime() {
        const options = { 
            weekday: 'long', 
            month: 'short', 
            day: '2-digit', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            hour12: true 
        };
        
        const currentDate = new Date();
        const dateTimeString = currentDate.toLocaleString('en-US', options);
        
        const datetimeElement = document.getElementById('datetime');
        if (datetimeElement) {
            datetimeElement.textContent = dateTimeString;
        }
    }

    // Update time immediately and every second
    updateDateTime();
    setInterval(updateDateTime, 1000);

    // Category filtering
    const categoryButtons = document.querySelectorAll('.category-btn');
    const blogPosts = document.querySelectorAll('.blog-post');

    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            categoryButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            const category = button.dataset.category;

            blogPosts.forEach(post => {
                if (category === 'all' || post.dataset.category === category) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    });
});