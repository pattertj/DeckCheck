/*jshint esversion: 6 */
(function () {
  var app = angular.module('deckCheck', []);

  app.controller('DeckController', function () {
    this.cards = [];
  });

  app.controller("BulkController", function () {
    this.cards = {
      list: "4 Glint Hawk\r\n4 Kor Skyfisher"
    };


    this.addCardsBulk = function (deck) {
      //break apart the rows
      var cardArray = this.cards.list.split(/\r?\n/);

      // Clear out the Deck List
      deck.cards = [];

      // Map cardArray to cards
      cardArray.forEach(element => {
        // Declare a newCard
        var newCard = {
          count: 0,
          name: "",
          manaCost: ""
        };

        // Parse the Row
        newCard.count = element.substr(0, element.indexOf(' '));
        newCard.name = element.substr(element.indexOf(' ') + 1);

        // Card Lookup

        // Get the amount of Colorless Mana needed
        var manaCostColorless = parseInt(newCard.manaCost.replace(/^\D+/g, ''));

        // Calculate the Converted Mana Cost (CMC)
        if (isNaN(manaCostColorless))
          newCard.cmc = newCard.manaCost.length;
        else
          newCard.cmc = manaCostColorless + newCard.manaCost.length - 1;

        // Calculate the count of Pip's for each color
        newCard.W = (newCard.manaCost.match(/W/g) || []).length;
        newCard.U = (newCard.manaCost.match(/U/g) || []).length;
        newCard.B = (newCard.manaCost.match(/B/g) || []).length;
        newCard.R = (newCard.manaCost.match(/R/g) || []).length;
        newCard.G = (newCard.manaCost.match(/G/g) || []).length;

        // Add the card to the Deck 
        deck.cards.push(newCard);
      });
    };
  });

  app.controller("DeckCheckController", function () {
    this.card = {};

    this.deckCheck = function (deck) {
      var arrayLength = deck.cards.length;
      var cardCount = 0;

      // How many non-lands are in the deck?
      for (var i = 0; i < arrayLength; i++) {
        var cardToCount = deck.cards[i];
        cardCount += cardToCount.count;
      }

      // How many lands can there be?
      // NOTE: Only 60-card decks are currently supported.
      var lands = 60 - cardCount;

      // Check if a valid number of cards
      if (lands > 27 || lands < 20)
        alert("Invalid Land Count. Land total must be 20-27. Only 60-card decks are supported currently.");

      // Set max sources count for each color
      var wMaxSources = 0;
      var uMaxSources = 0;
      var bMaxSources = 0;
      var rMaxSources = 0;
      var gMaxSources = 0;

      // Loop through the cards to determine the max pip count for each color in the deck.
      for (var j = 0; j < arrayLength; j++) {
        var currentCard = deck.cards[j];

        // Calculate how many mana sources are needed of each color for a given card
        var wManaSources = manaSourcesNeeded(lands, currentCard.cmc, currentCard.W);
        var uManaSources = manaSourcesNeeded(lands, currentCard.cmc, currentCard.U);
        var bManaSources = manaSourcesNeeded(lands, currentCard.cmc, currentCard.B);
        var rManaSources = manaSourcesNeeded(lands, currentCard.cmc, currentCard.R);
        var gManaSources = manaSourcesNeeded(lands, currentCard.cmc, currentCard.G);

        // Determine the max mana sources needed for each color after each card
        wMaxSources = Math.max(wMaxSources, wManaSources);
        uMaxSources = Math.max(uMaxSources, uManaSources);
        bMaxSources = Math.max(bMaxSources, bManaSources);
        rMaxSources = Math.max(rMaxSources, rManaSources);
        gMaxSources = Math.max(gMaxSources, gManaSources);
      }

      console.log(wMaxSources + " White Sources Needed");
      console.log(uMaxSources + " Blue Sources Needed");
      console.log(bMaxSources + " Black Sources Needed");
      console.log(rMaxSources + " Red Sources Needed");
      console.log(gMaxSources + " Green Sources Needed");
      console.log("In " + lands + " Land Slots");
    };

    function manaSourcesNeeded(land, turn, pips) {
      var result = [];

      if (pips === 1) {
        result = onePipChart.filter(function (entry) {
          return entry.lands === land && entry.turn === turn;
        }) || [];
      }
      if (pips === 2) {
        result = twoPipChart.filter(function (entry) {
          return entry.lands === land && entry.turn === turn;
        }) || [];
      }
      if (pips === 3) {
        result = threePipChart.filter(function (entry) {
          return entry.lands === land && entry.turn === turn;
        }) || [];
      }

      if (result.length === 0)
        return 0;
      else
        return result[0].sources;
    }

    var onePipChart = [{
        lands: 20,
        turn: 1,
        sources: 12
      }, {
        lands: 20,
        turn: 2,
        sources: 12
      }, {
        lands: 20,
        turn: 3,
        sources: 11
      }, {
        lands: 20,
        turn: 4,
        sources: 10
      }, {
        lands: 20,
        turn: 5,
        sources: 9
      }, {
        lands: 20,
        turn: 6,
        sources: 9
      }, {
        lands: 20,
        turn: 7,
        sources: 8
      },
      {
        lands: 21,
        turn: 1,
        sources: 13
      }, {
        lands: 21,
        turn: 2,
        sources: 12
      }, {
        lands: 21,
        turn: 3,
        sources: 11
      }, {
        lands: 21,
        turn: 4,
        sources: 10
      }, {
        lands: 21,
        turn: 5,
        sources: 10
      }, {
        lands: 21,
        turn: 6,
        sources: 9
      }, {
        lands: 21,
        turn: 7,
        sources: 8
      },
      {
        lands: 22,
        turn: 1,
        sources: 13
      }, {
        lands: 22,
        turn: 2,
        sources: 12
      }, {
        lands: 22,
        turn: 3,
        sources: 11
      }, {
        lands: 22,
        turn: 4,
        sources: 10
      }, {
        lands: 22,
        turn: 5,
        sources: 10
      }, {
        lands: 22,
        turn: 6,
        sources: 9
      }, {
        lands: 22,
        turn: 7,
        sources: 8
      },
      {
        lands: 23,
        turn: 1,
        sources: 13
      }, {
        lands: 23,
        turn: 2,
        sources: 12
      }, {
        lands: 23,
        turn: 3,
        sources: 12
      }, {
        lands: 23,
        turn: 4,
        sources: 11
      }, {
        lands: 23,
        turn: 5,
        sources: 10
      }, {
        lands: 23,
        turn: 6,
        sources: 9
      }, {
        lands: 23,
        turn: 7,
        sources: 9
      },
      {
        lands: 24,
        turn: 1,
        sources: 14
      }, {
        lands: 24,
        turn: 2,
        sources: 13
      }, {
        lands: 24,
        turn: 3,
        sources: 12
      }, {
        lands: 24,
        turn: 4,
        sources: 11
      }, {
        lands: 24,
        turn: 5,
        sources: 10
      }, {
        lands: 24,
        turn: 6,
        sources: 9
      }, {
        lands: 24,
        turn: 7,
        sources: 9
      },
      {
        lands: 25,
        turn: 1,
        sources: 14
      }, {
        lands: 25,
        turn: 2,
        sources: 13
      }, {
        lands: 25,
        turn: 3,
        sources: 12
      }, {
        lands: 25,
        turn: 4,
        sources: 11
      }, {
        lands: 25,
        turn: 5,
        sources: 10
      }, {
        lands: 25,
        turn: 6,
        sources: 10
      }, {
        lands: 25,
        turn: 7,
        sources: 9
      },
      {
        lands: 26,
        turn: 1,
        sources: 15
      }, {
        lands: 26,
        turn: 2,
        sources: 13
      }, {
        lands: 26,
        turn: 3,
        sources: 12
      }, {
        lands: 26,
        turn: 4,
        sources: 11
      }, {
        lands: 26,
        turn: 5,
        sources: 10
      }, {
        lands: 26,
        turn: 6,
        sources: 10
      }, {
        lands: 26,
        turn: 7,
        sources: 9
      },
      {
        lands: 27,
        turn: 1,
        sources: 15
      }, {
        lands: 27,
        turn: 2,
        sources: 14
      }, {
        lands: 27,
        turn: 3,
        sources: 12
      }, {
        lands: 27,
        turn: 4,
        sources: 11
      }, {
        lands: 27,
        turn: 5,
        sources: 10
      }, {
        lands: 27,
        turn: 6,
        sources: 10
      }, {
        lands: 27,
        turn: 7,
        sources: 9
      }
    ];

    var twoPipChart = [{
        lands: 20,
        turn: 2,
        sources: 18
      }, {
        lands: 20,
        turn: 3,
        sources: 17
      }, {
        lands: 20,
        turn: 4,
        sources: 16
      }, {
        lands: 20,
        turn: 5,
        sources: 15
      }, {
        lands: 20,
        turn: 6,
        sources: 14
      }, {
        lands: 20,
        turn: 7,
        sources: 14
      },
      {
        lands: 21,
        turn: 2,
        sources: 18
      }, {
        lands: 21,
        turn: 3,
        sources: 17
      }, {
        lands: 21,
        turn: 4,
        sources: 16
      }, {
        lands: 21,
        turn: 5,
        sources: 16
      }, {
        lands: 21,
        turn: 6,
        sources: 15
      }, {
        lands: 21,
        turn: 7,
        sources: 14
      },
      {
        lands: 22,
        turn: 2,
        sources: 19
      }, {
        lands: 22,
        turn: 3,
        sources: 18
      }, {
        lands: 22,
        turn: 4,
        sources: 17
      }, {
        lands: 22,
        turn: 5,
        sources: 16
      }, {
        lands: 22,
        turn: 6,
        sources: 15
      }, {
        lands: 22,
        turn: 7,
        sources: 14
      },
      {
        lands: 23,
        turn: 2,
        sources: 20
      }, {
        lands: 23,
        turn: 3,
        sources: 18
      }, {
        lands: 23,
        turn: 4,
        sources: 17
      }, {
        lands: 23,
        turn: 5,
        sources: 16
      }, {
        lands: 23,
        turn: 6,
        sources: 15
      }, {
        lands: 23,
        turn: 7,
        sources: 14
      },
      {
        lands: 24,
        turn: 2,
        sources: 20
      }, {
        lands: 24,
        turn: 3,
        sources: 19
      }, {
        lands: 24,
        turn: 4,
        sources: 18
      }, {
        lands: 24,
        turn: 5,
        sources: 16
      }, {
        lands: 24,
        turn: 6,
        sources: 15
      }, {
        lands: 24,
        turn: 7,
        sources: 14
      },
      {
        lands: 25,
        turn: 2,
        sources: 21
      }, {
        lands: 25,
        turn: 3,
        sources: 19
      }, {
        lands: 25,
        turn: 4,
        sources: 18
      }, {
        lands: 25,
        turn: 5,
        sources: 17
      }, {
        lands: 25,
        turn: 6,
        sources: 16
      }, {
        lands: 25,
        turn: 7,
        sources: 15
      },
      {
        lands: 26,
        turn: 2,
        sources: 21
      }, {
        lands: 26,
        turn: 3,
        sources: 20
      }, {
        lands: 26,
        turn: 4,
        sources: 18
      }, {
        lands: 26,
        turn: 5,
        sources: 17
      }, {
        lands: 26,
        turn: 6,
        sources: 16
      }, {
        lands: 26,
        turn: 7,
        sources: 15
      },
      {
        lands: 27,
        turn: 2,
        sources: 22
      }, {
        lands: 27,
        turn: 3,
        sources: 20
      }, {
        lands: 27,
        turn: 4,
        sources: 18
      }, {
        lands: 27,
        turn: 5,
        sources: 17
      }, {
        lands: 27,
        turn: 6,
        sources: 16
      }, {
        lands: 27,
        turn: 7,
        sources: 15
      }
    ];

    var threePipChart = [{
        lands: 20,
        turn: 3,
        sources: 19
      }, {
        lands: 20,
        turn: 4,
        sources: 19
      }, {
        lands: 20,
        turn: 5,
        sources: 18
      }, {
        lands: 20,
        turn: 6,
        sources: 18
      }, {
        lands: 20,
        turn: 7,
        sources: 17
      },
      {
        lands: 21,
        turn: 3,
        sources: 20
      }, {
        lands: 21,
        turn: 4,
        sources: 20
      }, {
        lands: 21,
        turn: 5,
        sources: 19
      }, {
        lands: 21,
        turn: 6,
        sources: 18
      }, {
        lands: 21,
        turn: 7,
        sources: 18
      },
      {
        lands: 22,
        turn: 3,
        sources: 21
      }, {
        lands: 22,
        turn: 4,
        sources: 20
      }, {
        lands: 22,
        turn: 5,
        sources: 20
      }, {
        lands: 22,
        turn: 6,
        sources: 19
      }, {
        lands: 22,
        turn: 7,
        sources: 18
      },
      {
        lands: 23,
        turn: 3,
        sources: 22
      }, {
        lands: 23,
        turn: 4,
        sources: 21
      }, {
        lands: 23,
        turn: 5,
        sources: 20
      }, {
        lands: 23,
        turn: 6,
        sources: 20
      }, {
        lands: 23,
        turn: 7,
        sources: 19
      },
      {
        lands: 24,
        turn: 3,
        sources: 22
      }, {
        lands: 24,
        turn: 4,
        sources: 22
      }, {
        lands: 24,
        turn: 5,
        sources: 21
      }, {
        lands: 24,
        turn: 6,
        sources: 20
      }, {
        lands: 24,
        turn: 7,
        sources: 19
      },
      {
        lands: 25,
        turn: 3,
        sources: 23
      }, {
        lands: 25,
        turn: 4,
        sources: 22
      }, {
        lands: 25,
        turn: 5,
        sources: 21
      }, {
        lands: 25,
        turn: 6,
        sources: 20
      }, {
        lands: 25,
        turn: 7,
        sources: 19
      },
      {
        lands: 26,
        turn: 3,
        sources: 23
      }, {
        lands: 26,
        turn: 4,
        sources: 22
      }, {
        lands: 26,
        turn: 5,
        sources: 21
      }, {
        lands: 26,
        turn: 6,
        sources: 20
      }, {
        lands: 26,
        turn: 7,
        sources: 20
      },
      {
        lands: 27,
        turn: 3,
        sources: 24
      }, {
        lands: 27,
        turn: 4,
        sources: 23
      }, {
        lands: 27,
        turn: 5,
        sources: 22
      }, {
        lands: 27,
        turn: 6,
        sources: 21
      }, {
        lands: 27,
        turn: 7,
        sources: 20
      }
    ];
  });

  var cardList = [{
      name: 'Thraben Inspector',
      manaCost: "W",
      count: 4,
      cmc: 1,
      W: 1,
      U: 0,
      B: 0,
      R: 0,
      G: 0
    },
    {
      name: 'Glint Hawk',
      manaCost: "W",
      count: 4,
      cmc: 1,
      W: 1,
      U: 0,
      B: 0,
      R: 0,
      G: 0
    },
    {
      name: 'Palace Sentinels',
      manaCost: "3W",
      count: 3,
      cmc: 4,
      W: 1,
      U: 0,
      B: 0,
      R: 0,
      G: 0
    },
    {
      name: 'Electrickery',
      manaCost: "R",
      count: 1,
      cmc: 1,
      W: 0,
      U: 0,
      B: 0,
      R: 1,
      G: 0
    },
    {
      name: 'Galvanic Blast',
      manaCost: "R",
      count: 4,
      cmc: 1,
      W: 0,
      U: 0,
      B: 0,
      R: 1,
      G: 0
    },
    {
      name: 'Lightning Bolt',
      manaCost: "R",
      count: 4,
      cmc: 1,
      W: 0,
      U: 0,
      B: 0,
      R: 1,
      G: 0
    },
    {
      name: 'Prismatic Strands',
      manaCost: "2W",
      count: 4,
      cmc: 3,
      W: 1,
      U: 0,
      B: 0,
      R: 0,
      G: 0
    },
    {
      name: 'Battle Screech',
      manaCost: "2WW",
      count: 4,
      cmc: 4,
      W: 2,
      U: 0,
      B: 0,
      R: 0,
      G: 0
    },
    {
      name: 'Alchemists Vial',
      manaCost: "2",
      count: 3,
      cmc: 2,
      W: 0,
      U: 0,
      B: 0,
      R: 0,
      G: 0
    },
    {
      name: 'Prophetic Prism',
      manaCost: "2",
      count: 4,
      cmc: 2,
      W: 0,
      U: 0,
      B: 0,
      R: 0,
      G: 0
    },
    {
      name: 'Journey to Nowhere',
      manaCost: "1W",
      count: 3,
      cmc: 2,
      W: 1,
      U: 0,
      B: 0,
      R: 0,
      G: 0
    }
  ];
})();