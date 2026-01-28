// Mock data for Skyswipe

const Data = {
  cities: [
    {
      id: 'barcelona',
      name: 'Barcelona',
      country: 'Spain',
      tags: ['Vibrant', 'Beachside'],
      flightPrice: 45,
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=1200&fit=crop',
      description: 'A Mediterranean gem where Gothic architecture meets golden beaches. Stroll down Las Ramblas, marvel at Gaudí\'s masterpieces, and end the day with tapas by the sea.',
      neighbourhoods: ['gothic-quarter', 'barceloneta', 'gracia']
    },
    {
      id: 'lisbon',
      name: 'Lisbon',
      country: 'Portugal',
      tags: ['Historic', 'Foodie'],
      flightPrice: 38,
      image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&h=1200&fit=crop',
      description: 'Seven hills of pastel-coloured buildings, vintage trams, and the best custard tarts you\'ll ever taste. Lisbon is effortlessly cool with a soulful fado soundtrack.',
      neighbourhoods: ['alfama', 'bairro-alto', 'belem']
    },
    {
      id: 'tokyo',
      name: 'Tokyo',
      country: 'Japan',
      tags: ['Futuristic', 'Cultural'],
      flightPrice: 520,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=1200&fit=crop',
      description: 'Where ancient temples sit beneath neon skyscrapers. Tokyo is a sensory overload of incredible food, cutting-edge fashion, and centuries of tradition.',
      neighbourhoods: ['shibuya', 'shinjuku', 'asakusa']
    },
    {
      id: 'new-york',
      name: 'New York',
      country: 'USA',
      tags: ['Iconic', 'Nightlife'],
      flightPrice: 380,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&h=1200&fit=crop',
      description: 'The city that never sleeps. From Broadway shows to Brooklyn brownstones, NYC offers unmatched energy, world-class museums, and pizza at 3am.',
      neighbourhoods: ['manhattan-midtown', 'brooklyn-williamsburg', 'soho']
    },
    {
      id: 'marrakech',
      name: 'Marrakech',
      country: 'Morocco',
      tags: ['Exotic', 'Markets'],
      flightPrice: 85,
      image: 'https://images.unsplash.com/photo-1597212618440-806262de4f6b?w=800&h=1200&fit=crop',
      description: 'Lose yourself in the maze-like medina, haggle in vibrant souks, and find peace in hidden riads. Marrakech is a feast for all the senses.',
      neighbourhoods: ['medina', 'gueliz', 'palmeraie']
    },
    {
      id: 'amsterdam',
      name: 'Amsterdam',
      country: 'Netherlands',
      tags: ['Canals', 'Artsy'],
      flightPrice: 62,
      image: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&h=1200&fit=crop',
      description: 'Cycle along picturesque canals, discover Van Gogh and Rembrandt, and embrace the city\'s famously liberal spirit. Cosy cafés and world-class culture await.',
      neighbourhoods: ['jordaan', 'de-pijp', 'centrum']
    },
    {
      id: 'cape-town',
      name: 'Cape Town',
      country: 'South Africa',
      tags: ['Adventure', 'Scenic'],
      flightPrice: 450,
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=1200&fit=crop',
      description: 'Where Table Mountain meets the Atlantic. Hike dramatic peaks, explore world-renowned vineyards, and experience one of the world\'s most beautiful coastlines.',
      neighbourhoods: ['city-bowl', 'camps-bay', 'woodstock']
    },
    {
      id: 'reykjavik',
      name: 'Reykjavik',
      country: 'Iceland',
      tags: ['Wilderness', 'Unique'],
      flightPrice: 120,
      image: 'https://images.unsplash.com/photo-1504829857797-ddff29c27927?w=800&h=1200&fit=crop',
      description: 'Gateway to fire and ice. Chase Northern Lights, soak in geothermal pools, and explore otherworldly landscapes. Reykjavik punches well above its size.',
      neighbourhoods: ['downtown', 'old-harbour', 'laugardalur']
    }
  ],

  neighbourhoods: [
    // Barcelona
    {
      id: 'gothic-quarter',
      cityId: 'barcelona',
      name: 'Gothic Quarter',
      tags: ['Historic', 'Atmospheric'],
      avgPrice: 95,
      image: 'https://images.unsplash.com/photo-1579282240050-352db0a14c21?w=800&h=1200&fit=crop',
      description: 'Narrow medieval streets, Roman ruins, and hidden plazas. The heart of old Barcelona.',
      properties: ['hotel-colon', 'do-placa-reial']
    },
    {
      id: 'barceloneta',
      cityId: 'barcelona',
      name: 'Barceloneta',
      tags: ['Beach', 'Lively'],
      avgPrice: 120,
      image: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&h=1200&fit=crop',
      description: 'Sun, sand, and seafood. The city\'s beloved beach neighbourhood.',
      properties: ['w-barcelona', 'hotel-arts']
    },
    {
      id: 'gracia',
      cityId: 'barcelona',
      name: 'Gràcia',
      tags: ['Bohemian', 'Local'],
      avgPrice: 80,
      image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&h=1200&fit=crop',
      description: 'Village vibes with independent shops, bars, and Plaza del Sol\'s buzzing terraces.',
      properties: ['casa-fuster', 'generator-barcelona']
    },

    // Lisbon
    {
      id: 'alfama',
      cityId: 'lisbon',
      name: 'Alfama',
      tags: ['Traditional', 'Fado'],
      avgPrice: 75,
      image: 'https://images.unsplash.com/photo-1548707309-dcebeab9ea9b?w=800&h=1200&fit=crop',
      description: 'Lisbon\'s oldest district. Winding alleys, azulejo tiles, and the soul of fado.',
      properties: ['memmo-alfama', 'santiago-alfama']
    },
    {
      id: 'bairro-alto',
      cityId: 'lisbon',
      name: 'Bairro Alto',
      tags: ['Nightlife', 'Artsy'],
      avgPrice: 90,
      image: 'https://images.unsplash.com/photo-1580323956656-26bbb7b4c7c9?w=800&h=1200&fit=crop',
      description: 'By day, artsy and quiet. By night, Lisbon\'s legendary party district.',
      properties: ['bairro-alto-hotel', 'the-lumiares']
    },
    {
      id: 'belem',
      cityId: 'lisbon',
      name: 'Belém',
      tags: ['Historic', 'Riverside'],
      avgPrice: 110,
      image: 'https://images.unsplash.com/photo-1513735492284-ecf18a7d1d6e?w=800&h=1200&fit=crop',
      description: 'Maritime history, custard tarts, and the iconic Tower of Belém.',
      properties: ['altis-belem', 'palacio-belem']
    },

    // Tokyo
    {
      id: 'shibuya',
      cityId: 'tokyo',
      name: 'Shibuya',
      tags: ['Trendy', 'Youth'],
      avgPrice: 180,
      image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=800&h=1200&fit=crop',
      description: 'The famous crossing, fashion-forward shopping, and Tokyo\'s youthful energy.',
      properties: ['shibuya-stream', 'trunk-hotel']
    },
    {
      id: 'shinjuku',
      cityId: 'tokyo',
      name: 'Shinjuku',
      tags: ['Neon', 'Entertainment'],
      avgPrice: 160,
      image: 'https://images.unsplash.com/photo-1554797589-7241bb691973?w=800&h=1200&fit=crop',
      description: 'Dazzling neon, karaoke bars, and the serene Shinjuku Gyoen gardens.',
      properties: ['park-hyatt-tokyo', 'hotel-gracery']
    },
    {
      id: 'asakusa',
      cityId: 'tokyo',
      name: 'Asakusa',
      tags: ['Traditional', 'Temple'],
      avgPrice: 120,
      image: 'https://images.unsplash.com/photo-1583416750470-965b2707b355?w=800&h=1200&fit=crop',
      description: 'Old Tokyo charm with Senso-ji temple and traditional craft shops.',
      properties: ['gate-hotel-asakusa', 'wired-hotel']
    },

    // New York
    {
      id: 'manhattan-midtown',
      cityId: 'new-york',
      name: 'Midtown Manhattan',
      tags: ['Iconic', 'Central'],
      avgPrice: 280,
      image: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=800&h=1200&fit=crop',
      description: 'Times Square, Empire State, Broadway. The New York of your dreams.',
      properties: ['the-peninsula', 'arlo-midtown']
    },
    {
      id: 'brooklyn-williamsburg',
      cityId: 'new-york',
      name: 'Williamsburg',
      tags: ['Hip', 'Creative'],
      avgPrice: 200,
      image: 'https://images.unsplash.com/photo-1541336032412-2048a678540d?w=800&h=1200&fit=crop',
      description: 'Brooklyn\'s hipster heartland. Craft coffee, vintage shops, and skyline views.',
      properties: ['wythe-hotel', 'the-williamsburg-hotel']
    },
    {
      id: 'soho',
      cityId: 'new-york',
      name: 'SoHo',
      tags: ['Shopping', 'Cast-Iron'],
      avgPrice: 350,
      image: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&h=1200&fit=crop',
      description: 'Designer boutiques in historic cast-iron buildings. Fashion heaven.',
      properties: ['the-mercer', 'crosby-street-hotel']
    },

    // Marrakech
    {
      id: 'medina',
      cityId: 'marrakech',
      name: 'Medina',
      tags: ['Authentic', 'Bustling'],
      avgPrice: 60,
      image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?w=800&h=1200&fit=crop',
      description: 'The ancient walled city. Souks, snake charmers, and sensory overload.',
      properties: ['riad-yasmine', 'el-fenn']
    },
    {
      id: 'gueliz',
      cityId: 'marrakech',
      name: 'Gueliz',
      tags: ['Modern', 'Galleries'],
      avgPrice: 85,
      image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=1200&fit=crop',
      description: 'The new town. European cafés, art galleries, and boutique shopping.',
      properties: ['hotel-& spa', 'radisson-blu']
    },

    // Amsterdam
    {
      id: 'jordaan',
      cityId: 'amsterdam',
      name: 'Jordaan',
      tags: ['Charming', 'Cafés'],
      avgPrice: 140,
      image: 'https://images.unsplash.com/photo-1576924542622-772281b13aa8?w=800&h=1200&fit=crop',
      description: 'Postcard-perfect canals, cosy brown cafés, and the Anne Frank House.',
      properties: ['the-dylan', 'mr-jordaan']
    },
    {
      id: 'de-pijp',
      cityId: 'amsterdam',
      name: 'De Pijp',
      tags: ['Multicultural', 'Markets'],
      avgPrice: 110,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=1200&fit=crop',
      description: 'Albert Cuyp market, diverse eateries, and local neighbourhood vibes.',
      properties: ['hotel-v-nesplein', 'sir-albert']
    },

    // Cape Town
    {
      id: 'city-bowl',
      cityId: 'cape-town',
      name: 'City Bowl',
      tags: ['Urban', 'Mountain Views'],
      avgPrice: 95,
      image: 'https://images.unsplash.com/photo-1576485375217-d6a95e34d043?w=800&h=1200&fit=crop',
      description: 'Central Cape Town cradled by Table Mountain. Culture, food, and easy access.',
      properties: ['belmond-mount-nelson', 'the-silo-hotel']
    },
    {
      id: 'camps-bay',
      cityId: 'cape-town',
      name: 'Camps Bay',
      tags: ['Beach', 'Upscale'],
      avgPrice: 180,
      image: 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=800&h=1200&fit=crop',
      description: 'Palm-lined beach, sunset cocktails, and the Twelve Apostles as backdrop.',
      properties: ['the-bay-hotel', 'pod-camps-bay']
    },

    // Reykjavik
    {
      id: 'downtown',
      cityId: 'reykjavik',
      name: 'Downtown',
      tags: ['Colourful', 'Walkable'],
      avgPrice: 160,
      image: 'https://images.unsplash.com/photo-1529963183134-61a90db47eaf?w=800&h=1200&fit=crop',
      description: 'Hallgrímskirkja church, rainbow streets, and cosy Nordic design.',
      properties: ['canopy-reykjavik', 'hotel-borg']
    },
    {
      id: 'old-harbour',
      cityId: 'reykjavik',
      name: 'Old Harbour',
      tags: ['Maritime', 'Restaurants'],
      avgPrice: 180,
      image: 'https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800&h=1200&fit=crop',
      description: 'Fresh seafood, whale watching tours, and harbourside charm.',
      properties: ['reykjavik-marina', 'tower-suites']
    }
  ],

  properties: [
    // Barcelona Gothic Quarter
    {
      id: 'hotel-colon',
      neighbourhoodId: 'gothic-quarter',
      cityId: 'barcelona',
      name: 'Hotel Colón Barcelona',
      rating: 4.5,
      pricePerNight: 145,
      highlight: 'Cathedral views from rooftop terrace',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1200&fit=crop',
      description: 'Historic hotel facing the cathedral with classic elegance and a legendary rooftop.'
    },
    {
      id: 'do-placa-reial',
      neighbourhoodId: 'gothic-quarter',
      cityId: 'barcelona',
      name: 'DO Plaça Reial',
      rating: 4.7,
      pricePerNight: 220,
      highlight: 'On Barcelona\'s most beautiful square',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=1200&fit=crop',
      description: 'Boutique luxury on iconic Plaça Reial with Michelin-starred dining.'
    },

    // Barcelona Barceloneta
    {
      id: 'w-barcelona',
      neighbourhoodId: 'barceloneta',
      cityId: 'barcelona',
      name: 'W Barcelona',
      rating: 4.6,
      pricePerNight: 280,
      highlight: 'Iconic sail-shaped tower on the beach',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=1200&fit=crop',
      description: 'Barcelona\'s beachfront landmark with infinity pool and Mediterranean views.'
    },
    {
      id: 'hotel-arts',
      neighbourhoodId: 'barceloneta',
      cityId: 'barcelona',
      name: 'Hotel Arts Barcelona',
      rating: 4.8,
      pricePerNight: 350,
      highlight: 'Two Michelin-starred restaurants',
      image: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&h=1200&fit=crop',
      description: 'Contemporary luxury tower with stunning sea views and world-class dining.'
    },

    // Barcelona Gràcia
    {
      id: 'casa-fuster',
      neighbourhoodId: 'gracia',
      cityId: 'barcelona',
      name: 'Casa Fuster',
      rating: 4.6,
      pricePerNight: 180,
      highlight: 'Stunning modernist architecture',
      image: 'https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&h=1200&fit=crop',
      description: 'Domènech i Montaner\'s masterpiece with rooftop pool and jazz bar.'
    },

    // Lisbon Alfama
    {
      id: 'memmo-alfama',
      neighbourhoodId: 'alfama',
      cityId: 'lisbon',
      name: 'Memmo Alfama',
      rating: 4.7,
      pricePerNight: 160,
      highlight: 'Panoramic terrace with river views',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&h=1200&fit=crop',
      description: 'Design hotel carved into Alfama\'s hillside with stunning Tagus views.'
    },
    {
      id: 'santiago-alfama',
      neighbourhoodId: 'alfama',
      cityId: 'lisbon',
      name: 'Santiago de Alfama',
      rating: 4.8,
      pricePerNight: 220,
      highlight: 'Former palace with 15th-century charm',
      image: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800&h=1200&fit=crop',
      description: 'Boutique hotel in a restored palace where history meets contemporary luxury.'
    },

    // Lisbon Bairro Alto
    {
      id: 'bairro-alto-hotel',
      neighbourhoodId: 'bairro-alto',
      cityId: 'lisbon',
      name: 'Bairro Alto Hotel',
      rating: 4.6,
      pricePerNight: 190,
      highlight: 'Rooftop bar with 360° city views',
      image: 'https://images.unsplash.com/photo-1587213811864-46e59f6873b1?w=800&h=1200&fit=crop',
      description: 'Elegant townhouse hotel at the heart of Lisbon\'s creative quarter.'
    },

    // Tokyo Shibuya
    {
      id: 'shibuya-stream',
      neighbourhoodId: 'shibuya',
      cityId: 'tokyo',
      name: 'Shibuya Stream Excel',
      rating: 4.5,
      pricePerNight: 220,
      highlight: 'Steps from the famous crossing',
      image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=800&h=1200&fit=crop',
      description: 'Modern hotel directly connected to Shibuya Station with crossing views.'
    },
    {
      id: 'trunk-hotel',
      neighbourhoodId: 'shibuya',
      cityId: 'tokyo',
      name: 'TRUNK(HOTEL)',
      rating: 4.7,
      pricePerNight: 280,
      highlight: 'Socialising-focused concept hotel',
      image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800&h=1200&fit=crop',
      description: 'Boutique hotel championing local community and sustainable luxury.'
    },

    // Tokyo Shinjuku
    {
      id: 'park-hyatt-tokyo',
      neighbourhoodId: 'shinjuku',
      cityId: 'tokyo',
      name: 'Park Hyatt Tokyo',
      rating: 4.9,
      pricePerNight: 450,
      highlight: 'Lost in Translation views from New York Bar',
      image: 'https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800&h=1200&fit=crop',
      description: 'Legendary luxury atop Shinjuku with Tokyo\'s most iconic bar.'
    },

    // New York Midtown
    {
      id: 'the-peninsula',
      neighbourhoodId: 'manhattan-midtown',
      cityId: 'new-york',
      name: 'The Peninsula New York',
      rating: 4.8,
      pricePerNight: 550,
      highlight: 'Rooftop bar overlooking Fifth Avenue',
      image: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=800&h=1200&fit=crop',
      description: 'Beaux-Arts landmark with legendary service and prime Fifth Avenue location.'
    },
    {
      id: 'arlo-midtown',
      neighbourhoodId: 'manhattan-midtown',
      cityId: 'new-york',
      name: 'Arlo Midtown',
      rating: 4.3,
      pricePerNight: 180,
      highlight: 'Rooftop with Empire State views',
      image: 'https://images.unsplash.com/photo-1560347876-aeef00ee58a1?w=800&h=1200&fit=crop',
      description: 'Smart micro-hotel with surprisingly generous spaces and buzzing rooftop.'
    },

    // New York Williamsburg
    {
      id: 'wythe-hotel',
      neighbourhoodId: 'brooklyn-williamsburg',
      cityId: 'new-york',
      name: 'Wythe Hotel',
      rating: 4.5,
      pricePerNight: 280,
      highlight: 'Converted factory with Manhattan views',
      image: 'https://images.unsplash.com/photo-1559599238-308793637427?w=800&h=1200&fit=crop',
      description: '1901 factory turned Brooklyn icon with raw industrial character.'
    },

    // Marrakech Medina
    {
      id: 'riad-yasmine',
      neighbourhoodId: 'medina',
      cityId: 'marrakech',
      name: 'Riad Yasmine',
      rating: 4.9,
      pricePerNight: 85,
      highlight: 'Instagram-famous swimming pool',
      image: 'https://images.unsplash.com/photo-1570213489059-0aac6626cade?w=800&h=1200&fit=crop',
      description: 'Boutique riad with the most photographed pool in Marrakech.'
    },
    {
      id: 'el-fenn',
      neighbourhoodId: 'medina',
      cityId: 'marrakech',
      name: 'El Fenn',
      rating: 4.8,
      pricePerNight: 180,
      highlight: 'Vanessa Branson\'s artistic retreat',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1200&fit=crop',
      description: 'Three riads combined into an art-filled oasis with rooftop views.'
    },

    // Amsterdam Jordaan
    {
      id: 'the-dylan',
      neighbourhoodId: 'jordaan',
      cityId: 'amsterdam',
      name: 'The Dylan Amsterdam',
      rating: 4.7,
      pricePerNight: 320,
      highlight: 'Michelin-starred Vinkeles restaurant',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=1200&fit=crop',
      description: '17th-century canal house reimagined as intimate luxury retreat.'
    },
    {
      id: 'mr-jordaan',
      neighbourhoodId: 'jordaan',
      cityId: 'amsterdam',
      name: 'Mr. Jordaan',
      rating: 4.4,
      pricePerNight: 140,
      highlight: 'Canal views and local neighbourhood feel',
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=1200&fit=crop',
      description: 'Boutique hotel blending into the Jordaan\'s charming streetscape.'
    },

    // Cape Town City Bowl
    {
      id: 'the-silo-hotel',
      neighbourhoodId: 'city-bowl',
      cityId: 'cape-town',
      name: 'The Silo Hotel',
      rating: 4.9,
      pricePerNight: 650,
      highlight: 'Converted grain silo with pillowed windows',
      image: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=800&h=1200&fit=crop',
      description: 'Cape Town\'s most extraordinary hotel atop the Zeitz MOCAA museum.'
    },
    {
      id: 'belmond-mount-nelson',
      neighbourhoodId: 'city-bowl',
      cityId: 'cape-town',
      name: 'Belmond Mount Nelson',
      rating: 4.7,
      pricePerNight: 280,
      highlight: 'Legendary afternoon tea in the gardens',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1200&fit=crop',
      description: 'The "Pink Lady" - Cape Town\'s grand dame since 1899.'
    },

    // Cape Town Camps Bay
    {
      id: 'the-bay-hotel',
      neighbourhoodId: 'camps-bay',
      cityId: 'cape-town',
      name: 'The Bay Hotel',
      rating: 4.5,
      pricePerNight: 220,
      highlight: 'Four pools cascading to the beach',
      image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=1200&fit=crop',
      description: 'Beachfront luxury with Atlantic views and legendary sunsets.'
    },

    // Reykjavik Downtown
    {
      id: 'canopy-reykjavik',
      neighbourhoodId: 'downtown',
      cityId: 'reykjavik',
      name: 'Canopy by Hilton Reykjavik',
      rating: 4.4,
      pricePerNight: 180,
      highlight: 'Local neighbourhood immersion experience',
      image: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&h=1200&fit=crop',
      description: 'Design-forward hotel celebrating Icelandic culture and craft.'
    },
    {
      id: 'hotel-borg',
      neighbourhoodId: 'downtown',
      cityId: 'reykjavik',
      name: 'Hotel Borg',
      rating: 4.6,
      pricePerNight: 250,
      highlight: 'Art Deco landmark on the main square',
      image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=1200&fit=crop',
      description: 'Iceland\'s first luxury hotel, restored to 1930s glamour.'
    },

    // Reykjavik Old Harbour
    {
      id: 'reykjavik-marina',
      neighbourhoodId: 'old-harbour',
      cityId: 'reykjavik',
      name: 'Reykjavik Marina Residence',
      rating: 4.3,
      pricePerNight: 160,
      highlight: 'Harbour views and maritime character',
      image: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&h=1200&fit=crop',
      description: 'Industrial-chic hotel in converted warehouse with Slippbarinn bar.'
    }
  ],

  // Helper methods
  getCityById(id) {
    return this.cities.find(c => c.id === id);
  },

  getNeighbourhoodById(id) {
    return this.neighbourhoods.find(n => n.id === id);
  },

  getPropertyById(id) {
    return this.properties.find(p => p.id === id);
  },

  getNeighbourhoodsByCity(cityId) {
    return this.neighbourhoods.filter(n => n.cityId === cityId);
  },

  getPropertiesByNeighbourhood(neighbourhoodId) {
    return this.properties.filter(p => p.neighbourhoodId === neighbourhoodId);
  },

  getPropertiesByCity(cityId) {
    return this.properties.filter(p => p.cityId === cityId);
  }
};

// Export for use in other modules
window.Data = Data;
