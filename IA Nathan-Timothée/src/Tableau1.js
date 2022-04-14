class Tableau1 extends Phaser.Scene {



    preload() {
        // Je preload les images autres que Tiled
        this.load.image('circle','assets/circle.png');
        this.load.image('circleG','assets/circleG.png');
        this.load.image('circleB','assets/circleB.png');

        this.load.image('sword','assets/sword.png');

        this.load.image('grenouille','assets/vf2.png');

        this.load.image('Arme1','assets/square.png');
        this.load.image('Arme2','assets/squareY.png');

        // chargement tilemap
        this.load.image("tilemap", "assets/tiles_packed.png");

        // chargement de la map en json
        this.load.tilemapTiledJSON("map", "assets/MapBasique.json");
        this.load.image('HauteHerbe','assets/herbe.png');

    }


    create() {

        this.changementAI = false;
        let me=this;
        this.gauche = true;
        this.CD = true;
        this.tireD = false;
        this.crouch = false;
        this.hide = false;



        // Création du personnage de base
        this.perso = this.physics.add.sprite(500, 0, 'circle').setOrigin(0, 0);
        this.perso.setDisplaySize(30,60);
        this.perso.body.setAllowGravity(true);
        this.perso.setVisible(true);
        this.perso.hp = 300;

        // Création du personnage de base
        this.persoC = this.physics.add.sprite(500, 0, 'circle').setOrigin(0, 0);
        this.persoC.setDisplaySize(30,30);
        this.persoC.body.setAllowGravity(true);
        this.persoC.setVisible(true);
        this.persoC.hp = 300;

        // Création du personnage de base
        this.ai = this.physics.add.sprite(900, 0, 'grenouille').setOrigin(0, 0);
        this.ai.setDisplaySize(50,75);
        this.ai.body.setAllowGravity(true);
        this.ai.setVisible(true);
        this.stop = this.ai.x


        // Création Ia qui snipe
        this.ai2 = this.physics.add.sprite(50, 0, 'grenouille').setOrigin(0, 0);
        this.ai2.setDisplaySize(50,75);
        this.ai2.body.setAllowGravity(true);
        this.ai2.setVisible(true);


        this.sword = this.physics.add.sprite(200, 100, "sword").setScale(0.1,0.1);
        this.sword.body.setAllowGravity(false);
        this.sword.setDepth(1);
        this.sword.setVisible(false);
        this.sword.attack = 100
        this.sword.disableBody()

       // creation d'un projectille

        this.bullet = this.physics.add.sprite(200, 180,'Arme1').setOrigin(0, 0);
        this.bullet.setDisplaySize(20,20);
        this.bullet.body.setAllowGravity(false);
        this.bullet.setVisible(false);


        // chargement de la map
        const map = this.add.tilemap("map");
        // chargement du tileset
        const tileset = map.addTilesetImage(
            "game_tile",
            "tilemap"
        );

        // chargement du calque plateformes
        const platforms = map.createLayer(
            "calque_plateformes",
            tileset
        );

        // chargement du calque plateformes
        this.HauteHerbe = this.physics.add.group({
            allowGravity: false,
            immovable: true
        });
        map.getObjectLayer('hauteHerbe').objects.forEach((HauteHerbe) => {
            // Add new spikes to our sprite group
            const HauteHerbeSprite = this.HauteHerbe.create(HauteHerbe.x,HauteHerbe.y    - HauteHerbe.height, 'HauteHerbe').setOrigin(0);

        });

        platforms.setCollisionByExclusion(-1, true);


        // target or player's x, y
        const tx = this.perso.x
        const ty = this.perso.y

        const iax = this.ai.x;
        const iay = this.ai.y;


        // Creation des collision

        this.physics.add.collider(this.persoC, platforms);
        this.physics.add.collider(this.perso, platforms);
        this.physics.add.collider(this.sword, this.perso);
        this.physics.add.collider(this.ai, platforms);
        this.physics.add.collider(this.ai2, platforms);







        this.physics.add.collider(this.bullet, this.perso, function () {
            me.bullet.destroy(true);
            me.perso.destroy(true);
        })

        this.initKeyboard();

        this.physics.add.overlap(this.persoC,this.HauteHerbe)
        this.physics.add.overlap(this.sword, this.perso, function (){
            me.perso.hp -= me.sword.attack;
        })

        this.projectiles = this.add.group();

        this.time.addEvent({ delay: 500, callback: this.tir, callbackScope: this,loop : true });





    }


    rouch(){
        if (this.crouch === true){
            this.cameras.main.startFollow(this.persoC,false);
            this.persoC.enableBody()
            this.persoC.setVisible(true)
            this.perso.setVisible(false)
            this.perso.disableBody(true);
            this.perso.y = this.persoC.y -30;
            this.perso.x = this.persoC.x


        }
        else{
            this.cameras.main.startFollow(this.perso,false);
            this.persoC.disableBody()
            this.persoC.y = this.perso.y +30 ;
            this.persoC.x = this.perso.x
            this.persoC.setVisible(false)
            this.perso.setVisible(true)
            this.perso.enableBody();


        }
    }
    tir(){
        let me = this;


if (this.hide == false){
    if (this.tireD === true){
        this.balle = new Balle(this);
        this.physics.add.collider(this.perso, this.balle, function (){
            console.log("ok")
        })
    }

}


    }

     IaGestion2(){
        if (this.hide == false){
            this.dist2 = Phaser.Math.Distance.BetweenPoints(this.perso,this.ai2);

            if (this.dist2 <= 400){
                this.tireD = true
                console.log("tire")

            }
            else{
                this.tireD = false;
            }

        }

    }


    IaGesttion(){
        this.gauche = false;

        if (this.hide == false){
            this.dist = Phaser.Math.Distance.BetweenPoints(this.perso,this.ai);


            if (this.dist <= 300 ){
                if (this.perso.x <= this.ai.x){
                    this.ai.setVelocityX(-200)
                    this.gauche = true;
                }
                else if(this.perso.x >= this.ai.x) {
                    this.ai.setVelocityX(200)


                }

                this.stop = this.ai.x;


                this.time.addEvent({ delay: 50, callback: this.Jump, callbackScope: this });

                if (this.dist <=  100 ){
                    this.attackAi()
                }
            }
        }


    }

    attackAi(){
        this.ai.setVelocityX(0);

        if(this.CD === true) {
            this.sword.y = this.ai.y + 47;

            if (this.gauche === true) {
                this.sword.x = this.ai.x - 10;
                this.sword.flipX = true;
            } else {
                this.sword.x = this.ai.x + 60;
                this.sword.flipX = false;
            }

            //On rend l'épée visible
            this.sword.setVisible(true);
            //On active le body de l'épée
            this.sword.enableBody()
            //On ajoute un event avec un delay qui fera disparaitre l'épée dans 50 ms
            this.time.addEvent({delay: 50, callback: this.onEvent, callbackScope: this});

        }else{
            this.time.addEvent({delay: 1000, callback: this.cd, callbackScope: this});
        }
    }

    cd()
    {
        this.CD = true;
        console.log("neuneu")
    }

    onEvent()
    {
        this.sword.disableBody()
        this.sword.setVisible(false);
        this.CD = false;
        console.log("on se retire")
    }

    Jump()
    {
        if(this.stop === this.ai.x && this.dist >=  110 ){
            console.log(this.stop);
            this.ai.set
            this.ai.setVelocityY(-100);
        }
    }


    tp(){
    this.persoC.x = this.perso.x-10
    this.persoC.y = this.perso.y
}


    test(){
       if ( this.physics.overlap(this.persoC,this.HauteHerbe) === false){
           this.hide = false;
           console.log(this.hide);
       }
       else{
           this.hide = true
           console.log(this.hide);
       }
   }

    update(){




        for(var i = 0; i < this.projectiles.getChildren().length; i++){
            var tir = this.projectiles.getChildren()[i];
            tir.update();
        }


             this.IaGesttion();
             this.IaGestion2()


            this.rouch();
        if (this.crouch ===true){
            this.test()
        }
        else{

        }






        if(this.perso.hp <= 0){
            this.perso.disableBody()
        }
    }

    initKeyboard() {
        let me = this;

        this.input.keyboard.on('keyup', function (kevent) {
            switch (kevent.keyCode) {

                case Phaser.Input.Keyboard.KeyCodes.Q:
                    if(me.crouch === true){
                        me.persoC.setVelocityX(0);
                    }
                    me.perso.setVelocityX(0);
                    break;
                case Phaser.Input.Keyboard.KeyCodes.D:
                    if(me.crouch === true){
                        me.persoC.setVelocityX(0);
                    }
                    me.perso.setVelocityX(0);
                    break;
            }
        })
        this.input.keyboard.on('keydown', function (kevent) {
            switch (kevent.keyCode) {

                case Phaser.Input.Keyboard.KeyCodes.Q:
                        if(me.crouch === true){
                            me.persoC.setVelocityX(-100);
                        }
                        me.gauche = true;
                        me.perso.setVelocityX(-300);

                    break;

                case Phaser.Input.Keyboard.KeyCodes.D:

                    if(me.crouch === true){
                        me.persoC.setVelocityX(100);
                    }
                        me.gauche = false;
                        me.perso.setVelocityX(300);

                    break;


                case Phaser.Input.Keyboard.KeyCodes.C:

                    if (me.crouch === true){
                        me.crouch = false;
                        me.hide = false;
                        console.log(me.hide);


                    }
                    else {
                        me.crouch = true;

                        break;

                    }



                case Phaser.Input.Keyboard.KeyCodes.SPACE:

                    if (me.perso.body.onFloor(true)){
                        me.perso.setVelocityY(-350)
                    }


            }
        })
    }


    // fin du programme
}