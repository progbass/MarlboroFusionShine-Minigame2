HitDisplay = function (game, _content, _style, _flag) {
	Phaser.Group.call(this, game);
	this.valid = true;

	// Background
	this.icon = new Phaser.Sprite(this.game, 0, 0, 'hitDisplay')// = this.create(0, 0, 'hitDisplay');
	this.icon.anchor.setTo(.5,.5);
	//this.icon.scale.setTo(.7,.7);
	this.add(this.icon)
	//this.star.alignIn(this.back, Phaser.BOTTOM_CENTER);

	// Label
	var label = new Phaser.Text(this.game, -4, 3, _content, _style);
	label.anchor.setTo(.5,.5);
	label.fontSize = '25pt';
	label.fill = '#fbaf3f';
	if(!_flag){
		label.fontSize = '50pt';
		label.fill = '#ff0000';
		label.y = 20;
		this.valid = false;
		this.icon.visible = false;
	}
	this.add(label);
};

HitDisplay.prototype = Object.create(Phaser.Group.prototype);
HitDisplay.prototype.constructor = HitDisplay;
HitDisplay.prototype.create = function () {};
HitDisplay.prototype.update = function () {
	if(this.valid)
		this.icon.angle += 2;
};
module.exports = HitDisplay;
