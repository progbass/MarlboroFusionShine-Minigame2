
  'use strict';
  function Guy() {}
  Guy.prototype = {
    create: function() {
      /*this.back = this.game.add.sprite(this.game.width/2, this.game.height/2, 'back');
      this.back.anchor.setTo(0.5, 0.5);
      this.back.inputEnabled = true;

      this.clouds = this.game.add.sprite(this.game.width/2, this.game.height/2, 'clouds');
      this.clouds.anchor.setTo(0.5, 0.5);
      this.kite = this.game.add.sprite(600, 60, 'kite');
      */


      this.game.physics.startSystem(Phaser.Physics.ARCADE);
      this.sprite = this.game.add.sprite(this.game.width/2, this.game.height, 'guy');
      this.sprite.inputEnabled = true;
      this.sprite.input.useHandCursor = true;
      this.sprite.input.enableDrag(false, true);
      this.sprite.input.setDragLock(true, false);
      this.sprite.input.boundsRect = new Phaser.Rectangle(0, 0, 800, 600);
      
      //this.game.physics.arcade.enable(this.sprite);
      //this.sprite.body.collideWorldBounds = true;
      //this.sprite.body.bounce.setTo(1, 0);
      //this.sprite.body.velocity.x = 300;//this.game.rnd.integerInRange(-500,500);
      //this.sprite.body.velocity.y = this.game.rnd.integerInRange(-500,500);

      // this.back.events.onInputDown.add(this.clickListener, this);
    },
    update: function() {

    },
    clickListener: function() {
      // this.game.state.start('gameover');
    }
  };
  
  module.exports = Guy;