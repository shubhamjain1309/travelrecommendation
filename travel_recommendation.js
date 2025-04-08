console.log('Application initialized successfully');

// Get current time for Toronto
function updateTime() {
    try {
        const options = {
            timeZone: 'America/Toronto',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        const time = new Date().toLocaleTimeString('en-US', options);
        document.getElementById('local-time').textContent = `Current Local Time (America/Toronto): ${time}`;
    } catch (error) {
        console.error('Time display error:', error);
    }
}

// Update time every second
setInterval(updateTime, 1000);
updateTime();

// Travel data store
const travelData = {
    "countries": [
        {
            "id": 1,
            "name": "Australia",
            "cities": [
                {
                    "name": "Sydney",
                    "imageUrl": "https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9",
                    "description": "A vibrant city known for its iconic landmarks like the Sydney Opera House and Sydney Harbour Bridge.",
                    "type": "city"
                },
                {
                    "name": "Melbourne",
                    "imageUrl": "https://images.unsplash.com/photo-1514395462725-fb4566210144",
                    "description": "A cultural hub famous for its art, food, and diverse neighborhoods.",
                    "type": "city"
                }
            ]
        },
        {
            "id": 2,
            "name": "Japan",
            "cities": [
                {
                    "name": "Tokyo",
                    "imageUrl": "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf",
                    "description": "A bustling metropolis blending tradition and modernity.",
                    "type": "city"
                }
            ]
        }
    ],
    "temples": [
        {
            "name": "Angkor Wat",
            "location": "Cambodia",
            "imageUrl": "https://images.unsplash.com/photo-1600000000000-000000000000",
            "description": "A UNESCO World Heritage site and the largest religious monument in the world.",
            "type": "temple"
        },
        {
            "name": "Taj Mahal",
            "location": "India",
            "imageUrl": "https://images.unsplash.com/photo-1600000000000-000000000001",
            "description": "An iconic symbol of love and a masterpiece of Mughal architecture.",
            "type": "temple"
        }
    ],
    "beaches": [
        {
            "name": "Bora Bora",
            "location": "French Polynesia",
            "imageUrl": "https://images.unsplash.com/photo-1600000000000-000000000002",
            "description": "Crystal clear waters and luxurious overwater bungalows.",
            "type": "beach"
        },
        {
            "name": "Copacabana",
            "location": "Brazil",
            "imageUrl": "https://images.unsplash.com/photo-1600000000000-000000000003",
            "description": "Famous beach with vibrant atmosphere and scenic views.",
            "type": "beach"
        }
    ]
};

// Keywords mapping for different variations
const keywordMappings = {
    // Beach variations
    'beach': 'beach',
    'beaches': 'beach',
    'seaside': 'beach',
    'coast': 'beach',
    'shore': 'beach',
    
    // Temple variations
    'temple': 'temple',
    'temples': 'temple',
    'shrine': 'temple',
    'sanctuary': 'temple',
    
    // Country/City variations
    'country': 'country',
    'countries': 'country',
    'city': 'city',
    'cities': 'city',
    'destination': 'country'
};

// Search functionality
class TravelSearch {
    constructor(data) {
        this.data = data;
        this.searchButton = document.querySelector('.search-button');
        this.searchInput = document.querySelector('.search-input');
        this.clearButton = document.querySelector('.clear-button');
        this.resultsContainer = document.getElementById('search-results');
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Search button click
        this.searchButton.addEventListener('click', () => this.handleSearch());

        // Clear button click
        this.clearButton.addEventListener('click', () => this.clearSearch());

        // Enter key press
        this.searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleSearch();
            }
        });
    }

    handleSearch() {
        const searchTerm = this.searchInput.value.trim().toLowerCase();
        if (!searchTerm) {
            this.showNoResults('Please enter a search term');
            return;
        }

        const results = this.searchAllCategories(searchTerm);
        this.displayResults(results);
    }

    searchAllCategories(searchTerm) {
        const results = [];

        // Search beaches
        if (this.isBeachSearch(searchTerm)) {
            results.push(...this.data.beaches);
        }

        // Search temples
        if (this.isTempleSearch(searchTerm)) {
            results.push(...this.data.temples);
        }

        // Search countries and cities
        if (this.isLocationSearch(searchTerm)) {
            this.data.countries.forEach(country => {
                // Match country
                if (country.name.toLowerCase().includes(searchTerm)) {
                    results.push({
                        name: country.name,
                        type: 'country',
                        description: `Explore the beautiful country of ${country.name}`,
                        imageUrl: country.cities[0]?.imageUrl // Use first city image as country image
                    });
                }
                // Match cities
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(searchTerm)) {
                        results.push(city);
                    }
                });
            });
        }

        // Direct name search if no category matches
        if (results.length === 0) {
            results.push(
                ...this.data.beaches.filter(beach => 
                    beach.name.toLowerCase().includes(searchTerm) || 
                    beach.location.toLowerCase().includes(searchTerm)
                ),
                ...this.data.temples.filter(temple => 
                    temple.name.toLowerCase().includes(searchTerm) || 
                    temple.location.toLowerCase().includes(searchTerm)
                )
            );
        }

        return results;
    }

    isBeachSearch(term) {
        const beachKeywords = ['beach', 'beaches', 'coast', 'shore', 'seaside'];
        return beachKeywords.includes(term);
    }

    isTempleSearch(term) {
        const templeKeywords = ['temple', 'temples', 'shrine', 'sanctuary'];
        return templeKeywords.includes(term);
    }

    isLocationSearch(term) {
        const locationKeywords = ['country', 'countries', 'city', 'cities', 'place', 'destination'];
        return locationKeywords.includes(term) || this.data.countries.some(country => 
            country.name.toLowerCase().includes(term));
    }

    displayResults(results) {
        const mainContent = document.querySelector('.main-content');
        
        if (results.length === 0) {
            this.showNoResults();
            return;
        }

        const resultsHTML = results.map(result => this.createResultCard(result)).join('');
        this.resultsContainer.innerHTML = resultsHTML;
        
        // Smooth display transition
        if (this.resultsContainer.style.display !== 'block') {
            this.resultsContainer.style.opacity = '0';
            this.resultsContainer.style.display = 'block';
            
            // Trigger reflow
            this.resultsContainer.offsetHeight;
            
            this.resultsContainer.style.transition = 'opacity 0.3s ease';
            this.resultsContainer.style.opacity = '1';
        }
        
        console.log(`Displaying ${results.length} results`);
    }

    createResultCard(result) {
        return `
            <div class="result-card">
                <img src="${result.imageUrl}" 
                     alt="${result.name}" 
                     onerror="this.src='placeholder.jpg'">
                <div class="result-content">
                    <h2>${result.name}</h2>
                    <span class="result-type">${result.type}</span>
                    ${result.location ? `<span class="result-location">${result.location}</span>` : ''}
                    <p>${result.description}</p>
                    <button class="visit-btn" onclick="handleVisit('${result.name}')">Visit</button>
                </div>
            </div>
        `;
    }

    showNoResults(message = 'No results found. Try different keywords like "beach", "temple", or a specific location name.') {
        this.resultsContainer.innerHTML = `
            <div class="no-results">
                <p>${message}</p>
            </div>
        `;
        this.resultsContainer.style.display = 'block';
    }

    clearSearch() {
        this.searchInput.value = '';
        
        // Smooth hide transition
        this.resultsContainer.style.opacity = '0';
        setTimeout(() => {
            this.resultsContainer.style.display = 'none';
            this.resultsContainer.style.transition = '';
        }, 300);
        
        console.log('Search cleared');
    }
}

// Handle visit button clicks
function handleVisit(locationName) {
    console.log(`Visit requested for: ${locationName}`);
    // Add your visit handling logic here
}

// Initialize search when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const travelSearch = new TravelSearch(travelData);
    console.log('Travel search initialized');
});

// Insert the styles
const styleSheet = document.createElement("style");
styleSheet.textContent = newStyles;
document.head.appendChild(styleSheet);

// Window load confirmation
window.addEventListener('load', () => {
    console.log('Application loaded successfully');
});

// Global error handler for critical errors only
window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.error('Critical error:', {
        message: msg,
        location: `${url} (${lineNo}:${columnNo})`
    });
    return false;
};
    