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

const canvas = document.getElementById('meuCanvas');
const ctx = canvas.getContext('2d');
var sizeWidth = 100 * window.innerWidth / 100,
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
const startY = bauRect.top * 2 - canvasRect.top; // Parte superior do baú

// Variáveis globais
const gravidade = 0.5; // Gravidade
const intervalo = 1000 / 60; // 60 FPS
let bolas = []; // Array que vai armazenar várias bolinhas

// Função para desenhar todas as bolas
function desenharBolas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    
    bolas.forEach((bola) => {
        ctx.beginPath();
        ctx.arc(bola.x, bola.y, bola.raio, 0, Math.PI * 2); // Desenha cada bola
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.closePath();
    });
}

// Função para atualizar a posição de todas as bolas
function atualizarPosicoes() {
    bolas.forEach((bola) => {
        bola.x += bola.vx;
        bola.y += bola.vy;
        bola.vy += gravidade; // Aplica gravidade

        // Verifica se a bola atingiu o chão
        if (bola.y > startY) {
            bola.y = startY; // Impede que a bola vá abaixo do chão
            bola.vy = 0; 
            bola.vx = 0; 
        }
    });

    
    desenharBolas();
}

// Função de animação
function animar() {
    atualizarPosicoes();

    // Continua a animação enquanto as bolas estão se movendo
    if (bolas.some(bola => bola.vx !== 0 || bola.vy !== 0)) {
        requestAnimationFrame(animar);
    }
}

// Função para adicionar uma nova bola com posição e velocidade específicas
function adicionarBola(xInicial, vxInicial) {
    const raio = 10; // Tamanho da bola
    const vyInicial = -15; // Velocidade inicial no eixo y (para cima)
    
    // Cria uma nova bola e adiciona ao array
    const novaBola = { x: xInicial, y: startY, vx: vxInicial, vy: vyInicial, raio };
    bolas.push(novaBola);
}

// Inicia a animação ao clicar no botão, adiciona várias bolas com velocidades específicas
function AnimacaoBolinha() {
    const espacamento = 50; // Espaçamento entre as bolas

    // Adiciona 4 bolas com as velocidades especificadas e em posições diferentes
    adicionarBola(startX + espacamento, 3);   // Bola 1 com vx = 3
    adicionarBola(startX + espacamento, 6);   // Bola 2 com vx = 6
    adicionarBola(startX - espacamento, -3);  // Bola 3 com vx = -3
    adicionarBola(startX - 2 * espacamento, -6);  // Bola 4 com vx = -6
    
    animar(); // Inicia a animação
}

// Função para dar play em tudo
function DarPlay() {
    RodaAnimacaoBau().then(() => {
        AnimacaoBolinha();
    });
}
