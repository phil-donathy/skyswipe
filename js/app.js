// Main application orchestration

const App = {
  currentScreen: 'login',
  elements: {},
  onboardingStep: 1,
  lastSavedCity: null,

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
      const settings = Storage.getSettings();
      if (!settings.airportSelected) {
        this.showScreen('airport');
      } else if (!settings.onboardingComplete) {
        this.showScreen('explore');
        this.initExplore();
        this.showOnboarding();
      } else {
        this.showScreen('explore');
        this.initExplore();
      }
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
      airportScreen: document.getElementById('screen-airport'),
      exploreScreen: document.getElementById('screen-explore'),
      shortlistScreen: document.getElementById('screen-shortlist'),
      settingsScreen: document.getElementById('screen-settings'),

      // Login
      loginForm: document.getElementById('login-form'),
      loginEmail: document.getElementById('login-email'),

      // Airport selection
      airportSearch: document.getElementById('airport-search'),
      airportResults: document.getElementById('airport-results'),
      airportChips: document.querySelectorAll('.airport-chip'),

      // Onboarding
      onboardingOverlay: document.getElementById('onboarding-overlay'),
      onboardingNext: document.getElementById('onboarding-next'),
      onboardingSteps: document.querySelectorAll('.onboarding-step'),
      onboardingDots: document.querySelectorAll('.onboarding-dots .dot'),

      // Explore
      cardStack: document.getElementById('card-stack'),
      levelIndicator: document.getElementById('level-indicator'),
      progressLabel: document.getElementById('progress-label'),
      exploreContent: document.querySelector('.explore-content'),
      btnDismiss: document.getElementById('btn-dismiss'),
      btnSave: document.getElementById('btn-save'),
      btnInfo: document.getElementById('btn-info'),
      tapHint: document.getElementById('tap-hint'),
      currentAirport: document.getElementById('current-airport'),
      airportDisplay: document.getElementById('airport-display'),

      // Unlock notification
      unlockNotification: document.getElementById('unlock-notification'),
      unlockTitle: document.getElementById('unlock-title'),
      unlockMessage: document.getElementById('unlock-message'),
      unlockExplore: document.getElementById('unlock-explore'),
      unlockLater: document.getElementById('unlock-later'),

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
      btnChangeAirport: document.getElementById('btn-change-airport'),
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

    // Airport selection
    this.elements.airportChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const code = chip.dataset.code;
        const name = chip.dataset.name;
        this.selectAirport(code, name);
      });
    });

    // Airport display button (to change airport)
    if (this.elements.airportDisplay) {
      this.elements.airportDisplay.addEventListener('click', () => {
        this.showScreen('airport');
      });
    }

    if (this.elements.btnChangeAirport) {
      this.elements.btnChangeAirport.addEventListener('click', () => {
        this.showScreen('airport');
      });
    }

    // Onboarding
    if (this.elements.onboardingNext) {
      this.elements.onboardingNext.addEventListener('click', () => {
        this.nextOnboardingStep();
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

    // Unlock notification buttons
    if (this.elements.unlockExplore) {
      this.elements.unlockExplore.addEventListener('click', () => {
        this.hideUnlockNotification();
        this.switchToNeighbourhoods();
      });
    }

    if (this.elements.unlockLater) {
      this.elements.unlockLater.addEventListener('click', () => {
        this.hideUnlockNotification();
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

  // Select airport
  selectAirport(code, name) {
    Storage.updateSettings({
      homeAirport: code,
      homeAirportName: name,
      airportSelected: true
    });

    // Update display
    if (this.elements.currentAirport) {
      this.elements.currentAirport.textContent = `From ${code}`;
    }

    // Check if onboarding needed
    const settings = Storage.getSettings();
    if (!settings.onboardingComplete) {
      this.showScreen('explore');
      this.initExplore();
      this.showOnboarding();
    } else {
      this.showScreen('explore');
      this.initExplore();
    }

    Toast.show(`Home airport set to ${code}`, 'success');
  },

  // Show onboarding
  showOnboarding() {
    this.onboardingStep = 1;
    this.updateOnboardingUI();
    this.elements.onboardingOverlay.classList.add('active');
  },

  // Next onboarding step
  nextOnboardingStep() {
    if (this.onboardingStep < 3) {
      this.onboardingStep++;
      this.updateOnboardingUI();
    } else {
      this.completeOnboarding();
    }
  },

  // Update onboarding UI
  updateOnboardingUI() {
    // Update steps visibility
    this.elements.onboardingSteps.forEach(step => {
      const stepNum = parseInt(step.dataset.step);
      step.style.display = stepNum === this.onboardingStep ? 'block' : 'none';
    });

    // Update dots
    this.elements.onboardingDots.forEach(dot => {
      const dotStep = parseInt(dot.dataset.step);
      dot.classList.toggle('active', dotStep === this.onboardingStep);
    });

    // Update button text
    if (this.elements.onboardingNext) {
      this.elements.onboardingNext.textContent = this.onboardingStep === 3 ? 'Get Started' : 'Next';
    }
  },

  // Complete onboarding
  completeOnboarding() {
    Storage.updateSettings({ onboardingComplete: true });
    this.elements.onboardingOverlay.classList.remove('active');
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
      navBar.style.display = ['login', 'airport'].includes(screenName) ? 'none' : 'block';
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
      // Show airport selection for new users
      this.showScreen('airport');
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
    // Update airport display
    const settings = Storage.getSettings();
    if (this.elements.currentAirport && settings.homeAirport) {
      this.elements.currentAirport.textContent = `From ${settings.homeAirport}`;
    }

    Cards.init(this.elements.cardStack, {
      onCardAction: (direction, item, level) => {
        this.updateProgress();
        if (direction === 'right') {
          // Show toast with correct item name
          Toast.show(`${item.name} saved to shortlist!`, 'success');

          // If it's a city, show unlock notification
          if (level === 'cities') {
            this.lastSavedCity = item;
            this.showUnlockNotification(item);
          }
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

  // Show unlock notification
  showUnlockNotification(city) {
    if (!this.elements.unlockNotification) return;

    const neighbourhoods = Data.getNeighbourhoodsByCity(city.id);

    if (this.elements.unlockTitle) {
      this.elements.unlockTitle.textContent = `${neighbourhoods.length} Neighbourhoods Unlocked!`;
    }

    if (this.elements.unlockMessage) {
      this.elements.unlockMessage.textContent = `Explore areas in ${city.name} or continue browsing cities`;
    }

    this.elements.unlockNotification.classList.add('show');

    // Auto-hide after 8 seconds
    setTimeout(() => {
      this.hideUnlockNotification();
    }, 8000);
  },

  // Hide unlock notification
  hideUnlockNotification() {
    if (this.elements.unlockNotification) {
      this.elements.unlockNotification.classList.remove('show');
    }
  },

  // Switch to neighbourhoods
  switchToNeighbourhoods() {
    Cards.currentLevel = 'neighbourhoods';
    Cards.loadNextCards();
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
      if (this.elements.tapHint) this.elements.tapHint.style.display = 'none';

      if (!completeMsg) {
        completeMsg = document.createElement('div');
        completeMsg.className = 'explore-complete';
        this.elements.exploreContent.insertBefore(completeMsg, this.elements.exploreContent.querySelector('.explore-actions'));
      }

      const summary = Shortlist.getSummary();

      completeMsg.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
          <polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        <h2>You're all caught up!</h2>
        <p>You've saved ${summary.cities} ${summary.cities === 1 ? 'city' : 'cities'}, ${summary.neighbourhoods} ${summary.neighbourhoods === 1 ? 'area' : 'areas'}, and ${summary.properties} ${summary.properties === 1 ? 'stay' : 'stays'}.</p>
        <button class="btn btn-primary" onclick="App.navigateTo('shortlist')">
          View Your Shortlist
        </button>
      `;

      completeMsg.style.display = 'block';
    }

    // Hide action buttons
    const actions = document.querySelector('.explore-actions');
    if (actions) actions.style.display = 'none';

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

      this.elements.shortlistSummary.innerHTML = `
        <span><strong>${summary.cities}</strong> ${summary.cities === 1 ? 'city' : 'cities'}</span>
        <span><strong>${summary.neighbourhoods}</strong> ${summary.neighbourhoods === 1 ? 'area' : 'areas'}</span>
        <span><strong>${summary.properties}</strong> ${summary.properties === 1 ? 'stay' : 'stays'}</span>
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
      const airportText = settings.homeAirportName
        ? `${settings.homeAirport} - ${settings.homeAirportName}`
        : settings.homeAirport;
      this.elements.homeAirport.textContent = airportText;
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
