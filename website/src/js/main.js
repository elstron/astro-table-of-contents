const PACKAGE_NAME = 'astro-table-of-contents';

document.addEventListener('DOMContentLoaded', async () => {
    initializeTabs();
    initializeSmoothScroll();
    initializeCodeCopy();
    initializeInteractiveElements();
    await displayVersion();
    await displayLastMonthDownloads()
});


async function getCurrentVersion() {
    const response = await fetch(`https://registry.npmjs.org/${PACKAGE_NAME}`);
    const data = await response.json();
    return data['dist-tags'] ? data['dist-tags'].latest : 'unknown';
}


async function lastMonthDownloads() {
    const response = await fetch(`https://api.npmjs.org/downloads/point/last-month/${PACKAGE_NAME}`);
    const data = await response.json();
    return data.downloads || 0;
}

async function displayLastMonthDownloads() {
    const downloadsElement = document.querySelector("#downloads")
    const downloads = await lastMonthDownloads()
    
    downloadsElement.textContent = downloads

}   

async function displayVersion() {
    const currentVersion = await getCurrentVersion()
    const text = document.getElementById("current-version")
    text.textContent = `v${currentVersion}`
    console.log(text.textContent)
}


function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            const tabContainer = this.closest('.code-tabs');
            
            tabContainer.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
            tabContainer.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            this.classList.add('active');
            const targetPane = tabContainer.querySelector(`#${targetTab}`);
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });
}


function initializeSmoothScroll() {
    const anchors = document.querySelectorAll('a[href^="#"]');
    
    anchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}


function initializeCodeCopy() {
    const codeBlocks = document.querySelectorAll('pre code');
    
    codeBlocks.forEach(codeBlock => {
        const pre = codeBlock.parentElement;
        
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-btn';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        pre.style.position = 'relative';
        copyButton.style.position = 'absolute';
        copyButton.style.top = '0.5rem';
        copyButton.style.right = '0.5rem';
        copyButton.style.background = 'rgba(99, 102, 241, 0.8)';
        copyButton.style.color = 'white';
        copyButton.style.border = '1px solid rgba(99, 102, 241, 0.6)';
        copyButton.style.borderRadius = '4px';
        copyButton.style.padding = '0.25rem 0.5rem';
        copyButton.style.fontSize = '0.75rem';
        copyButton.style.cursor = 'pointer';
        copyButton.style.transition = 'all 0.3s';
        copyButton.style.backdropFilter = 'blur(10px)';
        
        copyButton.addEventListener('mouseenter', () => {
            copyButton.style.background = 'rgba(99, 102, 241, 1)';
            copyButton.style.transform = 'scale(1.05)';
        });
        
        copyButton.addEventListener('mouseleave', () => {
            copyButton.style.background = 'rgba(99, 102, 241, 0.8)';
            copyButton.style.transform = 'scale(1)';
        });
        
        copyButton.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(codeBlock.textContent);
                copyButton.textContent = 'Copied!';
                copyButton.style.background = '#10b981';
                
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                    copyButton.style.background = 'rgba(99, 102, 241, 0.8)';
                }, 2000);
            } catch (err) {
                console.warn('Failed to copy code to clipboard:', err);
                copyButton.textContent = 'Failed';
                
                setTimeout(() => {
                    copyButton.textContent = 'Copy';
                }, 2000);
            }
        });
        
        pre.appendChild(copyButton);
    });
}


function initializeInteractiveElements() {
    const externalLinks = document.querySelectorAll('a[target="_blank"]');
    
    externalLinks.forEach(link => {
        link.addEventListener('click', function() {
            const originalText = this.textContent;
            this.textContent = 'Opening...';
            
            setTimeout(() => {
                this.textContent = originalText;
            }, 1500);
        });
    });
    
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);
        
        const animatedElements = document.querySelectorAll('.feature-card, .next-card, .stat-item');
        animatedElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
            observer.observe(el);
        });
    }
}