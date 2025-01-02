const urlParams = new URLSearchParams(window.location.search);
const noIntro = urlParams.get('nointro');
if (noIntro === 'true') {
    document.documentElement.style.setProperty('--animation-duration', '0s');
    const intro = document.querySelector('.intro');
    if (intro) {
        intro.classList.add('no-animation');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Handle intro
    const urlParams = new URLSearchParams(window.location.search);
    const noIntro = urlParams.get('nointro');
    const intro = document.querySelector('.intro');
    
    if (noIntro === 'true' && intro) {
        intro.style.display = 'none';
        intro.style.visibility = 'hidden';
        intro.style.opacity = '0';
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

    async function loadBlogPosts() {
        const blogPosts = document.getElementById('blogPosts');
        if (!blogPosts) return;

        const posts = [
            {
                file: 'first-post.md',
                date: 'March 2024'
            }
        ];

        for (const post of posts) {
            try {
                const response = await fetch(`./posts/${post.file}`);
                const content = await response.text();
                
                // Get first line as title
                const title = content.split('\n')[0].replace('#', '').trim();
                // Get second line as preview
                const preview = content.split('\n')[1].trim();

                const postElement = document.createElement('div');
                postElement.className = 'blog-post';
                postElement.innerHTML = `
                    <div class="post-date">${post.date}</div>
                    <h2 class="post-title">${title}</h2>
                    <p class="post-preview">${preview}</p>
                `;
                
                // Make post clickable
                postElement.style.cursor = 'pointer';
                postElement.onclick = () => {
                    // Store the post content in localStorage
                    localStorage.setItem('currentPost', content);
                    localStorage.setItem('postDate', post.date);
                    // Navigate to the post page
                    window.location.href = './post.html';
                };
                
                blogPosts.appendChild(postElement);
            } catch (error) {
                console.error(`Error loading ${post.file}:`, error);
            }
        }
    }

    // Function to load individual post content
    async function loadPostContent() {
        const postContent = document.getElementById('blogPostContent');
        if (!postContent) return;

        const content = localStorage.getItem('currentPost');
        const date = localStorage.getItem('postDate');

        if (content && date) {
            const lines = content.split('\n');
            const title = lines[0].replace('#', '').trim();
            
            postContent.innerHTML = `
                <h1>${title}</h1>
                <div class="post-date">${date}</div>
                <div class="post-content">
                    ${lines.slice(1).join('<br>')}
                </div>
            `;
        }
    }

    // Call loadBlogPosts here, inside the main DOMContentLoaded handler
    loadBlogPosts();
    loadPostContent();
});