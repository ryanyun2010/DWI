"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const p5_1 = __importDefault(require("p5"));
const CARD_WIDTH = 124.8;
const CARD_HEIGHT = 169;
const CARD_Y = 600;
var EB;
(function (EB) {
    EB[EB["Speedy"] = 0] = "Speedy";
    EB[EB["Big"] = 1] = "Big";
})(EB || (EB = {}));
const START_LEVELS = [
    [
        [[5, 5, []]],
        [],
        [[8, 3, []]],
        [[3, 3, []]],
        [],
        [[4, 4, []]],
        [],
        [[5, 10, []]],
        [[6, 4, [EB.Speedy]]]
    ],
    [
        [[6, 5, []]],
        [],
        [[5, 6, []]],
        [[4, 4, [EB.Speedy]]],
        [],
        [[6, 4, []]],
        [[3, 15, []]],
        [[4, 6, []], [5, 4, [EB.Speedy]]],
        [[8, 2, []], [12, 6, []]]
    ],
    [
        [[4, 5, []], [4, 5, [EB.Speedy]]],
        [],
        [[5, 5, [EB.Speedy]], [5, 5, []]],
        [[4, 4, []]],
        [],
        [[6, 6, []], [6, 6, []]],
        [[15, 3, [EB.Speedy]]],
        [],
        [[5, 5, []], [12, 6, []],],
        [[20, 20, [EB.Big]]]
    ],
];
let LEVELS = [];
var CardImage;
(function (CardImage) {
    CardImage[CardImage["NONE"] = 0] = "NONE";
    CardImage[CardImage["NULL"] = 1] = "NULL";
    CardImage[CardImage["PANDA"] = 2] = "PANDA";
    CardImage[CardImage["IGNORE"] = 3] = "IGNORE";
    CardImage[CardImage["THIS"] = 4] = "THIS";
    CardImage[CardImage["Fireball1"] = 5] = "Fireball1";
    CardImage[CardImage["Fireball2"] = 6] = "Fireball2";
    CardImage[CardImage["Lightning"] = 7] = "Lightning";
    CardImage[CardImage["Crusade"] = 8] = "Crusade";
    CardImage[CardImage["Rock"] = 9] = "Rock";
})(CardImage || (CardImage = {}));
var CardColor;
(function (CardColor) {
    CardColor[CardColor["NONE"] = 0] = "NONE";
    CardColor[CardColor["NULL"] = 1] = "NULL";
    CardColor[CardColor["PANDA"] = 2] = "PANDA";
    CardColor[CardColor["IGNORE"] = 3] = "IGNORE";
    CardColor[CardColor["THIS"] = 4] = "THIS";
    CardColor[CardColor["Blue"] = 5] = "Blue";
    CardColor[CardColor["White"] = 6] = "White";
    CardColor[CardColor["Green"] = 7] = "Green";
    CardColor[CardColor["Red"] = 8] = "Red";
})(CardColor || (CardColor = {}));
class CardDef {
    constructor(name, energy_cost, description, actions, t_size, card_image, card_color) {
        this.name = name;
        this.energy_cost = energy_cost;
        this.description = description;
        this.actions = actions;
        this.t_size = t_size || 9;
        this.card_image = (card_image != null) ? card_image : CardImage.Lightning;
        this.card_color = (card_color != null) ? card_color : CardColor.Blue;
    }
}
class Card {
    constructor(name, energy_cost, description, actions, t_size, card_image, card_color, discardable) {
        this.name = name;
        this.energy_cost = energy_cost;
        this.description = description;
        this.actions = actions;
        this.t_size = t_size || 9;
        this.card_image = card_image || CardImage.Lightning;
        this.base_energy_cost = energy_cost;
        this.tracker = 0;
        this.discardable = (discardable != null) ? discardable : true;
        this.card_color = (card_color != null) ? card_color : CardColor.Blue;
    }
    desc() {
        return this.description(additional_damage, this.tracker);
    }
    render(p5, x, y, factor) {
        p5.fill(25);
        p5.stroke(90);
        p5.strokeWeight(2 * factor);
        let w = CARD_WIDTH * factor;
        let h = CARD_HEIGHT * factor;
        let rx = x - (CARD_WIDTH * (factor - 1) / 2);
        let ry = y - (CARD_HEIGHT * (factor - 1) / 2);
        if (this.card_color == CardColor.Blue) {
            p5.image(cardimgbl, rx, ry, w, h);
        }
        if (this.card_color == CardColor.White) {
            p5.image(cardimgwh, rx, ry, w, h);
        }
        if (this.card_color == CardColor.Green) {
            p5.image(cardimggr, rx, ry, w, h);
        }
        if (this.card_color == CardColor.Red) {
            p5.image(cardimgre, rx, ry, w, h);
        }
        p5.noStroke();
        p5.textStyle(p5.NORMAL);
        p5.fill("white");
        p5.textSize(factor * 10);
        p5.strokeWeight(2);
        p5.stroke("black");
        p5.textAlign(p5.CENTER);
        if (this.card_image == CardImage.Lightning) {
            p5.image(li, rx + factor * 20.4, ry + factor * 26, w * 2 / 3, h * 7 / 20);
        }
        if (this.card_image == CardImage.Fireball1) {
            p5.image(f1, rx + factor * 20.4, ry + factor * 26, w * 2 / 3, h * 7 / 20);
        }
        if (this.card_image == CardImage.Fireball2) {
            p5.image(f2, rx + factor * 20.4, ry + factor * 26, w * 2 / 3, h * 7 / 20);
        }
        if (this.card_image == CardImage.Crusade) {
            p5.image(cru, rx + factor * 20.4, ry + factor * 26, w * 2 / 3, h * 7 / 20);
        }
        if (this.card_image == CardImage.Rock) {
            p5.image(roc, rx + factor * 20.4, ry + factor * 26, w * 2 / 3, h * 7 / 20);
        }
        if (this.card_color == CardColor.Blue) {
            p5.image(cardtopbl, rx - factor * 6, ry + factor * 9.5, w * 1.1, h * 9 / 40);
        }
        if (this.card_color == CardColor.White) {
            p5.image(cardtopwh, rx - factor * 6, ry + factor * 9.5, w * 1.1, h * 9 / 40);
        }
        if (this.card_color == CardColor.Green) {
            p5.image(cardtopgr, rx - factor * 6, ry + factor * 9.5, w * 1.1, h * 9 / 40);
        }
        if (this.card_color == CardColor.Red) {
            p5.image(cardtopre, rx - factor * 6, ry + factor * 9.5, w * 1.1, h * 9 / 40);
        }
        p5.text(this.name, rx + factor * 62, ry + factor * 25);
        p5.noStroke();
        p5.textSize(factor * 13);
        p5.textStyle(p5.BOLD);
        p5.text(this.energy_cost, rx + factor * 114, ry + factor * 11.5);
        p5.textStyle(p5.NORMAL);
        p5.textSize(factor * this.t_size);
        p5.text(this.desc(), rx + factor * 19, ry + factor * 100, factor * 86.8);
    }
}
class CardPerm {
    constructor(card) {
        this.card = card;
        this.casts = 0;
        this.turns = 0;
    }
}
class CardActions {
    constructor(onCast, onTarget, EOT, afterCast) {
        this.onCast = onCast;
        this.onTarget = (onTarget || ((_world, _card) => { }));
        this.EOT = (EOT || ((_world, _card) => { return false; }));
        this.afterCast = (afterCast || ((_world, _card) => { return false; }));
        this.eot_trigger = EOT != null;
        this.cast_trigger = afterCast != null;
    }
}
class CardTargeting {
    constructor(card, index, targets, targets_enemies, targets_cards) {
        this.card = card;
        this.index = index;
        this.targets_c = [];
        this.targets_e = [];
        this.targets_left = targets;
        this.total_targets = targets;
        this.targets_enemies = targets_enemies;
        this.targets_cards = targets_cards;
    }
}
class CardOnMouse {
    constructor(card, index, x_offset, y_offset) {
        this.card = card;
        this.index = index;
        this.x_offset = x_offset;
        this.y_offset = y_offset;
    }
}
class Enemy {
    constructor(x, y, w, h, hp, damage, eb) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.hp = hp;
        this.max_hp = hp;
        this.damage = damage;
        this.tags = eb;
    }
    render(p5) {
        p5.textAlign(p5.CENTER);
        p5.textStyle(p5.NORMAL);
        p5.stroke("black");
        p5.strokeWeight(3);
        p5.fill("red");
        if (this.tags.includes(EB.Speedy)) {
            p5.fill(0, 255, 100);
        }
        p5.rect(this.x, this.y, this.w, this.h);
        p5.fill(0);
        p5.strokeWeight(2);
        p5.rect(this.x - this.w / 2, this.y - 26, this.w * 2, 18);
        p5.fill("red");
        p5.rect(this.x - this.w / 2 + 1, this.y - 25, (this.w * 2 - 2) * this.hp / this.max_hp, 16);
        p5.fill(255);
        p5.noStroke();
        p5.textStyle(p5.BOLD);
        p5.textSize(30);
        p5.text(this.damage, this.x + this.w / 2, this.y + this.h / 2 + 10);
        p5.textStyle(p5.BOLD);
        p5.fill(255);
        p5.textSize(13);
        p5.textAlign(p5.RIGHT);
        p5.text(this.hp + "/" + this.max_hp, this.x + this.w * 1.5 - 5, this.y - 12.8);
        p5.textAlign(p5.CENTER);
    }
}
function shuffle(array) {
    let currentIndex = array.length;
    while (currentIndex != 0) {
        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]
        ];
    }
}
function selection(world, num) {
    let cards = [];
    for (let i = 0; i < num; i++) {
        cards.push(select(world));
    }
    return cards;
}
function select(world) {
    let r = Math.random();
    if (r < 10 / 111) {
        return world.make_card(card_1);
    }
    else if (r < 18 / 111) {
        return world.make_card(card_2);
    }
    else if (r < 25 / 111) {
        return world.make_card(card_3);
    }
    else if (r < 33 / 111) {
        return world.make_card(card_4);
    }
    else if (r < 40 / 111) {
        return world.make_card(card_5);
    }
    else if (r < 46 / 111) {
        return world.make_card(card_6);
    }
    else if (r < 54 / 111) {
        return world.make_card(card_7);
    }
    else if (r < 62 / 111) {
        return world.make_card(card_8);
    }
    else if (r < 71 / 111) {
        return world.make_card(card_9);
    }
    else if (r < 77 / 111) {
        return world.make_card(card_10);
    }
    else if (r < 82 / 111) {
        return world.make_card(card_11);
    }
    else if (r < 90 / 111) {
        return world.make_card(card_12);
    }
    else if (r < 96 / 111) {
        return world.make_card(card_13);
    }
    else if (r < 104 / 111) {
        return world.make_card(card_14);
    }
    else {
        return world.make_card(card_15);
    }
}
var State;
(function (State) {
    State[State["Playing"] = 0] = "Playing";
    State[State["ShowingDeck"] = 1] = "ShowingDeck";
    State[State["AddingCards"] = 2] = "AddingCards";
    State[State["EndPhase"] = 3] = "EndPhase";
    State[State["InBetweenPhase"] = 4] = "InBetweenPhase";
    State[State["Targeting"] = 5] = "Targeting";
    State[State["CardOnMouse"] = 6] = "CardOnMouse";
    State[State["GameOver"] = 7] = "GameOver";
    State[State["GameOverLoss"] = 8] = "GameOverLoss";
    State[State["Start"] = 9] = "Start";
    State[State["Discard"] = 10] = "Discard";
})(State || (State = {}));
class World {
    constructor() {
        this.player_hand = [];
        this.cur_deck = [];
        this.discard = [];
        this.card_on_mouse = null;
        this.maxhp = 20;
        this.hp = 20;
        this.cur_energy = 1;
        this.max_energy = 1;
        this.enemies = new Map();
        this.player_deck = [];
        this.cant_afford_text = -1;
        this.cur_card_trigger_eot = 0;
        this.s_e_d = null;
        this.ibt_damage_dealt = false;
        this.triggering_card = null;
        this.cur_t_hovered_card = null;
        this.t_time = -1;
        this.perm_cards = [];
        this.turn = 0;
        this.clicked_added_card = null;
        this.level = 0;
        this.state = State.Start;
        this.card_adds_left = -1;
        this.total_card_adds = 0;
        this.tutorial = true;
        this.tutorial_stage = 0;
    }
    add_card_to_deck(card_def) {
        this.player_deck.push(new Card(card_def.name, card_def.energy_cost, card_def.description, card_def.actions, card_def.t_size));
    }
    make_card(card_def) {
        return new Card(card_def.name, card_def.energy_cost, card_def.description, card_def.actions, card_def.t_size, card_def.card_image, card_def.card_color);
    }
    draw_card() {
        if (this.cur_deck.length > 0) {
            this.player_hand.push(this.cur_deck.shift());
        }
        else {
            this.cur_deck = [...this.discard];
            this.shuffle();
            this.discard = [];
            if (this.cur_deck.length > 0) {
                this.player_hand.push(this.cur_deck.shift());
            }
        }
    }
    add_cards(cards) {
        if (this.state == State.Targeting) {
            this.player_hand.splice(this.card_targeting.index, 0, this.card_targeting.card);
            this.card_targeting = null;
            this.state = State.Playing;
        }
        if (this.state == State.CardOnMouse) {
            this.player_hand.splice(this.card_on_mouse.index, 0, this.card_on_mouse.card);
            this.card_on_mouse = null;
            this.state = State.Playing;
        }
        if (!(this.state == State.Playing))
            return;
        this.card_adds_left = cards;
        this.state = State.AddingCards;
        this.clicked_added_card = null;
        this.cards_being_shown = selection(this, 3);
        this.total_card_adds = cards;
        this.card_adds_left--;
    }
    next_turn() {
        if (world.tutorial && (world.tutorial_stage == 8)) {
            world.tutorial_stage++;
        }
        ;
        if (this.player_hand.length > 6) {
            this.state = State.Discard;
        }
        if (!(this.state == State.Playing))
            return;
        this.cur_card_trigger_eot = 0;
        this.state = State.EndPhase;
        this.triggering_card = null;
        this.t_time = -1;
    }
    next_level() {
        additional_damage = 0;
        this.cur_deck = [...this.player_deck];
        this.discard = [];
        for (let c of this.player_deck) {
            c.energy_cost = c.base_energy_cost;
            c.tracker = 0;
        }
        this.level += 1;
        if (this.level >= LEVELS.length) {
            this.state = State.GameOver;
            return;
        }
        this.state = State.Playing;
        this.add_cards(2);
        this.max_energy = 0;
        this.turn = -1;
        this.perm_cards = [];
        this.player_hand = [];
        this.shuffle();
        this.hp = this.maxhp;
    }
    start() {
        this.state = State.Playing;
        this.add_cards(8);
        this.tutorial = false;
        this.level = 0;
        additional_damage = 0;
        this.max_energy = 0;
        this.turn = -1;
        this.perm_cards = [];
        this.player_hand = [];
        this.cur_deck = [...this.player_deck];
        this.discard = [];
        this.shuffle();
        this.hp = this.maxhp;
        LEVELS = START_LEVELS;
    }
    start_tutorial() {
        this.state = State.Playing;
        this.tutorial = true;
        this.tutorial_stage = 0;
        additional_damage = 0;
        this.level = 0;
        this.max_energy = 0;
        this.turn = -1;
        this.perm_cards = [];
        this.player_hand = [];
        this.cur_deck = [
            world.make_card(card_1),
            world.make_card(card_12),
            world.make_card(card_1)
        ];
        this.discard = [];
        this.shuffle();
        this.hp = this.maxhp;
        LEVELS = [
            [
                [[2, 1, []]],
                [[2, 1, [EB.Speedy]]]
            ]
        ];
        this.next_turn();
    }
    added_cards() {
        if (this.card_adds_left > 0) {
            this.clicked_added_card = null;
            this.cards_being_shown = selection(this, 3);
            this.card_adds_left--;
        }
        else {
            this.cur_deck = [...this.player_deck];
            this.state = State.Playing;
            this.draw_card();
            this.draw_card();
            this.next_turn();
        }
    }
    shuffle() {
        shuffle(this.player_deck);
    }
    update() {
        if (this.state == State.Start)
            return;
        if (this.hp <= 0) {
            this.state = State.GameOverLoss;
            return;
        }
        if (this.state != State.GameOver && this.enemies.size == 0 && this.turn >= LEVELS[this.level].length) {
            this.next_level();
            return;
        }
        if (this.state == State.EndPhase) {
            if (this.cur_card_trigger_eot >= this.perm_cards.length && this.triggering_card == null) {
                this.state = State.InBetweenPhase;
                this.s_e_d = new Map(JSON.parse(JSON.stringify(Array.from(this.enemies))));
                this.ibt_damage_dealt = false;
                return;
            }
            if (this.triggering_card == null) {
                let card = this.perm_cards[this.cur_card_trigger_eot].card.actions;
                if (!card.eot_trigger) {
                    this.cur_card_trigger_eot++;
                    return;
                }
                else {
                    this.triggering_card = this.perm_cards[this.cur_card_trigger_eot];
                    this.t_time = 45;
                    this.cur_card_trigger_eot++;
                    return;
                }
            }
            else {
                if (this.t_time <= 0) {
                    this.triggering_card = null;
                }
                else if (this.t_time == 20) {
                    this.triggering_card.card.actions.EOT(this, this.triggering_card);
                }
                this.t_time--;
            }
        }
        if (this.state == State.InBetweenPhase) {
            let something_happened = false;
            let d = false;
            for (let enemy of this.enemies) {
                let e = this.s_e_d.get(enemy[0]);
                if (e.y < 420) {
                    if (enemy[1].tags.includes(EB.Speedy)) {
                        if (enemy[1].y >= e.y + 160) {
                            enemy[1].y = e.y + 160;
                        }
                        else {
                            enemy[1].y += 4;
                            something_happened = true;
                        }
                    }
                    else {
                        if (enemy[1].y >= e.y + 80) {
                            enemy[1].y = e.y + 80;
                        }
                        else {
                            enemy[1].y += 2;
                            something_happened = true;
                        }
                    }
                }
                if (e.y >= 420) {
                    if (this.ibt_damage_dealt) {
                        if (enemy[1].y > 420) {
                            enemy[1].y -= 4;
                            something_happened = true;
                        }
                        else {
                            enemy[1].y = 420;
                        }
                    }
                    else {
                        if (enemy[1].y >= 470) {
                            d = true;
                            this.hp -= enemy[1].damage;
                            something_happened = true;
                        }
                        else {
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
                this.state = State.Playing;
                this.draw_card();
                this.max_energy += 1;
                this.cur_energy = this.max_energy;
                this.turn += 1;
                if (world.tutorial_stage == 10) {
                    world.tutorial_stage++;
                }
                if (this.level >= LEVELS.length) {
                    return;
                }
                if (this.turn >= LEVELS[this.level].length) {
                    return;
                }
                let push_forward = [];
                for (let enemy of LEVELS[this.level][this.turn]) {
                    let new_enemy_x = Math.random() * 1000 + 300;
                    let conflict = false;
                    for (let enemy of world.enemies.values()) {
                        if (Math.sqrt(Math.pow(enemy.x - new_enemy_x, 2) + Math.pow(enemy.y - 100, 2)) < 80) {
                            conflict = true;
                            break;
                        }
                    }
                    let tries = 0;
                    let fail = false;
                    while (conflict && tries < 10) {
                        tries++;
                        new_enemy_x = Math.random() * 1000 + 300;
                        conflict = false;
                        for (let enemy of world.enemies.values()) {
                            if (Math.sqrt(Math.pow(enemy.x - new_enemy_x, 2) + Math.pow(enemy.y - 100, 2)) < 80) {
                                conflict = true;
                                if (tries == 9) {
                                    fail = true;
                                }
                                break;
                            }
                        }
                    }
                    if (!fail) {
                        if (world.tutorial && world.tutorial_stage < 4) {
                            world.enemies.set(cur_id + 1, new Enemy(900, 100, (enemy[2].includes(EB.Big)) ? 85 : 50, (enemy[2].includes(EB.Big)) ? 85 : 50, enemy[1], enemy[0], enemy[2]));
                        }
                        else if (world.tutorial) {
                            world.enemies.set(cur_id + 1, new Enemy(600, 100, (enemy[2].includes(EB.Big)) ? 85 : 50, (enemy[2].includes(EB.Big)) ? 85 : 50, enemy[1], enemy[0], enemy[2]));
                        }
                        else {
                            world.enemies.set(cur_id + 1, new Enemy(new_enemy_x, 100, (enemy[2].includes(EB.Big)) ? 85 : 50, (enemy[2].includes(EB.Big)) ? 85 : 50, enemy[1], enemy[0], enemy[2]));
                        }
                        cur_id += 1;
                    }
                    else {
                        push_forward.push(LEVELS[this.level][this.turn].indexOf(enemy));
                    }
                }
                for (let element of push_forward) {
                    let e = LEVELS[this.level][this.turn][element];
                    if (LEVELS[this.level].length >= this.turn) {
                        LEVELS[this.level][this.turn + 1].push(e);
                    }
                    else {
                        LEVELS[this.level].push([e]);
                    }
                }
                let offset = 0;
                push_forward.sort();
                for (let element of push_forward) {
                    LEVELS[this.level][this.turn].splice(element - offset, 1);
                    offset++;
                }
            }
        }
        else {
            for (let enemy of this.enemies) {
                if (enemy[1].hp <= 0) {
                    this.enemies.delete(enemy[0]);
                    if (world.tutorial_stage == 4) {
                        world.tutorial_stage++;
                    }
                    if (world.tutorial_stage == 12) {
                        world.tutorial = false;
                        world.tutorial_stage = 100;
                        world.start();
                    }
                }
            }
        }
    }
}
class Camera {
    constructor() {
        this.camera_x = 0;
        this.camera_y = 0;
    }
    render(p5, world) {
        if (world.state == State.Start) {
            p5.textStyle(p5.BOLD);
            p5.textSize(40);
            p5.textAlign(p5.CENTER);
            p5.fill("black");
            p5.noStroke();
            p5.text("Click anywhere to start", WIDTH / 2, HEIGHT / 2);
            return;
        }
        if (world.state == State.GameOver) {
            p5.fill("black");
            p5.noStroke();
            p5.textStyle(p5.BOLD);
            p5.textSize(40);
            p5.textAlign(p5.CENTER);
            p5.text("You Won!\n Click anywhere to restart", WIDTH / 2, HEIGHT / 2);
            return;
        }
        if (world.state == State.GameOverLoss) {
            p5.fill("black");
            p5.noStroke();
            p5.textStyle(p5.BOLD);
            p5.textSize(40);
            p5.textAlign(p5.CENTER);
            p5.text("You died...\n Click anywhere to restart", WIDTH / 2, HEIGHT / 2);
            return;
        }
        if (world.state == State.Playing || world.state == State.InBetweenPhase || world.state == State.EndPhase || world.state == State.Targeting || world.state == State.CardOnMouse || world.state == State.Discard) {
            p5.stroke(190);
            p5.strokeWeight(3.5);
            for (let x = 0; x < WIDTH; x += 45) {
                p5.line(x, 125, x + 25, 125);
            }
            for (let x = 0; x < WIDTH; x += 45) {
                p5.line(x, 205, x + 25, 205);
            }
            for (let x = 0; x < WIDTH; x += 45) {
                p5.line(x, 285, x + 25, 285);
            }
            for (let x = 0; x < WIDTH; x += 45) {
                p5.line(x, 365, x + 25, 365);
            }
            p5.stroke(255, 30, 30);
            for (let x = 0; x < WIDTH; x += 45) {
                p5.line(x, 445, x + 25, 445);
            }
            for (let enemy of world.enemies) {
                enemy[1].render(p5);
            }
            p5.noStroke();
            p5.fill(0);
            p5.textSize(17);
            if (world.discard.length > 0 && world.state != State.Discard) {
                p5.text("Cards in Discard Pile: " + world.discard.length, 50 + CARD_WIDTH * 0.4, 580);
                p5.image(cb, 50, 600, CARD_WIDTH * 0.8, CARD_HEIGHT * 0.8);
            }
            if (world.cur_deck.length > 0 && world.state != State.Discard) {
                p5.text("Cards left in Deck: " + world.cur_deck.length, WIDTH - 50 - CARD_WIDTH * 0.4, 580);
                p5.image(cb, WIDTH - 50 - CARD_WIDTH * 0.8, 600, CARD_WIDTH * 0.8, CARD_HEIGHT * 0.8);
            }
            let hovered_card = null;
            let total_width = Math.min(85 * world.player_hand.length, 900); // 180
            let individual_width = total_width / world.player_hand.length; // 60
            if (world.state == State.Playing || world.state == State.Discard) {
                for (let i = 0; i < world.player_hand.length; i++) {
                    let x = (WIDTH - total_width - CARD_WIDTH) / 2.0 + individual_width * i;
                    let w = CARD_WIDTH;
                    let h = CARD_HEIGHT;
                    let y = CARD_Y;
                    if (i + 1 == world.cur_hovered_card) {
                        w -= 40.1;
                    }
                    if (i == world.cur_hovered_card) {
                        x -= 6.1;
                        w += 7;
                        y -= 8.45;
                        h += 16.9;
                    }
                    if (p5.mouseY >= y && p5.mouseY <= y + h && p5.mouseX >= x && p5.mouseX <= x + w) {
                        hovered_card = i;
                        break;
                    }
                }
            }
            if (world.state == State.InBetweenPhase || world.state == State.EndPhase) {
                hovered_card = null;
            }
            world.cur_hovered_card = hovered_card;
            for (let i = world.player_hand.length - 1; i >= 0; i--) {
                let card = world.player_hand[i];
                let x = (WIDTH - total_width - CARD_WIDTH) / 2.0 + individual_width * i;
                if (!(i == hovered_card)) {
                    card.render(p5, x, CARD_Y, 1);
                }
            }
            if (hovered_card != null) {
                let x = (WIDTH - total_width - CARD_WIDTH) / 2.0 + individual_width * hovered_card;
                world.player_hand[hovered_card].render(p5, x, CARD_Y, 1.1);
                world.player_hand[hovered_card].render(p5, 1100, 250, 2.4);
            }
            let j = 0;
            let h = -1;
            for (let _ of world.perm_cards) {
                if (p5.mouseX > j * 80 && p5.mouseX < j * 80 + CARD_WIDTH * 0.5 && p5.mouseY > 440 && p5.mouseY < 440 + CARD_HEIGHT * 0.5) {
                    h = j;
                }
                j++;
            }
            if (h >= 0 && world.state == State.Playing) {
                world.perm_cards[h].card.render(p5, 1100, 250, 2.4);
            }
            p5.image(hpb, 50, 50, 350, 25);
            p5.noStroke();
            p5.fill("red");
            p5.rect(51.7, 52, 346.6 * world.hp / world.maxhp, 21);
            p5.fill(0);
            p5.textStyle(p5.BOLD);
            p5.textSize(17);
            p5.text(world.hp + "/" + world.maxhp, 370, 42);
            for (let i = 0; i < world.cur_energy; i++) {
                p5.image(eb, 48 + (i % 10) * 36.5, 80 + 36.5 * Math.floor(i / 10), 27, 27);
            }
            if (world.state == State.Discard) {
                p5.noFill();
                p5.stroke(255, 0, 0);
                if (p5.mouseX > 130 && p5.mouseX < 330 && p5.mouseY > 500 && p5.mouseY < 700) {
                    p5.fill(255, 0, 0, 70);
                }
                p5.strokeWeight(3);
                p5.rect(130, 500, 200, 200);
                p5.noStroke();
                p5.fill(255, 0, 0);
                p5.textAlign(p5.CENTER);
                p5.textSize(19);
                p5.textStyle(p5.NORMAL);
                p5.text("Drag cards here to\n discard them", 230, 600 - 19 / 2);
                p5.fill(0);
                p5.textSize(26);
                p5.textStyle(p5.BOLD);
                p5.text("Please discard down to 6 cards to continue", WIDTH / 2, 320);
            }
            if (world.state == State.CardOnMouse || (world.state == State.Discard && world.card_on_mouse != null)) {
                world.card_on_mouse.card.render(p5, p5.mouseX + world.card_on_mouse.x_offset, p5.mouseY + world.card_on_mouse.y_offset, 1.3);
            }
            if (world.state == State.Targeting) {
                world.card_targeting.card.render(p5, 1000, 250, 1.5);
                targetingLine(p5, 970 + CARD_WIDTH * 1.5 / 2, 350, p5.mouseX, p5.mouseY);
                if (world.card_targeting.targets_enemies) {
                    world.cur_hovered_enemy = null;
                    for (let enemy of world.enemies) {
                        if (enemy[1].x + enemy[1].w > p5.mouseX && enemy[1].x < p5.mouseX && enemy[1].y + enemy[1].h > p5.mouseY && enemy[1].y < p5.mouseY) {
                            world.cur_hovered_enemy = enemy[0];
                        }
                    }
                    if (world.cur_hovered_enemy != null) {
                        let e = world.enemies.get(world.cur_hovered_enemy);
                        p5.stroke(255, 0, 0);
                        p5.strokeWeight(5);
                        p5.line(e.x - 10, e.y - 10, e.x - 10, e.y);
                        p5.line(e.x - 10, e.y - 10, e.x, e.y - 10);
                        p5.line(e.x + e.w + 10, e.y - 10, e.x + e.w, e.y - 10);
                        p5.line(e.x + e.w + 10, e.y - 10, e.x + e.w + 10, e.y);
                        p5.line(e.x - 10, e.y + e.h + 10, e.x, e.y + e.h + 10);
                        p5.line(e.x - 10, e.y + e.h + 10, e.x - 10, e.y + e.h);
                        p5.line(e.x + e.h + 10, e.y + e.h + 10, e.x + e.h, e.y + e.h + 10);
                        p5.line(e.x + e.h + 10, e.y + e.h + 10, e.x + e.h + 10, e.y + e.h);
                    }
                    for (let target of world.card_targeting.targets_e) {
                        let e = world.enemies.get(target);
                        p5.stroke(255, 0, 0);
                        p5.strokeWeight(5);
                        p5.line(e.x - 10, e.y - 10, e.x - 10, e.y);
                        p5.line(e.x - 10, e.y - 10, e.x, e.y - 10);
                        p5.line(e.x + e.w + 10, e.y - 10, e.x + e.w, e.y - 10);
                        p5.line(e.x + e.w + 10, e.y - 10, e.x + e.w + 10, e.y);
                        p5.line(e.x - 10, e.y + e.h + 10, e.x, e.y + e.h + 10);
                        p5.line(e.x - 10, e.y + e.h + 10, e.x - 10, e.y + e.h);
                        p5.line(e.x + e.w + 10, e.y + e.h + 10, e.x + e.w, e.y + e.h + 10);
                        p5.line(e.x + e.w + 10, e.y + e.h + 10, e.x + e.w + 10, e.y + e.h);
                    }
                }
                if (world.card_targeting.targets_cards) {
                    world.cur_t_hovered_card = null;
                    for (let i = 0; i < world.perm_cards.length; i++) {
                        if (p5.mouseX > i * 80 + CARD_WIDTH * 0.25 && p5.mouseX < i * 80 + CARD_WIDTH * 0.75 && p5.mouseY > 440 + CARD_HEIGHT * 0.25 && p5.mouseY < 440 + CARD_HEIGHT * 0.75) {
                            world.cur_t_hovered_card = i;
                        }
                    }
                    if (world.cur_t_hovered_card != null) {
                        let x = world.cur_t_hovered_card * 80 + CARD_WIDTH * 0.25;
                        let w = CARD_WIDTH * 0.5;
                        let y = 440 + CARD_HEIGHT * 0.25;
                        let h = CARD_HEIGHT * 0.5;
                        p5.stroke(255, 0, 0);
                        p5.strokeWeight(5);
                        p5.line(x - 10, y - 10, x - 10, y);
                        p5.line(x - 10, y - 10, x, y - 10);
                        p5.line(x + w + 10, y - 10, x + w, y - 10);
                        p5.line(x + w + 10, y - 10, x + w + 10, y);
                        p5.line(x - 10, y + h + 10, x, y + h + 10);
                        p5.line(x - 10, y + h + 10, x - 10, y + h);
                        p5.line(x + w + 10, y + h + 10, x + w, y + h + 10);
                        p5.line(x + w + 10, y + h + 10, x + w + 10, y + h);
                    }
                    for (let target of world.card_targeting.targets_c) {
                        let x = target * 80 + CARD_WIDTH * 0.25;
                        let w = CARD_WIDTH * 0.5;
                        let y = 440 + CARD_HEIGHT * 0.25;
                        let h = CARD_HEIGHT * 0.5;
                        p5.stroke(255, 0, 0);
                        p5.strokeWeight(5);
                        p5.line(x - 10, y - 10, x - 10, y);
                        p5.line(x - 10, y - 10, x, y - 10);
                        p5.line(x + w + 10, y - 10, x + w + 10, y);
                        p5.line(x + w + 10, y - 10, x + w, y - 10);
                        p5.line(x - 10, y + h + 10, x, y + h + 10);
                        p5.line(x - 10, y + h + 10, x - 10, y + h);
                        p5.line(x + w + 10, y + h + 10, x + w, y + h + 10);
                        p5.line(x + w + 10, y + h + 10, x + w + 10, y + h);
                    }
                }
            }
            if (world.triggering_card != null && world.t_time < 30 && world.t_time >= 0) {
                world.triggering_card.card.render(p5, 1000, 250, 1.5);
            }
            let i = 0;
            for (let perm of world.perm_cards) {
                perm.card.render(p5, i * 80, 440, 0.5);
                if (world.triggering_card != null && i == world.cur_card_trigger_eot - 1 && world.t_time >= 3 && world.t_time <= 35) {
                    targetingLine(p5, i * 80 + CARD_WIDTH * 0.5, 440 + CARD_HEIGHT * 0.25, 1000, 250 + CARD_HEIGHT * 0.75);
                }
                i++;
            }
            p5.stroke(20);
            p5.strokeWeight(3);
            p5.fill(0, 150, 200);
            if (p5.mouseX > 900 && p5.mouseX < 1000 && p5.mouseY > CARD_Y - 80 && p5.mouseY < CARD_Y - 30 && world.state == State.Playing) {
                p5.fill(200, 200, 240);
            }
            p5.rect(900, CARD_Y - 80, 100, 50, 14);
            p5.textAlign(p5.CENTER);
            p5.noStroke();
            p5.textSize(20);
            p5.textStyle(p5.BOLD);
            p5.fill(90, 150);
            p5.text("End Turn", 953, CARD_Y - 47);
            p5.fill(255);
            p5.text("End Turn", 950, CARD_Y - 50);
            p5.stroke(20);
            p5.strokeWeight(3);
            p5.fill(20, 200, 20);
            if (p5.mouseX > WIDTH - 150 && p5.mouseX < WIDTH - 31 && p5.mouseY > 23 && p5.mouseY < 63 && world.state == State.Playing) {
                p5.fill(80, 255, 30);
            }
            p5.rect(WIDTH - 150, 23, 120, 40, 14);
            p5.textAlign(p5.CENTER);
            p5.noStroke();
            p5.textSize(20);
            p5.textStyle(p5.BOLD);
            p5.fill(90, 150);
            p5.text("Show Deck", WIDTH - 87, 53);
            p5.fill(255);
            p5.text("Show Deck", WIDTH - 90, 50);
            if (world.state == State.Targeting && world.card_targeting.total_targets > 1) {
                p5.stroke(20);
                p5.strokeWeight(3);
                p5.fill(200, 150, 0);
                if (p5.mouseX > 265 && p5.mouseX < 430 && p5.mouseY > CARD_Y - 80 && p5.mouseY < CARD_Y - 30) {
                    p5.fill(240, 200, 200);
                }
                p5.rect(265, CARD_Y - 80, 170, 50, 14);
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
                p5.stroke(180, 50, 50, world.cant_afford_text / 20 * 255);
                p5.strokeWeight(5);
                p5.textSize(40);
                p5.textStyle(p5.BOLD);
                p5.fill(225, 30, 30, world.cant_afford_text / 20 * 255);
                p5.text("Not enough energy", WIDTH / 2, HEIGHT / 2);
            }
            world.cant_afford_text -= 1;
        }
        if (world.state == State.AddingCards) {
            p5.noStroke();
            p5.textSize(30);
            p5.fill(0);
            p5.textStyle(p5.NORMAL);
            if (world.level == 0) { // TODO
                p5.text("Choose a card to add to your starting deck! (" + (world.total_card_adds - world.card_adds_left) + "/" + world.total_card_adds + ")", WIDTH / 2, 200);
            }
            else {
                p5.text("Level Complete! \n Choose a card to add to your deck! (" + (world.total_card_adds - world.card_adds_left) + "/" + world.total_card_adds + ")", WIDTH / 2, 200);
            }
            world.cards_being_shown[0].render(p5, 350 + 13.88, 320, 1.3);
            world.cards_being_shown[1].render(p5, 650 + 13.88, 320, 1.3);
            world.cards_being_shown[2].render(p5, 950 + 13.88, 320, 1.3);
            let c = false;
            let x;
            let w = CARD_WIDTH * 1.17;
            let y = 300;
            let h = CARD_HEIGHT * 1.25;
            if (p5.mouseX >= 350 + 13.88 && p5.mouseX <= 350 + 13.88 + 1.17 * CARD_WIDTH && p5.mouseY >= 310 && p5.mouseY <= 310 + 1.25 * CARD_HEIGHT && world.clicked_added_card != 0) {
                x = 353;
                c = true;
            }
            if (p5.mouseX >= 650 + 13.88 && p5.mouseX <= 650 + 13.88 + 1.17 * CARD_WIDTH && p5.mouseY >= 310 && p5.mouseY <= 310 + 1.25 * CARD_HEIGHT && world.clicked_added_card != 1) {
                x = 653;
                c = true;
            }
            if (p5.mouseX >= 950 + 13.88 && p5.mouseX <= 950 + 13.88 + 1.17 * CARD_WIDTH && p5.mouseY >= 310 && p5.mouseY <= 310 + 1.25 * CARD_HEIGHT && world.clicked_added_card != 2) {
                x = 953;
                c = true;
            }
            if (c) {
                p5.stroke(255);
                p5.strokeWeight(5);
                p5.line(x - 10, y - 10, x - 10, y);
                p5.line(x - 10, y - 10, x, y - 10);
                p5.line(x + w + 10, y - 10, x + w + 10, y);
                p5.line(x + w + 10, y - 10, x + w, y - 10);
                p5.line(x - 10, y + h + 10, x, y + h + 10);
                p5.line(x - 10, y + h + 10, x - 10, y + h);
                p5.line(x + w + 10, y + h + 10, x + w, y + h + 10);
                p5.line(x + w + 10, y + h + 10, x + w + 10, y + h);
            }
            c = false;
            x = null;
            w = CARD_WIDTH * 1.17 + 10;
            y = 295;
            h = CARD_HEIGHT * 1.25 + 10;
            if (world.clicked_added_card == 0) {
                x = 353 - 5;
                c = true;
            }
            if (world.clicked_added_card == 1) {
                x = 653 - 5;
                c = true;
            }
            if (world.clicked_added_card == 2) {
                x = 953 - 5;
                c = true;
            }
            if (c) {
                p5.stroke(255);
                p5.strokeWeight(8);
                p5.line(x - 10, y - 10, x - 10, y);
                p5.line(x - 10, y - 10, x, y - 10);
                p5.line(x + w + 10, y - 10, x + w + 10, y);
                p5.line(x + w + 10, y - 10, x + w, y - 10);
                p5.line(x - 10, y + h + 10, x, y + h + 10);
                p5.line(x - 10, y + h + 10, x - 10, y + h);
                p5.line(x + w + 10, y + h + 10, x + w, y + h + 10);
                p5.line(x + w + 10, y + h + 10, x + w + 10, y + h);
            }
            p5.stroke(20);
            p5.strokeWeight(3);
            p5.fill(200, 150, 0);
            if (p5.mouseX > WIDTH / 2 - 170 / 2 - 14 && p5.mouseX < WIDTH / 2 + 170 / 2 - 14 && p5.mouseY > 700 - 50 / 2 && p5.mouseY < 750 - 50 / 2) {
                p5.fill(240, 200, 200);
            }
            p5.rectMode(p5.CENTER);
            p5.rect(WIDTH / 2 - 14, 700, 170, 50, 14);
            p5.rectMode(p5.CORNER);
            p5.textAlign(p5.CENTER);
            p5.noStroke();
            p5.textSize(20);
            p5.textStyle(p5.BOLD);
            p5.fill(90, 150);
            p5.text("Confirm", WIDTH / 2 + 3 - 14, 707);
            p5.fill(255);
            p5.text("Confirm", WIDTH / 2 - 14, 704);
        }
        else if (world.state == State.ShowingDeck) {
            let hovered_card = null;
            let total_width = Math.min(65 * world.player_hand.length, 900); // 180
            let individual_width = total_width / world.player_hand.length; // 60
            for (let i = 0; i < world.player_deck.length; i++) {
                let x = (WIDTH - total_width - (CARD_WIDTH * 0.8)) / 2.0 + individual_width * i;
                let w = CARD_WIDTH * 0.8;
                let h = CARD_HEIGHT * 0.9;
                let y = 150;
                if (i + 1 == world.cur_hovered_card) {
                    w -= 40.1 * 0.8;
                }
                if (i == world.cur_hovered_card) {
                    x -= 6.1 * 0.8;
                    w += 7 * 0.8;
                    y -= 8.45 * 0.8;
                    h += 16.9 * 0.9;
                }
                if (p5.mouseY >= y && p5.mouseY <= y + h && p5.mouseX >= x && p5.mouseX <= x + w) {
                    hovered_card = i;
                    break;
                }
            }
            world.cur_hovered_card = hovered_card;
            for (let i = world.player_deck.length - 1; i >= 0; i--) {
                let card = world.player_deck[i];
                let x = (WIDTH - total_width - CARD_WIDTH) / 2.0 + individual_width * i;
                if (!(i == hovered_card)) {
                    card.render(p5, x, 150, 0.8);
                }
            }
            if (hovered_card != null) {
                let x = (WIDTH - total_width - CARD_WIDTH) / 2.0 + individual_width * hovered_card;
                world.player_deck[hovered_card].render(p5, x, 150, 0.95);
                world.player_deck[hovered_card].render(p5, WIDTH / 2 - CARD_WIDTH * 0.7, 450, 2);
            }
            p5.stroke(20);
            p5.strokeWeight(3);
            p5.fill(200, 20, 20);
            if (p5.mouseX > WIDTH - 70 && p5.mouseX < WIDTH - 31 && p5.mouseY > 23 && p5.mouseY < 63) {
                p5.fill(255, 30, 30);
            }
            p5.rect(WIDTH - 70, 23, 40, 40, 14);
            p5.textAlign(p5.CENTER);
            p5.noStroke();
            p5.textSize(20);
            p5.textStyle(p5.BOLD);
            p5.fill(90, 150);
            p5.text("X", WIDTH - 47, 53);
            p5.fill(255);
            p5.text("X", WIDTH - 50, 50);
        }
        if (world.tutorial_stage == 0 && world.tutorial) {
            p5.fill(60, 60, 60, 185);
            p5.noStroke();
            p5.rect(0, 0, WIDTH, 23);
            p5.rect(0, 84, WIDTH, HEIGHT - 84);
            p5.rect(0, 23, 42, 61);
            p5.rect(415, 23, WIDTH - 415, 61);
            p5.fill(255);
            p5.textStyle(p5.NORMAL);
            p5.textSize(19);
            p5.textAlign(p5.LEFT);
            p5.text("This is your health bar, keep\nyour health above 0, otherwise\nyou'll lose.\n\nClick anywhere to continue...", 340, 140);
            p5.textAlign(p5.CENTER);
        }
        if (world.tutorial_stage == 1 && world.tutorial) {
            p5.fill(60, 60, 60, 185);
            p5.noStroke();
            p5.rect(0, 0, WIDTH, 75);
            p5.rect(0, 110, WIDTH, HEIGHT - 110);
            p5.rect(0, 75, 42, 35);
            p5.rect(410, 75, WIDTH - 410, 35);
            p5.fill(255);
            p5.textStyle(p5.NORMAL);
            p5.textSize(19);
            p5.textAlign(p5.LEFT);
            p5.text("This is your energy, you spend it to play cards.\n\nAt the start of each turn,you'll gain energy equal to the turn you are on,\nso on your first turn, you gain 1 energy, on your second, 2 energy etc.\nAt the end of each turn you'll lose any remaining energy\n\nClick anywhere to continue...", 340, 192);
            p5.textAlign(p5.CENTER);
        }
        if (world.tutorial_stage == 2 && world.tutorial) {
            p5.fill(60, 60, 60, 185);
            p5.noStroke();
            p5.rect(0, 0, WIDTH, 60);
            p5.rect(0, 160, WIDTH, HEIGHT - 160);
            p5.rect(0, 60, 860, 100);
            p5.rect(990, 60, WIDTH - 990, 100);
            p5.fill(255);
            p5.textStyle(p5.NORMAL);
            p5.textSize(19);
            p5.textAlign(p5.LEFT);
            p5.text("This is an enemy.\nAt the top is its health bar, get its health down to 0 to kill it.\nAt the end of each turn, the enemy will move forward one line.\nWhen you end a turn while the enemy is on the red line,\nit will attack you, dealing damage equal to the big number inside it.\n\nClick anywhere to continue...", 800, 210);
            p5.textAlign(p5.CENTER);
        }
        if (world.tutorial_stage == 3 && world.tutorial) {
            p5.fill(60, 60, 60, 185);
            p5.noStroke();
            p5.rect(0, 0, WIDTH, 584);
            p5.rect(0, 584, 600, 210);
            p5.rect(790, 584, WIDTH - 790, 210);
            p5.rect(0, 794, WIDTH, HEIGHT - 794);
            p5.fill(255);
            p5.textStyle(p5.NORMAL);
            p5.textSize(19);
            p5.textAlign(p5.LEFT);
            p5.text("This is a card.\nThe number in the top right is its energy cost.\nYou must pay this amount of energy in order to play the card.\nUnder that is the effect of the card, this is what it will do when played\n\nIn order to play a card, click and drag it to the top portion of the screen.\nYou may then need to target enemies, to do this, simply click on the enemies.\nFor cards that target a variable number of enemies, you may need to click\nConfirm Targets in the bottom left corner\n\nTry using Quickshot to kill the enemy.\n\nClick anywhere to continue...", 816, 520);
            p5.textAlign(p5.CENTER);
        }
        if (world.tutorial_stage == 5 && world.tutorial) {
            p5.fill(60, 60, 60, 185);
            p5.noStroke();
            p5.rect(0, 0, WIDTH, 540);
            p5.rect(0, 775, WIDTH, HEIGHT - 775);
            p5.rect(210, 540, WIDTH - 210, 235);
            p5.fill(255);
            p5.textStyle(p5.NORMAL);
            p5.textSize(19);
            p5.textAlign(p5.LEFT);
            p5.text("This is your Discard Pile. \nYour cards will go here after being played.\n\nClick anywhere to continue...", 270, 500);
            p5.textAlign(p5.CENTER);
        }
        if (world.tutorial_stage == 6 && world.tutorial) {
            p5.fill(60, 60, 60, 185);
            p5.noStroke();
            p5.rect(0, 0, WIDTH, 540);
            p5.rect(0, 775, WIDTH, HEIGHT - 775);
            p5.rect(0, 540, 1250, 235);
            p5.fill(255);
            p5.textStyle(p5.NORMAL);
            p5.textSize(19);
            p5.textAlign(p5.RIGHT);
            p5.text("This is your Deck. \nCards drawn will come from here.\nIf there are no cards in your deck and you try to draw a card, your discard pile will first be shuffled into your deck\nIf both your discard pile and your deck have no cards, you will not draw a card.\n\nClick anywhere to continue...", 1200, 500);
            p5.textAlign(p5.CENTER);
        }
        if (world.tutorial_stage == 7 && world.tutorial) {
            // 870 500
            p5.fill(60, 60, 60, 185);
            p5.noStroke();
            p5.rect(0, 0, WIDTH, 500);
            p5.rect(0, 590, WIDTH, HEIGHT - 590);
            p5.rect(0, 500, 877, 90);
            p5.rect(1020, 500, WIDTH - 1020, 90);
            p5.fill(255);
            p5.textStyle(p5.NORMAL);
            p5.textSize(19);
            p5.textAlign(p5.LEFT);
            p5.text("This is where you end your turn. \nEnding your turn will advance the enemies,\nreplenish your energy and draw you a card\n\nSince you have nothing else to do, try ending\nyour turn.\n\nClick anywhere to continue...", 1050, 460);
            p5.textAlign(p5.CENTER);
        }
        if (world.tutorial_stage == 9 && world.tutorial) {
            p5.fill(60, 60, 60, 185);
            p5.noStroke();
            p5.rect(0, 0, WIDTH, 60);
            p5.rect(0, 160, WIDTH, HEIGHT - 160);
            p5.rect(0, 60, 560, 100);
            p5.rect(690, 60, WIDTH - 690, 100);
            p5.fill(255);
            p5.textStyle(p5.NORMAL);
            p5.textSize(19);
            p5.textAlign(p5.LEFT);
            p5.text("This is a speedy enemy as indicated by its green color.\nSpeedy enemies move two spaces forward each turn instead of one.\n\nSince you don't have enough energy to play any of your cards,\ntry ending your turn again.\n\nClick anywhere to continue...", 760, 200);
            p5.textAlign(p5.CENTER);
        }
        if (world.tutorial_stage == 11 && world.tutorial) {
            p5.fill(60, 60, 60, 185);
            p5.noStroke();
            p5.rect(0, 0, WIDTH, HEIGHT);
            p5.fill(255);
            p5.textStyle(p5.NORMAL);
            p5.textSize(19);
            p5.textAlign(p5.LEFT);
            p5.text("Now kill this enemy and you'll have completed the tutorial! \n\nClick anywhere to continue...", 760, 400);
            p5.textAlign(p5.CENTER);
        }
    }
}
function drawDashedBezier(p5, x1, y1, cx, cy, x2, y2, dashLength, gapLength) {
    let totalLength = 0;
    let prev = p5.createVector(x1, y1);
    let steps = 100;
    for (let t = 0; t <= 1; t += 1.0 / steps) {
        let x = p5.bezierPoint(x1, cx, cx, x2, t);
        let y = p5.bezierPoint(y1, cy, cy, y2, t);
        let current = p5.createVector(x, y);
        let segLength = p5_1.default.Vector.dist(prev, current);
        if (p5.floor(totalLength / (dashLength + gapLength)) % 2 === 0) {
            p5.stroke(20);
            p5.strokeWeight(5);
            p5.line(prev.x, prev.y, current.x, current.y);
        }
        totalLength += segLength;
        prev = current;
    }
}
function drawArrowhead(p5, x1, y1, cx, cy, x2, y2) {
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
function targetingLine(p5, x_start, y_start, x_end, y_end) {
    drawDashedBezier(p5, x_start, y_start, (x_start + x_end) / 2, p5.min(y_start, y_end) - 150, x_end, y_end, 10, 10);
    drawArrowhead(p5, x_start, y_start, (x_start + x_end) / 2, p5.min(y_start, y_end) - 150, x_end, y_end);
}
const HEIGHT = 816;
const WIDTH = 1470;
let world = new World();
let camera = new Camera();
const card_1 = new CardDef("Quickshot", 0, (ad, _) => { return "deal " + (1 + ad) + " damage to target enemy"; }, new CardActions((world, card) => {
    world.card_targeting = new CardTargeting(card.card, card.index, 1, true, false);
    world.state = State.Targeting;
}, (world, card) => {
    world.enemies.get(card.targets_e[0]).hp -= 1 + additional_damage;
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
    world.discard.push(card.card);
}));
// 10
const card_2 = new CardDef("Lightning Bolt", 3, (ad, _) => { return "deal " + (2 + ad) + " damage to up to 3 target enemies"; }, new CardActions((world, card) => {
    world.card_targeting = new CardTargeting(card.card, card.index, 3, true, false);
    world.state = State.Targeting;
}, (world, card) => {
    for (let target of card.targets_e) {
        world.enemies.get(target).hp -= 2 + additional_damage;
    }
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
    world.discard.push(card.card);
}));
// 8
const card_3 = new CardDef("Smite", 4, (ad, _) => { return "deal " + (3 + ad) + " damage to up to 2 target enemies, draw a card"; }, new CardActions((world, card) => {
    world.card_targeting = new CardTargeting(card.card, card.index, 2, true, false);
    world.state = State.Targeting;
}, (world, card) => {
    for (let target of card.targets_e) {
        world.enemies.get(target).hp -= 3 + additional_damage;
    }
    world.draw_card();
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
    world.discard.push(card.card);
}));
// 7
const card_4 = new CardDef("Overwhelming Wave", 3, (ad, _) => { return "deal " + (2 + ad) + " damage to to all enemies"; }, new CardActions((world, card) => {
    for (let enemy of world.enemies) {
        enemy[1].hp -= 2 + additional_damage;
    }
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
    world.discard.push(card.card);
}));
// 8
const card_5 = new CardDef("Fiery Inferno", 3, (ad, _) => { return "for the rest of the level, at the end of each turn, deal " + (2 + ad) + " damage to to all enemies, and take 2 damage"; }, new CardActions((world, card) => {
    world.perm_cards.push(new CardPerm(card.card));
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
    world.discard.push(card.card);
}, (_w, _c) => { }, (world, _card) => {
    for (let enemy of world.enemies) {
        enemy[1].hp -= 2 + additional_damage;
    }
    world.hp -= 2;
    return true;
}), 7, CardImage.Fireball1, CardColor.Red);
// 7
const card_6 = new CardDef("Nature's Reclamation", 2, (_a, _t) => { return "remove a card on the battlefield, then, heal for 2."; }, new CardActions((world, card) => {
    world.card_targeting = new CardTargeting(card.card, card.index, 1, false, true);
    world.state = State.Targeting;
}, (world, card) => {
    world.perm_cards.splice(card.targets_c[0], 1);
    world.hp = Math.min(world.hp + 2, world.maxhp);
    world.state = State.Playing;
    world.discard.push(card.card);
}));
// 6
const card_7 = new CardDef("FIREBALL", 0, (ad, _) => {
    if (ad == 0) {
        return "Deal X damage evenly spread (rounded down) among any number of target enemies, where X is the 1.5 times the amount of energy you have left (rounded down). For each target beyond the first, decrease X by 1, X cannot be negative. Consume all of your energy.";
    }
    else {
        return "Deal X damage evenly spread (rounded down) + " + ad + " among any number of target enemies, where X is the 1.5 times the amount of energy you have left (rounded down). For each target beyond the first, decrease X by 1, X cannot be negative. Consume all of your energy.";
    }
}, new CardActions((world, card) => {
    world.card_targeting = new CardTargeting(card.card, card.index, 9999999, true, false);
    world.state = State.Targeting;
}, (world, card) => {
    let total_damage = Math.floor(world.cur_energy * 1.5);
    total_damage = Math.max(total_damage - card.targets_e.length + 1, 0);
    let to_each = Math.floor(total_damage / card.targets_e.length);
    for (let target of card.targets_e) {
        world.enemies.get(target).hp -= to_each + additional_damage;
    }
    world.cur_energy = 0;
    world.state = State.Playing;
    world.discard.push(card.card);
}), 5, CardImage.Fireball1, CardColor.Red);
// 8
const card_8 = new CardDef("Healing Blessing", 2, (_a, _t) => { return "Heal for 3, then, draw a card."; }, new CardActions((world, card) => {
    world.cur_energy -= card.card.energy_cost;
    world.hp = Math.min(world.hp + 3, world.maxhp);
    world.draw_card();
    world.state = State.Playing;
    world.discard.push(card.card);
}, (_world, _card) => {
}));
// 8
//
const card_9 = new CardDef("Shattering Rock", 3, (ad, _) => { return "Deal " + (2 + ad) + " damage to target enemy, then add 3 Rock Splinters to your hand which deal " + (1 + ad) + " damage to target enemy for 0 energy."; }, new CardActions((world, card) => {
    world.card_targeting = new CardTargeting(card.card, card.index, 1, true, false);
    world.state = State.Targeting;
}, (world, card) => {
    for (let target of card.targets_e) {
        world.enemies.get(target).hp -= 2 + additional_damage;
    }
    world.player_hand.push(new Card("Rock Splinter", 0, (ad, _) => { return "deal " + (1 + ad) + " damage to target enemy"; }, new CardActions((world, card) => { world.card_targeting = new CardTargeting(card.card, card.index, 1, true, false); world.state = State.Targeting; }, (world, card) => { for (let target of card.targets_e) {
        world.enemies.get(target).hp -= 1 + additional_damage;
    } world.cur_energy -= card.card.energy_cost; world.state = State.Playing; }), null, CardImage.Rock, CardColor.Green, false));
    world.player_hand.push(new Card("Rock Splinter", 0, (ad, _) => { return "deal " + (1 + ad) + " damage to target enemy"; }, new CardActions((world, card) => { world.card_targeting = new CardTargeting(card.card, card.index, 1, true, false); world.state = State.Targeting; }, (world, card) => { for (let target of card.targets_e) {
        world.enemies.get(target).hp -= 1 + additional_damage;
    } world.cur_energy -= card.card.energy_cost; world.state = State.Playing; }), null, CardImage.Rock, CardColor.Green, false));
    world.player_hand.push(new Card("Rock Splinter", 0, (ad, _) => { return "deal " + (1 + ad) + " damage to target enemy"; }, new CardActions((world, card) => { world.card_targeting = new CardTargeting(card.card, card.index, 1, true, false); world.state = State.Targeting; }, (world, card) => { for (let target of card.targets_e) {
        world.enemies.get(target).hp -= 1 + additional_damage;
    } world.cur_energy -= card.card.energy_cost; world.state = State.Playing; }), null, CardImage.Rock, CardColor.Green, false));
    console.log(world.player_hand);
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
    world.discard.push(card.card);
}), 7, CardImage.Rock, CardColor.Green);
// 9
const card_10 = new CardDef("Supernova", 7, (_) => { return "Discard your hand, shuffle your discard pile into your deck, then, for the rest of the level decrease the cost of energy cost cards in your deck by 2, energy cost cannot be negative."; }, new CardActions((world, card) => {
    world.discard = [...world.discard, ...world.player_hand];
    world.cur_deck = [...world.discard];
    world.discard = [];
    world.player_hand = [];
    world.cur_energy -= card.card.energy_cost;
    world.shuffle();
    for (let c of world.cur_deck) {
        c.energy_cost = Math.max(c.energy_cost - 2, 0);
    }
    world.state = State.Playing;
    world.discard.push(card.card);
}, (_world, _card) => { }), 6, CardImage.Fireball1, CardColor.Red);
// 5
const card_11 = new CardDef("Blood Pact", 2, (_a, _t) => { return "Lose 2 life, then draw 2 cards"; }, new CardActions((world, card) => {
    world.draw_card();
    world.draw_card();
    world.hp -= 2;
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
    world.discard.push(card.card);
}, (_world, _card) => { }));
let additional_damage = 0;
// 8
const card_12 = new CardDef("Arcane Power", 5, (_a, _t) => { return "For the rest of the level, each card that deals damage to enemies deals 1 more damage"; }, new CardActions((world, card) => {
    additional_damage += 1;
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
    world.discard.push(card.card);
}, (_world, _card) => { }));
const card_13 = new CardDef("Leyline", 5, (_a, _t) => { return "For the rest of the level, at the end of your turn, draw a card"; }, new CardActions((world, card) => {
    world.perm_cards.push(new CardPerm(card.card));
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
    world.discard.push(card.card);
}, (_w, _c) => { }, (world, _card) => {
    world.draw_card();
    return true;
}));
// 7
const card_14 = new CardDef("Relentless Crusade", 2, (ad, t) => { return "Deal " + (2 + ad + t * 2) + " damage to up to 2 target enemies, then for the rest of the level increase this card's damage by 2, and its mana cost by 2, then, this card goes back on the top of your deck"; }, new CardActions((world, card) => {
    world.card_targeting = new CardTargeting(card.card, card.index, 2, true, false);
    world.state = State.Targeting;
}, (world, card) => {
    for (let target of card.targets_e) {
        world.enemies.get(target).hp -= 2 + additional_damage + card.card.tracker * 2;
    }
    card.card.tracker++;
    world.cur_energy -= card.card.energy_cost;
    card.card.energy_cost += 2;
    world.state = State.Playing;
    world.cur_deck.unshift(card.card);
}), 6.1, CardImage.Crusade, CardColor.White);
// 6
const card_15 = new CardDef("Force Push", 3, (_a, _t) => { return "Move all enemies one space back"; }, new CardActions((world, card) => {
    for (let target of world.enemies) {
        target[1].y = Math.max(target[1].y - 80, 100);
    }
    world.cur_energy -= card.card.energy_cost;
    world.state = State.Playing;
}, (_world, _card) => {
}), null, CardImage.Crusade, CardColor.White);
let cur_id = 1;
let tutorial_complete = false;
let cardimgbl;
let cardimgwh;
let cardimggr;
let cardimgre;
let cardtopbl;
let cardtopwh;
let cardtopgr;
let cardtopre;
let hpb;
let eb;
let f1;
let f2;
let li;
let cb;
let cru;
let roc;
const sketch = (p5) => {
    p5.preload = function () {
        return __awaiter(this, void 0, void 0, function* () {
            cardimgbl = p5.loadImage("./img/card.png");
            cardimgwh = p5.loadImage("./img/card_white.png");
            cardimggr = p5.loadImage("./img/card_green.png");
            cardimgre = p5.loadImage("./img/card_red.png");
            eb = p5.loadImage("./img/energy.png");
            hpb = p5.loadImage("./img/hp.png");
            f1 = p5.loadImage("./img/fireball.png");
            f2 = p5.loadImage("./img/fire2.png");
            li = p5.loadImage("./img/lightning.png");
            cardtopbl = p5.loadImage("./img/top.png");
            cardtopwh = p5.loadImage("./img/top_white.png");
            cardtopgr = p5.loadImage("./img/top_green.png");
            cardtopre = p5.loadImage("./img/top_red.png");
            cb = p5.loadImage("./img/card_back.png");
            cru = p5.loadImage("./img/crusade.png");
            roc = p5.loadImage("./img/rock.png");
        });
    };
    p5.setup = function () {
        p5.createCanvas(WIDTH, HEIGHT);
        document.querySelector("canvas").style.width = "100vw";
        document.querySelector("canvas").style.height = "100vh";
    };
    p5.draw = function draw() {
        p5.background(220);
        world.update();
        camera.render(p5, world);
    };
    p5.mousePressed = function () {
        if (world.state == State.GameOver || world.state == State.GameOverLoss) {
            world = new World();
            tutorial_complete = true;
        }
        if (world.state == State.Start) {
            world.level = -1;
            world.shuffle();
            if (!tutorial_complete) {
                world.start_tutorial();
            }
            else {
                world.start();
            }
            return;
        }
        if (world.state == State.ShowingDeck) {
            if (p5.mouseX > WIDTH - 70 && p5.mouseX < WIDTH - 31 && p5.mouseY > 23 && p5.mouseY < 63) {
                world.state = State.Playing;
            }
            return;
        }
        if (world.tutorial && world.tutorial_stage != 4 && world.tutorial_stage != 8 && world.tutorial_stage != 10 && world.tutorial_stage != 12) {
            world.tutorial_stage++;
            return;
        }
        if (world.state == State.AddingCards) {
            if (p5.mouseX >= 350 + 13.88 && p5.mouseX <= 350 + 13.88 + 1.17 * CARD_WIDTH && p5.mouseY >= 310 && p5.mouseY <= 310 + 1.25 * CARD_HEIGHT && world.clicked_added_card != 0) {
                world.clicked_added_card = 0;
            }
            if (p5.mouseX >= 650 + 13.88 && p5.mouseX <= 650 + 13.88 + 1.17 * CARD_WIDTH && p5.mouseY >= 310 && p5.mouseY <= 310 + 1.25 * CARD_HEIGHT && world.clicked_added_card != 1) {
                world.clicked_added_card = 1;
            }
            if (p5.mouseX >= 950 + 13.88 && p5.mouseX <= 950 + 13.88 + 1.17 * CARD_WIDTH && p5.mouseY >= 310 && p5.mouseY <= 310 + 1.25 * CARD_HEIGHT && world.clicked_added_card != 2) {
                world.clicked_added_card = 2;
            }
            if (p5.mouseX > WIDTH / 2 - 170 / 2 - 14 && p5.mouseX < WIDTH / 2 + 170 / 2 - 14 && p5.mouseY > 700 - 50 / 2 && p5.mouseY < 750 - 50 / 2 && world.clicked_added_card != null) {
                world.player_deck.push(world.cards_being_shown[world.clicked_added_card]);
                world.added_cards();
            }
            return;
        }
        if (p5.mouseX > WIDTH - 150 && p5.mouseX < WIDTH - 31 && p5.mouseY > 23 && p5.mouseY < 63 && world.state == State.Playing && world.tutorial_stage != 4 && world.tutorial_stage != 8 && world.tutorial_stage != 10 && world.tutorial_stage != 12) {
            world.state = State.ShowingDeck;
        }
        if (world.state == State.Playing || world.state == State.Discard) {
            let hovered_card = null;
            let hcx = null;
            let total_width = Math.min(85 * world.player_hand.length, 900); // 180
            let individual_width = total_width / world.player_hand.length; // 60
            for (let i = 0; i < world.player_hand.length; i++) {
                let x = (WIDTH - total_width - CARD_WIDTH) / 2.0 + individual_width * i;
                let w = CARD_WIDTH;
                let h = CARD_HEIGHT;
                let y = CARD_Y;
                if (i + 1 == world.cur_hovered_card) {
                    w -= 40.1;
                }
                if (i == world.cur_hovered_card) {
                    x -= 6.1;
                    w += 7;
                    y -= 8.45;
                    h += 16.9;
                }
                if (p5.mouseY >= y && p5.mouseY <= y + h && p5.mouseX >= x && p5.mouseX <= x + w) {
                    hovered_card = i;
                    hcx = x;
                    break;
                }
            }
            if (hovered_card != null && world.tutorial_stage != 8) {
                world.card_on_mouse = new CardOnMouse(world.player_hand[hovered_card], hovered_card, hcx - p5.mouseX, CARD_Y - p5.mouseY);
                if (world.state != State.Discard) {
                    world.state = State.CardOnMouse;
                }
                ;
                world.player_hand.splice(hovered_card, 1);
            }
        }
        if (p5.mouseX > 900 && p5.mouseX < 1000 && p5.mouseY > CARD_Y - 80 && p5.mouseY < CARD_Y - 30 && world.state == State.Playing && world.tutorial_stage != 4 && world.tutorial_stage != 12) {
            world.next_turn();
        }
        if (world.card_targeting != null && world.cur_hovered_enemy != null && world.card_targeting.targets_enemies) {
            if (!world.card_targeting.targets_e.includes(world.cur_hovered_enemy)) {
                world.card_targeting.targets_e.push(world.cur_hovered_enemy);
                world.card_targeting.targets_left--;
                if (world.card_targeting.targets_left == 0) {
                    world.card_targeting.card.actions.onTarget(world, world.card_targeting);
                    world.card_targeting = null;
                }
            }
        }
        if (world.card_targeting != null && world.cur_t_hovered_card != null && world.card_targeting.targets_cards) {
            if (!world.card_targeting.targets_c.includes(world.cur_t_hovered_card)) {
                world.card_targeting.targets_c.push(world.cur_t_hovered_card);
                world.card_targeting.targets_left--;
                if (world.card_targeting.targets_left == 0) {
                    world.card_targeting.card.actions.onTarget(world, world.card_targeting);
                    world.card_targeting = null;
                }
            }
        }
        if (world.card_targeting != null && ((world.cur_hovered_enemy == null && world.card_targeting.targets_enemies) || (world.cur_t_hovered_card == null && world.card_targeting.targets_cards)) && !(p5.mouseX > 900 && p5.mouseX < 1000 && p5.mouseY > CARD_Y - 80 && p5.mouseY < CARD_Y - 30)) {
            if (p5.mouseX > 265 && p5.mouseX < 430 && p5.mouseY > CARD_Y - 80 && p5.mouseY < CARD_Y - 30 && world.card_targeting.total_targets >= 1) {
                world.card_targeting.card.actions.onTarget(world, world.card_targeting);
                world.card_targeting = null;
            }
            else {
                world.player_hand.splice(world.card_targeting.index, 0, world.card_targeting.card);
                world.card_targeting = null;
                world.state = State.Playing;
            }
        }
    };
    p5.mouseReleased = function () {
        if (world.state == State.CardOnMouse) {
            if (p5.mouseX > 0 && p5.mouseX < WIDTH && p5.mouseY > 0 && p5.mouseY < CARD_Y - 50) {
                if (world.cur_energy >= world.card_on_mouse.card.energy_cost) {
                    world.card_on_mouse.card.actions.onCast(world, world.card_on_mouse);
                    world.card_on_mouse = null;
                }
                else {
                    world.cant_afford_text = 20;
                    world.player_hand.splice(world.card_on_mouse.index, 0, world.card_on_mouse.card);
                    world.card_on_mouse = null;
                    world.state = State.Playing;
                }
            }
            else {
                world.player_hand.splice(world.card_on_mouse.index, 0, world.card_on_mouse.card);
                world.card_on_mouse = null;
                world.state = State.Playing;
            }
        }
        p5.rect(130, 500, 200, 200);
        if (world.state == State.Discard) {
            if (p5.mouseX > 130 && p5.mouseX < 330 && p5.mouseY > 500 && p5.mouseY < 700 && world.card_on_mouse != null) {
                if (world.card_on_mouse.card.discardable) {
                    world.discard.push(world.card_on_mouse.card);
                }
                world.card_on_mouse = null;
                if (world.player_hand.length <= 6) {
                    world.state = State.Playing;
                    world.next_turn();
                }
            }
            else {
                if (world.card_on_mouse != null) {
                    world.player_hand.splice(world.card_on_mouse.index, 0, world.card_on_mouse.card);
                    world.card_on_mouse = null;
                }
            }
        }
    };
};
new p5_1.default(sketch);
