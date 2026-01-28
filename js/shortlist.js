// Shortlist management and UI

const Shortlist = {
  currentTab: 'cities',
  containerElement: null,
  tabsElement: null,

  // Initialize shortlist
  init(containerElement, tabsElement) {
    this.containerElement = containerElement;
    this.tabsElement = tabsElement;

    // Set up tab click handlers
    if (tabsElement) {
      tabsElement.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const tabName = tab.dataset.tab;
          this.switchTab(tabName);
        });
      });
    }
  },

  // Switch active tab
  switchTab(tabName) {
    this.currentTab = tabName;

    // Update tab UI
    if (this.tabsElement) {
      this.tabsElement.querySelectorAll('.tab').forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
      });
    }

    // Render content
    this.render();
  },

  // Render shortlist content
  render() {
    if (!this.containerElement) return;

    const shortlist = Storage.getShortlist();
    const items = shortlist[this.currentTab] || [];

    // Hide all sections first
    this.containerElement.querySelectorAll('.shortlist-section').forEach(section => {
      section.classList.remove('active');
    });

    // Show current section
    const currentSection = this.containerElement.querySelector(`.shortlist-section[data-section="${this.currentTab}"]`);
    if (currentSection) {
      currentSection.classList.add('active');

      if (items.length === 0) {
        currentSection.innerHTML = this.renderEmptyState();
      } else {
        currentSection.innerHTML = this.renderItems(items, this.currentTab);
      }
    }

    // Update tab counts
    this.updateTabCounts();
  },

  // Render items grid
  renderItems(items, type) {
    let html = '<div class="shortlist-grid">';

    items.forEach(item => {
      const priceInfo = this.getPriceInfo(item, type);
      const locationInfo = this.getLocationInfo(item, type);

      html += `
        <div class="shortlist-item" data-id="${item.id}" data-type="${type}">
          <img src="${item.image}" alt="${item.name}" class="shortlist-image" loading="lazy">
          <div class="shortlist-info">
            <div class="shortlist-name">${item.name}</div>
            <div class="shortlist-meta">
              ${locationInfo}
              ${priceInfo}
            </div>
            <div class="shortlist-actions">
              <button class="btn btn-primary btn-sm" onclick="Shortlist.openBooking('${item.id}', '${type}')">
                Book
              </button>
              <button class="btn btn-secondary btn-sm" onclick="Shortlist.setPriceAlert('${item.id}', '${type}')">
                Alert
              </button>
            </div>
          </div>
        </div>
      `;
    });

    html += '</div>';
    return html;
  },

  // Render empty state
  renderEmptyState() {
    const messages = {
      cities: {
        title: 'No cities saved yet',
        text: 'Swipe right on cities you\'d like to explore'
      },
      neighbourhoods: {
        title: 'No neighbourhoods saved yet',
        text: 'Save a city first, then explore its neighbourhoods'
      },
      properties: {
        title: 'No stays saved yet',
        text: 'Save neighbourhoods to unlock property options'
      }
    };

    const msg = messages[this.currentTab] || messages.cities;

    return `
      <div class="empty-state">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        <h3>${msg.title}</h3>
        <p>${msg.text}</p>
      </div>
    `;
  },

  // Get price info string
  getPriceInfo(item, type) {
    if (type === 'cities') {
      return `Flights from £${item.flightPrice}`;
    } else if (type === 'neighbourhoods') {
      return `Avg £${item.avgPrice}/night`;
    } else if (type === 'properties') {
      return `£${item.pricePerNight}/night`;
    }
    return '';
  },

  // Get location info string
  getLocationInfo(item, type) {
    if (type === 'cities') {
      return `${item.country} • `;
    } else if (type === 'neighbourhoods') {
      const city = Data.getCityById(item.cityId);
      return city ? `${city.name} • ` : '';
    } else if (type === 'properties') {
      const neighbourhood = Data.getNeighbourhoodById(item.neighbourhoodId);
      return neighbourhood ? `${neighbourhood.name} • ` : '';
    }
    return '';
  },

  // Update tab counts
  updateTabCounts() {
    const shortlist = Storage.getShortlist();

    if (this.tabsElement) {
      this.tabsElement.querySelectorAll('.tab').forEach(tab => {
        const tabName = tab.dataset.tab;
        const count = (shortlist[tabName] || []).length;
        const countEl = tab.querySelector('.tab-count');

        if (countEl) {
          countEl.textContent = count;
        } else if (count > 0) {
          tab.innerHTML = `${tab.textContent.trim()} <span class="tab-count">(${count})</span>`;
        }
      });
    }
  },

  // Open booking link (Skyscanner search)
  openBooking(itemId, type) {
    let url = 'https://www.skyscanner.net/';
    const settings = Storage.getSettings();

    if (type === 'cities') {
      const city = Data.getCityById(itemId);
      if (city) {
        // Direct to Skyscanner flights search
        url = `https://www.skyscanner.net/transport/flights/${settings.homeAirport.toLowerCase()}/${city.id}/?adultsv2=1`;
      }
    } else if (type === 'neighbourhoods' || type === 'properties') {
      let city;
      if (type === 'neighbourhoods') {
        const neighbourhood = Data.getNeighbourhoodById(itemId);
        city = neighbourhood ? Data.getCityById(neighbourhood.cityId) : null;
      } else {
        const property = Data.getPropertyById(itemId);
        city = property ? Data.getCityById(property.cityId) : null;
      }

      if (city) {
        url = `https://www.skyscanner.net/hotels/${city.id}`;
      }
    }

    window.open(url, '_blank');
  },

  // Set price alert (mock)
  setPriceAlert(itemId, type) {
    Toast.show('Price alert set! We\'ll notify you of any drops.', 'success');
  },

  // Get summary stats
  getSummary() {
    const shortlist = Storage.getShortlist();
    return {
      cities: (shortlist.cities || []).length,
      neighbourhoods: (shortlist.neighbourhoods || []).length,
      properties: (shortlist.properties || []).length
    };
  },

  // Calculate estimated trip cost
  getEstimatedCost() {
    const shortlist = Storage.getShortlist();
    const cities = shortlist.cities || [];
    const properties = shortlist.properties || [];

    let flightCost = 0;
    let stayCost = 0;

    // Get cheapest flight from saved cities
    if (cities.length > 0) {
      flightCost = Math.min(...cities.map(c => c.flightPrice)) * 2; // Round trip
    }

    // Get average stay cost (assume 3 nights)
    if (properties.length > 0) {
      const avgNightly = properties.reduce((sum, p) => sum + p.pricePerNight, 0) / properties.length;
      stayCost = Math.round(avgNightly * 3);
    }

    return {
      flights: flightCost,
      stays: stayCost,
      total: flightCost + stayCost
    };
  },

  // Remove item from shortlist
  removeItem(itemId, type) {
    Storage.removeFromShortlist(type, itemId);
    this.render();
    Toast.show('Removed from shortlist');
  }
};

// Toast notifications
const Toast = {
  containerElement: null,

  init(containerElement) {
    this.containerElement = containerElement;
  },

  show(message, type = 'default', duration = 3000) {
    if (!this.containerElement) {
      // Create container if doesn't exist
      this.containerElement = document.createElement('div');
      this.containerElement.className = 'toast-container';
      document.body.appendChild(this.containerElement);
    }

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
        ${type === 'success'
          ? '<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>'
          : type === 'error'
            ? '<circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>'
            : '<circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/>'
        }
      </svg>
      <span>${message}</span>
    `;

    this.containerElement.appendChild(toast);

    // Remove after duration
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(-20px)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }
};

// Detail Modal
const Modal = {
  overlayElement: null,
  isOpen: false,

  init(overlayElement) {
    this.overlayElement = overlayElement;

    if (overlayElement) {
      // Close on overlay click
      overlayElement.addEventListener('click', (e) => {
        if (e.target === overlayElement) {
          this.close();
        }
      });

      // Close button
      const closeBtn = overlayElement.querySelector('.modal-close');
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.close());
      }
    }
  },

  open(item, type) {
    if (!this.overlayElement) return;

    this.isOpen = true;
    const modal = this.overlayElement.querySelector('.modal');
    const body = modal.querySelector('.modal-body');

    // Build modal content
    const locationInfo = this.getLocationInfo(item, type);
    const priceInfo = this.getPriceInfo(item, type);

    body.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="modal-image">
      <h2>${item.name}</h2>
      <p class="text-muted">${locationInfo}</p>

      ${type === 'properties' && item.rating ? `
        <div class="rating" style="margin: var(--space-md) 0;">
          <svg viewBox="0 0 24 24" width="20" height="20"><path fill="currentColor" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          <span>${item.rating} rating</span>
        </div>
      ` : ''}

      ${item.tags ? `
        <div class="card-tags" style="margin: var(--space-md) 0;">
          ${item.tags.map(tag => `<span class="tag" style="background: var(--color-grey-10); color: var(--color-charcoal);">${tag}</span>`).join('')}
        </div>
      ` : ''}

      <p>${item.description || ''}</p>

      ${type === 'properties' && item.highlight ? `
        <p><strong>Why this place:</strong> ${item.highlight}</p>
      ` : ''}

      <div class="price-estimate" style="margin-top: var(--space-lg);">
        <div class="price-estimate-label">${type === 'cities' ? 'Flight from LHR' : 'Price'}</div>
        <div class="price-estimate-value">${priceInfo}</div>
      </div>

      <div class="modal-actions">
        <button class="btn btn-dismiss btn-action" onclick="Modal.handleAction('dismiss')" aria-label="Dismiss">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <button class="btn btn-save btn-action" onclick="Modal.handleAction('save')" aria-label="Save">
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>
    `;

    // Store current item for actions
    this.currentItem = item;
    this.currentType = type;

    // Show modal
    this.overlayElement.classList.add('active');
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.overlayElement) return;

    this.isOpen = false;
    this.overlayElement.classList.remove('active');
    document.body.style.overflow = '';
  },

  handleAction(action) {
    if (action === 'save') {
      // Trigger swipe right
      this.close();
      setTimeout(() => {
        Cards.triggerSwipe('right');
      }, 100);
    } else if (action === 'dismiss') {
      // Trigger swipe left
      this.close();
      setTimeout(() => {
        Cards.triggerSwipe('left');
      }, 100);
    }
  },

  getLocationInfo(item, type) {
    if (type === 'cities') {
      return item.country;
    } else if (type === 'neighbourhoods') {
      const city = Data.getCityById(item.cityId);
      return city ? city.name : '';
    } else if (type === 'properties') {
      const neighbourhood = Data.getNeighbourhoodById(item.neighbourhoodId);
      const city = neighbourhood ? Data.getCityById(neighbourhood.cityId) : null;
      return neighbourhood ? `${neighbourhood.name}, ${city?.name || ''}` : '';
    }
    return '';
  },

  getPriceInfo(item, type) {
    if (type === 'cities') {
      return `From £${item.flightPrice}`;
    } else if (type === 'neighbourhoods') {
      return `Avg £${item.avgPrice}/night`;
    } else if (type === 'properties') {
      return `£${item.pricePerNight}/night`;
    }
    return '';
  }
};

// Export for use in other modules
window.Shortlist = Shortlist;
window.Toast = Toast;
window.Modal = Modal;
