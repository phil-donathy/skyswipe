// LocalStorage persistence layer

const STORAGE_KEYS = {
  USER: 'skyswipe_user',
  SWIPES: 'skyswipe_swipes',
  SHORTLIST: 'skyswipe_shortlist',
  UNLOCKED: 'skyswipe_unlocked',
  SETTINGS: 'skyswipe_settings'
};

const Storage = {
  // Get item from localStorage with JSON parsing
  get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (e) {
      console.error(`Error reading ${key} from storage:`, e);
      return null;
    }
  },

  // Set item in localStorage with JSON stringification
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Error writing ${key} to storage:`, e);
      return false;
    }
  },

  // Remove item from localStorage
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      console.error(`Error removing ${key} from storage:`, e);
      return false;
    }
  },

  // Clear all Skyswipe data
  clearAll() {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.remove(key);
    });
  },

  // User management
  getUser() {
    return this.get(STORAGE_KEYS.USER);
  },

  setUser(user) {
    return this.set(STORAGE_KEYS.USER, user);
  },

  removeUser() {
    return this.remove(STORAGE_KEYS.USER);
  },

  // Swipes management
  getSwipes() {
    return this.get(STORAGE_KEYS.SWIPES) || { cities: {}, neighbourhoods: {}, properties: {} };
  },

  saveSwipe(type, id, direction) {
    const swipes = this.getSwipes();
    if (!swipes[type]) swipes[type] = {};
    swipes[type][id] = {
      direction,
      timestamp: Date.now()
    };
    return this.set(STORAGE_KEYS.SWIPES, swipes);
  },

  hasSwipedItem(type, id) {
    const swipes = this.getSwipes();
    return swipes[type] && swipes[type][id] !== undefined;
  },

  getSwipeDirection(type, id) {
    const swipes = this.getSwipes();
    return swipes[type]?.[id]?.direction || null;
  },

  // Shortlist management
  getShortlist() {
    return this.get(STORAGE_KEYS.SHORTLIST) || { cities: [], neighbourhoods: [], properties: [] };
  },

  addToShortlist(type, item) {
    const shortlist = this.getShortlist();
    if (!shortlist[type]) shortlist[type] = [];

    // Avoid duplicates
    if (!shortlist[type].find(i => i.id === item.id)) {
      shortlist[type].push({
        ...item,
        savedAt: Date.now()
      });
    }
    return this.set(STORAGE_KEYS.SHORTLIST, shortlist);
  },

  removeFromShortlist(type, itemId) {
    const shortlist = this.getShortlist();
    if (shortlist[type]) {
      shortlist[type] = shortlist[type].filter(i => i.id !== itemId);
    }
    return this.set(STORAGE_KEYS.SHORTLIST, shortlist);
  },

  isInShortlist(type, itemId) {
    const shortlist = this.getShortlist();
    return shortlist[type]?.some(i => i.id === itemId) || false;
  },

  // Unlocked items management
  getUnlocked() {
    return this.get(STORAGE_KEYS.UNLOCKED) || { neighbourhoods: [], properties: [] };
  },

  unlockNeighbourhoods(cityId, neighbourhoodIds) {
    const unlocked = this.getUnlocked();
    neighbourhoodIds.forEach(id => {
      if (!unlocked.neighbourhoods.includes(id)) {
        unlocked.neighbourhoods.push(id);
      }
    });
    return this.set(STORAGE_KEYS.UNLOCKED, unlocked);
  },

  unlockProperties(neighbourhoodId, propertyIds) {
    const unlocked = this.getUnlocked();
    propertyIds.forEach(id => {
      if (!unlocked.properties.includes(id)) {
        unlocked.properties.push(id);
      }
    });
    return this.set(STORAGE_KEYS.UNLOCKED, unlocked);
  },

  isNeighbourhoodUnlocked(id) {
    const unlocked = this.getUnlocked();
    return unlocked.neighbourhoods.includes(id);
  },

  isPropertyUnlocked(id) {
    const unlocked = this.getUnlocked();
    return unlocked.properties.includes(id);
  },

  // Settings management
  getSettings() {
    return this.get(STORAGE_KEYS.SETTINGS) || {
      personalisation: true,
      homeAirport: 'LHR'
    };
  },

  updateSettings(updates) {
    const settings = this.getSettings();
    return this.set(STORAGE_KEYS.SETTINGS, { ...settings, ...updates });
  }
};

// Export for use in other modules
window.Storage = Storage;
