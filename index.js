    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    canvas.width = 1024
    canvas.height = 576

    context.fillRect(0, 0, canvas.width, canvas.height)

    const gravity = 0.6



    const playerProjectiles = [];
    const player2Projectiles = [];
   

    const background = new Sprite({
        position: {
            x: 0,
            y: 0
        },
        imgScr: './assets/background.png'
    })

    const shop = new Sprite({
        position: {
            x: 600,
            y: 130
        },
        imgScr: './assets/shop.png',
        scale: 2.75,
        framesMax: 6
    })

    const player = new Figther({
        position: {
            x: 0,
            y: 0
        },
        velocity: {
            x: 0,
            y: 0
        },
        offset: {
            x: 0,
            y: 0
        },imgScr: './assets/samuraiMack/Idle.png',
        framesMax: 8,
        scale: 2.5,
        offset: {
            x: 215,
            y: 155
        },
        sprites: {
            idle: {
                imgScr: './assets/samuraiMack/Idle.png',
                framesMax: 8
            },
            run: {
                imgScr: './assets/samuraiMack/Run.png',
                framesMax: 8,
                
            },
            jump: {
                imgScr: './assets/samuraiMack/Jump.png',
                framesMax: 2
            },
            fall: {
                imgScr: './assets/samuraiMack/Fall.png',
                framesMax: 2
            },
            attack1: {
                imgScr: './assets/samuraiMack/Attack1.png',
                framesMax: 6
            },
            takehit: {
                imgScr: './assets/samuraiMack/Take Hit - white silhouette.png',
                framesMax: 4
            },
            death: {
                imgScr: './assets/samuraiMack/Death.png',
                framesMax: 6
            }
        },
        attackBox: {
            offset: {
              x: 100,
              y: 50
            },
            width: 160,
            height: 50
          }
    })

    const player2 = new Figther({
        position: {
            x: 400,
            y: 100
        },
        velocity: {
            x: 0,
            y: 0
        },
        color: 'blue',
        offset: {
            x: -50,
            y: 0
        },imgScr: './assets/kenji/Idle.png',
        framesMax: 4,
        scale: 2.5,
        offset: {
            x: 214,
            y: 167
        },
        sprites: {
            idle: {
                imgScr: './assets/kenji/Idle.png',
                framesMax: 4
            },
            run: {
                imgScr: './assets/kenji/Run.png',
                framesMax: 8,
                
            },
            jump: {
                imgScr: './assets/kenji/Jump.png',
                framesMax: 2
            },
            fall: {
                imgScr: './assets/kenji/Fall.png',
                framesMax: 2
            },
            attack1: {
                imgScr: './assets/kenji/Attack1.png',
                framesMax: 4
            },
            takehit: {
                imgScr: './assets/kenji/Take hit.png',
                framesMax: 3
            },
            death: {
                imgScr: './assets/kenji/Death.png',
                framesMax: 7
            }
            
        },attackBox: {
            offset: {
              x: -170,
              y: 50
            },
            width: 170,
            height: 50
          }

    })

    console.log(player);

    const keys = {
        a: {
            pressed: false
        },
        d: {
            pressed: false
        },
        ArrowLeft: {
            pressed: false
        },
        ArrowRight: {
            pressed: false
        }
    }

    decreaseTimer()


    function animate () {
        window.requestAnimationFrame(animate)
        context.fillStyle = 'black'
        context.fillRect(0, 0, canvas.width, canvas.height)
        background.update()
        shop.update()
        context.fillStyle = 'rgba(255, 255, 255, 0.1)'
        context.fillRect(0, 0, canvas.width, canvas.height)
        player.update()
        player2.update()

        player.velocity.x = 0
        player2.velocity.x = 0

        // Update and draw projectiles for player
        for (const projectile of playerProjectiles) {
            projectile.update();
        }

        // Update and draw projectiles for player2
        for (const projectile of player2Projectiles) {
            projectile.update();
        }


        //player movement
        if(keys.a.pressed && player.lastKey === 'a'){
            player.velocity.x = -3
            player.switchSprite('run')
        }else if(keys.d.pressed && player.lastKey === 'd'){
            player.velocity.x = 3
            player.switchSprite('run')
        }else{
            player.switchSprite('idle')
        }

        if(player.velocity.y < 0){
            player.switchSprite('jump')
        }else if (player.velocity.y > 0){
            player.switchSprite('fall')
        }

            //enemy movement
        if(keys.ArrowLeft.pressed && player2.lastKey === 'ArrowLeft'){
            player2.velocity.x = -3
            player2.switchSprite('run')
        }else if(keys.ArrowRight.pressed && player2.lastKey === 'ArrowRight'){
            player2.velocity.x = 3
            player2.switchSprite('run')
        }else{
            player2.switchSprite('idle')
        }

        if(player2.velocity.y < 0){
            player2.switchSprite('jump')
        }else if (player2.velocity.y > 0){
            player2.switchSprite('fall')
        }


        //detect collisions & take hit 
        if (RectCollisions({
            rectangle1: player, 
            rectangle2: player2
        }) && player.isAttacking && player.framesCurrent === 4) {
            player2.takehit()
            player.isAttacking = false
            
            // document.querySelector('#enemyHealth').style.width = enemy.health + '%'
            gsap.to( '#enemyHealth', {
                width: player2.health + '%'
            })
            console.log('Hit')
        }

        for (const projectile of playerProjectiles) {
            projectile.update();
            
            // Check if the projectile hits the enemy (player2)
            if (RectCollisions({
                rectangle1: player2,
                rectangle2: projectile
            })) {
                player2.takehitProjectile();
                playerProjectiles.splice(playerProjectiles.indexOf(projectile), 1); // Remove the projectile
                gsap.to('#enemyHealth', { width: player2.health + '%' });
            }
        }
    
        // Update and draw projectiles for player2
        for (const projectile of player2Projectiles) {
            projectile.update();
    
            // Check if the projectile hits the player
            if (RectCollisions({
                rectangle1: player,
                rectangle2: projectile
            })) {
                player.takehitProjectile();
                player2Projectiles.splice(player2Projectiles.indexOf(projectile), 1); // Remove the projectile
                gsap.to('#playerHealth', { width: player.health + '%' });
            }
        }

        //border collision player
        if(player.position.x < 0){
            player.position.x = 0
        }else if (player.position.x + player.width * player.scale > canvas.width){
            player.position.x = canvas.width - player.width * player.scale
        }

        //border collision enemy
        if(player2.position.x < 0){
            player2.position.x = 0
        }else if (player2.position.x + player2.width * player2.scale > canvas.width){
            player2.position.x = canvas.width - player2.width * player2.scale
        }

        //player misses
        if(player.isAttacking && player.framesCurrent === 4){
            player.isAttacking = false
        }

        //player gets hit
        if (RectCollisions({
            rectangle1: player2, 
            rectangle2: player
        }) && player2.isAttacking && player2.framesCurrent === 2) {
            player.takehit()
            player2.isAttacking = false
            // document.querySelector('#playerHealth').style.width = player.health + '%'
            gsap.to( '#playerHealth', {
                width: player.health + '%'
            })
            console.log('Hit')
        }

        // enemy misses
        if(player2.isAttacking && player2.framesCurrent === 2){
            player2.isAttacking = false
        }

        //end game base on health
        if (player2.health <= 0 || player.health <= 0) {
            determineWinner({ player, enemy: player2, timerId })
        }
        
    }

    animate();

    function playerShoot(player) {
        
        const currentTime = Date.now();
        const timeSinceLastShot = currentTime - player.lastShotTime;
        const shootDelay = 1000; 
    
        if (timeSinceLastShot < shootDelay) {
        
            return;
        }
    
        const position = {
            x: player.position.x + (player === player2 ? player.width * player.scale : 0),
            y: player.position.y + player.height / 2
        };
    
        const velocity = {
            x: player === player2 ? -1 : 1,
            y: 0
        };
    
        const width = 64;
        const height = 32;
        const color = 'blue';

    
        const projectile = new Projectile(position, velocity, width, height, color);
    
        if (player === player2) {
            player2Projectiles.push(projectile);
        } else {
            playerProjectiles.push(projectile);
        }
    
        player.lastShotTime = currentTime;
    }

    var keySound = document.getElementById('keySound');

    function playSound() {
        keySound.currentTime = 0;
        keySound.play();
    }

    

    window.addEventListener('keydown', (event) => {
        if(!player.dead){
            switch(event.key){
                case 'd':
                    keys.d.pressed = true
                    player.lastKey = 'd'
                    break
                case 'a':
                    keys.a.pressed = true
                    player.lastKey = 'a'
                    break
                case 'w':
                    player.velocity.y = -20
                    break
                case 's':
                    player.attack()
                    playSound()
                    break;
                case 'Enter':
                    playerShoot(player);
                    break
            }

            
        }

        if(!player2.dead){
            switch (event.key) {
                case 'ArrowRight':
                    keys.ArrowRight.pressed = true
                    player2.lastKey = 'ArrowRight'
                    break
                case 'ArrowLeft':
                    keys.ArrowLeft.pressed = true
                    player2.lastKey = 'ArrowLeft'
                    break
                case 'ArrowUp':
                    player2.velocity.y = -20
                    break
                case 'ArrowDown':
                    player2.attack()
                    playSound()
                    break
                case 'Shift':
                    playerShoot(player2);
                    break
            }   
        }

    });

    window.addEventListener('keyup', (event) => {
        switch(event.key){
            case 'd':
                keys.d.pressed = false
                break
            case 'a':
                keys.a.pressed = false
                break
        }

        //enemy case
        switch(event.key){
            case 'ArrowRight':
                keys.ArrowRight.pressed = false
                break
            case 'ArrowLeft':
                keys.ArrowLeft.pressed = false
                break
        }
        

    });
