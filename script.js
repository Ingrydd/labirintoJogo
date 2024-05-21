const bola = document.getElementById('bola');
const labirinto = document.getElementById('labirinto');
const botaoIniciar = document.getElementById('botaoIniciar');
const containerLabirinto = document.getElementById('containerLabirinto');
const fim = document.getElementById('fim');
const tempoElemento = document.getElementById('tempo');
const pontuacaoElemento = document.getElementById('pontuacao');
const paredes = document.querySelectorAll('.parede');
const retanguloLabirinto = labirinto.getBoundingClientRect();
const tempoInicial = 20;

let tempoRestante = tempoInicial;
let intervaloTempo;
let arrastando = false;

botaoIniciar.addEventListener('click', iniciarJogo);
bola.addEventListener('mousedown', iniciarArrasto);

function iniciarJogo(){
    containerLabirinto.classList.remove('oculto');
    botaoIniciar.disabled = true;
    iniciarTempo();
}

function iniciarArrasto() {
    arrastando = true;
    document.addEventListener('mousemove', moverBola);
    document.addEventListener('mouseup', pararArrastar);
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
        vencerJogo(); 
        return;
    }

    if (verificarColisao()) {
        reiniciarJogo(); 
        return;
    }
}

function pararArrastar() {
    arrastando = false;

    document.removeEventListener('mousemove', moverBola);
    document.removeEventListener('mouseup', pararArrastar);
}

function verificarColisao() {
    const retanguloBola = bola.getBoundingClientRect();
    for (const parede of paredes) {
        const retanguloParede = parede.getBoundingClientRect();
        if (!(retanguloBola.right < retanguloParede.left || 
              retanguloBola.left > retanguloParede.right || 
              retanguloBola.bottom < retanguloParede.top || 
              retanguloBola.top > retanguloParede.bottom)) {
            return true; 
            }
    }
    return false; 
}

function verificarChegada() {
    const retanguloBola = bola.getBoundingClientRect();
    const retanguloFim = fim.getBoundingClientRect();

    return !(retanguloBola.right < retanguloFim.left || 
             retanguloBola.left > retanguloFim.right || 
             retanguloBola.bottom < retanguloFim.top || 
             retanguloBola.top > retanguloFim.bottom);
}


let alertaExibido = false;

function reiniciarJogo() {
    if (!alertaExibido) {
        alertaExibido = true;
        alert('Você perdeu! Reiniciando o jogo!');
        resetarJogo();
    }
}

function vencerJogo() {
    if (!alertaExibido) {
        alertaExibido = true;
        alert('Parabéns! Você ganhou!');
        resetarJogo();
    }
}



function resetarJogo() {
    bola.style.left = '0px';
    bola.style.top = '0px';
    clearInterval(intervaloTempo);
    tempoRestante = tempoInicial;
    atualizarTempo();
    containerLabirinto.classList.add('oculto');
    botaoIniciar.disabled = false;
}

function atualizarTempo() {
    tempoElemento.textContent = tempoRestante;
}

function iniciarTempo() {
    if (!intervaloTempo) {
        intervaloTempo = setInterval(function() {
            if (tempoRestante === 0) {
                clearInterval(intervaloTempo);
                alert("Tempo Esgotado!" + "\nVocê perdeu!!");
                resetarJogo();
            } else {
                atualizarTempo();
                tempoRestante--; 
            }
        }, 1000);
    }
}