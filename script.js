// Sample data for carousel items
const carouselData = [
    {
        id: 1,
        title: 'Amazing Product 1',
        description: 'Great quality and fast delivery',
        emoji: '🎁',
        badge: 'Featured'
    },
    {
        id: 2,
        title: 'Exclusive Deal 2',
        description: 'Limited time offer available now',
        emoji: '⚡',
        badge: 'Hot'
    },
    {
        id: 3,
        title: 'Premium Service 3',
        description: 'Best in class customer support',
        emoji: '👑',
        badge: 'Premium'
    },
    {
        id: 4,
        title: 'Best Value 4',
        description: 'Unbeatable prices and quality',
        emoji: '💎',
        badge: 'Best'
    },
    {
        id: 5,
        title: 'New Release 5',
        description: 'Just launched this week',
        emoji: '🆕',
        badge: 'New'
    },
    {
        id: 6,
        title: 'Top Rated 6',
        description: '5 stars from thousands of users',
        emoji: '⭐',
        badge: 'Top'
    }
];

class Carousel {
    constructor() {
        this.currentScroll = 0;
        this.isDragging = false;
        this.dragStartX = 0;
        this.dragStartScroll = 0;
        this.maxScroll = 0;
        this.bounceFriction = 0.85;
        
        this.init();
        this.setupEventListeners();
    }

    init() {
        this.renderItems();
        this.calculateMaxScroll();
    }

    calculateMaxScroll() {
        const track = document.querySelector('.carousel-track');
        const items = document.querySelector('.carousel-items');
        
        if (track && items) {
            const trackWidth = track.offsetWidth;
            const itemsWidth = items.scrollWidth;
            this.maxScroll = Math.max(0, itemsWidth - trackWidth);
        }
    }

    renderItems() {
        const container = document.querySelector('.carousel-items');
        container.innerHTML = carouselData.map(item => `
            <div class="carousel-item" data-id="${item.id}">
                <div class="item-card">
                    <div class="item-image">${item.emoji}</div>
                    <div class="item-content">
                        <h3 class="item-title">${item.title}</h3>
                        <p class="item-description">${item.description}</p>
                        <span class="item-badge">${item.badge}</span>
                    </div>
                </div>
            </div>
        `).join('');

        this.attachItemListeners();
    }

    attachItemListeners() {
        document.querySelectorAll('.carousel-item').forEach(item => {
            item.addEventListener('click', () => {
                if (!this.isDragging) {
                    const itemId = item.dataset.id;
                    this.handleItemClick(itemId);
                }
            });
        });
    }

    handleItemClick(itemId) {
        const item = carouselData.find(i => i.id === parseInt(itemId));
        console.log('Clicked item:', item);
        window.dispatchEvent(new CustomEvent('carouselItemClick', { detail: item }));
    }

    setupEventListeners() {
        document.querySelector('.carousel-close').addEventListener('click', () => this.close());

        const track = document.querySelector('.carousel-track');
        const items = document.querySelector('.carousel-items');

        // Touch support
        track.addEventListener('touchstart', (e) => {
            this.isDragging = true;
            this.dragStartX = e.touches[0].clientX;
            this.dragStartScroll = this.currentScroll;
            track.style.cursor = 'grabbing';
        });

        track.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();
            const diff = this.dragStartX - e.touches[0].clientX;
            this.updateScroll(this.dragStartScroll + diff);
        });

        track.addEventListener('touchend', (e) => {
            this.isDragging = false;
            track.style.cursor = 'grab';
            this.bounceBack();
        });

        // Mouse support
        track.addEventListener('mousedown', (e) => {
            this.isDragging = true;
            this.dragStartX = e.clientX;
            this.dragStartScroll = this.currentScroll;
            track.style.cursor = 'grabbing';
        });

        track.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            const diff = this.dragStartX - e.clientX;
            this.updateScroll(this.dragStartScroll + diff);
        });

        track.addEventListener('mouseup', (e) => {
            this.isDragging = false;
            track.style.cursor = 'grab';
            this.bounceBack();
        });

        track.addEventListener('mouseleave', () => {
            if (this.isDragging) {
                this.isDragging = false;
                track.style.cursor = 'grab';
                this.bounceBack();
            }
        });

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.scroll(-100);
            if (e.key === 'ArrowRight') this.scroll(100);
        });

        // Trackpad/wheel scrolling
        track.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.currentScroll += e.deltaX || e.deltaY;
            this.updateScroll(this.currentScroll);
        }, { passive: false });
    }

    updateScroll(scrollValue) {
        // Clamp scroll value to prevent scrolling beyond boundaries during drag
        this.currentScroll = Math.max(0, Math.min(scrollValue, this.maxScroll));
        const items = document.querySelector('.carousel-items');
        items.style.transform = `translateX(${-this.currentScroll}px)`;
    }

    scroll(distance) {
        const items = document.querySelector('.carousel-items');
        items.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
        this.currentScroll += distance;
        items.style.transform = `translateX(${-this.currentScroll}px)`;
        
        setTimeout(() => {
            items.style.transition = 'none';
        }, 400);
    }

    close() {
        const container = document.querySelector('.carousel-container');
        container.style.display = 'none';
        window.dispatchEvent(new CustomEvent('carouselClosed'));
    }
}

// Initialize carousel when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
});
