document.addEventListener("DOMContentLoaded", function () {
    var canvas = document.getElementById('mycanvas');
    //drawShape();
    createDeck();
    getCurrentPlayer();
  
    initializeGame();
  
    canvas.addEventListener('click', function (evt) {
      var mousePos = getMousePos(canvas, evt);
      checkSelect(mousePos);
  
    }, false);
  
  });
  
  let deck = [];
  let selectBoxs = [];
  let gameOver=false
  
  
  let players = [];
  let turn = 0;
  
  function getCurrentPlayer() {
    return players[turn];
  }
  function getLastPlayer() {
    if (turn == 0) {
      return players[players.length-1];
    }
    return players[(turn - 1)];
  
  }
  function createDeck() {
    for (let i = 0; i < 4; i++) {
      for (let y = 1; y < 13; y++) {
        let card = new Card(i, y)
        if (card.value == "1")
          card.value = "A"
        else if (card.value == "11")
          card.value = "J"
        else if (card.value == "12")
          card.value = "K"
        if (card.suit == "0")
          card.suit = "C"
        else if (card.suit == "1")
          card.suit = "D"
        else if (card.suit == "2")
          card.suit = "H"
        else
          card.suit = "S"
        deck.push(card)
      }
    }
  
    let queen = {
      value: "Q",
      suit: "H",
    }
    deck.push(queen)
    queen = {
      value: "Q",
      suit: "C",
    }
    deck.push(queen)
    queen = {
      value: "Q",
      suit: "D",
    }
    deck.push(queen)
  
    deck = shuffleArray(deck);
    console.log(deck);
  }
  
  function checkSelect(mousePos) {
    for (let i = 0; i < selectBoxs.length; i++) {
      if (isInside(mousePos, selectBoxs[i])) {
        console.log("selected " + i + "        value " + getLastPlayer().hand[i].value);
        alert("You chose a "+getLastPlayer().hand[i].value+".")
  
        getCurrentPlayer().hand.push(getLastPlayer().hand[i]);
  
        removePairs(getCurrentPlayer());
  
        getLastPlayer().hand.splice(i, 1);
        removePairs(getLastPlayer());
  
        if (players.length == 1) {
          alert(" Old maid is!! ->" + (players[0].num + 1));
          gameOver=true;
        }
        else {
          if (getLastPlayer().hand.length == 0) {
            console.log("SMTHG ")
            removeTurn=turn
            if (turn==0)
              removeTurn=players.length
            else
              removeTurn--
            players.splice(removeTurn, 1);
            if(turn==0)
              turn=players.length
            else
              turn--
            if (players.length == 1) {
              alert(" Old maid is!! ->" + (players[0].num + 1));
              gameOver=true;
            }
          }
          if (getCurrentPlayer().hand.length == 0) {
            console.log("SMTHG ")
            players.splice(turn, 1);
            if(turn==0)
              turn=players.length
            else
              turn--
            if (players.length == 1) {
              alert(" Old maid is!! ->" + (players[0].num + 1));
              gameOver=true;
            }
          }
          turn++;
          if(turn>=players.length)
            turn=0
          turner();
        }
      }
    }
  }
  function getMousePos(canvas, event) {
    let rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  
  }
  function removePairs(player) {
    while (hasPairs(player)) {
      for (let i = 0; i < player.hand.length; i++) {
        for (let j = 0; j < player.hand.length; j++) {
          if (checkPaired(player, i, j) && i != j) {
            player.hand.splice(i, 1);
            if (j > i) {
              player.hand.splice(j - 1, 1);
            }
            else {
              player.hand.splice(j, 1);
            }
            break;
          }
        }
      }
    }
  }
  function hasPairs(player) {
    for (let i = 0; i < player.hand.length; i++) {
      for (let j = 0; j < player.hand.length; j++) {
        if (checkPaired(player, i, j) && i != j) {
          return true;
        }
      }
    }
    return false;
  }
  function checkPaired(player, x, y) {
    if (player.hand[x].value == player.hand[y].value) {
      return true;
    }
    return false;
  }
  
  function isInside(pos, rect) {
    return pos.x > rect.x && pos.x < rect.x + rect.width && pos.y < rect.y + rect.height && pos.y > rect.y
  }
  
  
  function turner() {
    console.log("now turn: " + turn);
    console.log("player " + getCurrentPlayer().num);
    removePairs(getCurrentPlayer());
    removePairs(getLastPlayer());
    renderCards(getLastPlayer(), getCurrentPlayer());
  
    console.log(players)
  
  }
  function renderCards(player1, player2) {
    let canvas = document.getElementById('mycanvas');
  
  
    // Get the canvas element using the DOM
  
    // Make sure we don't execute when canvas isn't supported
    if (canvas.getContext) {
      // use getContext to use the canvas for drawing
      var ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
  
      // Draw shapes
  
      let ar1 = []
      let ar2 = []
      selectBoxs = []
      let x1 = canvas.width / 2 - player1.hand.length * 105 / 2
      let x2 = canvas.width / 2 - player2.hand.length * 105 / 2
  
      ctx.font = "30px Arial";
  
      ctx.fillText("Player " + (getCurrentPlayer().num + 1) + "'s turn", 25, 50);
      ctx.fillText("Player " + (getLastPlayer().num + 1) + "'s hand", 600, 30);
      ctx.fillText("Player " + (getCurrentPlayer().num + 1) + "'s hand", 600, 580);
      
      shuffleArray(player1.hand)
      shuffleArray(player2.hand)
      if(!gameOver)
      {
        for (let i = 0; i < player1.hand.length; i++) {
          let img = new Image(100, 150);
          img.src = 'cards/cardback.png';
    
          img.onload = function () {
            ctx.drawImage(this, x1 + 105 * i, 50, 100, 150);
            selectBoxs.push(new rect(x1 + 105 * i, 50, 100, 150));
            ar1.push('');
          }
        }
    
        for (let i = 0; i < player2.hand.length; i++) {
          let img = new Image(100, 150);
          img.src = 'cards/' + player2.hand[i].value + '' + player2.hand[i].suit + '.png';
          img.onload = function () {
            ctx.drawImage(this, x2 + 105 * i, 600, 100, 150);
            ar2.push('');
          }
        }
      }
      else{
        let img = new Image(100, 150);
        img.src = 'cards/' + player2.hand[0].value + '' + player2.hand[0].suit + '.png';
        img.onload = function () {
          ctx.drawImage(this, x2, 600, 100, 150);
          ar2.push('');
        }
      }
  
    } else {
      alert('You need Safari or Firefox 1.5+ to see this demo.');
    }
  
  }
  
  
  function initializeGame() {
    for (let i = 0; i < 4; i++) {
      players.push(new Player(i));
    }
    let i = 0;
    while (i < deck.length) {
      players[i % 4].hand.push(deck[i]);
      i++;
    }
    turner();
  }
  
  function Player(a) {
    this.hand = [];
    this.num = a;
  }
  function rect(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
  }
  function Card(i, j) {
    this.value = j;
    this.suit = i;
  }
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }
  
  
