'use strict';

// DECLARE MODULE
function Boot(){};
Boot.prototype = {

	/*--------------------------------------
	    ON PRELOAD
	---------------------------------------*/
  	preload: function() {},



	/*--------------------------------------
	    ON CREATE
	---------------------------------------*/
	create: function() {
		///////////////////////////
		// SCALE MANAGER
		///////////////////////////
	    this.game.scale.maxWidth = 1024;
	    this.game.scale.maxHeight = 728;
		this.game.scale.forceLandscape = true;
		this.game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		this.game.scale.pageAlignVertically = true;
		this.game.scale.pageAlignHorizontally = true;
		this.game.scale.setResizeCallback(this.adjust, this);
		this.adjust();
		this.game.scale.refresh();

  		///////////////////////////
		// STAGE PROPERTIES
		///////////////////////////
  		//this.game.stage.backgroundColor = '#6fb989';
	  	this.game.input.maxPointers = 1;


	  	///////////////////////////
		// PLAY NEXT SCENE
		///////////////////////////
	    this.game.state.start('preload');
	},



   adjust: function() {
   	// game holder size
    var divgame = document.getElementById("main-container");
    divgame.style.width = window.innerWidth + "px";
    divgame.style.height = window.innerHeight + "px";

    // Place 'close' button
    var close_btn = document.getElementById("btn_close");
    var game_outter_bounds = (this.game.canvas.offsetLeft + this.game.canvas.offsetWidth) - close_btn.offsetWidth ;
    close_btn.style.left = (game_outter_bounds - 15) + "px";
	
	this.game.scale.refresh();
  }
};

// EXPORT MODULE
module.exports = Boot;

