
'use strict';
function Intro() {}

Intro.prototype = {
  preload: function() {

  },
  create: function() {
    this.shop = this.game.add.sprite(0, 0, 'intro');
    
    ///////////////////////////
    // FOOTER
    ///////////////////////////
    this.footer = this.game.add.sprite(0, 0, 'footer');
    this.footer.alignIn(this.shop, Phaser.BOTTOM_CENTER);

    // Animate elements
    this.game.add.tween(this.shop).from( { alpha: 0 }, 1600, Phaser.Easing.Quartic.Out, true);
    //this.game.add.tween(this.machine).from( { x: -this.machine.width }, 1600, Phaser.Easing.Quartic.Out, true, 300);
    //this.game.add.tween(this.guy).from( { x: -this.guy.width }, 1300, Phaser.Easing.Quartic.Out, true, 800);
    

    // PLAY NEXT SCENE
    this.game.time.events.add(Phaser.Timer.SECOND * 3, function(){
      // State Transition
      var slideIn = Phaser.Plugin.StateTransition.Out.SlideTop;
      var slideOut = Phaser.Plugin.StateTransition.In.SlideTop;
      slideIn.duration = 1500;
      slideOut.duration = 1500;
      this.game.state.start('features_intro', slideIn, slideOut);
    }, this);  
  },

  update: function() {}
};

module.exports = Intro;
