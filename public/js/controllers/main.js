angular.module('deckController', [])

	// inject the Cards service factory into our controller
	.controller('mainController', ['$scope', '$http', 'Cards', function ($scope, $http, Cards) {
		$scope.deckList = {
			text: "4 Glint Hawk\r\n4 Kor Skyfisher"
		};
		$scope.cardList = [];

		$scope.processDeckList = function () {

			// validate the deckList to make sure that something is there
			// if form is empty, nothing will happen
			if ($scope.deckList.text != undefined) {
				var card = {};
				$scope.cardList = [];

				// Get the list of Cards
				var cardArray = $scope.deckList.text.split(/\r?\n/);

				//Iterate on the cards
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

					console.log(newCard);

					// Card Lookup
					Cards.get(newCard.name)
						.success(function (data) {
							card = data;
							console.log(card);

							newCard.cmc = card.cmc;
							newCard.manaCost = card.manaCost;
							newCard.W = (newCard.manaCost.match(/W/g) || []).length;
							newCard.U = (newCard.manaCost.match(/U/g) || []).length;
							newCard.B = (newCard.manaCost.match(/B/g) || []).length;
							newCard.R = (newCard.manaCost.match(/R/g) || []).length;
							newCard.G = (newCard.manaCost.match(/G/g) || []).length;

							console.log(newCard);

							// Add the card to the Deck 
							$scope.cardList.push(newCard);
							console.log($scope.cardList);
						});
				});

			} else {
				console.log("There is no decklist!");
			}
		};
	}]);