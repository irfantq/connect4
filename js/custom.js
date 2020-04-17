
/* Custom Scripts for Connect4 Game */

var stone = [];                         // Chips Array
var mark = [];                          // Array to highlight Chips in case of Win
var height = [0, 0, 0, 0, 0, 0, 0];     // Array for the board column position
var moves = [];                         // Array for storing player moves
var board = [                           // Nested Array for board rows and columns
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0]];
var won = false;                        // Boolean variable for Win. By default it's FALSE
var firstPlayer, secondPlayer;          // Variables for storing Player Names



// Function to check if the Player can play the move after dragging chip on the board.
// Checking if no player has won and the column resides within the board
function canplay(col) {
  return !won && height[col] < 6;
}

//Function to run after 'canplay' function to let the player play the current move.
// Calling required functions here and updating variables after move
function play(col, dont_compute) {
  board[col][height[col]] = 1 + moves.length % 2;
  drop(stone[moves.length], col, height[col]);
  height[col]++;
  moves.push(col);
  win();
  if(dont_compute) return;
  show_winner();
}

// Function to toggle ACTIVE/INACTIVE states of chips for the players
// Just adding the necessary CSS classes here
function enable_next_player() {
  if(won) {
    $(".player-one-chips-stack").removeClass("active").addClass("inactive");
    $(".player-two-chips-stack").removeClass("active").addClass("inactive");
  }
  else if(moves.length % 2 == 0) {
    $(".player-one-chips-stack").removeClass("inactive").addClass("active");
    $(".player-two-chips-stack").removeClass("active").addClass("inactive");
  }
  else {
    $(".player-one-chips-stack").removeClass("active").addClass("inactive");
    $(".player-two-chips-stack").removeClass("inactive").addClass("active");
  }
}

// Function called within 'play' function
// Animating the Chips from top of the board to the position to give the chips a drop effect
function drop(img, x, y) {
  img.css("left", (x*100/7)+"%");
  img.css("top", (-100/7)+"%");
  img.show();
  img.animate({top: ((5-y)*100/7)+"%"}, 400, "linear", show_win);
}

// Function to find the chips to highlight in case if a player wins
function mark_win(x, y, dx, dy) {
  for (var i = 0; i < 4; i++) {
    mark[i].css("left", ((x + i * dx)*100/7) + '%');
    mark[i].css("top", ((5 - (y + i * dy))*100/7) + '%');
  }
}

// Function to Highlight specific Chips in case if a player wins
function show_win() {
  if(won)
    for(var i = 0; i < 4; i++) {
      mark[i].show();
    }
}

// Function to check if a player has won or not.
// Using Nested Board array to check the horizontal, verticle and diagonal chips on each move
function win() {
  var x = moves[moves.length - 1];
  var y = height[x] - 1;

  if (y >= 3 && board[x][y - 3] == board[x][y] && board[x][y - 2] == board[x][y] && board[x][y - 1] == board[x][y]) {
    mark_win(x, y, 0, -1);
    won = true;
  }
  for (var dy = -1; dy <= 1; dy++) {
    var nb = 0;
    for (var dx = 1; x + dx < 7 && y + dx * dy < 6 && y + dx * dy >= 0; dx++)
      if (board[x + dx][y + dx * dy] == board[x][y]) nb++;
      else break;
    for (var dx = -1; x + dx >= 0 && y + dx * dy < 6 && y + dx * dy >= 0; dx--)
      if (board[x + dx][y + dx * dy] == board[x][y]) nb++;
      else break;
    if (nb >= 3) {
      mark_win(x + dx + 1, y + (dx + 1) * dy, 1, dy);
      won = true;
    }
  }
}

// Function to display the Winner Popup
// Adding necessary texts here to be displayed in the Winner popup
function show_winner() {
  enable_next_player();
  if(won) {
    setTimeout(function(){ $('.player-won-popup').css({'max-height':'unset', 'opacity':'1'}); }, 2000);
    if(moves.length % 2 == 1) $(".player-won-popup .won-player-name").text('Congratulations ' + firstPlayer + '! You are the winner.'); 
    else $(".player-won-popup .won-player-name").text('Congratulations ' + secondPlayer + '! You are the winner.');  
    return;
  }
  if(moves.length == 42) {
    setTimeout(function(){ $('.player-won-popup').css({'max-height':'unset', 'opacity':'1'}); }, 2000);
    $('.trophy-gif').hide();
    $(".player-won-popup .won-player-name").text("Draw game"); 
    return;
  }
}

// Function to handle 'Undo Move' button
// Basically removing the last move from 'moves' array
function back(event) {
  if (moves.length > 0) {
    var col = moves.pop();
    height[col]--;
    stone[moves.length].hide();
    board[col][height[col]] = 0;
    if (won) {
      won = false;
      $(".win").hide();
    }
  }
}

// Function to Handle 'Play Again' button
// Showing and hiding the necessary elements here to restart the game
function reset() {
  if(moves.length > 0) {
    moves = [];
    for(var i =0; i < 7; i++) {
      height[i] = 0;
      for(var j =0; j < 6; j++) board[i][j] = 0;
    }
    won = false;
    $(".win").hide();
    $(".player1").hide();
    $(".player2").hide();
    show_winner();
    $('.player-won-popup .won-player-name').text('');
    $('.player-won-popup').css({'max-height':'0', 'opacity':'0'});
    firstPlayer = "";
    secondPlayer = "";
    $('.player-names-popup').css({'max-height':'unset', 'opacity':'1'});
  }
}

// Function to Initialize necessary elements of the game (Chips Stacks for both Players, Board Rows and Columns)
// This function gets called whenever the page is loaded in the browser to set the elements of this game
function init() {
  var count = 0;
  for (var x = 0; x < 7; x++) {
    for (var y = 0; y < 6; y++) {
      count = count + 1;
      var v = $("<div/>");                    // Creating Dropzone elements of Board to drop Chips
      v.attr({
        id: 'dropzone-'+count, 
        column: x
    });
      v.css("left", (x*100/7)+'%');
      v.css("top",  ((5-y)*100/7)+'%');
      v.appendTo("#board");
    }
  }

  for (i = 0; i < 42; i++) {
    var v = $("<div/>");
    if (i % 2 === 0) v.addClass("player1");         // Creating chips elements for dropping effect
    else v.addClass("player2");
    v.hide();
    v.appendTo("#board");
    stone[i] = v;
  }
  for (i = 0; i < 4; i++) {
    var v = $("<div/>");
    v.addClass("win");                              // Creating 4 Trophy icons to mark the chips in case of Win
    v.hide();
    v.appendTo("#board");
    mark[i] = v;
  }

  // Adding Chips Stack for both players to drag
  $('.player-one-chips-stack, .player-two-chips-stack').empty();
  if($('.chips-stack').length < 1){
    var count = 0;
    for(i = 0; i < 24; i++){
      count = count + 1;
      $('.player-one-chips-stack').append('<img class="chips-stack" id="chip-'+count+'" src="images/red.png" />');
      count = count + 1;
      $('.player-two-chips-stack').append('<img class="chips-stack" id="chip-'+count+'" src="images/yellow.png" />');
    }
  }
  show_winner();
}

// Drag N Drop function of plugin to enable dragging of Chips
function dragNDrop(){
  for(i=1; i <= 44; i++){
    dragNdrop({
      element: document.getElementById('chip-'+i), 
      customStyles: true,
      useTransform: true,
      constraints: false,
      dropZones: $('div[id^="dropzone-"]').toArray(),
      callback: function(event) {
        var elem = event.element;
        if(event.dropped){
          var col = event.dropped;
          col = $(col).attr('column');
          col = parseInt(col);
          if(canplay(col)) {
            $(elem).hide();
            play(col);
          }
        }
        else if(!event.dropped){
          console.log("Out of dropzone area");
          $(elem).css({'transform': 'translate3d(0px, 0px, 0px)', '-webkit-transform': 'translate3d(0px, 0px, 0px)', '-moz-transform': 'translate3d(0px, 0px, 0px)'});          
        }
      }
    });
  }
}

// Get Player Names on Form Submit
$('.player-names-form').submit(function(e) {
  e.preventDefault();
  e.stopPropagation();
  firstPlayer = $('#firstplayer', this).val();
  secondPlayer = $('#secondplayer', this).val();

  $('.player-one-details .player-name').text(firstPlayer);
  $('.player-two-details .player-name').text(secondPlayer);
  $('.player-names-popup').css({'max-height':'0', 'opacity':'0'});
});

// Restart Game Button Click
$('.player-won-popup .restart-game input').on("click", function(e) {
  e.preventDefault();
  e.stopPropagation();
  reset();
});

// Calling necessary functions on page load in order to initialize and display elements in the browser
$(window).load(function(){
  init();
  dragNDrop();
});