'use strict';

// DECLARE MODULE
var Play = function (){};
Play.prototype = {

  /*--------------------------------------
    GAME VARIABLES
  ---------------------------------------*/
  hero_dragged: false,
  loop_spawner: 0,





  /*--------------------------------------
    ON RENDER
  ---------------------------------------*/
  render: function(){
    // If debug flag is ON show debuggers
    if(this.debug){
      this.coinsGroup.forEachAlive(function(_target){
        this.game.debug.body(_target);
      }, this);
      this.game.debug.body(this.hero);
    }
  },





  /*------------------------------------------------------
    SCENE SHUTDOWN
  -------------------------------------------------------*/
  shutdown: function() { 
    // this.game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
    
    // Destroy Sprites
    this.hero.destroy();
    this.coinsGroup.destroy();
    this.back.destroy();
    this.score_display.destroy();
  },




  /*--------------------------------------
    ON CREATE
  ---------------------------------------*/
  create: function() {
    // Object Reference
    var scope = this;


    ///////////////////////////
    // RESET GAME PROPERTIES
    ///////////////////////////
    this.debug = false;
    this.gameInit = false;
    this.hero_dragged = false;
    this.loop_spawner = 0;
    this.game.level_speed = 1;
    this.game.level = 1;
    this.game.score = 0;
    this.game.coins_total = 0;
    this.game.coins_single = 0;
    this.game.coins_same_time = 2;


    ///////////////////////////
    // GAME PHYSICS ENGINE
    ///////////////////////////
    this.game.physics.startSystem(Phaser.Physics.ARCADE);


    ///////////////////////////
    // BACKGROUND
    ///////////////////////////
    this.back = this.game.add.sprite(0, 0, 'shop');
    



    ///////////////////////////
    // HERO
    ///////////////////////////
    this.hero = this.game.add.sprite(this.world.centerX, this.world.centerY-30, 'cajetilla');
    this.hero.anchor.setTo(0.5, 0.5);
    this.hero.scale.setTo(0.85, 0.85);

    // Enable Physics
    this.game.physics.arcade.enable(this.hero, Phaser.Physics.ARCADE);
    this.hero.enableBody = true;
    this.hero.body.immovable = true;
    this.hero.body.setSize(this.hero.body.width - 25, this.hero.body.height+10, 40, 55);




    ///////////////////////////
    // COINS
    ///////////////////////////
    // Create Coins Group
    this.coinsGroup = this.game.add.physicsGroup();
    this.coinsGroup.enableBody = true;
    this.coinsGroup.physicsBodyType = Phaser.Physics.ARCADE;

    


    ///////////////////////////
    // ERROR OVERLAY
    ///////////////////////////
    this.error_overlay = this.game.add.sprite(0, 0, 'overlay');
    this.error_overlay.alpha = 0;






    ///////////////////////////
    // FOOTER
    ///////////////////////////
    this.footer = this.game.add.sprite(0, 0, 'footer');
    this.footer.alignIn(this.back, Phaser.BOTTOM_CENTER);






    ///////////////////////////
    // 'BACK' BUTTON
    ///////////////////////////
    this.back_display = this.game.add.sprite(this.game.world.width - 205, 35, 'back_button');
    //this.back_display.fontSize = '23pt';
    //this.back_display.fill = '#FFFFFF';
    this.back_display.inputEnabled = true;
    this.back_display.useHandCursor = true;

    // 'Tap/Click' Event
    this.back_display.events.onInputUp.add(function () {
      // Is pointer inside button?
      if(this.back_display.input.pointerOver()){
        this.game.endGame = false;

        // PLAY PREVIOUS SCENE
        var slideIn = Phaser.Plugin.StateTransition.Out.SlideRight;
        var slideOut = Phaser.Plugin.StateTransition.In.SlideRight;
        slideIn.duration = 2e3;
        slideOut.duration = 2e3;
        this.game.state.start('features_intro', slideIn, slideOut);
      }
    }, this);







    ///////////////////////////
    // SCORE DISPLAY
    ///////////////////////////
    this.score_display = this.game.add.text(110, 47, '0pts', this.game.font_style);
    this.score_display.fontSize = '30pt';
    this.score_display.fill = '#ffffff';





    ///////////////////////////
    // 'TIMEUP'
    ///////////////////////////
    // Display
    this.timeup_base = this.game.add.sprite(30, 35, 'counter');
    this.timeup_display = this.game.add.text(66, 73, '60', this.game.font_style);
    this.timeup_display.fontSize = '28pt';
    this.timeup_display.anchor.set(0.5);
    this.timeup_display.setTextBounds()
    this.timeup_display.fill = '#ffffff';
    
    // Timers & Events
    this.timeup_timer = this.game.time.create();
    this.timeup_event = this.timeup_timer.add(this.game.total_timeup, this.timeupEnd, this);
    this.timeup_tick = this.game.time.create();
    this.timeup_tick_event = this.timeup_tick.loop(Phaser.Timer.SECOND, this.updateTimeup, this);
    

    


    ///////////////////////////
    // PAUSE BUTTON
    ///////////////////////////
    this.pause_label = this.game.add.sprite(this.game.world.width - 125, 35, 'pause');//this.game.add.text(this.game.world.width - 200, 20, 'Pause', this.game.font_style);
    //this.pause_label.scale.setTo(.65, .65);

    // Enable INteractivity
    this.pause_label.inputEnabled = true;
    this.pause_label.useHandCursor = true;

    // Events
    this.pause_label.events.onInputUp.add(function () {
      // Is pointer inside button?
      if(this.pause_label.input.pointerOver())
        this.game.paused = true;
    }, this);
    this.game.input.onDown.add(function() {
        if (this.game.paused) this.game.paused = false;
    }, this);







    ///////////////////////////
    // LEVEL DISPLAY
    ///////////////////////////
    this.modalWindow_visible = false;

    // create Background
    var level_overlay = this.game.add.graphics(0,0);
    level_overlay.beginFill(0x000000, .6);
    level_overlay.boundsPadding = 0;
    level_overlay.drawRect(0, 0, this.game.width, this.game.height);

    // Label
    this.level_label = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY-40, 'NIVEL '+this.game.level, this.game.font_style);
    this.level_label.font = 'YouDecide M';
    this.level_label.anchor.setTo(.5,.5);
    this.level_label.fontSize = '82pt';
    this.level_label.fill = '#ffffff';

    // Create Group
    this.levelDisplayGroup = new Phaser.Group(this.game);
    this.levelDisplayGroup.add(level_overlay);
    this.levelDisplayGroup.add(this.level_label);
    this.levelDisplayGroup.alpha = 0;

    // Level Timer / Events
    this.level_timer_update = this.game.time.create();
    this.level_event_update = this.level_timer_update.loop(Phaser.Timer.SECOND * 15, function(){
      
      // If the main timer has stopped, stop level updates
      if(!this.timeup_timer.running){
        this.level_timer_update.stop();
        return;
      }


      // Update game level
      this.game.level++;

      // Show Overlay
      var level = Math.round(this.timeup_event.delay - this.timeup_timer.ms) / 1000;
      this.updateLevel();
      this.showLevel();

    }, this);



    ///////////////////////////
    // INIT GAME
    ///////////////////////////
    // Wait some time before initializing the game
    this.initDelayTimer = this.game.time.events.add(Phaser.Timer.SECOND, this.initGame, this);

  },




  /*--------------------------------------
    INIT GAME
  ---------------------------------------*/
  initGame: function(){
    // remove init delay timer;
    this.game.time.events.remove(this.initDelayTimer );

    // Show Level
    this.updateLevel();
    this.showLevel();

    // Init Timeeup
    this.timeup_timer.start();
    this.timeup_tick.start();
    this.level_timer_update.start();

    // Game Init Flag (Start to Spawn Enemies)
    this.gameInit = true;
  },





  /*--------------------------------------
    UPDATE LEVEL
  ---------------------------------------*/
  updateLevel: function(){
    var level = this.game.level;
    this.game.coins_same_time += 2;

    // If level is greter than 1
    if(this.game.level > 1){
      // Update Level Seed
      this.game.level_speed++;

      // Play Sound FX
      this.game.fx_state.play();
    }

    // Dont show more 'coins' than the limit (for performance pouropses)
    if(this.game.coins_same_time >= this.game.coins_max){
      this.game.coins_same_time = this.game.coins_max;
    }
  },




  /*--------------------------------------
    SHOW LEVEL LIGHTBOX
  ---------------------------------------*/
  showLevel: function(){
    // Update Level Text
    this.level_label.text = 'NIVEL '+this.game.level;

    // Update modal window state
    this.modalWindow_visible = true;

    // tween sprite
    var tween = this.game.add.tween(this.levelDisplayGroup).to( { alpha: 1 }, 400, Phaser.Easing.Cubic.Out, true);
    var tween2 = this.game.add.tween(this.levelDisplayGroup).to( { alpha: 0 }, 400, Phaser.Easing.Cubic.Out, false, 1400);
    tween.chain(tween2);
    tween2.onComplete.add(function (){
      // Update modal window state
      this.modalWindow_visible = false;
    }, this);
  },






  /*--------------------------------------
    UPDATE 'TIMEUP' DISPLAY
  ---------------------------------------*/
  updateTimeup: function(){
    //
    var remaining_seconds = Math.ceil( (this.timeup_event.delay - this.timeup_timer.ms) / 1000 )

    // If there´s less than 6 seconds remaining, change text style
    if(remaining_seconds < 6){
      this.timeup_display.fill = "#ff0000"; 
      this.timeup_display.fontSize = "28pt"; 
      
      //this.game.fx_seconds.stop();
      this.game.fx_seconds.play();
    }

    // Update text
    this.timeup_display.text = remaining_seconds; 
  },




  /*--------------------------------------
    ON 'TIMEUP' END
  ---------------------------------------*/
  timeupEnd: function(){
    // Stop Timers
    this.timeup_tick.stop();
    this.timeup_timer.stop();

    /////////////////////
    /// GAME OVER
    /////////////////////
    // Wait some time before initializing the game
    this.gameoverDelayTimer = this.game.time.events.add(Phaser.Timer.SECOND * 1, this.gameOver, this);
  },




  /*--------------------------------------
    GAME OVER HANDLER
  ---------------------------------------*/
  gameOver: function(){
    // Play state
    this.game.endGame = true;

    /////////////////////
    /// PLAY NEXT SCENE
    /////////////////////
    var slideIn = Phaser.Plugin.StateTransition.Out.SlideLeft;
    var slideOut = Phaser.Plugin.StateTransition.In.SlideLeft;
    slideIn.duration = 2e3;
    slideOut.duration = 2e3;
    this.game.state.start('features_end', slideIn, slideOut);
  },





  /*--------------------------------------
    'DRAG' EVENTS
  ---------------------------------------*/
  startDrag: function(){
    this.hero_dragged = true;
  },
  stopDrag: function(){
    this.hero_dragged = false;
  },





  /*--------------------------------------
    UPDATE EVENT
  ---------------------------------------*/
  update: function() {

    /////////////////////////////////////
    /// HERO DRAG
    /////////////////////////////////////
    /// Check for collisions
    this.game.physics.arcade.collide(
      this.coinsGroup,
      this.hero,
      function(cajetilla, coin){
          if(coin.thrown)
            this.getCoin(cajetilla, coin);
      },
      null,
      this
    );
    this.game.physics.arcade.overlap(
      this.hero,
      this.coinsGroup,
      this.getCoin,
      this.processHandler,
      this
    );
    this.game.physics.arcade.collide(this.coinsGroup);


    /////////////////////////////////////
    /// COINS SPAWN
    //console.log(this.coinsGroup.countLiving(), this.game.coins_same_time)
    //this.coinsGroup.checkAll('valid', false, true) || 
    if (this.coinsGroup.checkAll('valid', false, true) || (this.coinsGroup.countLiving() < this.game.coins_same_time-1) && !this.modalWindow_visible && this.gameInit ) {
        // Spawn new Coin
        this.spawnCoin();
    }
  },







  /*--------------------------------------
    PROCESS HANDLER
  ---------------------------------------*/
  processHandler: function(cajetilla, coin){
    if( coin.dragger_init && !coin.dragged){
      return true;
    } else {
      return false;
    } 
  },

  




  /*--------------------------------------
    UPDATE SCORE DISPLAY
  ---------------------------------------*/
  updateScore: function(){
    // LIMIT SCORE VALUE
    if(this.game.score <= 0){
      this.game.score = 0;
    }

    // Update Text
    this.score_display.text = this.game.getFormattedScore()+'pts'; 
  },







  /*--------------------------------------
    'GET COIN' EVENT
  ---------------------------------------*/
  getCoin: function(_body1, _body2){
    // Check Coin Type for calculating score
    var points_content;
    var points_flag = true;
    if(_body2.valid){
      points_content = '+100';
      this.game.score += 100;
      this.updateScore();
      this.game.fx_good.play();

    } else {
      points_content = '-50';
      points_flag = false;
      this.game.score -= 50;
      this.updateScore();
      this.game.fx_bad.play();

      // Show Overlay
      this.showOverlay();
    }

    // Display Points
    this.pointsDisplay(points_content, {x: _body2.x, y: _body2.y}, points_flag);


    // Kill Sprite
    _body2.kill();
  },






  /*--------------------------------------
    SHOW 'POINTS' SPRITE
  ---------------------------------------*/
  pointsDisplay: function(_content, _location, _flag){
    var points_sprite = new HitDisplay(this.game, _content, this.game.font_style, _flag);
    points_sprite.x =  _location.x;
    points_sprite.y =  _location.y;
    points_sprite.alpha =  0;

    // tween sprite
    var tween = this.game.add.tween(points_sprite).to( { alpha: 1, y: points_sprite.y-100 }, 900, Phaser.Easing.Cubic.Out, true);
    tween.onComplete.add(function (){
      points_sprite.destroy();
    }, this);

  },






  /*------------------------------------------------------
    'COIN OUT OF WORLD' HANDLER
  -------------------------------------------------------*/
  coinOut: function(_target){
    // Show Overlay
    this.showOverlay();

    // Play Sound FX
    this.game.fx_bad.play();

    /*if(_target.valid){

      // Check Coin Type for calculating score
      var points_content = '-50';
      var points_flag = false;
      this.game.score -= 50;
      this.updateScore();

      // Display Points
      this.pointsDisplay(points_content, {x: _target.body.x, y: _target.body.y}, points_flag);
    
      
    }*/
  },




  /*--------------------------------------------------
    SHOW LIGHTBOX OVERLAY
  ---------------------------------------------------*/
  showOverlay: function(){
    var tweenA = this.game.add.tween(this.error_overlay).to( { alpha: .75 }, 200, Phaser.Easing.Quadratic.Out);
    var tweenB = this.game.add.tween(this.error_overlay).to( { alpha: 0 }, 300, Phaser.Easing.Quadratic.Out);
    tweenA.chain(tweenB);
    tweenA.start();
  },






  /*------------------------------------------------------
    SPAWN COIN
  -------------------------------------------------------*/
  spawnCoin: function(){
    var coin;

    // get a random angle (in radians)
    var angle = 2 * Math.PI * Math.random();
    var xPos = this.game.world.centerX + (((this.game.world.width / 2) + 280) * Math.cos(angle));
    var yPos = this.game.world.centerY + (((this.game.world.height / 2) + 120) * Math.sin(angle));

    // If we have generated more spirtes than the maximum,
    // start recycling from pool of sprites
    if( this.game.coins_single >= this.game.coins_max ){
      // Revive first dead Coin
      var coin = this.coinsGroup.getFirstDead();
      coin.revive();
      coin.x = xPos;
      coin.y = yPos;
      coin.randomize();

    } else {
      // New Coin
      var coin = new Coin(this.game, xPos, yPos);
      //coin.onDissapear.add(this.coinOut, this);

      // Add coin to Group
      this.coinsGroup.add(coin);
      //console.log(this.coinsGroup.countLiving())

      //
      this.game.coins_single++
    }


    // Make sure that there´s at leat 1 'valid' coin
    if(this.coinsGroup.checkAll('valid', false, true)){
      coin.fixFrame(0, 0);
    }
    //console.log(this.coinsGroup.countLiving(), xPos, yPos)

    // Animation
    var showTween = this.game.add.tween(coin).from( {alpha: 0}, 300, Phaser.Easing.Linear.None, true);
    var scaleTween = this.game.add.tween(coin.scale).from( {x: 0, y: 0}, 300, Phaser.Easing.Back.Out, true);


    
    // Update coins count
    this.game.coins_total++;
  },




  /*------------------------------------------------------
    'ON COIN DOWN' HANDLER
  -------------------------------------------------------
  onDown: function(_sprite){
    var points_content;
    var points_flag = true;
    if(!_sprite.valid){
      points_content = '-20';
      points_flag = false;
      this.game.score -= 20;
      this.updateScore();

      // Display Points
      this.pointsDisplay(points_content, {x: _sprite.body.x, y: _sprite.body.y}, points_flag);
    }
  }*/

};


// EXPORT MODULE
module.exports = Play;
