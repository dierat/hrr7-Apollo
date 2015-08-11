angular.module('app', ['ui.router', 'app.game', 'app.leaderboard', 'app.setInitials'])

.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider){

  $urlRouterProvider.otherwise('/');

  var game = {
    name: 'game',
    url: '/',
    templateUrl: './game/game.html'
  };

  var leaderboard = {
    name: 'leaderboard',
    url: '/leaderboard',
    templateUrl: './leaderboard/leaderboard.html'
  };

  var setInitials = {
    name: 'setInitials',
    url: '/setInitials',
    templateUrl: './leaderboard/setInitials.html',
    resolve: { authenticate: authenticate }
  };

  $stateProvider
    .state(game)
    .state(leaderboard)
    .state(setInitials)

  function authenticate($q, $state, $timeout, gameOver, trackScore) {
    console.log("authenticating!");
    // todo: this returns undefined
    console.log('check score', gameOver.checkScore(trackScore.totalScore));
    // if the score is high enough and the user has a valid session
    if ( gameOver.checkScore(trackScore.totalScore) ) {
      // continue to the target path
      return $q.when()
    } else {
      $timeout(function() {
        // redirect to the leaderboard
        console.log("timeout fired, go to leaderboard")
        // $state.go('leaderboard')
      })
      // reject the authentication promise to prevent the state from loading
      return $q.reject()
    }
  }

}])

.run(['$state', function($state){
  $state.transitionTo('game');
}]);


