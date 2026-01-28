// Swipe engine with touch, mouse, and keyboard support

const SwipeEngine = {
  // Configuration
  config: {
    threshold: 100,        // Minimum distance to trigger action
    rotationMultiplier: 0.1, // Card rotation during drag
    opacityMultiplier: 0.005, // Indicator opacity during drag
    velocityThreshold: 0.5,  // Minimum velocity to trigger swipe
    animationDuration: 300   // ms
  },

  // State
  currentCard: null,
  startX: 0,
  startY: 0,
  currentX: 0,
  isDragging: false,
  callbacks: {
    onSwipeLeft: null,
    onSwipeRight: null,
    onTap: null
  },

  // Initialize swipe handlers on a card element
  init(cardElement, callbacks) {
    this.currentCard = cardElement;
    this.callbacks = { ...this.callbacks, ...callbacks };

    // Touch events
    cardElement.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    cardElement.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    cardElement.addEventListener('touchend', this.handleTouchEnd.bind(this));

    // Mouse events
    cardElement.addEventListener('mousedown', this.handleMouseDown.bind(this));
    document.addEventListener('mousemove', this.handleMouseMove.bind(this));
    document.addEventListener('mouseup', this.handleMouseUp.bind(this));

    // Prevent context menu on long press
    cardElement.addEventListener('contextmenu', e => e.preventDefault());
  },

  // Remove all event listeners
  destroy() {
    if (this.currentCard) {
      this.currentCard.removeEventListener('touchstart', this.handleTouchStart);
      this.currentCard.removeEventListener('touchmove', this.handleTouchMove);
      this.currentCard.removeEventListener('touchend', this.handleTouchEnd);
      this.currentCard.removeEventListener('mousedown', this.handleMouseDown);
    }
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
  },

  // Touch handlers
  handleTouchStart(e) {
    if (e.touches.length !== 1) return;
    this.startDrag(e.touches[0].clientX, e.touches[0].clientY);
  },

  handleTouchMove(e) {
    if (!this.isDragging) return;
    e.preventDefault();
    this.updateDrag(e.touches[0].clientX, e.touches[0].clientY);
  },

  handleTouchEnd(e) {
    this.endDrag();
  },

  // Mouse handlers
  handleMouseDown(e) {
    e.preventDefault();
    this.startDrag(e.clientX, e.clientY);
  },

  handleMouseMove(e) {
    if (!this.isDragging) return;
    this.updateDrag(e.clientX, e.clientY);
  },

  handleMouseUp(e) {
    if (!this.isDragging) return;
    this.endDrag();
  },

  // Core drag logic
  startDrag(x, y) {
    this.isDragging = true;
    this.startX = x;
    this.startY = y;
    this.currentX = 0;
    this.startTime = Date.now();

    if (this.currentCard) {
      this.currentCard.classList.add('dragging');
      this.currentCard.style.transition = 'none';
    }
  },

  updateDrag(x, y) {
    if (!this.currentCard) return;

    this.currentX = x - this.startX;
    const rotation = this.currentX * this.config.rotationMultiplier;

    // Apply transform
    this.currentCard.style.transform = `translateX(${this.currentX}px) rotate(${rotation}deg)`;

    // Update indicators
    const likeIndicator = this.currentCard.querySelector('.card-indicator.like');
    const nopeIndicator = this.currentCard.querySelector('.card-indicator.nope');

    if (likeIndicator && nopeIndicator) {
      const opacity = Math.abs(this.currentX) * this.config.opacityMultiplier;

      if (this.currentX > 0) {
        likeIndicator.style.opacity = Math.min(opacity, 1);
        nopeIndicator.style.opacity = 0;
      } else {
        nopeIndicator.style.opacity = Math.min(opacity, 1);
        likeIndicator.style.opacity = 0;
      }
    }
  },

  endDrag() {
    if (!this.currentCard) return;

    this.isDragging = false;
    this.currentCard.classList.remove('dragging');

    // Calculate velocity
    const duration = Date.now() - this.startTime;
    const velocity = Math.abs(this.currentX) / duration;

    // Determine action based on distance or velocity
    const isSwipe = Math.abs(this.currentX) > this.config.threshold || velocity > this.config.velocityThreshold;
    const isTap = Math.abs(this.currentX) < 10 && duration < 200;

    if (isTap) {
      this.resetCard();
      if (this.callbacks.onTap) {
        this.callbacks.onTap();
      }
    } else if (isSwipe && this.currentX > 0) {
      this.animateOut('right');
    } else if (isSwipe && this.currentX < 0) {
      this.animateOut('left');
    } else {
      this.resetCard();
    }
  },

  // Animate card off screen
  animateOut(direction) {
    if (!this.currentCard) return;

    const card = this.currentCard;
    const multiplier = direction === 'right' ? 1 : -1;
    const targetX = window.innerWidth * multiplier;
    const targetRotation = 30 * multiplier;

    card.style.transition = `transform ${this.config.animationDuration}ms ease-out`;
    card.style.transform = `translateX(${targetX}px) rotate(${targetRotation}deg)`;

    // Trigger callback after animation
    setTimeout(() => {
      if (direction === 'right' && this.callbacks.onSwipeRight) {
        this.callbacks.onSwipeRight();
      } else if (direction === 'left' && this.callbacks.onSwipeLeft) {
        this.callbacks.onSwipeLeft();
      }
    }, this.config.animationDuration);
  },

  // Reset card to original position
  resetCard() {
    if (!this.currentCard) return;

    this.currentCard.style.transition = `transform ${this.config.animationDuration}ms cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
    this.currentCard.style.transform = 'translateX(0) rotate(0)';

    // Reset indicators
    const likeIndicator = this.currentCard.querySelector('.card-indicator.like');
    const nopeIndicator = this.currentCard.querySelector('.card-indicator.nope');

    if (likeIndicator) likeIndicator.style.opacity = 0;
    if (nopeIndicator) nopeIndicator.style.opacity = 0;
  },

  // Programmatic swipe (for button triggers)
  triggerSwipe(direction) {
    if (!this.currentCard) return;

    // Simulate drag start
    this.currentX = direction === 'right' ? this.config.threshold + 50 : -(this.config.threshold + 50);
    this.updateDrag(this.startX + this.currentX, this.startY);

    // Animate out
    setTimeout(() => {
      this.animateOut(direction);
    }, 100);
  }
};

// Keyboard navigation handler
const KeyboardNav = {
  isEnabled: false,
  callbacks: {},

  init(callbacks) {
    this.callbacks = callbacks;
    this.handleKeyDown = this.handleKeyDown.bind(this);
  },

  enable() {
    if (this.isEnabled) return;
    this.isEnabled = true;
    document.addEventListener('keydown', this.handleKeyDown);
  },

  disable() {
    this.isEnabled = false;
    document.removeEventListener('keydown', this.handleKeyDown);
  },

  handleKeyDown(e) {
    // Ignore if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        if (this.callbacks.onLeft) this.callbacks.onLeft();
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (this.callbacks.onRight) this.callbacks.onRight();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.callbacks.onSelect) this.callbacks.onSelect();
        break;
      case 'Escape':
        e.preventDefault();
        if (this.callbacks.onEscape) this.callbacks.onEscape();
        break;
    }
  }
};

// Export for use in other modules
window.SwipeEngine = SwipeEngine;
window.KeyboardNav = KeyboardNav;
