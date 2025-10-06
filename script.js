document.addEventListener('DOMContentLoaded', () => {
    const modalEntrada = document.getElementById('modalEntrada');
    const btnNovaEntrada = document.getElementById('btnNovaEntrada');
    const btnFecharModalEntrada = document.getElementById('btnFecharModalEntrada');
    const btnCancelarEntrada = document.getElementById('btnCancelarEntrada');
    const formEntrada = document.getElementById('formEntrada');
    const entradaId = document.getElementById('entradaId');
    const entradaTipo = document.getElementById('entradaTipo');
    const entradaTitulo = document.getElementById('entradaTitulo');
    const entradaReferencia = document.getElementById('entradaReferencia');
    const entradaConteudo = document.getElementById('entradaConteudo');
    const tituloModalEntrada = document.getElementById('tituloModalEntrada');

    const modalVisualizarEntrada = document.getElementById('modalVisualizarEntrada');
    const btnFecharModalVisualizarEntrada = document.getElementById('btnFecharModalVisualizarEntrada');
    const visualizarTitulo = document.getElementById('visualizarTitulo');
    const visualizarTipo = document.getElementById('visualizarTipo');
    const visualizarReferencia = document.getElementById('visualizarReferencia');
    const visualizarData = document.getElementById('visualizarData');
    const visualizarConteudo = document.getElementById('visualizarConteudo');
    const btnEditarEntrada = document.getElementById('btnEditarEntrada');
    const btnExcluirEntrada = document.getElementById('btnExcluirEntrada');

    const gradeEntradas = document.getElementById('gradeEntradas');
    const entradaVazia = document.getElementById('entradaVazia');
    const inputBusca = document.getElementById('inputBusca');
    const filtrosRapidos = document.querySelectorAll('.filtroRapido');
    const selectOrdenacao = document.getElementById('selectOrdenacao');

    const totalEntradasSpan = document.getElementById('totalEntradas');
    const totalDevocionaisSpan = document.getElementById('totalDevocionais');
    const totalLeiturasSpan = document.getElementById('totalLeituras');

    let entradas = [];

    // Funções de Utilidade
    const formatarData = (dataString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dataString).toLocaleDateString('pt-BR', options);
    };

    const salvarEntradas = () => {
        localStorage.setItem('lightUpEntradas', JSON.stringify(entradas));
    };

    const carregarEntradas = () => {
        const entradasSalvas = localStorage.getItem('lightUpEntradas');
        if (entradasSalvas) {
            entradas = JSON.parse(entradasSalvas);
        } else {
            // Entradas de exemplo para demonstração
            entradas = [
                {
                    id: 1,
                    tipo: "agradecimento",
                    titulo: "Pela minha vida!",
                    conteudo: "Agradeço a Deus por mais um dia de vida, pela saúde e por todas as bênçãos que recebo diariamente. Sua graça me sustenta.",
                    referenciaBiblica: "Salmos 118:24",
                    dataCriacao: "2025-09-03T10:00:00.000Z"
                },
                {
                    id: 2,
                    tipo: "pedido",
                    titulo: "Por recomeços!",
                    conteudo: "Peço a Deus força e sabedoria para os novos desafios e recomeços em minha vida. Que Ele guie meus passos e me dê discernimento.",
                    referenciaBiblica: "Isaías 43:19",
                    dataCriacao: "2025-04-04T11:30:00.000Z"
                },
                {
                    id: 3,
                    tipo: "reflexao",
                    titulo: "O que eu cultivo no meu coração?",
                    conteudo: "Provérbios 4:23 diz: 'Acima de tudo, guarde o seu coração, pois dele procedem as fontes da vida.' Refletindo sobre isso, percebo a importância de cultivar pensamentos e sentimentos puros.",
                    referenciaBiblica: "Provérbios 4:23",
                    dataCriacao: "2025-03-30T14:00:00.000Z"
                },
                {
                    id: 4,
                    tipo: "agradecimento",
                    titulo: "Pelo meu trabalho!",
                    conteudo: "Sou grato pelo meu trabalho, pelas oportunidades de aprendizado e crescimento. Que eu possa ser um instrumento de bênção onde quer que eu esteja.",
                    referenciaBiblica: "Colossenses 3:23",
                    dataCriacao: "2025-05-20T09:00:00.000Z"
                },
                {
                    id: 5,
                    tipo: "devocional",
                    titulo: "Força - Josué 1:9",
                    conteudo: "'Não fui eu que lhe ordenei? Seja forte e corajoso! Não se apavore nem desanime, pois o Senhor, o seu Deus, estará com você por onde quer que você andar.' Este versículo me lembra que Deus está comigo em qualquer desafio.",
                    referenciaBiblica: "Josué 1:9",
                    dataCriacao: "2025-09-01T08:00:00.000Z"
                },
                {
                    id: 6,
                    tipo: "devocional",
                    titulo: "Amor - Efésios 4:32",
                    conteudo: "'Sejam bondosos e compassivos uns para com os outros, perdoando-se mutuamente, assim como Deus os perdoou em Cristo.' Para perdoar e tratar os outros com bondade.",
                    referenciaBiblica: "Efésios 4:32",
                    dataCriacao: "2025-09-02T08:30:00.000Z"
                },
                {
                    id: 7,
                    tipo: "devocional",
                    titulo: "Sabedoria - Tiago 1:5",
                    conteudo: "'Se algum de vocês tem falta de sabedoria, peça-a a Deus, que a todos dá livremente, de boa vontade; e lhe será concedida.' Para pedir direção a Deus nas escolhas.",
                    referenciaBiblica: "Tiago 1:5",
                    dataCriacao: "2025-09-03T09:00:00.000Z"
                },
                {
                    id: 8,
                    tipo: "leitura",
                    titulo: "A chegada da Luz - Lucas 2:10-11",
                    conteudo: "'Mas o anjo lhes disse: 'Não tenham medo. Estou trazendo boas-novas que são para todo o povo: Hoje, na cidade de Davi, nasceu o Salvador, que é Cristo, o Senhor.' Uma leitura que ilumina o coração.",
                    referenciaBiblica: "Lucas 2:10-11",
                    dataCriacao: "2025-09-04T10:00:00.000Z"
                },
                {
                    id: 9,
                    tipo: "leitura",
                    titulo: "Cotidiano - Provérbios 4:23",
                    conteudo: "'Acima de tudo, guarde o seu coração, pois dele procedem as fontes da vida.' Uma reflexão sobre a importância de cuidar do que cultivamos internamente.",
                    referenciaBiblica: "Provérbios 4:23",
                    dataCriacao: "2025-09-05T11:00:00.000Z"
                }
            ];
            salvarEntradas();
        }
    };

    const atualizarEstatisticas = () => {
        totalEntradasSpan.textContent = entradas.length;
        totalDevocionaisSpan.textContent = entradas.filter(e => e.tipo === 'devocional').length;
        totalLeiturasSpan.textContent = entradas.filter(e => e.tipo === 'leitura').length;
    };

    const renderizarEntradas = (filtro = 'todos', termoBusca = '', ordenacao = 'data') => {
        gradeEntradas.innerHTML = '';
        let entradasFiltradas = [...entradas];

        // Corrigir os nomes dos filtros para corresponder aos tipos de entrada
        const mapeamentoFiltros = {
            'todos': 'todos',
            'agradecimentos': 'agradecimento',
            'pedidos': 'pedido',
            'reflexoes': 'reflexao',
            'devocionais': 'devocional',
            'leituras': 'leitura'
        };

        const tipoFiltro = mapeamentoFiltros[filtro] || filtro;

        if (tipoFiltro !== 'todos') {
            entradasFiltradas = entradasFiltradas.filter(entrada => entrada.tipo === tipoFiltro);
        }

        if (termoBusca) {
            const buscaLower = termoBusca.toLowerCase();
            entradasFiltradas = entradasFiltradas.filter(entrada =>
                entrada.titulo.toLowerCase().includes(buscaLower) ||
                entrada.conteudo.toLowerCase().includes(buscaLower) ||
                (entrada.referenciaBiblica && entrada.referenciaBiblica.toLowerCase().includes(buscaLower))
            );
        }

        entradasFiltradas.sort((a, b) => {
            if (ordenacao === 'data') {
                return new Date(b.dataCriacao) - new Date(a.dataCriacao);
            } else if (ordenacao === 'tipo') {
                return a.tipo.localeCompare(b.tipo);
            }
            return 0;
        });

        if (entradasFiltradas.length === 0) {
            entradaVazia.style.display = 'block';
        } else {
            entradaVazia.style.display = 'none';
            entradasFiltradas.forEach(entrada => {
                const card = document.createElement('div');
                card.classList.add('cardEntrada');
                card.dataset.id = entrada.id;
                
                const referenciaBiblica = entrada.referenciaBiblica ? 
                    `<div class="referenciaBiblica">📖 ${entrada.referenciaBiblica}</div>` : '';
                
                card.innerHTML = `
                    <div class="cabecalhoCard">
                        <h3 class="nomeEntrada">${entrada.titulo}</h3>
                    </div>
                    <span class="categoriaTag categoria-${entrada.tipo}">${entrada.tipo}</span>
                    ${referenciaBiblica}
                    <div class="detalhesCard">
                        <span class="detalheItem">🗓️ ${formatarData(entrada.dataCriacao)}</span>
                    </div>
                    <p class="previewConteudo">${entrada.conteudo}</p>
                `;
                card.addEventListener('click', () => abrirVisualizarEntrada(entrada.id));
                gradeEntradas.appendChild(card);
            });
        }
        atualizarEstatisticas();
    };

    const abrirModalEntrada = (entrada = null) => {
        formEntrada.reset();
        entradaId.value = '';
        tituloModalEntrada.textContent = 'Nova Entrada';

        if (entrada) {
            entradaId.value = entrada.id;
            entradaTipo.value = entrada.tipo;
            entradaTitulo.value = entrada.titulo;
            entradaReferencia.value = entrada.referenciaBiblica || '';
            entradaConteudo.value = entrada.conteudo;
            tituloModalEntrada.textContent = 'Editar Entrada';
        }
        modalEntrada.showModal();
    };

    const fecharModalEntrada = () => {
        modalEntrada.close();
    };

    const abrirVisualizarEntrada = (id) => {
        const entrada = entradas.find(e => e.id == id);
        if (!entrada) return;

        visualizarTitulo.textContent = entrada.titulo;
        visualizarTipo.textContent = entrada.tipo;
        visualizarTipo.className = `categoriaTag categoria-${entrada.tipo}`;
        
        // Exibir referência bíblica se existir
        if (entrada.referenciaBiblica) {
            visualizarReferencia.style.display = 'flex';
            visualizarReferencia.querySelector('.textoReferencia').textContent = entrada.referenciaBiblica;
        } else {
            visualizarReferencia.style.display = 'none';
        }
        
        visualizarData.textContent = formatarData(entrada.dataCriacao);
        visualizarConteudo.textContent = entrada.conteudo;

        btnEditarEntrada.onclick = () => {
            fecharVisualizarEntrada();
            abrirModalEntrada(entrada);
        };
        btnExcluirEntrada.onclick = () => excluirEntrada(entrada.id);

        modalVisualizarEntrada.showModal();
    };

    const fecharVisualizarEntrada = () => {
        modalVisualizarEntrada.close();
    };

    const excluirEntrada = (id) => {
        if (confirm('Tem certeza que deseja excluir esta entrada?')) {
            entradas = entradas.filter(e => e.id !== id);
            salvarEntradas();
            renderizarEntradas(document.querySelector('.filtroRapido.ativo').dataset.filtro, inputBusca.value, selectOrdenacao.value);
            fecharVisualizarEntrada();
        }
    };

    // Event Listeners
    btnNovaEntrada.addEventListener('click', () => abrirModalEntrada());
    btnFecharModalEntrada.addEventListener('click', fecharModalEntrada);
    btnCancelarEntrada.addEventListener('click', fecharModalEntrada);
    btnFecharModalVisualizarEntrada.addEventListener('click', fecharVisualizarEntrada);

    formEntrada.addEventListener('submit', (e) => {
        e.preventDefault();

        const id = entradaId.value ? parseInt(entradaId.value) : Date.now();
        const tipo = entradaTipo.value;
        const titulo = entradaTitulo.value;
        const referenciaBiblica = entradaReferencia.value.trim();
        const conteudo = entradaConteudo.value;
        const dataCriacao = entradaId.value ? entradas.find(e => e.id == id).dataCriacao : new Date().toISOString();

        if (titulo && conteudo) {
            const novaEntrada = { 
                id, 
                tipo, 
                titulo, 
                conteudo, 
                dataCriacao,
                ...(referenciaBiblica && { referenciaBiblica })
            };
            if (entradaId.value) {
                entradas = entradas.map(e => (e.id == id ? novaEntrada : e));
            } else {
                entradas.push(novaEntrada);
            }
            salvarEntradas();
            renderizarEntradas(document.querySelector('.filtroRapido.ativo').dataset.filtro, inputBusca.value, selectOrdenacao.value);
            fecharModalEntrada();
        } else {
            alert('Por favor, preencha o título e o conteúdo da entrada.');
        }
    });

    inputBusca.addEventListener('input', () => {
        renderizarEntradas(document.querySelector('.filtroRapido.ativo').dataset.filtro, inputBusca.value, selectOrdenacao.value);
    });

    filtrosRapidos.forEach(filtroBtn => {
        filtroBtn.addEventListener('click', () => {
            filtrosRapidos.forEach(btn => btn.classList.remove('ativo'));
            filtroBtn.classList.add('ativo');
            renderizarEntradas(filtroBtn.dataset.filtro, inputBusca.value, selectOrdenacao.value);
        });
    });

    selectOrdenacao.addEventListener('change', () => {
        renderizarEntradas(document.querySelector('.filtroRapido.ativo').dataset.filtro, inputBusca.value, selectOrdenacao.value);
    });

    // Inicialização
    carregarEntradas();
    renderizarEntradas();
});

