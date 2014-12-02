$(function(){

  //animates and moves the enemies
  function enemyMovement(){
      $('#enemy1')
      .sprite({fps: 18,
        no_of_frames: 10,
        on_first_frame: function(obj) {
        obj.spState(2);
        }
      })
      .spRandom({
        top: 550,
        bottom: 150,
        left: 100,
        right: 220,
        speed: 1000,
        pause: 3000
      });

      $('#enemy2')
      .sprite({fps: 18, no_of_frames: 10})
      .spRandom({
        top: 550,
        bottom: 150,
        left: 200,
        right: 320,
        speed: 1000,
        pause: 1500
      });

      $('#enemy3')
      .sprite({fps: 18,
        no_of_frames: 10,
        on_first_frame: function(obj) {
        obj.spState(2);
        }
      })
      .spRandom({
        top: 550,
        bottom: 150,
        left: 300,
        right: 420,
        speed: 1000,
        pause: 2500
      });

      $('#enemy4')
      .sprite({fps: 18, no_of_frames: 10})
      .spRandom({
        top: 550,
        bottom: 150,
        left: 400,
        right: 520,
        speed: 1000,
        pause: 4000
      });

      $('#enemy5')
      .sprite({fps: 18, no_of_frames: 10})
      .spRandom({
        top: 550,
        bottom: 150,
        left: 500,
        right: 620,
        speed: 700,
        pause: 6000
      });
  }
    
  //controlling the way the bullet moves over the screen and removing it once the animation is done
  function bulletMovement(){
    $('#heroBullet').animate({top:'-=520px'},600, function(){
      $('#heroBullet').remove();
    });
    bulletCollide();
  }

  //making sure that the enemies die when i shoot them
  function bulletCollide(){
    $("#heroBullet").collides(".enemy",function(hero,enemy){
      enemy.hide("explode",{pieces:4},500,"easeOut");
      
      setTimeout(function(){
        enemy.show("blinds");
      },3000);
    });
  }

  //via this and the if in heroshoot i am attempting to regulate how many bullets can be on screen at once. However it does
  //not work as planned.
  var bulletExists = false;
  //creates a bullet when we hit the 'space' key.
  function heroShoot(){
    if(bulletExists){return;}

    $(document).bind('keypress', 'space', function(e) {
      var bullet = $('<div id=heroBullet></div>').appendTo('#mainBoard');
      var bulletLeft = $('#hero').position().left + $('#hero').width()/2 - $('#heroBullet').width()/2.2;
      var bulletTop = $('#hero').position().top + $('#hero').width()/4 - $('#heroBullet').width()/2;

      $('#heroBullet').css({
        left:bulletLeft,
        top:bulletTop
        });

      bulletExists = true;

      bulletMovement();
    });
  }

  //making sure the hero can move when we hit the arrow keys. the if's somewhat stop the hero from moving when you get to the
  //designated area, but it does not work fully, i'm guessing this is because of browser lag.
  function heroMovement(){
    $(document).bind('keydown', 'right', function(e) {
      if ($('#hero').position().left <= $('#mainBoard').position().left +820){
        $('#hero').animate({left: "+=13px"}, 1);
      }
    });

    $(document).bind('keydown', 'left', function(e) {
      if ($('#hero').position().left >= $('#mainBoard').position().left - 10){
        $('#hero').animate({left:'-=13px'}, 1);
      }
    });
  }

  //animating the rocket propulsion of the hero
  function heroAnimation(){
    $('#hero').sprite({
      fps: 18,
      no_of_frames: 12,
      on_first_frame: function(obj) {
        obj.spState(1);
      },
      on_last_frame: function(obj) {
        obj.spState(1);
      }
    });
  }

  //animating the background
  function backgroundAnimation(){
    $('#bg1').pan({fps: 24, speed: 5, dir: 'down', depth:10});
    $('#bg2').pan({fps: 24, speed: 10, dir: 'down', depth:20});
    $('#bg3').pan({fps: 24, speed: 20, dir: 'down', depth:30});
  }

  //controlling the placements of the points you can pick up.
  function addPoints(){
    var point = $('<div id=points></div>').appendTo('#mainBoard');
    //making the first appereance of the point random as well.
    var pointLeft = Math.floor((Math.random()*900)+1);
    var pointTop = '550px';

    $('#points').css({
      left:pointLeft,
      top:pointTop
    });
  }

  //controlling the behaviour of the hero when he is hit by an enemy. Also displays the losescreen.
  function heroDeath(){
    var lives = 10;

    $('.scoreboard').prepend('<p class="lives">lives:<span class="livesholder">10</span></p>');

    $('#hero').collides('.enemy',function(){
      lives -= 1;
      $('.livesholder').html(lives);
      $('#hero').hide("explode",{pieces:4},500,"easeOut");

      setTimeout(function(){
        $('#hero').show("blinds");
      }, 3000);

      //this is the lose-screen that will be displayed if your lives hit 0
      var lose = '<div class = "lose">' + '<h1>' + "I'm sorry you have lost the game." + '<br>' +
      ' If you wish to play again please reload the page' + '</h1>' + '</div>';
      if(lives === 0){
        $('#mainBoard').replaceWith(lose);
        $('.scoreboard').remove();
      }

    });
  }

  //creating a scorecounter. Which adds 100 points everytime we catch one of the points divs, removes them
  //from the screen and then places them back again in a random position. Also shows the winscreen
  function scoreCounter(){
    var score = 0;

    $('body').prepend('<div class="scoreboard"><p class="score">Score:<span class="scoreholder">0</span></p></div>');
 
    $('#hero').collides("#points",function(){
      score += 100;
      $('.scoreholder').html(score);
      $('#points').hide();

      //moving the points div to another location while it is hidden.
      $('#points').animate({left:Math.floor((Math.random()*900)+1)},200);

      setTimeout(function(){
        $('#points').show("blinds");
      },3000);

      //this is the win-screen that will be displayed once you have reached a certain score
      var win = '<div class = "win">' + '<h1>' + 'Congratulations, you have won the game!' + '<br>' +
      ' If you wish to play again please reload the page' + '</h1>' + '</div>';

      if(score == 1500){
        $('#mainBoard').replaceWith(win);
        $('.scoreboard').remove();
      }
    });
  }
  
  //finally we add the instructions to our little space adventure
  function addInstructions(){

    $('.scoreboard').append("<h1> Welcome to spacegame! </h1>" + "<br>" + "your objective is to gather all of the yellow orbs of energy." + "<br>"+
          "However! There are dangerous enemy drones trying to stop you by ramming into you." + "<br>" +
          "Don't worry too much though, as they are really stupid and tend to move in random patterns." +"<br>" +
          "Go left or right with the arrow keys, fire your lazors with space. Good hunting!" + "<br><br>" +
          "All art and assets in this game were made my Jesper Nordström and all programming was done by Martin Hansson");
  }

  //running all the individual parts of our game
  addPoints();
  scoreCounter();
  heroDeath();
  addInstructions();
  backgroundAnimation();
  heroShoot();
  heroMovement();
  enemyMovement();
  heroAnimation();
});

//here's another update for the featurebranch
