class Sprite {
    constructor ({position, imgScr, scale = 1, framesMax = 1, offset = {x: 0, y: 0}}){
        this.position = position
        this.width = 50
        this.height = 150
        this.image = new Image()
        this.image.src = imgScr
        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
    }

    draw(){
        context.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x, 
            this.position.y - this.offset.y, 
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        )
        
    }

    animateFrames() {
        this.framesElapsed++

        if (this.framesElapsed % this.framesHold === 0){
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            }else{
                this.framesCurrent = 0
            }

        }
    }

    update() {
        this.draw()
        this.animateFrames()
    }

}




class Figther extends Sprite{
    constructor ({
        position, 
        velocity, 
        color = 'red', 
        imgScr, 
        scale = 1, 
        framesMax = 1, 
        offset = {x: 0, y: 0}, 
        sprites, 
        attackBox = {offset: {}, width: undefined, height: undefined}
        }){

        super({
            position,
            imgScr,
            scale,
            framesMax,
            offset
        })

        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        }
        this.color = color
        this.isAttacking
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites
        this.dead = false
        this.loadCharacterSprites();

        console.log(this.sprites);
    }

    loadCharacterSprites() {
        for (const sprite in this.sprites) {
            const spriteData = this.sprites[sprite];
            spriteData.image = new Image();
            spriteData.image.src = spriteData.imgScr;

            // Attach an onload event to each image to ensure it's fully loaded
            spriteData.image.onload = () => {
                if (sprite === 'idle') {
                    // Set the default sprite to 'idle' once the first sprite is loaded
                    this.image = spriteData.image;
                    this.framesMax = spriteData.framesMax;
                }
            };
        }
    }
    
    update() {
        this.draw();
        if(!this.dead){
            this.animateFrames()
        }
        
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        // context.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height) //attckbox

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 97){
            this.velocity.y = 0
            this.position.y = 329
        }else{
            this.velocity.y += gravity
        }
        
    }

    attack(){
        this.switchSprite('attack1')
        this.isAttacking = true
        
    }

    takehit(){
       
        this.health -= 20

        if(this.health <= 0 ){
            this.switchSprite('death')
        }else{
            this.switchSprite('takeHit')
        }
    }

    takehitProjectile(){
       
        this.health -= 10

        if(this.health <= 0 ){
            this.switchSprite('death')
        }else{
            this.switchSprite('takeHit')
        }
    }

    switchSprite(sprite){
        if(this.image === this.sprites.death.image){
            if(this.framesCurrent === this.sprites.death.framesMax - 1){
                this.dead = true
            }
            return
        }
        //it will overide all animations with the attack animations
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return

        //will overide all animations with the takeHit animations
        if (this.image === this.sprites.takehit.image && this.framesCurrent < this.sprites.takehit.framesMax - 1) return

        switch (sprite) {
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image
                    this.framesMax = this.sprites.idle.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image
                    this.framesMax = this.sprites.run.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image
                    this.framesMax = this.sprites.jump.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image
                    this.framesMax = this.sprites.fall.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'attack1':
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image
                    this.framesMax = this.sprites.attack1.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'takeHit':
                if (this.image !== this.sprites.takehit.image) {
                    this.image = this.sprites.takehit.image
                    this.framesMax = this.sprites.takehit.framesMax
                    this.framesCurrent = 0
                }
                break
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image
                    this.framesMax = this.sprites.death.framesMax
                    this.framesCurrent = 0
                }
                break
        }
    }
}


class Projectile extends Sprite {
    constructor(position, velocity, width, height, color) {
        super({
            position,
            imgScr: './assets/flames/FB001.png',
            framesMax: 1, 
        });
        this.velocity = velocity;
        this.width = width;
        this.height = height;
        this.color = color;
        this.active = true;
    }

    draw() {
        if (this.active) {
            context.drawImage(this.image, this.position.x, this.position.y, this.width, this.height);
        }
    }

    update() {
        if (this.active) {
            this.position.x += this.velocity.x;
            this.draw();
        }
    }
}