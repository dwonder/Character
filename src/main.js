// --- STATE AND DATA ---

// This maps animal names to their local image files.
const animalImageMap = {
  // Updated to use 'dog1.png' as 'Dog.png' might be a different file
  'Dog': 'assets/dog1.png', 
  
  // Note: This file is still a JPG in your repo
  'Elephant': 'assets/Elephant.jpg', 
  
  // Updated to match the new filename 'artic (1).png'
  'Arctic Wolf': 'assets/artic (1).png', 
  
  'Dove': 'assets/dove.png',
  'Dolphin': 'assets/dolphin.png',
  'Eagle': 'assets/eagle.png',
  
  // Updated to use the lowercase 'f' version from your list
  'Fox': 'assets/Fox.png',
  
  'Octopus': 'assets/octopus.png',
  'Cat': 'assets/cat.png',
  
  // Updated to match 'Sea Turtle.png'
  'Sea Turtle': 'assets/Sea Turtle.png',
  
  'Owl': 'assets/owl.png',
};
// Mock function to simulate fetching data from Gemini.
// This is used to avoid exposing your API key in client-side code.
async function generateAnimalData() {
  console.log("Fetching mock data...");
  // Simulate network delay to show the loading spinner
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const mockData = [
    { 
      animalName: "Dog", 
      representative: "Kingsley", 
      genericDescription: "A social pack animal known for its unwavering loyalty, intelligence, and protective instincts. Dogs form strong bonds and are celebrated for their companionship.",
      genericTraits: ["Loyal", "Protective", "Intelligent"],
      personalizedDescription: "Kingsley embodies the spirit of the Dog, offering steadfast support to ensure systems are reliable and users are happy. His loyalty to the team makes him an invaluable guardian of our IT infrastructure."
    },
    { 
      animalName: "Owl", 
      representative: "Kelechi", 
      genericDescription: "A nocturnal predator with exceptional vision and silent flight. Owls are symbols of wisdom, known for their patient and observant nature.",
      genericTraits: ["Wise", "Patient", "Observant"],
      personalizedDescription: "Like the Owl, Kelechi thrives in quiet focus, navigating complex problems with keen insight. His wisdom allows him to foresee challenges and craft elegant solutions under the cover of code."
    },
    { 
      animalName: "Eagle", 
      representative: "Deborah", 
      genericDescription: "A majestic bird of prey with a powerful build and incredible eyesight. Eagles are symbols of freedom, courage, and far-reaching vision.",
      genericTraits: ["Visionary", "Courageous", "Efficient"],
      personalizedDescription: "Deborah channels the Eagle's spirit, soaring above challenges with a clear vision of the goal. Fearless and efficient, she tackles new tasks with the courage to innovate and the wisdom to succeed."
    },
    { 
      animalName: "Dolphin", 
      representative: "Gbemisola", 
      genericDescription: "Highly intelligent and social marine mammals known for their playful behavior and complex communication. Dolphins excel at collaboration and teamwork.",
      genericTraits: ["Communicative", "Intelligent", "Playful"],
      personalizedDescription: "Embodying the Dolphin's collaborative spirit, Gbemisola navigates complex projects with fluid communication. Her friendly, team-oriented approach makes every interaction productive and engaging."
    },
  ];

  // Add image paths to the data
  return mockData.map(card => ({
    ...card,
    imageUrl: animalImageMap[card.animalName] || 'assets/default.png'
  }));
}

// App state
let cards = [];
let currentIndex = 0;
let isFlipped = false;
let isShuffling = false;

// --- DOM ELEMENTS ---
const appContainer = document.getElementById('app-container');

// --- RENDERING LOGIC ---

function renderCardViewer() {
  if (cards.length === 0) {
    appContainer.innerHTML = `<p class="text-xl text-gray-400">No persona cards to display.</p>`;
    return;
  }
  
  const card = cards[currentIndex];
  const totalCards = cards.length;

  appContainer.innerHTML = `
    <div class="w-full max-w-2xl flex flex-col items-center gap-6">
      <div id="card-container" class="w-full max-w-md h-[500px] [perspective:1200px] cursor-pointer" role="button" tabindex="0">
        <div id="card-flipper" class="relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]">
          <div class="absolute w-full h-full [backface-visibility:hidden] rounded-2xl overflow-hidden border-4 border-gray-700 shadow-2xl shadow-yellow-500/20 bg-gray-800 flex flex-col">
            <div class="w-full h-64 overflow-hidden">
                <img src="${card.imageUrl}" alt="${card.animalName}" class="w-full h-full object-cover">
            </div>
            <div class="p-6 flex flex-col flex-grow text-center">
                <h2 class="text-3xl font-bold text-yellow-400">${card.animalName}</h2>
                <p class="text-gray-300 my-3 text-sm flex-grow">${card.genericDescription}</p>
                <div class="flex justify-center gap-2">
                    ${card.genericTraits.map(trait => `<span class="bg-gray-700 text-yellow-300 text-xs font-semibold px-3 py-1 rounded-full">${trait}</span>`).join('')}
                </div>
            </div>
          </div>
          <div class="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] rounded-2xl border-4 border-yellow-600 bg-gray-700 p-8 flex flex-col justify-center items-center text-center">
            <h3 class="text-xl font-semibold text-white">Embodied by:</h3>
            <p class="text-4xl font-bold text-yellow-300 my-4">${card.representative}</p>
            <div class="w-1/2 h-px bg-yellow-400/50 my-2"></div>
            <blockquote class="text-gray-200 mt-4 italic text-base">
              "${card.personalizedDescription}"
            </blockquote>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-between w-full max-w-md">
        <button id="prev-btn" class="px-6 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">&lt; Prev</button>
        <span class="text-lg font-semibold">${currentIndex + 1} / ${totalCards}</span>
        <button id="next-btn" class="px-6 py-3 bg-red-600 rounded-lg font-bold hover:bg-red-500 transition-colors disabled:bg-gray-500 disabled:cursor-not-allowed">Next &gt;</button>
      </div>
      <button id="shuffle-btn" class="px-8 py-3 bg-gray-600 rounded-lg font-bold hover:bg-gray-500 transition-colors">Shuffle Cards</button>
    </div>
  `;

  // Add event listeners after rendering
  attachEventListeners();
}

// --- EVENT HANDLING ---

function attachEventListeners() {
  const cardContainer = document.getElementById('card-container');
  if (cardContainer) {
    cardContainer.addEventListener('click', handleCardClick);
    cardContainer.addEventListener('keydown', (e) => (e.key === 'Enter' || e.key === ' ') && handleCardClick());
  }
  document.getElementById('prev-btn').addEventListener('click', handlePrevious);
  document.getElementById('next-btn').addEventListener('click', handleNext);
  document.getElementById('shuffle-btn').addEventListener('click', handleShuffle);
}

function handleCardClick() {
  isFlipped = !isFlipped;
  const flipper = document.getElementById('card-flipper');
  if (flipper) {
    flipper.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
  }
}

function handleNext() {
  if (isShuffling) return;
  if (isFlipped) {
    handleCardClick();
  }
  setTimeout(() => {
    currentIndex = (currentIndex + 1) % cards.length;
    renderCardViewer();
  }, 200);
}

function handlePrevious() {
  if (isShuffling) return;
  if (isFlipped) {
    handleCardClick();
  }
  setTimeout(() => {
    currentIndex = (currentIndex - 1 + cards.length) % cards.length;
    renderCardViewer();
  }, 200);
}

function handleShuffle() {
  if (isShuffling) return;
  isShuffling = true;
  
  // Add a shuffle animation class
  const cardViewer = document.querySelector('#app-container > div');
  if(cardViewer) cardViewer.style.transition = 'transform 0.5s ease';
  if(cardViewer) cardViewer.style.transform = 'scale(0.9) rotate(-5deg)';

  setTimeout(() => {
    for (let i = cards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    currentIndex = 0;
    if (isFlipped) {
        isFlipped = false; 
    }
    renderCardViewer();
    isShuffling = false;
    // Reset animation
    const newCardViewer = document.querySelector('#app-container > div');
    if(newCardViewer) newCardViewer.style.transform = 'scale(1) rotate(0deg)';
  }, 500);
}

// --- INITIALIZATION ---

async function init() {
  try {
    cards = await generateAnimalData();
    renderCardViewer();
  } catch (error) {
    console.error(error);
    appContainer.innerHTML = `
      <div class="bg-red-900/50 border-2 border-red-700 p-8 rounded-lg text-center">
        <h2 class="text-2xl font-bold text-red-400">An Error Occurred</h2>
        <p class="text-red-300 mt-2">${error.message}</p>
      </div>
    `;
  }
}

// Start the app
init();