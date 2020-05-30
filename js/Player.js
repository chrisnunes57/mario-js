const mario_positions = [
    [20, 0], // mario standing
    [140, 0], // mario about to take step
    [290, 0], // mario taking a step
    [420, 0] // mario about to take step
]

const mario_reversed_positions = [
    [420, 0], // mario about to take step
    [290, 0], // mario taking a step
    [140, 0], // mario about to take step
    [20, 0] // mario standing
]

class Player {

    constructor(ctx, x, y, width, height, type) {
        this.image = new Image();
        this.image.src = "assets/mario.png";

        this.imageReversed = new Image();
        this.imageReversed.src = "assets/mario-reversed.png";
        this.image.onload = () => {
            this.draw();
        };

        this.ctx = ctx;

        this.width = width;
        this.height = height;

        this.x = x;
        this.y = y;

        this.velocityX = 0;
        this.velocityY = 0;
        this.maxVelocity = 20;
        this.runSpeed = 10;

        this.spritePositions = mario_reversed_positions;

        this.running = false;
        this.jumping = false;

        this.spriteIndex = 0;
        // we keep track of previous sprite so that we only re-render on change
        this.prevSpriteIndex = 0;

        this.reversed = false;

        this.spriteX = this.spritePositions[this.spriteIndex][0];
        this.spriteY = this.spritePositions[this.spriteIndex][1];
    }

    draw(cameraOffset, obstacles=[], characters=[]) {

        this.setSprite();

        this.velocityY += 2.5;

        this.x += this.velocityX;
        this.checkCollisions(obstacles, characters, "x");
        this.y += this.velocityY;
        this.checkCollisions(obstacles, characters, "y");

        this.ctx.drawImage(this.reversed ? this.imageReversed : this.image, this.spriteX, this.spriteY, 120, 160, this.x + cameraOffset[0], this.y + cameraOffset[1], this.width, this.height);
    }

    checkCollisions(obstacles, characters, direction) {
        for (let i = 0; i < obstacles.length; i++) {
            let ob = obstacles[i];
            if (this.x < ob.x + ob.width && this.x + this.width > ob.x
                && this.y < ob.y + ob.height && this.y + this.height > ob.y) {
                // collision with another rectangle
                if (direction === "y") {
                    if (this.velocityY > 0) {
                        // falling down
                        this.y = ob.y - this.height;
                        this.jumping = false;
                    } else {
                        // jumping up
                        this.y = ob.y + ob.height;
                    }
                    this.velocityY = 0;
                } else if (direction === "x") {
                    if (this.velocityX > 0) {
                        // we were running to the right
                        this.x = ob.x - this.width;
                    } else {
                        // running to left
                        this.x = ob.x + ob.width;
                    }
                    this.velocityX = 0;
                    this.running = false;
                }
                
            }
        }
    }

    setSprite() {
        if (this.running) {
            this.spriteIndex += 1;
            if (this.spriteIndex >= 3) {
                this.spriteIndex = 1;
            }
        } else {
            this.spriteIndex = 0;
        }

        if (this.reversed) {
            this.spritePositions = mario_reversed_positions;
        } else {
            this.spritePositions = mario_positions;
        }

        if (this.spriteIndex !== this.prevSpriteIndex) {
            this.prevSpriteIndex = this.spriteIndex;
            this.spriteX = this.spritePositions[this.spriteIndex][0];
            this.spriteY = this.spritePositions[this.spriteIndex][1];
        }
    }

    moveLeft(flag) {
        this.running = flag;
        this.velocityX = -this.maxVelocity * flag;
        this.reversed = true;
    }

    moveRight(flag) {
        this.running = flag;
        this.velocityX = this.maxVelocity * flag;
        this.reversed = false;
    }

    jump() {
        if (!this.jumping) {
            this.jumping = true;
            this.velocityY = -30;
        }
    }
}

export { Player };