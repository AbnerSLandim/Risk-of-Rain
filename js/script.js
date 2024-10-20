let currentFrame = 0;
let totalFrames = 11;
let animationInterval;

function RodaAnimacaoBau() {
    return new Promise((resolve, rejeita) => {
        // Verifica se já está em execução
        if (animationInterval) return;

        // Define intervalo para trocar imagens a cada 50ms (ajustável)
        animationInterval = setInterval(() => {
            // Atualiza o src da imagem
            document.getElementById('bau').src = `img/sChest1/sChest1_${currentFrame}.png`;

            // Avança para o próximo frame
            currentFrame++;

            // Quando atingir o total de frames, para a animação
            if (currentFrame >= totalFrames) {
                clearInterval(animationInterval);
                animationInterval = null; // Reseta para poder rodar novamente
                currentFrame = 0; // Reseta para a próxima execução
                resolve();
            }
        }, 50); // Tempo de troca de imagens em milissegundos
        
    })
    
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

//
const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');
var sizeWidth = 50 * window.innerWidth / 100,
    sizeHeight = 100 * window.innerHeight / 100 || 766;

//Configurando tamanho do canvas dinamicamente
canvas.width = sizeWidth;
canvas.height = sizeHeight;
canvas.style.width = sizeWidth;
canvas.style.height = sizeHeight;

// Obtém a posição do baú
const bau = document.getElementById('bau');
const bauRect = bau.getBoundingClientRect(); // Pega a posição do baú na tela

// Ajusta a posição do canvas para o sistema de coordenadas dele
const canvasRect = canvas.getBoundingClientRect();
const startX = bauRect.left - canvasRect.left + (bauRect.width / 2); // Meio do baú
const startY = bauRect.top * 1.8 - canvasRect.top; // Parte superior do baú

// Variáveis para a animação
let x = startX; // Posição inicial no eixo x (meio do baú)
let y = startY; // Posição inicial no eixo y (topo do baú)
let gravidade = 0.5; // Gravidade
let intervalo = 1000 / 60; // 60 FPS
let bolas = [];

let vx = 3; // Velocidade no eixo x
let vy = -15; // Velocidade inicial no eixo y (para cima)

function desenharBola() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2); // Desenha a bola (um círculo)
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
}

function atualizarPosicao() {
    // Atualiza as coordenadas da bola
    x += vx;
    y += vy;
    vy += gravidade; // Aumenta a velocidade vertical com a gravidade (faz a bola cair)

    // Verifica se a bola atingiu o chão
    if (y > startY) {
        y = startY; // Impede que a bola vá abaixo do chão
        vy = 0; // Zera a velocidade vertical (a bola para)
        vx = 0; // Zera a velocidade horizontal
    }

    desenharBola();
}

function animar() {
    atualizarPosicao();

    // Se a bola ainda não parou, continua a animação
    if (vx !== 0 || vy !== 0) {
        requestAnimationFrame(animar);
    }
}

// Inicia a animação ao clicar no botão
function AnimacaoBolinha() {
    animar();
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////

//Dar Play em tudo

function DarPlay(){
    
    RodaAnimacaoBau().then(() => {
        AnimacaoBolinha();
    });
}