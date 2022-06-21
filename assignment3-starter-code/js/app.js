(function() {
    'use strict';

    // Create angular module
    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItems);

    // Create DDO and bind it to controller
    function FoundItems() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                foundItems: '<',
                onEmpty: '<',
                onRemove: '&'
            },
            controller: NarrowItDownController,
            controllerAs: 'list',
            bindToController: true
        };
        return ddo;
    }

    // Protect function against minification
    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var list = this;
        list.shortName = '';
        
        // Get menu items that equal the searched term
        list.matchedMenuItems = function(searchTerm) {
            var promise = MenuSearchService.getMatchedMenuItems(searchTerm); // promise to retrieve searched terms

            promise.then(function(items) { 
                if (items && items.length > 0) {
                    list.message = '';
                    list.found = items;
                } else {
                    list.message = 'Nothing found!';
                    list.found = [];
                }
            });
        };

        list.removeMenuItem = function(itemIndex) { // remove item at index
            list.found.splice(itemIndex, 1);
        }
    }

    MenuSearchService.$inject = ['$http']; // protect MenuSearchService against minification
    function MenuSearchService($http) {
        var service = this;

        // retrieve the menu items that equal the searched term (controller will use)
        service.getMatchedMenuItems = function(searchTerm) {
            return $http({                                                              // Use ajax to get data from the server
                method: "GET",
                url: ('https://davids-restaurant.herokuapp.com/menu_items.json') 
            }).then(function(response) {
                var foundItems = [];

                for(var i = 0; i < response.data['menu_items'].length;i++){
                    if(searchTerm.length > 0 && response.data['menu_items'][i]['description'] // seraches the response from server for matched term
                    .toLowerCase().indexOf(searchTerm) !== -1){
                        foundItems.push(response.data['menu_items'][i]);
                    }
                }
                return foundItems;
            });
        };
    }
})();