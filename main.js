const k = kaboom({
    global:true, //imports all kaboom functions to global namespace for easiness
    fullscreen: true,
    clearColor: [0, 0, 0],//background color
});


loadSprite("alien","alien.png");
loadSprite("player","space-invaders.png")
loadSprite('wall',"wall.png")
loadSprite('bullet',"bullet.png")
// define a scene

scene("gameover",(score)=>{

    add([
        text(score),
        origin("center"),
        scale(10),
        pos(width()/2,height()/2)
    ])

    add([
        text("Press ENTER to play again!"),
        origin("center"),
        scale(5),
        pos(width()/2,height()/2+100)
    ])

    keyDown('enter',()=>{
        go('main')
    })
    
});

scene("main", () => {

    const PLAYER_SPEED=100;
    const TIME_LEFT=30;
    let ALIEN_SPEED=150;
    const LEVEL_DOWN=50;
    const BULLET_SPEED=300;

    layers=(["obj","ui"],"obj");

    // [] array for map and {} object for configuration
    addLevel([
        '|                                  !',
        '|                                  !',
        '|    ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^     !',
        '|    ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^     !',
        '|    ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^     !',
        '|    ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^ ^     !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',
        '|                                  !',

    ],{
        width:30,
        height:30,
        '^':[sprite('alien'),'alien'],
        '|':[sprite('wall'),solid(),'left-wall'],
        '!':[sprite('wall'),solid(),'right-wall']
    })

    const gameName = add([
        // content, size
        text("Space Invaders", 30),
        pos(350,10),
        layer('ui'),
    ]);


    const player=add([
        sprite('player'),
        pos(width()/2,height()/2+200),
        origin('center'),
    ]);

    keyDown("left",()=>{
        player.move(-PLAYER_SPEED,0);
    });

    keyDown("right",()=>{
        player.move(PLAYER_SPEED,0);
    });

    keyDown("up",()=>{
        player.move(0,-PLAYER_SPEED);
    });

    keyDown("down",()=>{
        player.move(0,PLAYER_SPEED);
    });

    const score=add([
        text("0"),
        layer("ui"),
        scale(3),
        pos(90,10),
        layer("ui"),
        {
            value:0,
        }
    ]);

    const timer=add([
        text("0"),
        layer("ui"),
        scale(3),
        pos(900,10),
        {
            time:TIME_LEFT,
        }
    ]);

    timer.action(()=>{
        timer.time-=dt();
        timer.text=timer.time.toFixed(2);
        if (timer.time<=0){
            go("gameover",score.value);
        }
    })

    action("alien",(a)=>{
        a.move(ALIEN_SPEED,0);
    })

    collides("alien","right-wall",()=>{
        ALIEN_SPEED=-1*ALIEN_SPEED;
        every('alien',(a)=>{
            a.move(0,LEVEL_DOWN);
        });  
    });

    collides("alien","left-wall",()=>{
        ALIEN_SPEED=-1*ALIEN_SPEED;
        every('alien',(a)=>{
            a.move(0,LEVEL_DOWN);
        });  
    });

    player.overlaps('alien',()=>{
        go("gameover",score.value);
    });

    // ------------------
    player.action(()=>{
        player.resolve();
    })

    action("alien",(a)=>{
        a.resolve();
    })
    // ---------------

    action('alien',(a)=>{
        if (a.pos.y>height()){
            go("gameover",score.value);
        }

    });

    keyDown("space",()=>{

        fireBullet(player.pos.add(0,-30))
    });

    function fireBullet(playerPosition){
        add([
            sprite("bullet"),
            pos(playerPosition),
            origin("center"),
            'bullet',
        ])

    }

    action('bullet',(b)=>{
        b.move(0,-BULLET_SPEED)
        if (b.pos.y<0){
            destroy(b);
        }
    })
    collides('bullet','alien',(b,a)=>{
        destroy(b);
        destroy(a);
        camShake(8);
        score.value+=1;
        score.text=score.value;
    })
    
});

// start the game
start("main");
