// Main application orchestration

const App = {
  currentScreen: 'login',
  elements: {},

  // Initialize application
  init() {
    // Cache DOM elements
    this.cacheElements();

    // Initialize modules
    Auth.init();
    Toast.init();
    Modal.init(this.elements.modalOverlay);

    // Check auth state
    if (Auth.isLoggedIn()) {
      this.showScreen('explore');
      this.initExplore();
    } else {
      this.showScreen('login');
    }

    // Set up navigation
    this.setupNavigation();

    // Set up keyboard navigation
    KeyboardNav.init({
      onLeft: () => this.handleKeySwipe('left'),
      onRight: () => this.handleKeySwipe('right'),
      onSelect: () => this.handleKeySelect(),
      onEscape: () => Modal.close()
    });
  },

  // Cache DOM elements
  cacheElements() {
    this.elements = {
      // Screens
      loginScreen: document.getElementById('screen-login'),
      exploreScreen: document.getElementById('screen-explore'),
      shortlistScreen: document.getElementById('screen-shortlist'),
      settingsScreen: document.getElementById('screen-settings'),

      // Login
      loginForm: document.getElementById('login-form'),
      loginEmail: document.getElementById('login-email'),

      // Explore
      cardStack: document.getElementById('card-stack'),
      levelIndicator: document.getElementById('level-indicator'),
      progressLabel: document.getElementById('progress-label'),
      exploreContent: document.querySelector('.explore-content'),
      btnDismiss: document.getElementById('btn-dismiss'),
      btnSave: document.getElementById('btn-save'),
      btnInfo: document.getElementById('btn-info'),

      // Shortlist
      shortlistTabs: document.getElementById('shortlist-tabs'),
      shortlistContent: document.getElementById('shortlist-content'),
      shortlistSummary: document.getElementById('shortlist-summary'),

      // Settings
      userAvatar: document.getElementById('user-avatar'),
      userName: document.getElementById('user-name'),
      userEmail: document.getElementById('user-email'),
      homeAirport: document.getElementById('home-airport'),
      personalisationToggle: document.getElementById('personalisation-toggle'),
      btnLogout: document.getElementById('btn-logout'),
      btnClearData: document.getElementById('btn-clear-data'),

      // Navigation
      navLinks: document.querySelectorAll('.nav-link'),

      // Modal
      modalOverlay: document.getElementById('modal-overlay')
    };
  },

  // Set up navigation handlers
  setupNavigation() {
    // Nav links
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const screen = link.dataset.screen;
        this.navigateTo(screen);
      });
    });

    // Login form
    if (this.elements.loginForm) {
      this.elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleLogin();
      });
    }

    // Swipe action buttons
    if (this.elements.btnDismiss) {
      this.elements.btnDismiss.addEventListener('click', () => {
        Cards.triggerSwipe('left');
      });
    }

    if (this.elements.btnSave) {
      this.elements.btnSave.addEventListener('click', () => {
        Cards.triggerSwipe('right');
      });
    }

    if (this.elements.btnInfo) {
      this.elements.btnInfo.addEventListener('click', () => {
        const card = Cards.getCurrentCard();
        if (card) {
          Modal.open(card, Cards.currentLevel);
        }
      });
    }

    // Settings handlers
    if (this.elements.personalisationToggle) {
      this.elements.personalisationToggle.addEventListener('click', () => {
        this.togglePersonalisation();
      });
    }

    if (this.elements.btnLogout) {
      this.elements.btnLogout.addEventListener('click', () => {
        this.handleLogout();
      });
    }

    if (this.elements.btnClearData) {
      this.elements.btnClearData.addEventListener('click', () => {
        this.handleClearData();
      });
    }
  },

  // Navigate to screen
  navigateTo(screenName) {
    this.showScreen(screenName);

    // Screen-specific initialization
    if (screenName === 'explore') {
      this.initExplore();
    } else if (screenName === 'shortlist') {
      this.initShortlist();
    } else if (screenName === 'settings') {
      this.initSettings();
    }
  },

  // Show specific screen
  showScreen(screenName) {
    this.currentScreen = screenName;

    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
      screen.classList.remove('active');
    });

    // Show target screen
    const targetScreen = document.getElementById(`screen-${screenName}`);
    if (targetScreen) {
      targetScreen.classList.add('active');
    }

    // Update nav
    this.elements.navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.screen === screenName);
    });

    // Show/hide nav bar
    const navBar = document.querySelector('.nav');
    if (navBar) {
      navBar.style.display = screenName === 'login' ? 'none' : 'block';
    }

    // Enable/disable keyboard nav
    if (screenName === 'explore') {
      KeyboardNav.enable();
    } else {
      KeyboardNav.disable();
    }
  },

  // Handle login
  handleLogin() {
    const email = this.elements.loginEmail?.value;
    const result = Auth.login(email);

    if (result.success) {
      this.showScreen('explore');
      this.initExplore();
      Toast.show(`Welcome, ${result.user.name}!`, 'success');
    } else {
      Toast.show(result.error, 'error');
    }
  },

  // Handle logout
  handleLogout() {
    Auth.logout();
    this.showScreen('login');
    Toast.show('You\'ve been logged out');
  },

  // Handle clear data
  handleClearData() {
    if (confirm('This will clear all your saved trips and preferences. Continue?')) {
      Storage.clearAll();
      Auth.logout();
      this.showScreen('login');
      Toast.show('All data cleared');
    }
  },

  // Initialize explore screen
  initExplore() {
    Cards.init(this.elements.cardStack, {
      onCardAction: (direction, item, level) => {
        this.updateProgress();
        if (direction === 'right') {
          Toast.show(`${item.name} saved!`, 'success');
        }
      },
      onQueueEmpty: () => {
        this.showExploreComplete();
      },
      onTap: (item, level) => {
        Modal.open(item, level);
      }
    });

    if (Cards.hasCards()) {
      Cards.startWithCities();
      this.updateProgress();
      this.showExploreCards();
    } else {
      this.showExploreComplete();
    }
  },

  // Update progress display
  updateProgress() {
    const progress = Cards.getProgress();

    // Update level indicator
    if (this.elements.levelIndicator) {
      const dots = this.elements.levelIndicator.querySelectorAll('.level-dot');
      const levelName = this.elements.levelIndicator.querySelector('.level-name');

      dots.forEach(dot => {
        const dotLevel = dot.dataset.level;
        dot.classList.remove('active', 'completed');

        if (dotLevel === progress.level) {
          dot.classList.add('active');
        } else if (
          (progress.level === 'neighbourhoods' && dotLevel === 'cities') ||
          (progress.level === 'properties' && (dotLevel === 'cities' || dotLevel === 'neighbourhoods'))
        ) {
          dot.classList.add('completed');
        }
      });

      if (levelName) {
        const levelLabels = {
          cities: 'Cities',
          neighbourhoods: 'Neighbourhoods',
          properties: 'Stays'
        };
        levelName.textContent = levelLabels[progress.level] || '';
      }
    }

    // Update progress label
    if (this.elements.progressLabel) {
      this.elements.progressLabel.innerHTML = `
        <span class="progress-count">${progress.current}</span>
        <span class="progress-label">of ${progress.total}</span>
      `;
    }
  },

  // Show explore cards view
  showExploreCards() {
    if (this.elements.exploreContent) {
      // Make sure card container is visible
      const cardContainer = this.elements.exploreContent.querySelector('.card-container');
      const completeMsg = this.elements.exploreContent.querySelector('.explore-complete');

      if (cardContainer) cardContainer.style.display = 'flex';
      if (completeMsg) completeMsg.style.display = 'none';
    }
  },

  // Show explore complete message
  showExploreComplete() {
    if (this.elements.exploreContent) {
      const cardContainer = this.elements.exploreContent.querySelector('.card-container');
      let completeMsg = this.elements.exploreContent.querySelector('.explore-complete');

      if (cardContainer) cardContainer.style.display = 'none';

      if (!completeMsg) {
        completeMsg = document.createElement('div');
        completeMsg.className = 'explore-complete';
        this.elements.exploreContent.appendChild(completeMsg);
      }

      const summary = Shortlist.getSummary();

      completeMsg.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h2>You're all caught up!</h2>
        <p>You've saved ${summary.cities} cities, ${summary.neighbourhoods} neighbourhoods, and ${summary.properties} stays.</p>
        <button class="btn btn-primary" onclick="App.navigateTo('shortlist')">
          View Your Shortlist
        </button>
      `;

      completeMsg.style.display = 'block';
    }

    // Disable swipe keyboard nav
    KeyboardNav.disable();
  },

  // Initialize shortlist screen
  initShortlist() {
    Shortlist.init(this.elements.shortlistContent, this.elements.shortlistTabs);
    Shortlist.render();

    // Update summary
    this.updateShortlistSummary();
  },

  // Update shortlist summary
  updateShortlistSummary() {
    if (this.elements.shortlistSummary) {
      const summary = Shortlist.getSummary();
      const cost = Shortlist.getEstimatedCost();

      this.elements.shortlistSummary.innerHTML = `
        <span><strong>${summary.cities}</strong> cities</span>
        <span><strong>${summary.neighbourhoods}</strong> areas</span>
        <span><strong>${summary.properties}</strong> stays</span>
      `;
    }
  },

  // Initialize settings screen
  initSettings() {
    const user = Auth.getUser();
    const settings = Storage.getSettings();

    // Update user info
    if (this.elements.userAvatar) {
      this.elements.userAvatar.textContent = Auth.getInitials();
    }

    if (this.elements.userName) {
      this.elements.userName.textContent = user?.name || 'Traveller';
    }

    if (this.elements.userEmail) {
      this.elements.userEmail.textContent = user?.email || '';
    }

    // Update settings values
    if (this.elements.homeAirport) {
      this.elements.homeAirport.textContent = settings.homeAirport;
    }

    if (this.elements.personalisationToggle) {
      this.elements.personalisationToggle.classList.toggle('active', settings.personalisation);
    }
  },

  // Toggle personalisation setting
  togglePersonalisation() {
    const settings = Storage.getSettings();
    const newValue = !settings.personalisation;

    Storage.updateSettings({ personalisation: newValue });

    if (this.elements.personalisationToggle) {
      this.elements.personalisationToggle.classList.toggle('active', newValue);
    }

    Toast.show(newValue ? 'Personalisation enabled' : 'Personalisation disabled');
  },

  // Handle keyboard swipe
  handleKeySwipe(direction) {
    if (this.currentScreen !== 'explore' || !Cards.hasCards()) return;

    if (Modal.isOpen) {
      Modal.handleAction(direction === 'right' ? 'save' : 'dismiss');
    } else {
      Cards.triggerSwipe(direction);
    }
  },

  // Handle keyboard select (Enter/Space)
  handleKeySelect() {
    if (this.currentScreen !== 'explore') return;

    if (Modal.isOpen) {
      Modal.handleAction('save');
    } else {
      const card = Cards.getCurrentCard();
      if (card) {
        Modal.open(card, Cards.currentLevel);
      }
    }
  }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// Export for use in other modules
window.App = App;
