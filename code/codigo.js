const tabuleiro=document.getElementById('tabuleiro'), opcoes=document.getElementById('opcoes');
const resultado=document.getElementById('resultado'), numBombas=document.getElementById('numBombas');
const largura=document.getElementById('larg'), altura=document.getElementById('alt'), bombas=document.getElementById('bomb');
const bomba=9;

let numRevelados=0, numMarcados=0, fim=false;
let larg=0, alt=0, tam=0, bomb=0;
let clicado=[], marcado=[], mapa=[];

criarTabuleiro();
criarMapa();
numBombas.innerHTML=bomb-numMarcados+' BOMBAS';

function criarTabuleiro()
{
    larg=largura.value;
    alt=altura.value;
    tam=larg*alt;

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

        if (loop%larg==0) 
        { 
            let quebra=document.createElement('br'); 
            tabuleiro.appendChild(quebra);
        }
    }
}

function criarMapa()
{
    bomb=bombas.value;
    
    mapa[0]=bomba;
    for (let loop=1; loop<=tam; loop++)
    { mapa.push(0); }

    for (loop=1; loop<=bomb; loop++)
    {
        let lugar=0;
        while (mapa[lugar]==bomba)
        {
            lugar=Math.floor(Math.random() * tam)+1;
        }
        mapa[lugar]=bomba;
    }

    for (loop=1; loop<=tam; loop++)
    {
        let verificar=[];
        if (mapa[loop]==0) 
        {
            verificar.push(loop+larg);
            verificar.push(loop-larg);
            if (loop%larg>1)
            {
                verificar.push(loop+1);
                verificar.push(loop-1);
                verificar.push(loop+larg+1);
                verificar.push(loop+larg-1);
                verificar.push(loop-larg+1);
                verificar.push(loop-larg-1);
            }
            else
            {
                if (loop%larg==1)
                {
                    verificar.push(loop+1);
                    verificar.push(loop+larg+1);
                    verificar.push(loop-larg+1);
                }

                if (loop%larg==0)
                {
                    verificar.push(loop-1);
                    verificar.push(loop+larg-1);
                    verificar.push(loop-larg-1);
                }
            }

            for (let loop1=0; loop1<verificar.length; loop1++)
            {
                if (verificar[loop1]>0 && verificar[loop1]<=tam)
                { if (mapa[verificar[loop1]]==bomba) { mapa[loop]++; } }
            }
        }
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
    
    numBombas.innerHTML=bomb-numMarcados+' BOMBAS';
    
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

            if (num>larg)                               //se espaço estiver fora da primeira linha,
            {
                revelarProximos(num-larg)               //verificar linha acima,
                if (num%larg!=1)                        //se espaço nao estiver no canto esquerdo,
                {
                    revelarProximos(num-1);             //verificar esquerda
                    revelarProximos(num-larg-1);        //e esquerda para cima
                }
                if (num%larg!=0)                        //se espaço nao estiver no canto direito,
                {
                    revelarProximos(num+1);             //verificar direita
                    revelarProximos(num-larg+1);        //e direita para cima
                }
            }

            if (num<tam-larg)                       //se espaço estiver fora da ultima linha,
            {
                revelarProximos(num+larg);          //verificar linha abaixo
                if (num%larg!=1)                    //se espaço nao estiver no canto esquerdo,
                {
                    revelarProximos(num-1);         //verificar esquerda
                    revelarProximos(num+larg-1);    //e esquerda para baixo
                }
                if (num%larg!=0)                    //se espaço nao estiver no canto direito,
                {
                    revelarProximos(num+1);         //verificar direita
                    revelarProximos(num+larg+1);    //e direita para baixo
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
    if (numMarcados==bomb && numRevelados==tam-bomb)
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

    numBombas.innerHTML=bomb-numMarcados+' BOMBAS';
    verificarFim();
}
