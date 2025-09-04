const CACHE_NAME = 'school-of-adults-v3'; // Increment this version number to trigger an update
const urlsToCache = [
  '/',
  'index.html',
  // Health
  'health-food.json', 'health-exercise.json', 'health-healthcheckup.json', 'health-mentalhealth.json', 'health-period.json',
  // Wealth
  'wealth-generate.json', 'wealth-invest.json', 'wealth-insurance.json', 'wealth-spends.json', 'wealth-loans.json',
  // Career
  'career-choosing.json', 'career-jobsearch.json', 'career-ladder.json', 'career-resignation.json',
  // Home
  'home-livingroom.json', 'home-bedroom.json', 'home-kitchen.json', 'home-garden.json', 'home-bathroom.json',
  // People
  'people-self.json', 'people-parents.json', 'people-partner.json', 'people-kids.json', 'people-friends.json', 'people-relatives.json', 'people-colleagues.json', 'people-enemy.json',
  // Pets
  'pets-cats.json', 'pets-dogs.json',
  // Travel
  'travel-place.json', 'travel-stay.json', 'travel-flight.json', 'travel-train.json', 'travel-bus.json', 'travel-cab.json', 'travel-itinerary.json', 'travel-thingstocarry.json',
  // Content
  'content-news.json', 'content-tvmovies.json', 'content-songs.json', 'content-books.json', 'content-games.json',
  // Fashion
  'fashion-men.json', 'fashion-women.json', 'fashion-kids.json',
  // Life Skills
  'lifeskills-driving.json', 'lifeskills-swimming.json', 'lifeskills-decisionmaking.json', 'lifeskills-problemsolving.json',
  // Life Events
  'lifeevents-buyinghouse.json', 'lifeevents-gettingmarried.json', 'lifeevents-pregnancy.json', 'lifeevents-moving.json'
];

// 1. Install: Cache the essential "app shell" files
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache and caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. Activate: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch: Implement Stale-While-Revalidate for all requests
self.addEventListener('fetch', event => {
  // We only want to cache GET requests.
  if (event.request.method !== 'GET') {
    return;
  }
  
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(response => {
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // If we get a valid response, update the cache
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(err => {
          // Fetch failed, probably offline
          console.error('Fetch failed:', err);
          // Here you could return a generic offline fallback page if you had one cached
        });

        // Return the cached response immediately, while the network fetch happens in the background.
        return response || fetchPromise;
      });
    })
  );
});

