let jogo;

const elementos = {
  telaInicial: document.getElementById(`inicial`),
  telaJogo: document.getElementById(`jogo`),
  telaCadastro: document.getElementById(`cadastro`),
  telaMensagem: document.querySelector(`.mensagem`),
  textoMensagem: document.querySelector(`#texto`),
  telaDica: document.querySelector(`.dica`),
  textoDica: document.querySelector(`#texto-dica`),
  teclado: document.querySelector(`.teclado`),
  palavra: document.querySelector(`.palavra`),
  palavraCadastrada: document.querySelector(`#palavraCadastrada`),
  dicaCadastrada: document.querySelector(`#dicaCadastrada`),
  botoes: {
    facil: document.querySelector('.botao-facil'),
    medio: document.querySelector('.botao-medio'),
    dificil: document.querySelector('.botao-dificil'),
    reiniciar: document.querySelector('.reiniciar'),
    irParaCadastro: document.querySelector('#cadastrar-palavra'),
    cadastrar: document.querySelector('#botao-cadastro'),
    dica: document.querySelector('#dica'),
  },
  boneco: [
    document.querySelector('.boneco-cabeca'),
    document.querySelector('.boneco-corpo'),
    document.querySelector('.boneco-braco-esquerdo'),
    document.querySelector('.boneco-braco-direito'),
    document.querySelector('.boneco-perna-esquerda'),
    document.querySelector('.boneco-perna-direita')
  ],
  radioButton: {
    facil: document.querySelector(`#facil`),
    medio: document.querySelector(`#medio`),
    dificil: document.querySelector(`#dificil`),
  }
};

const palavras = {

  facil: {
    palavra: ["Real", "Camisa", "Chocolate", "Oliva", "Sete", "Jangada"],
    dica: ["Moeda", "Roupa", "Doce", "Oliveira", "Perfeição", "Tipo de barco"]
  },
  medio: {
    palavra: ["Mão", "Golpe", "Quadril", "Ovelha", "Leão", "Kiwi", "Teclado"],
    dica: ["Membro do corpo", "Furto qualificado, soco", "Próximo do Fêmur", "Animal", "Animal", "Fruta", "Peça pra usar no PC"]
  },
  dificil: {
    palavra: ["Santos", "Flamengo", "Corinthians", "Forte", "Alfarrobeira", "Eleitor"],
    dica: ["Maior time do Mundo", "Time dos Urubus", "Time da Gávea", "Força", "Arvore", "Quem vota em algo"]
  },
};

const novoJogo = () => {

  jogo = {
    dificuldade: undefined,
    palavra: {
      original: undefined,
      semAcentos: undefined,
      tamanho: undefined,
      dica: undefined,
    },
    acertos: undefined,
    jogadas: [],
    chances: 6,
    definirPalavra: function (palavra, dica) {
      this.palavra.original = palavra;
      this.palavra.tamanho = palavra.length;
      this.acertos = '';
      this.palavra.semAcentos = this.palavra.original.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      this.palavra.dica = dica;
      for (let i = 0; i < this.palavra.tamanho; i++) {
        this.acertos += ' ';
      }
    },
    jogar: function (letraJogada) {
      let acertou = false;

      for (let i = 0; i < this.palavra.tamanho; i++) {
        const letra = this.palavra.semAcentos[i].toLowerCase();

        if (letra === letraJogada.toLowerCase()) {
          acertou = true;
          this.acertos = replace(this.acertos, i, this.palavra.original[i]);
        }
      }
      if (!acertou) {
        this.chances--;
      }
      return acertou;
    },
    ganhou: function () {
      return !this.acertos.includes(' ');
    },
    perdeu: function () {
      return this.chances <= 0;
    },
    acabou: function () {
      return this.ganhou() || this.perdeu();
    },
  };

  elementos.telaInicial.style.display = 'flex';
  elementos.telaJogo.style.display = 'none';
  elementos.telaCadastro.style.display = 'none';
  elementos.telaMensagem.style.display = 'none';
  elementos.telaMensagem.classList.remove('mensagem-vitoria');
  elementos.telaMensagem.classList.remove('mensagem-derrota');
  elementos.telaDica.style.display = 'none'
  elementos.textoDica.style.display = 'none'
  elementos.telaDica.classList.remove['mensagem-dica']

  for (const parte of elementos.boneco) {
    parte.classList.remove('escondido');
    parte.classList.add('escondido');
  }

  criarTeclado();
};

const criarTeclado = () => {
  const letras = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
  elementos.teclado.textContent = '';
  for (const letra of letras) {
    const button = document.createElement('button')
    button.appendChild(document.createTextNode(letra.toUpperCase()))
    button.classList.add(`botao-${letra}`)

    elementos.teclado.appendChild(button)

    button.addEventListener('click', () => digitar(letra))
  }
}

const digitar = (i) => {
  if (!jogo.jogadas.includes(i) && !jogo.acabou()) {
    const acertou = jogo.jogar(i)
    jogo.jogadas.push(i)

    for (const aux of elementos.teclado.children) {

      if (aux.textContent.toLowerCase() === i) {
        aux.classList.add(acertou ? 'certo' : 'errado')
      }
    }

    mostrarPalavra()

    if (!acertou) {
      mostrarErro();
    }

    if (jogo.ganhou()) {
      mostrarMensagem(true)
    } else if (jogo.perdeu()) {
      mostrarMensagem(false)
    }
  }
}

const mostrarErro = () => {
  const parte = elementos.boneco[5 - jogo.chances];
  parte.classList.remove('escondido');
};

const mostrarMensagem = vitoria => {
  const mensagem = vitoria ? '<p>Parabéns!</p><p>Você GANHOU!</p>' : '<p>Que pena!</p><p>Você PERDEU!</p>';
  elementos.textoMensagem.innerHTML = mensagem;
  elementos.telaMensagem.style.display = 'flex';
  elementos.telaMensagem.classList.add(`mensagem-${vitoria ? 'vitoria' : 'derrota'}`);
  elementos.telaDica.style.display = 'none'
};

const mostrarDica = () => {
  elementos.textoDica.innerHTML = `<p>${jogo.palavra.dica}</p>`
  elementos.telaDica.classList.add('mensagem-dica')
  elementos.botoes.dica.style.display = 'none'
}

const mostrarTelaDica = () => {
  elementos.botoes.dica.style.display = 'flex'
  elementos.textoDica.style.display = 'flex'
  elementos.textoDica.innerHTML = `<p>Precisa de ajuda?</p>`
  elementos.telaDica.style.display = 'flex'
}

const carregarTelaCadastro = () => {
  elementos.telaCadastro.style.display = 'flex'
  elementos.telaInicial.style.display = 'none'
  elementos.telaJogo.style.display = 'none'
}

const sortearPalavra = () => {
  const i = Math.floor(Math.random() * palavras[jogo.dificuldade].palavra.length)
  jogo.definirPalavra(palavras[jogo.dificuldade].palavra[i], palavras[jogo.dificuldade].dica[i])
};

const mostrarPalavra = () => {
  elementos.palavra.textContent = '';
  for (let i = 0; i < jogo.acertos.length; i++) {
    const letra = jogo.acertos[i].toUpperCase();
    elementos.palavra.innerHTML += `<div class="letra-${i}">${letra}</div>`;
  }
};

const iniciarJogo = dificuldade => {
  jogo.dificuldade = dificuldade
  elementos.telaInicial.style.display = 'none'
  elementos.telaCadastro.style.display = 'none'
  elementos.telaJogo.style.display = 'flex'

  mostrarTelaDica()
  sortearPalavra()
  mostrarPalavra()

  document.querySelector('body').addEventListener('keydown', (e) => digitar(e.key));

};

elementos.botoes.dica.addEventListener('click', () => mostrarDica())

const cadastrarPalavra = () => {

  for (const i in elementos.radioButton) {
    if (elementos.radioButton[i].checked) {
      if (!palavras[`${i}`].palavra.includes(elementos.palavraCadastrada.value) && elementos.palavraCadastrada.value != "" && elementos.dicaCadastrada.value != "") {
        palavras[`${i}`].palavra.push(elementos.palavraCadastrada.value)
        palavras[`${i}`].dica.push(elementos.dicaCadastrada.value)

        elementos.telaInicial.style.display = 'flex'
        elementos.telaCadastro.style.display = 'none'
        elementos.telaJogo.style.display = 'none'
      } else {
        console.log("Essa palavra já cadastrada");
      }
    }
  }
}

const replace = (str, i, newChar) => str.substring(0, i) + newChar + str.substring(i + 1)

elementos.botoes.facil.addEventListener('click', () => iniciarJogo('facil'))
elementos.botoes.medio.addEventListener('click', () => iniciarJogo('medio'))
elementos.botoes.dificil.addEventListener('click', () => iniciarJogo('dificil'))

elementos.botoes.reiniciar.addEventListener('click', () => novoJogo())
elementos.botoes.irParaCadastro.addEventListener('click', () => carregarTelaCadastro())
elementos.botoes.cadastrar.addEventListener('click', () => cadastrarPalavra())

novoJogo();