// Mobile menu functionality
const hamburger = document.getElementById('hamburger');
if (hamburger) {
    hamburger.addEventListener('click', function() {
        const mobileMenu = document.getElementById('mobileMenu');
        if (mobileMenu) {
            mobileMenu.classList.toggle('show');
        }
        this.classList.toggle('active');
    });
}

// Mobile language toggle
const languageMobileToggle = document.querySelector('.language-mobile-toggle');
if (languageMobileToggle) {
    languageMobileToggle.addEventListener('click', function(e) {
        e.preventDefault();
        const mobileLanguageSelect = document.getElementById('mobileLanguageSelect');
        if (mobileLanguageSelect) {
            mobileLanguageSelect.classList.toggle('show');
        }
    });
}

// Language dropdown functionality
const languageBtn = document.querySelector('.language-btn');
if (languageBtn) {
    languageBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const languageDropdown = document.getElementById('languageDropdown');
        if (languageDropdown) {
            languageDropdown.classList.toggle('show');
        }
    });
}

// Close dropdowns when clicking outside
document.addEventListener('click', function() {
    const languageDropdown = document.getElementById('languageDropdown');
    if (languageDropdown) {
        languageDropdown.classList.remove('show');
    }
    
    const shareOptions = document.getElementById('shareOptions');
    if (shareOptions) {
        shareOptions.classList.remove('show');
    }
});

// Prevent language dropdown from closing when clicking inside it
const languageDropdown = document.getElementById('languageDropdown');
if (languageDropdown) {
    languageDropdown.addEventListener('click', function(e) {
        e.stopPropagation();
    });
}

// Share button functionality
const shareBtn = document.getElementById('shareBtn');
if (shareBtn) {
    shareBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        const shareOptions = document.getElementById('shareOptions');
        if (shareOptions) {
            shareOptions.classList.toggle('show');
        }
    });
}

// Share functionality
const currentUrl = encodeURIComponent(window.location.href);
const gameTitleElement = document.querySelector('.game-title');
const title = gameTitleElement ? gameTitleElement.textContent : null;

const shareFacebook = document.querySelector('.share-facebook');
if (shareFacebook) {
    shareFacebook.setAttribute('href', `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`);
}

const shareTwitter = document.querySelector('.share-twitter');
if (shareTwitter) {
    shareTwitter.setAttribute('href', `https://twitter.com/intent/tweet?url=${currentUrl}&text=${title}`);
}

const shareReddit = document.querySelector('.share-reddit');
if (shareReddit) {
    shareReddit.setAttribute('href', `https://reddit.com/submit?url=${currentUrl}&title=${title}`);
}

// Copy link functionality
const copyLink = document.querySelector('.copy-link');
if (copyLink) {
    copyLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 使用现代API或回退方法
        if (navigator.clipboard && window.isSecureContext) {
            // 使用现代API
            navigator.clipboard.writeText(window.location.href).then(function() {
                alert('Link copied to clipboard!');
                const shareOptions = document.getElementById('shareOptions');
                if (shareOptions) {
                    shareOptions.classList.remove('show');
                }
            }).catch(function() {
                // 如果现代API失败，使用回退方法
                copyToClipboardFallback(window.location.href);
            });
        } else {
            // 使用回退方法
            copyToClipboardFallback(window.location.href);
        }
    });
}

// 回退的复制到剪贴板方法
function copyToClipboardFallback(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // 避免滚动到可视区域
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
        alert('Link copied to clipboard!');
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
        alert('Failed to copy link: ' + err);
    }
    
    document.body.removeChild(textArea);
    const shareOptions = document.getElementById('shareOptions');
    if (shareOptions) {
        shareOptions.classList.remove('show');
    }
}

// Fullscreen functionality
const fullscreenBtn = document.getElementById('fullscreenBtn');
if (fullscreenBtn) {
    fullscreenBtn.addEventListener('click', function() {
        const iframe = document.querySelector('.game-iframe');
        if (!iframe) return;
        
        if (iframe.requestFullscreen) {
            iframe.requestFullscreen();
        } else if (iframe.webkitRequestFullscreen) {
            iframe.webkitRequestFullscreen();
        } else if (iframe.msRequestFullscreen) {
            iframe.msRequestFullscreen();
        }
    });
}

// Star rating functionality
const stars = document.querySelectorAll('.star');
if (stars.length > 0) {
    const ratingInput = document.getElementById('rating');
    
    stars.forEach(star => {
        star.addEventListener('click', function() {
            const value = this.getAttribute('data-value');
            ratingInput.value = value;
            
            stars.forEach(s => {
                if (s.getAttribute('data-value') <= value) {
                    s.classList.add('active');
                } else {
                    s.classList.remove('active');
                }
            });
        });
    });
}

// Form submission
const commentForm = document.getElementById('commentForm');
if (commentForm) {
    commentForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitBtn');
        const gameIdElement = document.getElementById('game-content');
        const gameId = gameIdElement ? gameIdElement.dataset.gameId : null;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const rating = document.getElementById('rating').value;
        const content = document.getElementById('content').value;
        
        if (rating === '0') {
            showNotification('Please select a rating', 'error');
            return;
        }
        
        if (!gameId) {
            showNotification('Game ID is missing', 'error');
            return;
        }
        
        const formData = {
            game_id: gameId,
            name: name,
            email: email,
            rating: rating,
            title: "User Review",
            content: content
        };
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        
        try {
            const response = await fetch('/api/submit_review.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            // 修改响应处理逻辑
            const result = await response.json();
            
            // 检查响应中的success字段而不是response.ok
            if (result.success) {
                showNotification('Thank you for your review! It will be published after moderation.', 'success');
                this.reset();
                // 确保这些变量在作用域内
                const stars = document.querySelectorAll('.star');
                const ratingInput = document.getElementById('rating');
                stars.forEach(star => star.classList.remove('active'));
                ratingInput.value = '0';
            } else {
                showNotification(result.message || 'There was an error submitting your review. Please try again.', 'error');
            }
        } catch (error) {
            showNotification('There was a network error. Please check your connection and try again.', 'error');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Review';
        }
    });
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type}`;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 5000);
}