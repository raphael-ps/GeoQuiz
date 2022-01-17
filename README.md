# GeoQuiz Bot

[__Comandos__](#Comandos)   •   [__ScreenShots__](#ScreenShots)   •   [__Status e Planos__](#Status-e-Planos)

Primeiro contato com Node.js e com Discord.js. Um simples bot para o discord feito para uso pessoal, com intuito de praticar e aprender um pouco. 

Contém informações básicas _(básicas mesmo)_ sobre alguns países e estados brasileiros. 
Contém também os mini games "Guess The Flag" (Adivinhe a bandeira) e "Guess The Capital" (Adivinhe a capital).

Além do mais, esse bot é fechadão com a organização do canal, já que todas as mensagens, enviadas e recebidas, __utilizadas nos mini games__ são excluídas após um certo tempo.


## Comandos

* [__/randcountry__](#randcountry-e-randstate) - Um país aleatório é mostrado, bem como sua capital, continente em que está localizado, sua bandeira e sigla. 
A mensagem ainda é composta com um botão "Ver Mais" que leva o usuário à página do Wikipedia do país em questão. E ainda um botão "Próximo" que edita a mensagem para mostrar outro país, pode ser clicado infinitamente, já que há repetição de países, mas apenas por quem utilizou o comando.

* [__/randstate__](#randcountry-e-randstate) - O mesmo do "/randcountry" mas com estados brasileiros. :thumbsup:

* [__/gtf ( "países" | "br" )__](#gtf) - Inicia o mini game "Adivinhe a bandeira". Mostrando bandeiras aleatórias de países ou estados, depende do escolhido, sem repetições.

* [__/gtc__](#gtc) - Inicia o mini game "Adivinhe a capital", nesse só há a opção com países. 

* [__/rank ( "gtfpaíses" | "gtfestados" | "gtc" )__](#rank) - :trophy: Mostra o ranking  de pontos, TOP 10, do mini game escolhido. O mesmo usuário não pode ocupar mais de uma posição no ranking.

* [__/ping__](#GeoQuiz-Bot) - **Pong!** :ping_pong: :man_shrugging:

## ScreenShots
Algumas imagens dos comandos em uso:

### randcountry e randstate

![RandCountryScreen](https://github.com/raphael-ps/GeoQuiz/blob/main/data/screenShots/randcountry.png) 

![RandStateScreen](https://github.com/raphael-ps/GeoQuiz/blob/main/data/screenShots/randstate.png?raw=true)

![InxiridoMessage](https://github.com/raphael-ps/GeoQuiz/blob/main/data/screenShots/inxirido.png)

### gtf

![gtf](https://github.com/raphael-ps/GeoQuiz/blob/main/data/screenShots/gtfcountry.png)

![gtfCorrectMessage](https://github.com/raphael-ps/GeoQuiz/blob/main/data/screenShots/gtfacerto.png)

![gtfFinalScreen](https://github.com/raphael-ps/GeoQuiz/blob/main/data/screenShots/gtffinal.png)

### gtc

![gtcCapital](https://github.com/raphael-ps/GeoQuiz/blob/main/data/screenShots/gtccapital.png)

![gtcContinent](https://github.com/raphael-ps/GeoQuiz/blob/main/data/screenShots/gtccontinent.png)

### rank
Apesar de não aceitar usuários repetidos, eu tive que ver como ficava o ranking completo, então foi só uma exceção. :P

![ranking](https://github.com/raphael-ps/GeoQuiz/blob/main/data/screenShots/gtfcountriesrank.png)

## Status e Planos

### Status

Abandonado por um tempo (__*talvez para sempre*__) por motivos de: Inicio do semestre, ~~entre outras coisa.~~

### Planos

Implementações desejadas:

- [ ] Substituir os .JSON dos países, estados e rankings por um banco de dados '-'
- [ ] Fazer um novo modo de jogo: Modo desafio/duelo confronto direto entre desafiante e desafiado.
- [ ] Fazer outros comandos básicos, como resetar ranking, etc, etc.
- [ ] Talvez, _só talvez_, tentar achar um lugar pra hostear o bot de graça, mas não vejo necessidade.

Meu objetivo não é fazer esse bot "famoso", foi só para fazer algo novo ~~(novo pra mim)~~ mesmo. Então, provavelmente, nenhuma dessas coisas serão implementadas, principalmente o bagulho de hostear. 👍
