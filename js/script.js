//Variaveis
let currentFrame = 0;
let totalFramesBau = 11;
let totalFramesParticula = 4; 
let animationInterval;
let trocaImagensConcluida = false;

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
            if (currentFrame >= totalFramesBau) {
                clearInterval(animationInterval);
                animationInterval = null; // Reseta para poder rodar novamente
                currentFrame = 0; // Reseta para a próxima execução
                resolve();
            }
        }, 50); // Tempo de troca de imagens em milissegundos
        
    })
    
}

// Função para rodar a animação da partícula
function RodaAnimacaoParticula(bola) {
    return new Promise((resolve, rejeita) => {
        currentFrame = 0; // Reseta o frame inicial

        // Verifica se já está em execução
        if (animationInterval) return;

        // Define intervalo para trocar imagens a cada 50ms
        animationInterval = setInterval(() => {
            // Atualiza a imagem da bolinha durante a animação de partícula
            bola.imagem.src = `img/sItemSpawnBurstEf/sItemSpawnBurstEf_${currentFrame}.png`;

            // Avança para o próximo frame
            currentFrame++;

            // Quando atingir o total de frames da partícula, para a animação
            if (currentFrame >= totalFramesParticula) {
                clearInterval(animationInterval);
                animationInterval = null; // Reseta o intervalo para poder rodar novamente
                currentFrame = 0; // Reseta para a próxima execução
                resolve(); // Resolve a promise para continuar o fluxo
            }
        }, 50); // Tempo de troca de imagens em milissegundos
    });
}

///////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////



// Função para desenhar todas as bolas
function desenharBolas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
    
    bolas.forEach((bola) => {
        // Desenha a bola (com a imagem em tamanho ajustado)
        const larguraImagem = 30 * bola.escala; // Defina a largura desejada
        const alturaImagem = 30 * bola.escala;// Defina a altura desejada

        ctx.drawImage(bola.imagem, bola.x - larguraImagem / 2, bola.y - alturaImagem / 2, larguraImagem, alturaImagem);
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
            
            // Verifica se a animação de partícula já não foi rodada
            if (!bola.animacaoConcluida) {
                bola.animacaoConcluida = true; // Marca como concluída
                adicionaLog(bola); // Passa a bolinha para adicionarLog
            }
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
    const imagem = new Image(); // Adiciona uma nova imagem para cada bola
    imagem.src = `img/sItemSpawnBurstEf/sItemSpawnBurstEf_0.png`; // Primeira imagem da partícula

    // Cria uma nova bola e adiciona ao array
    const novaBola = { x: xInicial, y: startY, vx: vxInicial, vy: vyInicial, raio, imagem, escala : 1, animacaoConcluida: false };
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

function adicionaLog(bola) {
    // Troca a imagem pela do sBookDrop
    bola.imagem.src = `img/sBookDrop/sBookDrop_0.png?${new Date().getTime()}`;

    // Aumenta o tamanho (escala) da bolinha após trocar a imagem
    bola.escala = 3; // Multiplica o tamanho por 2 (ajuste conforme necessário)

}

// Função para dar play em tudo
function DarPlay() {
    RodaAnimacaoBau().then(() => {
        AnimacaoBolinha();
        
    });
}
