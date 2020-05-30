import { Block } from "./Block.js";
import { Player } from "./Player.js";

/* CONSTANTS */
// we want a 16x12 screen size 
let blocksize = 48;
let playerWidth = 38;
let playerHeight = 44;
let gameWidth = blocksize * 16;
let gameHeight = blocksize * 12;
let originalPlayerX = blocksize * 8;
let originalPlayerY = blocksize * 6;

/* Declarations */

// to monitor fps
let fps = 30;
let fpsInterval, now, then, elapsed;

let gameMap = [
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "u", "u", "u", "u", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["u", "u", "u", "u", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"],
    ["b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"],
    ["b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b", "b"]
]

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

canvas.width = gameWidth;
canvas.height = gameHeight;

// track non-moving elements
let obstacles = [];

// track moving elements
let characters = [];

// track our main character specifically
let player;

// We keep track of the camera offset, to simulate a viewport
let cameraOffset = [0, 0];

function gameLoop(newtime) {
    
    window.requestAnimationFrame(gameLoop);

    // we throttle fps
    now = newtime;
    elapsed = now - then;

    if (elapsed > fpsInterval) {

        // Get ready for next frame by setting then=now, but...
        // Also, adjust for fpsInterval not being multiple of 16.67
        then = now - (elapsed % fpsInterval);

        cameraOffset[0] = Math.min(originalPlayerX - player.x, 0);
        cameraOffset[1] = Math.max(originalPlayerY - player.y - 100, 0);

        // draw stuff here
        ctx.fillStyle = "#5C94FC";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // re-render our obstacles
        obstacles.forEach((item) => {
            item.draw(cameraOffset);
        });

        // re-render our characters
        characters.forEach((item) => {
            item.draw(cameraOffset, obstacles, characters);
        });


    }
}

function handleKeyDown(e) {
    let code = e.keyCode;
    switch (code) {
        case 37: 
            player.moveLeft(1);
            break; //Left key
        case 38: 
            player.jump();
            break; //Up key
        case 39: 
            player.moveRight(1);
            break; //Right key
        case 40: 
            console.log("Down");
            break; //Down key
        case 87:
            player.jump();
            break; //W key
        case 65:
            player.moveLeft(1);
            break; //A key
        case 83:
            console.log("Down");
            break; //Down key
        case 68:
            player.moveRight(1);
            break; //Right key
        case 32:
            player.jump();
            break; //Space key
        default: console.log(code); //Everything else
    }
}

function handleKeyUp(e) {
    let code = e.keyCode;
    switch (code) {
        case 37:
            player.moveLeft(0);
            break; //Left key
        case 38:
            player.jump();
            break; //Up key
        case 39:
            player.moveRight(0);
            break; //Right key
        case 40:
            console.log("Down");
            break; //Down key
        case 87:
            player.jump();
            break; //W key
        case 65:
            player.moveLeft(0);
            break; //A key
        case 83:
            console.log("Down");
            break; //Down key
        case 68:
            player.moveRight(0);
            break; //Right key
        case 32:
            player.jump();
            break; //Space key
        default:
            break;
    }
}

function setup() {

    window.addEventListener('keydown', (e) => { handleKeyDown(e) });
    window.addEventListener('keyup', (e) => { handleKeyUp(e) });

    ctx.fillStyle = "#5C94FC";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw our map
    for (let r = 0; r < gameMap.length; r++) {
        for (let c = 0; c < gameMap[r].length; c++) {
            if (gameMap[r][c] !== '0') {
                let b = new Block(ctx, c * blocksize, r * blocksize, blocksize, blocksize, gameMap[r][c]);
                obstacles.push(b);
            }
        }
    }

    // Draw our player
    player = new Player(ctx, originalPlayerX, originalPlayerY, playerWidth, playerHeight, "mario");
    characters.push(player);

    fpsInterval = 1000 / fps;
    then = window.performance.now();

    gameLoop();
}

setup();