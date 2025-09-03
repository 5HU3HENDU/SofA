const CACHE_NAME = 'school-of-adults-v1';
const urlsToCache = [
    '/',
    '/index.html',
    
    // JSON Data Files
    'health-food.json',
    'health-exercise.json',
    'health-healthcheckup.json',
    'health-mentalhealth.json',
    'health-period.json',
    'wealth-generate.json',
    'wealth-invest.json',
    'wealth-insurance.json',
    'wealth-spends.json',
    'wealth-loans.json',
    'career-choosing.json',
    'career-jobsearch.json',
    'career-ladder.json',
    'career-resignation.json',
    'home-livingroom.json',
    'home-bedroom.json',
    'home-kitchen.json',
    'home-garden.json',
    'home-bathroom.json',
    'travel-place.json',
    'travel-stay.json',
    'travel-flight.json',
    'travel-train.json',
    'travel-bus.json',
    'travel-cab.json',
    'travel-itinerary.json',
    'travel-thingstocarry.json',
    'people-self.json',
    'people-parents.json',
    'people-partner.json',
    'people-kids.json',
    'people-friends.json',
    'people-relatives.json',
    'people-colleagues.json',
    'people-enemy.json',
    'lifeskills-driving.json',
    'lifeskills-swimming.json',
    'lifeskills-decisionmaking.json',
    'lifeskills-problemsolving.json',
    'lifeevents-buyinghouse.json',
    'lifeevents-gettingmarried.json',
    'lifeevents-pregnancy.json',
    'lifeevents-moving.json',
    'pets-cats.json',
    'pets-dogs.json',
    'content-news.json',
    'content-tvmovies.json',
    'content-songs.json',
    'content-books.json',
    'content-games.json',
    'fashion-men.json',
    'fashion-women.json',
    'fashion-kids.json',
    
    // External Assets
    'https://cdn.tailwindcss.com',
    'https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap',
    'https://unpkg.com/feather-icons'
];

// Install event: cache the app shell
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache and caching app shell');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event: serve from cache first, then network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Not in cache - fetch from network, cache, and return
                return fetch(event.request);
            })
    );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

