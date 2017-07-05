
'use strict';
function Features() {}

Features.prototype = {
  /*--------------------------------------
    ON CREATE
  ---------------------------------------*/
  create: function() {
      ///////////////////////////
      // BACKGROUND
      ///////////////////////////
      this.background = this.game.add.sprite(0, 0, 'shop');

      // Add Footer
      this.footer = this.game.add.sprite(0, 0, 'footer');
      this.footer.alignIn(this.background, Phaser.BOTTOM_CENTER);


      ///////////////////////////
      // CONFIG SCENE
      ///////////////////////////
      this.game.time.events.add(1000, this.configScene.bind(this));


      ///////////////////////////
      // PLAY NEXT SCENE
      ///////////////////////////
      // Play scene after a fixed time interval
      this.delay = Phaser.Timer.SECOND * 8;
      this.game.time.events.add(this.delay, function(){
        // State Transition
        var slideIn = Phaser.Plugin.StateTransition.Out.SlideLeft;
        var slideOut = Phaser.Plugin.StateTransition.In.SlideLeft;
        slideIn.duration = 1000;
        slideOut.duration = 1000;

        this.game.state.start('gameover', slideIn, slideOut);
      }, this); 
  },


  configScene: function(){

      ///////////////////////////
      // ICONS
      ///////////////////////////
      this.icon1 = new Coin(this.game, 580, 480, 0);
      this.game.add.existing(this.icon1);
      this.icon1.scale.setTo(1.12, 1.12);
      this.icon1.body.enable = false;
      this.icon1.timeActive = false;
      //this.icon1.fixFrame(0, 0);

      // Icon 2
      this.icon2 =  this.game.add.sprite(390, 480, 'coin');
      this.icon2.frame = 1;
      this.icon2.anchor.setTo(.5, .5);

      // Icon 3
      this.icon3 =  this.game.add.sprite(185, 480, 'coin');
      this.icon3.frame = 2;
      this.icon3.anchor.setTo(.5, .5);

      // Icon 4
      this.icon4 =  this.game.add.sprite(480, 340, 'coin');
      this.icon4.frame = 6;
      this.icon4.anchor.setTo(.5, .5);
      this.icon4.scale.setTo(1.3, 1.3);


      // Cajetilla
      this.cajetilla =  this.game.add.sprite(820, 330, 'cajetilla');
      this.cajetilla.anchor.setTo(.5, .5);

      // Instrucciones
      this.header = this.game.add.sprite(100, 90, 'features_end');


      ///////////////////////////
      // INIT ANIMATION
      ///////////////////////////
      this.initAnimation()

  },




  /*--------------------------------------
    INIT ANIMATION
  ---------------------------------------*/
  initAnimation: function(){

    // Animate elements
    this.game.add.tween(this.header).from( { alpha: 0, y: this.header.y - 40 }, 800, Phaser.Easing.Quartic.Out, true, 240, 0);
    
    // In Icons
    var iconTween1 = this.game.add.tween(this.icon2.scale).from( { x: 0, y: 0 }, 980, Phaser.Easing.Elastic.Out, true, 680, 0);
    var iconTween2 = this.game.add.tween(this.icon1.scale).from( { x: 0, y: 0 }, 980, Phaser.Easing.Elastic.Out, true, 1080, 0);
    var iconTween3 = this.game.add.tween(this.icon3.scale).from( { x: 0, y: 0 }, 980, Phaser.Easing.Elastic.Out, true, 980, 0);
    var iconTween4 = this.game.add.tween(this.icon4.scale).from( { x: 0, y: 0 }, 980, Phaser.Easing.Elastic.Out, true, 1100, 0);
    var cajetillaTween = this.game.add.tween(this.cajetilla).from( { alpha: 0, x: this.cajetilla.x + 40 }, 1100, Phaser.Easing.Quartic.Out, true, 1120);
  }

};

module.exports = Features;
