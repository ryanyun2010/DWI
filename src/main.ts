import P5 from 'p5';
console.log("DDDD");
const CARD_WIDTH: number = 124.8;
const CARD_HEIGHT: number = 169;
const CARD_Y: number = 600;


class CardDef {
	name: string;
	energy_cost: number;
	description: string;
	actions: CardActions;
	constructor(name: string, energy_cost: number, description: string, actions: CardActions){
		this.name = name;
		this.energy_cost = energy_cost;
		this.description = description;
		this.actions = actions;
	}
}


class Card {
	name: string;
	energy_cost: number;
	description: string;
	actions: CardActions;
	constructor(name: string, energy_cost: number, description: string, actions: CardActions){
		this.name = name;
		this.energy_cost = energy_cost;
		this.description = description;
		this.actions = actions;
	}
	render(p5: P5, x: number, y: number, factor: number) {
		p5.fill(25);
		p5.stroke(90);
		p5.strokeWeight(2 * factor);
		let w = CARD_WIDTH * factor;
		let h = CARD_HEIGHT * factor;
		let rx = x - (CARD_WIDTH * (factor-1)/2);
		let ry = y - (CARD_HEIGHT * (factor-1)/2);
		p5.image(cardimg,rx,ry,w, h);	
		p5.noStroke();
		p5.textStyle(p5.NORMAL);
		p5.fill("white");
		p5.textSize(factor*10);
		p5.strokeWeight(2);
		p5.stroke("black");
		p5.textAlign(p5.CENTER);
		p5.text(this.name, rx + factor*62, ry+factor*25);
		p5.noStroke();
		p5.textSize(factor*13);
		p5.textStyle(p5.BOLD);
		p5.text(this.energy_cost, rx + factor*114, ry+factor*11.5);

		p5.textStyle(p5.NORMAL);
		p5.textSize(factor * 9);
		p5.text(this.description, rx + factor*19, ry+factor*110, factor * 86.8);
	}
}

class CardActions {
	onCast: (world: World, card: CardOnMouse) => void;
	onTarget: (world: World, card: CardTargeting) => void;
	constructor(onCast: (world: World, card: CardOnMouse) => void, onTarget: (world: World, card: CardTargeting) => void) {
		this.onCast = onCast;
		this.onTarget = onTarget;
	}
}

class CardTargeting {
	card: Card;
	index: number;
	targets: number[]; //ids of the enemies
	targets_left: number;
	total_targets: number;
	constructor(card: Card, index: number, targets: number) {
		this.card = card;
		this.index = index;
		this.targets = [];
		this.targets_left = targets;
		this.total_targets = targets;
	}
}
	
class CardOnMouse {
	card: Card;
	index: number;
	x_offset: number;
	y_offset: number;
	constructor(card: Card, index: number, x_offset: number, y_offset: number) {
		this.card = card;
		this.index = index;
		this.x_offset = x_offset;
		this.y_offset = y_offset;
	}
}


class Enemy {
	x: number;
	y: number;
	w: number;
	h: number;
	max_hp: number;
	hp: number;
	damage: number;
	constructor(x: number, y: number, w: number, h: number, hp: number, damage: number) {
		this.x = x;
		this.y = y;
		this.w = w;
		this.h = h;
		this.hp = hp;
		this.max_hp = hp;
		this.damage = damage;
	}
	render(p5: P5) {
		p5.textStyle(p5.NORMAL);
		p5.stroke("black");
		p5.strokeWeight(3);
		p5.fill("red");
		p5.rect(this.x, this.y, this.w, this.h);
		p5.fill(0);
		p5.strokeWeight(2);
		p5.rect(this.x - 25, this.y - 30, 100, 15);
		p5.fill("red");
		p5.rect(this.x - 24, this.y - 29, 98 * this.hp/this.max_hp, 13);
		p5.fill(255);
		p5.noStroke();
		p5.textStyle(p5.BOLD);
		p5.textSize(30);
		p5.text(this.damage, this.x + this.w/2, this.y + this.h/2 + 10);

	}
}



function shuffle(array) {
	  let currentIndex = array.length;

	  while (currentIndex != 0) {

		  let randomIndex = Math.floor(Math.random() * currentIndex);
		  currentIndex--;

		  [array[currentIndex], array[randomIndex]] = [
			  array[randomIndex], array[currentIndex]];
	  }
}

class World {
	player_hand: Card[];
	player_deck: Card[];
	draw_pos: number;
	card_on_mouse: CardOnMouse | null;
	cur_hovered_card: number | null;
	maxhp: number;
	hp: number;
	cur_energy: number;
	max_energy: number;
	enemies: Map<number,Enemy>;
	card_targeting: CardTargeting | null;
	cur_hovered_enemy: number | null;
	cant_afford_text: number;
	in_between_phase: boolean;
	s_e_d: Map<number, Enemy> | null;
	ibt_damage_dealt: boolean;
	
	constructor(){
		this.player_hand = [];
		this.card_on_mouse = null;
		this.maxhp = 20;
		this.hp = 20;
		this.cur_energy = 1;
		this.max_energy = 1;
		this.enemies = new Map();
		this.player_deck = [];
		this.draw_pos = 0;
		this.cant_afford_text = -1;
		this.in_between_phase = false;
		this.s_e_d = null;
		this.ibt_damage_dealt = false;
	}
	add_card_to_deck(card_def: CardDef) {
		this.player_deck.push(new Card(card_def.name, card_def.energy_cost, card_def.description, card_def.actions));
	}
	draw_card() {
		this.player_hand.push(this.player_deck[this.draw_pos]);
		this.draw_pos += 1;
		this.draw_pos %= this.player_deck.length;
	}
	next_turn() {
		if (this.in_between_phase) return;
		this.in_between_phase = true;
		this.s_e_d = new Map(JSON.parse(JSON.stringify(Array.from(this.enemies))));
		this.ibt_damage_dealt = false;
	}
	shuffle() {
		shuffle(this.player_deck);
	}
	update(){
		if (this.in_between_phase) {
			let something_happened = false;
			let d = false;
			for (let enemy of this.enemies) {
				let e = this.s_e_d.get(enemy[0]);
				if (e.y < 420) {
					console.log("FDD", enemy[1].y, e.y);
					if (enemy[1].y >= e.y + 80) {
						enemy[1].y = e.y + 80;
					}else {
						enemy[1].y += 2;
						something_happened = true;
					}
				}
				if (e.y >= 420) {
					if (this.ibt_damage_dealt) {
						if (enemy[1].y > 420) {
							enemy[1].y -= 4;
							something_happened = true;
						}else {
							enemy[1].y = 420;
						}
					}else {
						if (enemy[1].y >= 470) {
							d = true;
							this.hp -= enemy[1].damage;
							something_happened = true;
						}else{
							enemy[1].y += 6;
							something_happened = true;
						}
					}
				}
					
			}
			if (d) {
				this.ibt_damage_dealt = true;
			}
			if (!something_happened) {
				this.in_between_phase = false;
				this.draw_card();
				this.max_energy += 1;
				this.cur_energy = this.max_energy;
			}

		}
		else {
		for (let enemy of this.enemies) {
			if (enemy[1].hp <= 0) {
				this.enemies.delete(enemy[0]);
			}
		}
		}
	}
}


class Camera {
	camera_x: number;
	camera_y: number;
	constructor(){
		this.camera_x = 0;
		this.camera_y = 0;
	}
	render(p5: P5, world: World){

		p5.stroke(190);
		p5.strokeWeight(3.5);
		for (let x = 0; x < WIDTH; x+= 45) {
			p5.line(x, 125, x+25, 125);
		}
		for (let x = 0; x < WIDTH; x+= 45) {
			p5.line(x, 205, x+25, 205);
		}
		for (let x = 0; x < WIDTH; x+= 45) {
			p5.line(x, 285, x+25, 285);
		}
		for (let x = 0; x < WIDTH; x+= 45) {
			p5.line(x, 365, x+25, 365);
		}
		p5.stroke(255,30,30);
		for (let x = 0; x < WIDTH; x+= 45) {
			p5.line(x, 445, x+25, 445);
		}
		for (let enemy of world.enemies) {
			enemy[1].render(p5);
		}

		let hovered_card: number = null;
		let total_width = Math.min(85 * world.player_hand.length, 900); // 180
		let individual_width = total_width/world.player_hand.length; // 60
		if (world.card_on_mouse == null) {
			for (let i = 0; i < world.player_hand.length; i++) {
				let x = (WIDTH-total_width-CARD_WIDTH)/2.0 + individual_width * i;
				let w = CARD_WIDTH;
				let h = CARD_HEIGHT;
				let y = CARD_Y;
				if (i+1 == world.cur_hovered_card) {
					w-=40.1;
				}
				if (i == world.cur_hovered_card) {
					x-= 6.1;
					w+=7;
					y -= 8.45;
					h += 16.9;
				}

				if (p5.mouseY >= y && p5.mouseY <= y + h && p5.mouseX >= x && p5.mouseX <= x + w) {
					hovered_card = i;
					break;
				}
			}
		}
		world.cur_hovered_card = hovered_card;


		for (let i = world.player_hand.length - 1; i >= 0; i--) {
			let card = world.player_hand[i];
			let x = (WIDTH-total_width-CARD_WIDTH)/2.0 + individual_width * i;
			if (!(i==hovered_card)) {
				card.render(p5, x,CARD_Y, 1);
			}
		}
		if (hovered_card != null) {
			let x = (WIDTH-total_width-CARD_WIDTH)/2.0 + individual_width * hovered_card;
			world.player_hand[hovered_card].render(p5, x,CARD_Y, 1.1);
			world.player_hand[hovered_card].render(p5, 1100,300, 2.6);
		}

		p5.image(hpb, 50,50, 350, 25);
		p5.noStroke();
		p5.fill("red");
		p5.rect(51.7,52,346.6 * world.hp/world.maxhp,21);
		
		for (let i = 0; i < world.cur_energy; i++) {
			p5.image(eb, 48 + (i%10) * 36.5,80 + 36.5 * Math.floor(i/10), 27, 27);
		}


		if (world.card_on_mouse != null) {
			world.card_on_mouse.card.render(p5, p5.mouseX + world.card_on_mouse.x_offset,p5.mouseY + world.card_on_mouse.y_offset, 1.3);
		}
		if (world.card_targeting != null) {
			world.card_targeting.card.render(p5, 900,250, 1.5);
			targetingLine(p5, 870 + CARD_WIDTH * 1.5/2, 350, p5.mouseX, p5.mouseY);

			world.cur_hovered_enemy = null;
			for (let enemy of world.enemies) {
				if (enemy[1].x + enemy[1].w > p5.mouseX && enemy[1].x < p5.mouseX && enemy[1].y + enemy[1].h > p5.mouseY && enemy[1].y < p5.mouseY) {
					world.cur_hovered_enemy = enemy[0];
				}
			}

			if (world.cur_hovered_enemy != null) {
				let e = world.enemies.get(world.cur_hovered_enemy);
				p5.stroke(255,0,0);
				p5.strokeWeight(5);
				p5.line(e.x-10, e.y-10, e.x-10, e.y);
				p5.line(e.x-10, e.y-10, e.x, e.y-10);
				p5.line(e.x+e.w+10, e.y-10, e.x+e.w, e.y-10);
				p5.line(e.x+e.w+10, e.y-10, e.x+e.w+10, e.y);
				p5.line(e.x-10, e.y+e.h+10, e.x, e.y + e.h + 10);
				p5.line(e.x-10, e.y+e.h+10, e.x - 10, e.y + e.h);
				p5.line(e.x+e.h+10, e.y+e.h+10, e.x +e.h, e.y + e.h+10);
				p5.line(e.x+e.h+10, e.y+e.h+10, e.x +e.h+10, e.y + e.h);

			}
			for (let target of world.card_targeting.targets) {
				let e = world.enemies.get(target);
				p5.stroke(255,0,0);
				p5.strokeWeight(5);
				p5.line(e.x-10, e.y-10, e.x-10, e.y);
				p5.line(e.x-10, e.y-10, e.x, e.y-10);
				p5.line(e.x+e.w+10, e.y-10, e.x+e.w, e.y-10);
				p5.line(e.x+e.w+10, e.y-10, e.x+e.w+10, e.y);
				p5.line(e.x-10, e.y+e.h+10, e.x, e.y + e.h + 10);
				p5.line(e.x-10, e.y+e.h+10, e.x - 10, e.y + e.h);
				p5.line(e.x+e.h+10, e.y+e.h+10, e.x +e.h, e.y + e.h+10);
				p5.line(e.x+e.h+10, e.y+e.h+10, e.x +e.h+10, e.y + e.h);
			}

		}



		p5.stroke(20);
		p5.strokeWeight(3);
		p5.fill(0,150,200);
		if (p5.mouseX > 900 && p5.mouseX < 1000 && p5.mouseY > CARD_Y - 80 && p5.mouseY < CARD_Y - 30 && world.card_targeting == null) {
			p5.fill(200,200,240);
		}
		p5.rect(900,CARD_Y - 80,100,50, 14);
		p5.textAlign(p5.CENTER);
		p5.noStroke();
		p5.textSize(20);
		p5.textStyle(p5.BOLD);
		p5.fill(90, 150);
		p5.text("End Turn", 953, CARD_Y - 47);
		p5.fill(255);
		p5.text("End Turn", 950, CARD_Y - 50);


		if (world.card_targeting != null && world.card_targeting.total_targets > 1) {
			p5.stroke(20);
			p5.strokeWeight(3);
			p5.fill(200,150,0);
			if (p5.mouseX > 265 && p5.mouseX < 430 && p5.mouseY > CARD_Y - 80 && p5.mouseY < CARD_Y - 30) {
				p5.fill(240,200,200);
			}
			p5.rect(265,CARD_Y - 80,170,50, 14);
			p5.textAlign(p5.CENTER);
			p5.noStroke();
			p5.textSize(20);
			p5.textStyle(p5.BOLD);
			p5.fill(90, 150);
			p5.text("Confirm Targets", 353, CARD_Y - 47);
			p5.fill(255);
			p5.text("Confirm Targets", 350, CARD_Y - 50);
		}

		if (world.cant_afford_text >= 0) {
			p5.stroke(180,50,50, world.cant_afford_text/20 * 255);
			p5.strokeWeight(5);
			p5.textSize(40);
			p5.textStyle(p5.BOLD);
			p5.fill(225,30,30, world.cant_afford_text/20 * 255);
			p5.text("Not enough energy", WIDTH/2, HEIGHT/2);
		}
		world.cant_afford_text -= 1;

	}
}

function drawDashedBezier(p5: P5, x1: number, y1: number, cx: number, cy: number, x2: number, y2: number, dashLength: number, gapLength: number) {
	let totalLength = 0;
	let prev = p5.createVector(x1, y1);
	let steps = 100;

	for (let t = 0; t <= 1; t += 1.0 / steps) {
		let x = p5.bezierPoint(x1, cx, cx, x2, t);
		let y = p5.bezierPoint(y1, cy, cy, y2, t);
		let current = p5.createVector(x, y);
		let segLength = P5.Vector.dist(prev, current);

		if (p5.floor(totalLength / (dashLength + gapLength)) % 2 === 0) {
			p5.stroke(20);
			p5.strokeWeight(5);
			p5.line(prev.x, prev.y, current.x, current.y);
		}

		totalLength += segLength;
		prev = current;
	}
}
function drawArrowhead(p5: P5, x1: number, y1: number, cx: number, cy: number, x2: number, y2: number) {
	let t = 1;
	let dx = p5.bezierTangent(x1, cx, cx, x2, t);
	let dy = p5.bezierTangent(y1, cy, cy, y2, t);
	let angle = p5.atan2(dy, dx);

	p5.push();
	p5.translate(x2, y2);
	p5.rotate(angle);
	p5.fill(20);
	p5.stroke("black");
	p5.strokeWeight(3);
	p5.triangle(0, 0, -20, -10, -20, 10);
	p5.pop();
}
function targetingLine(p5: P5, x_start: number, y_start: number, x_end: number, y_end: number) {
	drawDashedBezier(p5, x_start, y_start, (x_start + x_end)/2, p5.min(y_start, y_end) - 150,x_end, y_end, 10, 10);
	drawArrowhead(p5, x_start, y_start, (x_start + x_end)/2, p5.min(y_start, y_end) - 150,x_end, y_end);
}
const HEIGHT: number = 816;
const WIDTH: number = 1470;


let world = new World();
let camera = new Camera();
const card_1 = new CardDef("card 1", 1, "deal 1 damage to target enemy", new CardActions(
	(world: World, card: CardOnMouse) => {
		world.card_targeting = new CardTargeting(card.card, card.index, 1); 
	},
	(world: World, card: CardTargeting) => {
		world.enemies.get(card.targets[0]).hp -= 1;
		world.cur_energy -= card.card.energy_cost;
	}
));
const card_2 = new CardDef("card 2", 3, "deal 2 damage to up to 3 target enemies", new CardActions(
	(world: World, card: CardOnMouse) => {
		world.card_targeting = new CardTargeting(card.card, card.index, 3); 
	},
	(world: World, card: CardTargeting) => {
		for (let target of card.targets) {
			world.enemies.get(target).hp -= 2;
		}
		world.cur_energy -= card.card.energy_cost;
	}
))
const card_3 = new CardDef("card 3", 4, "deal 3 damage to up to 2 target enemies, draw a card", new CardActions(
	(world: World, card: CardOnMouse) => {
		world.card_targeting = new CardTargeting(card.card, card.index, 2); 
	},
	(world: World, card: CardTargeting) => {
		for (let target of card.targets) {
			world.enemies.get(target).hp -= 3;
		}
		world.draw_card();
		world.cur_energy -= card.card.energy_cost;
	}
))
for (let i = 0; i < 30; i++) {
	world.add_card_to_deck(card_1);
}
for (let i = 0; i < 12; i++) {
	world.add_card_to_deck(card_2);
}
for (let i = 0; i < 8; i++) {
	world.add_card_to_deck(card_3);
}
world.shuffle();
world.draw_card();
world.draw_card();
world.draw_card();
world.enemies.set(0, new Enemy(500,100,50,50,10, 5));
world.enemies.set(1, new Enemy(900,100,50,50,7, 8));
world.draw_card();
world.draw_card();
world.draw_card();
world.draw_card();

let cardimg: P5.Image;
let hpb: P5.Image;
let eb: P5.Image;
const sketch = (p5: P5) => { 
	p5.preload = async function() {
		cardimg = p5.loadImage("https://ryanyun2010.github.io/DWI/img/card.png");
		eb = p5.loadImage("https://ryanyun2010.github.io/DWI/img/energy.png");
		hpb = p5.loadImage("https://ryanyun2010.github.io/DWI/img/hp.png");
	}

	p5.setup = function () {
		console.log("test");
		p5.createCanvas(WIDTH,HEIGHT);
	}

	p5.draw = function draw() {
		p5.background(220);
		world.update();
		camera.render(p5, world);
	}
	p5.mousePressed = function() {
		if (world.in_between_phase) return;
		if (world.card_on_mouse == null) {
			let hovered_card: number = null;
			let hcx = null;
			let total_width = Math.min(85 * world.player_hand.length, 900); // 180
			let individual_width = total_width/world.player_hand.length; // 60
			for (let i = 0; i < world.player_hand.length; i++) {
				let x = (WIDTH-total_width-CARD_WIDTH)/2.0 + individual_width * i;
				let w = CARD_WIDTH;
				let h = CARD_HEIGHT;
				let y = CARD_Y;
				if (i+1 == world.cur_hovered_card) {
					w-=40.1;
				}
				if (i == world.cur_hovered_card) {
					x-= 6.1;
					w+=7;
					y -= 8.45;
					h += 16.9;
				}

				if (p5.mouseY >= y && p5.mouseY <= y + h && p5.mouseX >= x && p5.mouseX <= x + w) {
					hovered_card = i;
					hcx = x;
					break;
				}
			}
			if (hovered_card != null) {
				world.card_on_mouse = new CardOnMouse(world.player_hand[hovered_card],hovered_card, hcx - p5.mouseX, CARD_Y - p5.mouseY);
				world.player_hand.splice(hovered_card,1);
			}
		}
		if (world.card_targeting != null && world.cur_hovered_enemy != null) {
			world.card_targeting.targets.push(world.cur_hovered_enemy);
			world.card_targeting.targets_left --;
			if (world.card_targeting.targets_left == 0) {
				world.card_targeting.card.actions.onTarget(world, world.card_targeting);
				world.card_targeting = null;
			}
		}
		if (world.card_targeting != null && world.cur_hovered_enemy == null) {
			if (p5.mouseX > 265 && p5.mouseX < 430 && p5.mouseY > CARD_Y - 80 && p5.mouseY < CARD_Y - 30 && world.card_targeting.total_targets >= 1) {
				world.card_targeting.card.actions.onTarget(world, world.card_targeting);
				world.card_targeting = null;
			}else {
				world.player_hand.splice(world.card_targeting.index, 0, world.card_targeting.card);
				world.card_targeting = null;
			}
		}
		if (p5.mouseX > 900 && p5.mouseX < 1000 && p5.mouseY > CARD_Y - 80 && p5.mouseY < CARD_Y - 30 && world.card_targeting == null) {
			world.next_turn();
		}
	}
	p5.mouseReleased = function () {
		if (world.card_on_mouse != null) {
			if (p5.mouseX > 0 && p5.mouseX < WIDTH && p5.mouseY > 0 && p5.mouseY < CARD_Y - 50) {
				if (world.cur_energy >= world.card_on_mouse.card.energy_cost) {
					world.card_on_mouse.card.actions.onCast(world, world.card_on_mouse);
					world.card_on_mouse = null;
				}else {
					world.cant_afford_text = 20;
					world.player_hand.splice(world.card_on_mouse.index, 0, world.card_on_mouse.card);
					world.card_on_mouse = null;
				}
			}else {
				world.player_hand.splice(world.card_on_mouse.index, 0, world.card_on_mouse.card);
				world.card_on_mouse = null;
			}
		}
	}

}

new P5(sketch);
