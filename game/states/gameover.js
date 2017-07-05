
'use strict';
function GameOver() {}

GameOver.prototype = {
  preload: function () {

  },
  create: function () {

      //
      this.back = this.game.add.sprite(this.game.width/2, this.game.height/2, 'shop_end');
      this.back.anchor.setTo(0.5, 0.5);
      this.back.inputEnabled = true;

      
      // Add Footer
      this.footer = this.game.add.sprite(0, 0, 'footer');
      this.footer.alignIn(this.back, Phaser.BOTTOM_CENTER);


      //this.text_1 = this.game.add.text(this.game.width/2, 220, '¡EXCELENTE JUEGO!', this.game.font_style);
      //this.text_2 = this.game.add.text(this.game.width/2, 340, 'TU PUNTAJE FINAL ES:', this.game.font_style);
      this.text_3 = this.game.add.text(this.world.centerX+240, 425, this.game.getFormattedScore()+' PTS', this.game.font_style);
      ///this.replay_btn = this.game.add.text(this.game.width/2, 580, '< VOLVER A JUGAR', this.game.font_style);


      //this.text_1.fill = this.text_2.fill = this.text_3.fill = "#FFFFFF";
      //this.text_1.wordWrapWidth = '1000';
      //this.text_1.fontSize = '72pt';
      //this.text_2.fontSize = '50pt';
      this.text_3.fontSize = '80pt';
      this.text_3.angle = -8;
      ///this.replay_btn.fontSize = '22pt';
      //this.text_1.anchor.set(0.5);
      //this.text_2.anchor.set(0.5);
      this.text_3.anchor.set(0.5);
      ///this.replay_btn.anchor.set(0.5);
      //this.text_1.font = 'Neutra Text Bold';
      //this.text_2.font = 'Neutra Text Bold';
      this.text_3.font = 'YouDecide M';
      ///this.replay_btn.font = 'Neutra Text Bold';
      //this.end = this.game.add.sprite(this.game.width/2, this.game.height/2, 'end');
      //this.end.anchor.setTo(0.5, 0.5);

      //
      //this.game.add.tween(this.end).from( { alpha: 0 }, 980, Phaser.Easing.Circular.Out, true);

  },


  update: function () { 
    
    this.game.time.events.add(Phaser.Timer.SECOND * 2, function(){
      if(this.game.input.activePointer.justPressed()) {
        // Play state
        this.game.endGame = false;

        // Start Game Over State
        var slideIn = Phaser.Plugin.StateTransition.Out.SlideRight;
        var slideOut = Phaser.Plugin.StateTransition.In.SlideRight;
        slideIn.duration = 500;
        slideOut.duration = 500;
        this.game.state.start('instructions', slideIn, slideOut);
      }
    }, this);  
  }
};
module.exports = GameOver;
