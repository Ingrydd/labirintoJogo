const bola = document.getElementById('bola');
const labirinto = document.getElementById('labirinto');
const botaoIniciar = document.getElementById('botaoIniciar');
const botaoReiniciar = document.getElementById('botaoReiniciar');
const containerLabirinto = document.getElementById('containerLabirinto');
const fim = document.getElementById('fim');
const tempoElemento = document.getElementById('tempo');
const paredes = document.querySelectorAll('.parede');
const tempoInicial = 20;

let tempoRestante = tempoInicial;
let intervaloTempo;
let arrastando = false;
let alertaExibido = false;

botaoIniciar.addEventListener('click', iniciarJogo);
botaoReiniciar.addEventListener('click', reiniciarJogo);
bola.addEventListener('mousedown', iniciarArrasto);
bola.addEventListener('mouseup', pararArrastar);
bola.removeEventListener('mousemove', moverBola);
bola.addEventListener('dblclick', function(evento) {});

function iniciarJogo() {
    containerLabirinto.classList.remove('oculto');
    botaoIniciar.classList.add('oculto');
    botaoReiniciar.classList.remove('oculto');
    iniciarTempo();
}

function iniciarArrasto(evento) {
    arrastando = true;
    evento.preventDefault();
    document.addEventListener('mousemove', moverBola);
}

function moverBola(evento) {
    if (!arrastando) return;
    
    const labirintoRect = labirinto.getBoundingClientRect();
    const bolaRect = bola.getBoundingClientRect();
    
    let newLeft = evento.clientX - labirintoRect.left - bolaRect.width / 2;
    let newTop = evento.clientY - labirintoRect.top - bolaRect.height / 2;
    
    newLeft = Math.max(0, Math.min(newLeft, labirintoRect.width - bolaRect.width));
    newTop = Math.max(0, Math.min(newTop, labirintoRect.height - bolaRect.height));
    
    bola.style.left = `${newLeft}px`;
    bola.style.top = `${newTop}px`;
    
    if (verificarChegada()) {
        return;
    }
    
    if (verificarColisao()) {
        return;
    } 
}

function pararArrastar() {
    arrastando = false;
}

function verificarColisao() {
    const retanguloBola = bola.getBoundingClientRect();
    for (const parede of paredes) {
        const retanguloParede = parede.getBoundingClientRect();
        if (!(retanguloBola.right < retanguloParede.left || 
              retanguloBola.left > retanguloParede.right || 
              retanguloBola.bottom < retanguloParede.top || 
              retanguloBola.top > retanguloParede.bottom)) {
            alert("Você bateu na parede! Tente novamente!");
            reiniciarJogo();
            return true; 
        }
    }
    return false; 
}

function verificarChegada() {
    const retanguloBola = bola.getBoundingClientRect();
    const retanguloFim = fim.getBoundingClientRect();

    if(!(retanguloBola.right < retanguloFim.left || 
        retanguloBola.left > retanguloFim.right || 
        retanguloBola.bottom < retanguloFim.top || 
        retanguloBola.top > retanguloFim.bottom)){
            alert("Parabéns! Você ganhou!");
            reiniciarJogo();
            return true;
        }
    return false
}

function reiniciarJogo() {
    alertaExibido = false;
    resetarJogo();
}

function vencerJogo() {
    if (!alertaExibido) {
        alertaExibido = true;
        alert('Parabéns! Você ganhou!');
        resetarJogo();
    }
}

function resetarJogo() {
    arrastando = false;
    bola.classList.add('reset-posicao');
    bola.style.left = '0px';
    bola.style.top = '0px';

    tempoRestante = tempoInicial;
    atualizarTempo();
    iniciarTempo();

    containerLabirinto.classList.add('oculto');
    botaoIniciar.classList.remove('oculto');
    botaoReiniciar.classList.add('oculto');
}    

function atualizarTempo() {
    tempoElemento.textContent = tempoRestante;
}

function iniciarTempo() {
    if (!intervaloTempo) {
        intervaloTempo = setInterval(function() {
            if (tempoRestante === 0) {
                alert("Tempo Esgotado! Você perdeu!!");
                resetarJogo();
            } else {
                atualizarTempo();
                tempoRestante--; 
            }
        }, 1000);
    }
}
