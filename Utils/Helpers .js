const Helpers = {
  async generateRandomEmail(prefix = "qauser") {
    const timestamp = Date.now();
    return `${prefix}${timestamp}@testmail.com`;
  },

  async generateRandomUsername(prefix = "qauser") {
    const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit random
    return `${prefix}_${Date.now()}_${randomNum}`;
  },
};

export default Helpers;