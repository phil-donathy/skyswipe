// Card rendering and state management

const Cards = {
  // State
  currentLevel: 'cities', // 'cities' | 'neighbourhoods' | 'properties'
  currentQueue: [],
  currentIndex: 0,
  stackElement: null,

  // Callbacks
  onCardAction: null,
  onQueueEmpty: null,
  onTap: null,

  // Initialize cards system
  init(stackElement, callbacks = {}) {
    this.stackElement = stackElement;
    this.onCardAction = callbacks.onCardAction;
    this.onQueueEmpty = callbacks.onQueueEmpty;
    this.onTap = callbacks.onTap;
  },

  // Start with cities
  startWithCities() {
    this.currentLevel = 'cities';
    this.currentQueue = this.getUnswipedCities();
    this.currentIndex = 0;
    this.renderStack();
  },

  // Get unswiped cities
  getUnswipedCities() {
    return Data.cities.filter(city => !Storage.hasSwipedItem('cities', city.id));
  },

  // Get unlocked unswiped neighbourhoods
  getUnswipedNeighbourhoods() {
    const unlocked = Storage.getUnlocked().neighbourhoods;
    return Data.neighbourhoods.filter(n =>
      unlocked.includes(n.id) && !Storage.hasSwipedItem('neighbourhoods', n.id)
    );
  },

  // Get unlocked unswiped properties
  getUnswipedProperties() {
    const unlocked = Storage.getUnlocked().properties;
    return Data.properties.filter(p =>
      unlocked.includes(p.id) && !Storage.hasSwipedItem('properties', p.id)
    );
  },

  // Load next level or check for more cards
  loadNextCards() {
    // Check for more at current level
    if (this.currentLevel === 'cities') {
      const remainingCities = this.getUnswipedCities();
      if (remainingCities.length > 0) {
        this.currentQueue = remainingCities;
        this.currentIndex = 0;
        this.renderStack();
        return;
      }

      // Move to neighbourhoods
      const neighbourhoods = this.getUnswipedNeighbourhoods();
      if (neighbourhoods.length > 0) {
        this.currentLevel = 'neighbourhoods';
        this.currentQueue = neighbourhoods;
        this.currentIndex = 0;
        this.renderStack();
        return;
      }
    }

    if (this.currentLevel === 'cities' || this.currentLevel === 'neighbourhoods') {
      const neighbourhoods = this.getUnswipedNeighbourhoods();
      if (neighbourhoods.length > 0) {
        this.currentLevel = 'neighbourhoods';
        this.currentQueue = neighbourhoods;
        this.currentIndex = 0;
        this.renderStack();
        return;
      }

      // Move to properties
      const properties = this.getUnswipedProperties();
      if (properties.length > 0) {
        this.currentLevel = 'properties';
        this.currentQueue = properties;
        this.currentIndex = 0;
        this.renderStack();
        return;
      }
    }

    if (this.currentLevel === 'properties') {
      const properties = this.getUnswipedProperties();
      if (properties.length > 0) {
        this.currentQueue = properties;
        this.currentIndex = 0;
        this.renderStack();
        return;
      }
    }

    // Check all levels for remaining cards
    const remainingCities = this.getUnswipedCities();
    if (remainingCities.length > 0) {
      this.currentLevel = 'cities';
      this.currentQueue = remainingCities;
      this.currentIndex = 0;
      this.renderStack();
      return;
    }

    const remainingNeighbourhoods = this.getUnswipedNeighbourhoods();
    if (remainingNeighbourhoods.length > 0) {
      this.currentLevel = 'neighbourhoods';
      this.currentQueue = remainingNeighbourhoods;
      this.currentIndex = 0;
      this.renderStack();
      return;
    }

    const remainingProperties = this.getUnswipedProperties();
    if (remainingProperties.length > 0) {
      this.currentLevel = 'properties';
      this.currentQueue = remainingProperties;
      this.currentIndex = 0;
      this.renderStack();
      return;
    }

    // All done
    if (this.onQueueEmpty) {
      this.onQueueEmpty();
    }
  },

  // Render card stack
  renderStack() {
    if (!this.stackElement) return;

    this.stackElement.innerHTML = '';

    // Render up to 3 cards
    const cardsToRender = Math.min(3, this.currentQueue.length - this.currentIndex);

    for (let i = cardsToRender - 1; i >= 0; i--) {
      const item = this.currentQueue[this.currentIndex + i];
      const cardEl = this.createCardElement(item, this.currentLevel);
      this.stackElement.appendChild(cardEl);
    }

    // Initialize swipe on top card
    const topCard = this.stackElement.querySelector('.card:last-child');
    if (topCard) {
      SwipeEngine.destroy();
      SwipeEngine.init(topCard, {
        onSwipeRight: () => this.handleSwipe('right'),
        onSwipeLeft: () => this.handleSwipe('left'),
        onTap: () => this.handleTap()
      });
    }

    // Preload next images
    this.preloadImages();
  },

  // Create card HTML element
  createCardElement(item, type) {
    const card = document.createElement('div');
    card.className = 'card';
    card.dataset.id = item.id;
    card.dataset.type = type;

    let typeLabel = '';
    let priceContent = '';
    let additionalContent = '';

    if (type === 'cities') {
      typeLabel = 'City';
      priceContent = `
        <div class="card-price">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          From £${item.flightPrice}
        </div>
      `;
    } else if (type === 'neighbourhoods') {
      const city = Data.getCityById(item.cityId);
      typeLabel = 'Neighbourhood';
      priceContent = `
        <div class="card-price">
          Avg £${item.avgPrice}/night
        </div>
      `;
      additionalContent = `
        <div class="mini-map">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      `;
      card.innerHTML = `
        <div class="card-subtitle">${city ? city.name : ''}</div>
      `;
    } else if (type === 'properties') {
      const neighbourhood = Data.getNeighbourhoodById(item.neighbourhoodId);
      typeLabel = 'Stay';
      priceContent = `
        <div class="card-price">
          £${item.pricePerNight}/night
        </div>
      `;
      additionalContent = `
        <div class="rating">
          <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          ${item.rating}
        </div>
      `;
    }

    const subtitle = type === 'neighbourhoods'
      ? `<div class="card-subtitle">${Data.getCityById(item.cityId)?.name || ''}</div>`
      : type === 'properties'
        ? `<div class="card-subtitle">${item.highlight}</div>`
        : `<div class="card-subtitle">${item.country}</div>`;

    card.innerHTML = `
      <div class="card-image" style="background-image: url('${item.image}')"></div>
      <span class="card-type">${typeLabel}</span>
      ${additionalContent}
      <div class="card-content">
        <h3 class="card-title">${item.name}</h3>
        ${subtitle}
        <div class="card-tags">
          ${(item.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
        </div>
        ${type === 'properties' && item.rating ? `
          <div class="rating" style="margin-bottom: var(--space-sm);">
            <svg viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            ${item.rating}
          </div>
        ` : ''}
        ${priceContent}
      </div>
      <div class="card-indicator like">LIKE</div>
      <div class="card-indicator nope">NOPE</div>
    `;

    return card;
  },

  // Handle swipe action
  handleSwipe(direction) {
    const item = this.currentQueue[this.currentIndex];
    if (!item) return;

    // Save swipe to storage
    Storage.saveSwipe(this.currentLevel, item.id, direction);

    // If swiped right, add to shortlist and unlock next level
    if (direction === 'right') {
      Storage.addToShortlist(this.currentLevel, item);

      // Unlock next level items
      if (this.currentLevel === 'cities') {
        const neighbourhoodIds = Data.getNeighbourhoodsByCity(item.id).map(n => n.id);
        Storage.unlockNeighbourhoods(item.id, neighbourhoodIds);
      } else if (this.currentLevel === 'neighbourhoods') {
        const propertyIds = Data.getPropertiesByNeighbourhood(item.id).map(p => p.id);
        Storage.unlockProperties(item.id, propertyIds);
      }
    }

    // Callback
    if (this.onCardAction) {
      this.onCardAction(direction, item, this.currentLevel);
    }

    // Move to next card
    this.currentIndex++;

    if (this.currentIndex >= this.currentQueue.length) {
      // Load next set of cards
      this.loadNextCards();
    } else {
      this.renderStack();
    }
  },

  // Handle tap on card
  handleTap() {
    const item = this.currentQueue[this.currentIndex];
    if (!item) return;

    if (this.onTap) {
      this.onTap(item, this.currentLevel);
    }
  },

  // Trigger swipe programmatically
  triggerSwipe(direction) {
    SwipeEngine.triggerSwipe(direction);
  },

  // Preload next images for smooth experience
  preloadImages() {
    const nextItems = this.currentQueue.slice(this.currentIndex + 1, this.currentIndex + 4);
    nextItems.forEach(item => {
      const img = new Image();
      img.src = item.image;
    });
  },

  // Get current card data
  getCurrentCard() {
    return this.currentQueue[this.currentIndex] || null;
  },

  // Get progress info
  getProgress() {
    const total = this.currentQueue.length;
    const current = this.currentIndex + 1;
    return {
      current,
      total,
      level: this.currentLevel,
      percentage: total > 0 ? Math.round((current / total) * 100) : 0
    };
  },

  // Get level counts
  getLevelCounts() {
    return {
      cities: this.getUnswipedCities().length,
      neighbourhoods: this.getUnswipedNeighbourhoods().length,
      properties: this.getUnswipedProperties().length
    };
  },

  // Check if there are cards to show
  hasCards() {
    const counts = this.getLevelCounts();
    return counts.cities > 0 || counts.neighbourhoods > 0 || counts.properties > 0;
  }
};

// Export for use in other modules
window.Cards = Cards;
