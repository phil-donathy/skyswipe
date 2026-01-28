// Authentication module

const Auth = {
  currentUser: null,

  // Initialize auth state from storage
  init() {
    this.currentUser = Storage.getUser();
    return this.currentUser;
  },

  // Check if user is logged in
  isLoggedIn() {
    return this.currentUser !== null;
  },

  // Log in with email
  login(email) {
    if (!email || !this.isValidEmail(email)) {
      return { success: false, error: 'Please enter a valid email address' };
    }

    const user = {
      email: email.toLowerCase().trim(),
      name: this.extractNameFromEmail(email),
      createdAt: Date.now()
    };

    Storage.setUser(user);
    this.currentUser = user;

    return { success: true, user };
  },

  // Log out
  logout() {
    Storage.removeUser();
    this.currentUser = null;
    return { success: true };
  },

  // Get current user
  getUser() {
    return this.currentUser;
  },

  // Get user's initials for avatar
  getInitials() {
    if (!this.currentUser) return '?';
    const name = this.currentUser.name || this.currentUser.email;
    const parts = name.split(/[\s@.]+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  },

  // Helper: Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Helper: Extract name from email
  extractNameFromEmail(email) {
    const localPart = email.split('@')[0];
    // Replace dots, underscores, numbers with spaces
    const name = localPart
      .replace(/[._]/g, ' ')
      .replace(/\d+/g, '')
      .trim();

    // Capitalize first letter of each word
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') || 'Traveller';
  }
};

// Export for use in other modules
window.Auth = Auth;
