angular.module('deckController', [])

	// inject the Cards service factory into our controller
	.controller('mainController', ['$scope', '$http', 'Cards', function ($scope, $http, Cards) {
		$scope.deckList = {
			text: "4 Glint Hawk\r\n4 Kor Skyfisher\r\n3 Palace Sentinels\r\n4 Thraben Inspector\r\n2 Battle Screech\r\n1 Electrickery\r\n4 Galvanic Blast\r\n4 Lightning Bolt\r\n3 Prismatic Strands\r\n3 Alchemist's Vial\r\n4 Prophetic Prism\r\n3 Journey to Nowhere"
		};
		$scope.cardList = [];
		$scope.manaAnalysis = {
			whiteSources: 0,
			blueSources: 0,
			blackSources: 0,
			redSources: 0,
			greenSources: 0,
			totalLands: 0
		};

		$scope.processDeckList = function () {

			// validate the deckList to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.deckList.text != undefined) {
				var card = {};
				$scope.cardList = [];

				// Get the list of Cards
				var cardArray = $scope.deckList.text.split(/\r?\n/);

				//Iterate on the cards
				processCards(cardArray, function () {
					deckCheck();
				});

			} else {
				console.log("There is no decklist!");
			}
		};

		var fetchCard = function (name) {
			return new Promise((resolve, reject) => {
				Cards.get(name)
					.success(function (card) {
						resolve(card);
					});
			});
		};

		processCards = function (cardArray, callback) {

			var cardNames = [];

			cardArray.forEach(function (card) {
				cardNames.push(card.substr(card.indexOf(' ') + 1));
			});

			itemPromises = cardNames.map(fetchCard);

			Promise.all(itemPromises)
				.then(function (results) {
					// we only get here if ALL promises fulfill
					results.forEach(function (card) {
						// Declare a newCard
						var newCard = {
							count: 0,
							name: "",
							manaCost: ""
						};

						// newCard.count = element.substr(0, element.indexOf(' '));
						newCard.name = card.name;
						newCard.count = 3;
						newCard.cmc = card.cmc;
						newCard.manaCost = card.manaCost;
						newCard.W = (newCard.manaCost.match(/W/g) || []).length;
						newCard.U = (newCard.manaCost.match(/U/g) || []).length;
						newCard.B = (newCard.manaCost.match(/B/g) || []).length;
						newCard.R = (newCard.manaCost.match(/R/g) || []).length;
						newCard.G = (newCard.manaCost.match(/G/g) || []).length;

						// Add the card to the Deck 
						$scope.cardList.push(newCard);
					});

					callback();
				})
				.catch(function (err) {
					// Will catch failure of first failed promise
					console.log("Failed:", err);
				});
		};

		deckCheck = function () {
			var arrayLength = $scope.cardList.length;
			var cardCount = 0;

			// How many non-lands are in the deck?
			for (var i = 0; i < arrayLength; i++) {
				var cardToCount = $scope.cardList[i];
				cardCount += cardToCount.count;
			}

			// How many lands slots are there?
			// NOTE: Only 60-card decks are currently supported.
			$scope.manaAnalysis.lands = 60 - cardCount;

			// Check if a valid number of cards
			if ($scope.manaAnalysis.lands > 27 || $scope.manaAnalysis.lands < 20)
				alert("Invalid Land Count. Land total must be 20-27. Only 60-card decks are supported currently.");
			else {
				// Loop through the cards to determine the max pip count for each color in the deck.
				for (var j = 0; j < arrayLength; j++) {
					var currentCard = $scope.cardList[j];

					// Calculate how many mana sources are needed of each color for a given card
					var wManaSources = manaSourcesNeeded($scope.manaAnalysis.lands, currentCard.cmc, currentCard.W);
					var uManaSources = manaSourcesNeeded($scope.manaAnalysis.lands, currentCard.cmc, currentCard.U);
					var bManaSources = manaSourcesNeeded($scope.manaAnalysis.lands, currentCard.cmc, currentCard.B);
					var rManaSources = manaSourcesNeeded($scope.manaAnalysis.lands, currentCard.cmc, currentCard.R);
					var gManaSources = manaSourcesNeeded($scope.manaAnalysis.lands, currentCard.cmc, currentCard.G);

					// Determine the max mana sources needed for each color after each card
					$scope.manaAnalysis.whiteSources = Math.max($scope.manaAnalysis.whiteSources, wManaSources);
					$scope.manaAnalysis.blueSources = Math.max($scope.manaAnalysis.blueSources, uManaSources);
					$scope.manaAnalysis.blackSources = Math.max($scope.manaAnalysis.blackSources, bManaSources);
					$scope.manaAnalysis.redSources = Math.max($scope.manaAnalysis.redSources, rManaSources);
					$scope.manaAnalysis.greenSources = Math.max($scope.manaAnalysis.greenSources, gManaSources);
				}

				console.log($scope.manaAnalysis.whiteSources + " White Sources Needed");
				console.log($scope.manaAnalysis.blueSources + " Blue Sources Needed");
				console.log($scope.manaAnalysis.blackSources + " Black Sources Needed");
				console.log($scope.manaAnalysis.redSources + " Red Sources Needed");
				console.log($scope.manaAnalysis.greenSources + " Green Sources Needed");
				console.log("In " + $scope.manaAnalysis.lands + " Land Slots");
			}
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
	}]);