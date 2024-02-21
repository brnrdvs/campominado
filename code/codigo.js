const tabuleiro=document.getElementById('tabuleiro'), opcoes=document.getElementById('opcoes');
const resultado=document.getElementById('resultado'), numBombas=document.getElementById('numBombas');
const larg=document.getElementById('larg'), alt=document.getElementById('alt'), bomb=document.getElementById('bomb');
const bomba=9;

let numRevelados=0, numMarcados=0, fim=false;
let largura=0, altura=0, tam=0, bombas=0;
let clicado=[], marcado=[], mapa=[];

criarTabuleiro();
criarMapa();
//numBombas.innerHTML=bomb-numMarcados+' BOMBAS';
//umBombas.innerHTML=tam;

function criarTabuleiro()
{
    largura=larg.value;
    altura=alt.value;
    tam=largura*altura;

    for (let loop=1; loop<=tam; loop++)
    {
        let botao=document.createElement("button");

        botao.id=loop;
        botao.innerText='-';
        botao.setAttribute('onclick','clicar(this.id)');
        botao.setAttribute('oncontextmenu','marcar(this.id); return false;');
        tabuleiro.appendChild(botao);
        
        clicado.push(false);
        marcado.push(false);

        if (loop%largura==0) 
        { 
            let quebra=document.createElement('br'); 
            tabuleiro.appendChild(quebra);
        }

    }
}

function criarMapa()
{
    bombas=bomb.value;
    
    mapa[0]=bomba;
    for (let loop=1; loop<=tam; loop++)
    { mapa.push(0); }

    for (loop=1; loop<=bombas; loop++)
    {
        let lugar=0;
        while (mapa[lugar]==bomba)
        {
            lugar=Math.floor(Math.random() * tam)+1;
        }
        mapa[lugar]=bomba;
    }
    let varteste=0;

    for (loop=1;loop<=tam;loop++)
    {
        if (mapa[loop]!=bomba) 
        {
            let qtdBombas=0;

            if (loop>largura) { if (mapa[loop-largura]==bomba) { qtdBombas++; } }             //se nao estiver no topo, olhar para cima
            if (loop<=tam-largura) { if (mapa[loop+largura]==bomba) { qtdBombas++; }  varteste++; }        //se nao estiver embaixo, olhar para baixo

            if (loop%largura!=1)                                                           //se nao estiver no canto esquerdo, olhar pra esquerda
            {
                if (mapa[loop+1]==bomba) { qtdBombas++; }
                if (loop>largura) { if (mapa[loop-largura+1]==bomba) { qtdBombas++; } }       //se nao estiver no topo, olhar para esquerda acima
                if (loop<=tam-largura) { if (mapa[loop+largura+1]==bomba) { qtdBombas++; } }  //se nao estiver embaixo, olhar pra esquerda abaixo
            }

            if (loop%largura!=0)                                                           //mesma rotina mas para a direita   
            {
                if (mapa[loop-1]==bomba) { qtdBombas++; }
                if (loop>largura) { if (mapa[loop-largura-1]==bomba) { qtdBombas++; } } 
                if (loop<=tam-largura) { if (mapa[loop+largura-1]==bomba) { qtdBombas++; } }     
            }   

            mapa[loop]=qtdBombas;
        }
    }

    for (loop=1;loop<=tam;loop++)
    {
        let botaoAtual=document.getElementById(loop);
        if (mapa[loop]==bomba) { botaoAtual.innerText='B'; }
        else if (mapa[loop]>0) { botaoAtual.innerText=mapa[loop]; }
    }

    numBombas.innerHTML=varteste

    for (loop=0;loop<=altura;loop++)
    {
        let texto=document.createElement("p");
        for (loop1=loop*largura+1; loop1<=loop*largura+largura; loop1++)
        {
            let txt='a';
            if (mapa[loop1]==bomba) { texto+='B' }
            if (mapa[loop1]==0) { texto+='-' }
            else { texto+=mapa[loop1]; }
        }
        texto.innerText=txt;
        tabuleiro.appendChild(texto);
        tabuleiro.innerHTML=txt;
    }    
}

function apagar()
{    
    let coisa=document.getElementById('tabuleiro');
    while (coisa.firstChild) { coisa.removeChild(coisa.lastChild); }
    while (mapa.length>1) { mapa.pop(); }
    while (marcado.length>1) { marcado.pop(); }
    while (clicado.length>1) { clicado.pop(); }

    numRevelados=0; 
    numMarcados=0;
    fim=false;
}

function atualizarTabuleiro()
{
    apagar();
    criarTabuleiro();
    criarMapa();
    
    numBombas.innerHTML=bombas-numMarcados+' BOMBAS';
    
    event.preventDefault();
}

function verificarCor(num)
{
    if (num==1) { return "mediumblue" }
    if (num==2) { return "green" }
    if (num==3) { return "red" }
    if (num==4) { return "darkblue" }
    if (num==5) { return "maroon" }
    if (num==6) { return "cyan" }
    if (num==7) { return "black" }
    if (num==8) { return "darkgray" }
}

function revelarTudo()
{    
    for (let loop=1; loop<=tam; loop++)
    {
        let botaoAtual=document.getElementById(loop);
        if (!clicado[loop])
        {
            botaoAtual.setAttribute("class","revelado");
            clicado[loop]=true;
            if (mapa[loop]==bomba)      
            {
                botaoAtual.innerText='B';
                botaoAtual.style.color='red';
            }
            else if (mapa[loop]==0) 
            { 
                botaoAtual.innerText='-'; 
                botaoAtual.style.color='rgb(175, 175, 175)';
            }
            else                    
            { 
                botaoAtual.innerText=mapa[loop];                          
                botaoAtual.style.color=verificarCor(mapa[loop]);
            }
        }
    }

    fim=true;
    numBombas.innerHTML='PERDEU';
}

function revelarProximos(num)                           //recursiva
{
    let botaoAtual=document.getElementById(num);        

    if (marcado[num])                                   //se marcado, desmarcar
    {
        marcado[num]=false;
        numMarcados--;
    }
    
    if (!clicado[num])                                 //se espaço ainda nao revelado, verificar conteudo
    {
        if (mapa[num]==0)                               //se espaço for vazio, liberar e verificar entorno
        {
            botaoAtual.setAttribute("class","revelado");
            botaoAtual.style.color='rgb(175, 175, 175)';
            botaoAtual.innerText='-';
            clicado[num]=true;
            numRevelados++;

            if (num>largura)                               //se espaço estiver fora da primeira linha,
            {
                revelarProximos(num-largura)               //verificar linha acima,
                if (num%largura!=1)                        //se espaço nao estiver no canto esquerdo,
                {
                    revelarProximos(num-1);             //verificar esquerda
                    revelarProximos(num-largura-1);        //e esquerda para cima
                }
                if (num%largura!=0)                        //se espaço nao estiver no canto direito,
                {
                    revelarProximos(num+1);             //verificar direita
                    revelarProximos(num-largura+1);        //e direita para cima
                }
            }

            if (num<tam-largura)                       //se espaço estiver fora da ultima linha,
            {
                revelarProximos(num+largura);          //verificar linha abaixo
                if (num%largura!=1)                    //se espaço nao estiver no canto esquerdo,
                {
                    revelarProximos(num-1);         //verificar esquerda
                    revelarProximos(num+largura-1);    //e esquerda para baixo
                }
                if (num%largura!=0)                    //se espaço nao estiver no canto direito,
                {
                    revelarProximos(num+1);         //verificar direita
                    revelarProximos(num+largura+1);    //e direita para baixo
                }
            }
        }

        else if (mapa[num]!=bomba)                  //se espaço nao for bomba e nao estiver vazio, mostrar numero do espaço
        {
            botaoAtual.setAttribute("class","revelado");
            botaoAtual.style.color=verificarCor(mapa[num]);
            botaoAtual.innerText=mapa[num];
            clicado[num]=true;
            numRevelados++;
        }
    }
}

function verificarFim()
{
    if (numMarcados==bombas && numRevelados==tam-bombas)
    { 
        fim=true;
        numBombas.innerHTML='VENCEU';
    }
}

function clicar(num)
{
    if (!clicado[Number(num)])
    {
        if (mapa[Number(num)]==bomba) 
        {
            revelarTudo();
        }
        else
        {
            revelarProximos(Number(num));
            verificarFim();
        }
    }
}

function marcar(num)
{
    botaoAtual=document.getElementById(num);

    if (!marcado[Number(num)] && !clicado[Number(num)] && numMarcados!=bomb)
    {
        botaoAtual.setAttribute("class","marcado");
        botaoAtual.innerText='*';
        marcado[Number(num)]=true;
        numMarcados++;
    }
    
    else if (marcado[Number(num)]) 
    { 
        botaoAtual.setAttribute("class","normal");
        botaoAtual.innerText='-'; 
        marcado[Number(num)]=false;
        numMarcados--;
    }

    numBombas.innerHTML=bombas-numMarcados+' BOMBAS';
    verificarFim();
}
