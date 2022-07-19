
var trex ,trex_running;
var trexF;
var chao, chaoImg;
var nuvemImg;
var cactus1,cactus2,cactus3,cactus4,cactus5,cactus6;
var grupoCactus;
var grupoNuvens;
var jogar = 1;
var encerar = 0;
var gameState = jogar;
var restart;
var gameOver;
var gameOverImg;
var botaoRestart;
var botaoRestartImg;
var pontuacao = 0;
var puloSom;
var checkPointSom;
var gameOverSom;
var tempo = 0;
var invisibleGround;

//carregar imagens e animações
function preload(){
  trex_running = loadAnimation("trex1.png","trex3.png","trex4.png");
  chaoImg = loadImage("ground2.png");
  nuvemImg=loadImage("cloud.png");
  cactus1=loadImage("obstacle1.png");
  cactus2=loadImage("obstacle2.png");
  cactus3=loadImage("obstacle3.png");
  cactus4=loadImage("obstacle4.png");
  cactus5=loadImage("obstacle5.png");
  cactus6=loadImage("obstacle6.png");
  trexF=loadAnimation("trex_collided.png");
  gameOverImg=loadImage("gameOver.png");
  botaoRestartImg=loadImage("restart.png");
  puloSom=loadSound("jump.mp3");
  checkPointSom=loadSound("checkpoint.mp3");
  gameOverSom=loadSound("die.mp3");
}

//adicionar as imagens e animações as variaveis
function setup(){
  createCanvas(windowWidth,windowHeight);

  //trex
  trex = createSprite(50,height-70,10,10);
  trex.setCollider("circle", 0, 0, 35);
  trex.addAnimation("trexrun", trex_running);
  trex.addAnimation("trexF", trexF);
  trex.scale=0.7;
  //chão
  chao = createSprite(width/2,height-10,width,2);
  chao.addImage(chaoImg);
  //grupo de nuvens e cactus
  grupoCactus = createGroup();
  grupoNuvens = createGroup();
  //texto de gamer over
  gameOver=createSprite(width/2,160,10,10);
  gameOver.addImage("gameOver", gameOverImg);
  //botao de game over
  botaoRestart=createSprite(width/2,height/2,10,10);
  botaoRestart.addImage("gameOver", botaoRestartImg);

  invisibleGround = createSprite(width/2,height - 10,width,7);
  invisibleGround.visible = false;
}


function draw(){
  background("white");
  //mudar dia e noite
  if(tempo>0 && tempo % 2==0){
    background("black");
  }
  //pre funções
  botaoRestart.visible=false;
  gameOver.visible=false;

  text("pontuação: "+ pontuacao, width/2, 100);

  //colisão do trex
  trex.collide(chao);

  //estado do jogo jogar
  if(gameState==jogar){
    //fazer o chão se mover mais rapido
    chao.velocityX = -(5 + 1* pontuacao/200);

    //aumentar a pontuação
    pontuacao = pontuacao + Math.round(frameRate()/50);
    tempo=Math.round(pontuacao/300);
    
    //check point
    if(pontuacao>0 && pontuacao%300==0){
      checkPointSom.play();
    }

    //pulo do trex
    if((touches.length > 0 || keyDown("space"))&& trex.y >= height - 120) {
      trex.velocityY = -12;
      jumpSound.play();
      touches = [];
  }
    
    //gravidade
    trex.velocityY=trex.velocityY + 0.8;
    
    //chão se movendo
    chao.velocityX=-5;
    if(chao.x<0){
      chao.x = chao.width/2;
    }

    //mudando estado de jogo
    if(trex.isTouching(grupoCactus)){
      gameState=encerar;
      gameOverSom.play();
    }
  }

  //estado do jogo gamerOver
  else if (gameState==encerar){
    //parar o chão, nuvens e cactus
    grupoCactus.setLifetimeEach(-1);
    grupoNuvens.setLifetimeEach(-1);
    grupoNuvens.setVelocityXEach(0);
    grupoCactus.setVelocityXEach(0);
    chao.velocityX=0;

    //parar o Trex e mudar sua animação
    trex.changeAnimation("trexF",trexF);
    trex.velocityX=0;
    trex.velocityY=0;

    //colocar game over e o botão de restart na tela
    botaoRestart.visible=true;
    gameOver.visible=true;

    //recomeçar o jogo
    if(touches.length > 0 || mousePressedOver(botaoRestart)){
      reset();
      touches = [];
    }
  }

  drawSprites();

  //chamando funções
  criarNuvens();
  cactus();
}

function criarNuvens(){
  if(frameCount % 60 ==0){
   var nuvem = createSprite(width, 60, 40, 40);
   nuvem.addImage(nuvemImg);
   nuvem.velocityX=-4;
   nuvem.y=Math.round(random(20,150));
   nuvem.lifetime=450;
   nuvem.depth=trex.depth;
   trex.depth=trex.depth+1;
   grupoNuvens.add(nuvem);
  }
}

function cactus(){
  if(frameCount % 90 ==0){
   var cactus = createSprite(width,265,12,12);
   var rand = Math.round(random(1,6));
   cactus.velocityX=-5;
   cactus.scale=0.6;
   grupoCactus.add(cactus);
   switch(rand){
    case 1:cactus.addImage(cactus1)
      break;
    case 2:cactus.addImage(cactus2)
      break;
    case 3:cactus.addImage(cactus3)
      break;
    case 4:cactus.addImage(cactus4)
      break;
    case 5:cactus.addImage(cactus5)
      break;
    case 6:cactus.addImage(cactus6)
      break;
      default:break;
   }
  cactus.lifetime=400;
  }
}

function reset(){
  botaoRestart.visible=false;
  gameOver.visible=false;
  gameState=jogar;
  trex.changeAnimation("trexrun", trex_running);
  grupoCactus.destroyEach();
  grupoNuvens.destroyEach();
  pontuacao=0;
}
