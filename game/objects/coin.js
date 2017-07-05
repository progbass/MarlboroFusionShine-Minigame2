Coin = function (game, _x, _y, _frame) {
	Phaser.Sprite.call(this, game, _x, _y, 'coin');

	// Properties
    this.init = true;
    this.game.physics.arcade.enable(this);
    this.name = 'coin' + this.game.coins_total.toString();
    this.liveInterval = 0;
    this.timeActive = false;
    this.timeInit = 0;
    this.timeDelay = 0;
	this.dragged = false;
    this.dragger_init = false;
    this.thrown = false;
	this.static = false;
    this.anchor.setTo(.5,.5);
    this.lastInputX = 0;
    this.lastInputY = 0;
    this.onDissapear = new Phaser.Signal();
	this.lastPosition = new Phaser.Point()

    this.label = this.addChild( new Phaser.Text(this.game, 0, -10, '', this.game.font_style) );
	this.label.anchor.setTo(.5, .5);
	this.label.fill = '#ffffff';
	this.label.fontSize = '60pt';
	this.label2 = this.addChild( new Phaser.Text(this.game, -5, 45, '', this.game.font_style) );
	this.label2.anchor.setTo(.5, .5);
	this.label2.fill = '#ffffff';
	this.label2.fontSize = '14pt';

    // 
    this.randomize(_frame);
};

Coin.prototype = Object.create(Phaser.Sprite.prototype);
Coin.prototype.constructor = Coin;
Coin.prototype.create = function () {};

Coin.prototype.randomize = function(_frame){
    //
    if(_frame != undefined)
    	this.fixFrame(_frame, 0);
   	else
    	this.randomFrame();
};

  /*--------------------------------------
    'DRAG' EVENTS
  ---------------------------------------*/
 Coin.prototype.startDrag = function(e){
 	this.lastPosition.set(e.position.x, e.position.y);
    this.dragged = true;
    this.dragger_init = true;
    this.thrown = false;
 }
 Coin.prototype.stopDrag = function(e){
    this.dragged = false;

    //
    var averageVel = Math.sqrt( Math.abs(this.body.velocity.x)) * Math.sqrt( Math.abs(this.body.velocity.y));
    if( averageVel > 180 ){
        this.thrown = true;
        this.body.friction = .2;

        this.body.onWorldBounds = new Phaser.Signal();
        this.body.onWorldBounds.add( function(sprite, up, down, left, right) {
            sprite.body.onWorldBounds.removeAll();
            sprite.thrown = false;
        });
    }
 }



Coin.prototype.update = function() {

    //
    if( this.timeActive && this.game.time.time >= this.timeInit+(Phaser.Timer.SECOND * this.timeDelay)){
        this.dissapearHandler();
    }

    if( this.init ){
        var distx = this.game.world.centerX - this.body.x;
        var posx = (distx) * .08;
        var disty = this.game.world.centerY - this.body.y;
        var posy = (disty) * .08;
        this.body.x += posx;
        this.body.y += posy;

        if(this.isOnStage()){
            this.init = false;
            this.body.velocity.x = 100 + ((this.game.level_speed*16) * this.game.rnd.frac());
            this.body.velocity.y = 100 + ((this.game.level_speed*16) * this.game.rnd.frac());

        }
        
    }


	// If mouse is being dragged 
    if( this.dragged ){
        var xvel = (this.game.input.activePointer.x - this.lastPosition.x) * 8;
        var yvel = (this.game.input.activePointer.y - this.lastPosition.y) * 8;
        this.body.velocity.x = xvel;
        this.body.velocity.y = yvel;
        this.lastPosition.set(this.game.input.activePointer.x, this.game.input.activePointer.y);

      // If body exists, follow pointer
      if( this.body != null ){
        var distx = this.game.input.activePointer.worldX - this.body.width/2;
        var posx = (distx - this.body.x) * .2;
        var disty = this.game.input.activePointer.worldY - this.body.width/2;
        var posy = (disty - this.body.y) * .2;
        this.body.x += posx;
        this.body.y += posy;
      }
    }

};


Coin.prototype.isOnStage = function(){
    if( (this.body.x > 0 && this.body.x < this.game.world.width) && (this.body.y > 0 && this.body.y < this.game.world.height) ){
        this.body.collideWorldBounds = true;
        return true;
    }
    return false;
}


Coin.prototype.setupFrame = function(_label) {
	// Sprite Configuration
	this.valid = (this.frame == 3 || this.frame == 4 || this.frame == 5) ? false : true;
	this.label.text = '';
	this.label2.text = '';
    this.scale.x = this.scale.y = 1;
    this.alpha = 1;

    // Enable Interaction
    this.inputEnabled = true;
    this.input.useHandCursor = true;
    this.events.onInputDown.removeAll();
    this.events.onInputUp.removeAll();
    this.events.onKilled.removeAll();
    this.events.onInputDown.add(this.startDrag, this);
    this.events.onInputUp.add(this.stopDrag, this);
    this.events.onKilled.add(function(){
    	this.timeActive = false;
    }, this);

    // Sprite Body
    this.init = true;
    this.game.physics.arcade.enable(this, Phaser.Physics.ARCADE);
    this.body.bounce.set(1);
    this.body.collideWorldBounds = false;
    this.body.velocity.x = 0;
	this.body.velocity.y = 0;


    // Drag State
    this.dragger_init = false;
    this.dragged = false;
    this.thrown = false;


	// Living Time Lapse
	this.timeActive = true;
	this.timeInit = this.game.time.time;
    this.timeDelay = this.valid ? 8 : 5;

	// Specific Sprite Configuration
	switch(this.frame){
		case 0:
			var precios = [{tint: 0xff0000, label: '$41'}, {tint: 0x00ff00, label: '$61'}, {tint: 0x0000ff, label: '$55'}, {tint: 0xff00ff, label: '$38'}];
			var precio_random = _label != undefined ? _label : Math.round(this.game.rnd.integerInRange(0, precios.length-1));
			this.label.text = precios[precio_random].label;
			this.label2.text = 'PRECIO SUGERIDO';
			this.scale.setTo(.9, .9);
			if(precio_random != 0){
			  this.valid = false;
			}

			//
			this.body.setSize(this.width - 75, this.height - 70, 40, 47);

			break;

		case 1:
			this.scale.setTo(.9, .9);
			this.body.setSize(150, 100, 16, 40);
			break;

		case 2:
			this.body.setSize(170, 130, 5, 25);
			break;

		case 3:
			this.scale.setTo(.9, .9);
			this.body.setSize(145, 100, 15, 47);
			break;

		case 4:
			this.body.setSize(130, 58, 14, 62);
			break;

		case 5:
			this.body.setSize(this.width - 50, this.height - 75, 20, 35);
			break;

		case 6:
			this.body.setSize(this.width - 15, this.height - 120, 5, 60);
			break;
	}
};

Coin.prototype.dissapearHandler = function(){
	this.timeActive = false;
    this.body.velocity.set(0, 0);
	if(this.valid) this.onDissapear.dispatch();
    var lostTween = this.game.add.tween(this).to( {alpha: 0}, 600, Phaser.Easing.Back.In, true);
;
	//var lostTween = this.game.add.tween(this.scale).to( { x: 0, y: 0 }, 600, Phaser.Easing.Back.In, true);
;
	lostTween.onComplete.add(function (){
		this.kill();
    }, this);
}

Coin.prototype.randomFrame = function(){
	// Frame Configuration
    this.frame = this.game.rnd.integerInRange(0, 6);
    this.setupFrame();
};



Coin.prototype.fixFrame = function(_frame, _label) {    
	// 
    this.frame = _frame;
    this.setupFrame(_label);
};


module.exports = Coin;
