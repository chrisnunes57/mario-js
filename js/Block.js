const sprite_positions = {
    "b": [0, 0], // base block
    "u": [48, 0] // used coin block
}

class Block {


    constructor(ctx, x, y, width, height, type) {
        this.image = new Image();
        this.image.src = "assets/tileset.png";
        this.image.onload = () => {
            this.draw();
        };

        this.ctx = ctx;

        this.width = width;
        this.height = height;

        this.x = x;
        this.y = y;

        this.spriteX = sprite_positions[type][0];
        this.spriteY = sprite_positions[type][1];
    }

    draw(cameraOffset) {
        
        this.ctx.drawImage(this.image, this.spriteX, this.spriteY, 16, 16, this.x + cameraOffset[0], this.y + cameraOffset[1], this.width, this.height);
    }
}

export { Block };