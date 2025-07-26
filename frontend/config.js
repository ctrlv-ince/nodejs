// Frontend Configuration
const config = {
    API_URL: 'http://localhost:4000',
    API_VERSION: 'v1',
    FULL_API_URL: 'http://localhost:4000/api/v1'
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} 