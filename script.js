document.addEventListener("DOMContentLoaded", () => {
    const modalEntrada = document.getElementById("modalEntrada");
    const btnNovaEntrada = document.getElementById("btnNovaEntrada");
    const btnFecharModalEntrada = document.getElementById("btnFecharModalEntrada");
    const btnCancelarEntrada = document.getElementById("btnCancelarEntrada");
    const formEntrada = document.getElementById("formEntrada");
    const entradaId = document.getElementById("entradaId");
    const entradaTipo = document.getElementById("entradaTipo");
    const entradaTitulo = document.getElementById("entradaTitulo");
    const entradaReferencia = document.getElementById("entradaReferencia");
    const entradaConteudo = document.getElementById("entradaConteudo");
    const tituloModalEntrada = document.getElementById("tituloModalEntrada");

    const modalVisualizarEntrada = document.getElementById("modalVisualizarEntrada");
    const btnFecharModalVisualizarEntrada = document.getElementById("btnFecharModalVisualizarEntrada");
    const visualizarTitulo = document.getElementById("visualizarTitulo");
    const visualizarTipo = document.getElementById("visualizarTipo");
    const visualizarReferencia = document.getElementById("visualizarReferencia");
    const visualizarData = document.getElementById("visualizarData");
    const visualizarConteudo = document.getElementById("visualizarConteudo");
    const btnEditarEntrada = document.getElementById("btnEditarEntrada");
    const btnExcluirEntrada = document.getElementById("btnExcluirEntrada");

    const gradeEntradas = document.getElementById("gradeEntradas");
    const entradaVazia = document.getElementById("entradaVazia");
    const inputBusca = document.getElementById("inputBusca");
    const filtrosRapidos = document.querySelectorAll(".filtroRapido");
    const selectOrdenacao = document.getElementById("selectOrdenacao");

    const gradeEntradasPerfil = document.getElementById("gradeEntradasPerfil");
    const entradaVaziaPerfil = document.getElementById("entradaVaziaPerfil");
    const filtrosRapidosPerfil = document.querySelectorAll("#filtrosRapidosPerfil .filtroRapido");
    const selectOrdenacaoPerfil = document.getElementById("selectOrdenacaoPerfil");

    const totalEntradasSpan = document.getElementById("totalEntradas");
    const totalDevocionaisSpan = document.getElementById("totalDevocionais");
    const totalLeiturasSpan = document.getElementById("totalLeituras");

    let entradas = [];
    let usuarios = JSON.parse(localStorage.getItem("lightUpUsuarios")) || [];
    let historicoLeituras = JSON.parse(localStorage.getItem("lightUpHistoricoLeituras")) || {};
    let usuarioLogado = JSON.parse(localStorage.getItem("usuarioLogado"));

    // Função para exibir toasts
    const showToast = (message, type = "info", duration = 3000) => {
        let backgroundColor;
        switch (type) {
            case "success":
                backgroundColor = "linear-gradient(to right, #5cb85c, #4cae4c)";
                break;
            case "error":
                backgroundColor = "linear-gradient(to right, #d9534f, #c9302c)";
                break;
            case "warning":
                backgroundColor = "linear-gradient(to right, #f0ad4e, #eea236)";
                break;
            default:
                backgroundColor = "linear-gradient(to right, #5bc0de, #46b8da)";
        }
        Toastify({
            text: message,
            duration: duration,
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: backgroundColor,
            },
            onClick: function () { }, // Callback after click
        }).showToast();
    };

    // --- Funções de Autenticação ---
    const salvarUsuarios = () => {
        localStorage.setItem("lightUpUsuarios", JSON.stringify(usuarios));
        localStorage.setItem("lightUpHistoricoLeituras", JSON.stringify(historicoLeituras));
    };

    const registrarUsuario = (nome, email, senha) => {
        if (usuarios.some(user => user.email === email)) {
            showToast("Este e-mail já está cadastrado.", "error");
            return false;
        }
        usuarios.push({ nome, email, senha });
        salvarUsuarios();
        showToast("Usuário cadastrado com sucesso!", "success");
        fazerLogin(email, senha); // Logar automaticamente após o cadastro
        return true;
    };

    const fazerLogin = (email, senha) => {
        const usuario = usuarios.find(user => user.email === email && user.senha === senha);
        if (usuario) {
            localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
            usuarioLogado = usuario;
            showToast(`Bem-vindo(a), ${usuario.nome}!`, "success");
            window.location.href = "index1.html";
            return true;
        }
        showToast("Email ou senha incorretos.", "error");
        return false;
    };

    const fazerLogout = () => {
        localStorage.removeItem("usuarioLogado");
        usuarioLogado = null;
        showToast("Você foi desconectado.", "info");
        window.location.href = "login.html";
    };

    const verificarLogin = () => {
        const path = window.location.pathname;
        const isLoginPage = path.includes("login.html");
        const isCadastroPage = path.includes("cadastro.html");
        const isPerfilPage = path.includes("perfil.html");
        const appContent = document.getElementById("appContent");
        const btnLoginLogout = document.getElementById("btnLoginLogout");
        const linkPerfil = document.getElementById("linkPerfil");

        if (usuarioLogado) {
            if (appContent) appContent.style.display = "block";
            if (btnLoginLogout) {
                btnLoginLogout.textContent = `Sair (${usuarioLogado.nome.split(' ')[0]})`;
                btnLoginLogout.onclick = fazerLogout;
            }
            if (linkPerfil) linkPerfil.style.display = "inline-flex";

            if (isLoginPage || isCadastroPage) {
                showToast("Você já está logado! Redirecionando para a página principal.", "info");
                window.location.href = "index1.html";
            }
        } else {
            if (appContent) appContent.style.display = "none";
            if (btnLoginLogout) {
                btnLoginLogout.textContent = "Login";
                btnLoginLogout.onclick = () => { window.location.href = "login.html"; };
            }
            if (linkPerfil) linkPerfil.style.display = "none";

            if (!isLoginPage && !isCadastroPage) {
                window.location.href = "login.html";
            }
        }
    };

    // --- Funções de Utilidade (Existentes) ---
    const formatarData = (dataString) => {
        const options = { year: "numeric", month: "long", day: "numeric" };
        return new Date(dataString).toLocaleDateString("pt-BR", options);
    };

    const salvarEntradas = () => {
        if (usuarioLogado) {
            // Salva apenas as entradas do usuário logado
            const entradasDoUsuario = entradas.filter(e => !e.autor || e.emailAutor === usuarioLogado.email);
            localStorage.setItem(`lightUpEntradas_${usuarioLogado.email}`, JSON.stringify(entradasDoUsuario));
        }
    };

    const carregarEntradas = () => {
        if (usuarioLogado) {
            // Carrega as entradas do usuário logado
            const entradasSalvas = localStorage.getItem(`lightUpEntradas_${usuarioLogado.email}`);
            entradas = entradasSalvas ? JSON.parse(entradasSalvas) : [];

            // Carrega entradas de outros usuários (para exibição global)
            const entradasGlobais = [];
            usuarios.forEach(user => {
                if (user.email !== usuarioLogado.email) {
                    const outrasEntradasSalvas = localStorage.getItem(`lightUpEntradas_${user.email}`);
                    if (outrasEntradasSalvas) {
                        const outrasEntradas = JSON.parse(outrasEntradasSalvas);
                        outrasEntradas.forEach(entradaGlobal => {
                            // Adicionar a informação de quem criou a entrada
                            entradasGlobais.push({...entradaGlobal, autor: user.nome, emailAutor: user.email});
                        });
                    }
                }
            });

            // Mescla as entradas do usuário com as entradas globais, evitando duplicidade de IDs
            const todasEntradas = [...entradas];
            entradasGlobais.forEach(entradaGlobal => {
                // Verifica se já existe uma entrada com o mesmo ID e autor
                if (!todasEntradas.some(e => e.id === entradaGlobal.id && e.emailAutor === entradaGlobal.emailAutor)) {
                    todasEntradas.push(entradaGlobal);
                }
            });
            entradas = todasEntradas;

            // Entradas de exemplo para demonstração se for o primeiro login e não houver entradas
            if (entradas.length === 0 && usuarios.length === 1 && usuarioLogado.email === usuarios[0].email) {
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
        }
    };

    const atualizarEstatisticas = () => {
        if (totalEntradasSpan) totalEntradasSpan.textContent = entradas.filter(e => !e.autor || e.emailAutor === usuarioLogado.email).length;
        if (totalDevocionaisSpan) totalDevocionaisSpan.textContent = entradas.filter(e => e.tipo === "devocional").length;
        if (totalLeiturasSpan) {
            const email = usuarioLogado ? usuarioLogado.email : null;
            const leituras = email && historicoLeituras[email] ? historicoLeituras[email].length : 0;
            totalLeiturasSpan.textContent = leituras;
        }
    };

    // --- Funções de Histórico de Leituras ---
    const exibirHistoricoLeituras = () => {
        const historicoContainer = document.getElementById("historicoLeiturasContainer");
        if (!historicoContainer || !usuarioLogado) return;

        historicoContainer.innerHTML = "";
        const leiturasDoUsuario = historicoLeituras[usuarioLogado.email] || [];

        if (leiturasDoUsuario.length === 0) {
            historicoContainer.innerHTML = "<p class='mensagemVazia'>Nenhuma entrada lida/visualizada ainda.</p>";
            return;
        }

        // Agrupar por título para mostrar a contagem de leituras
        const leiturasAgrupadas = leiturasDoUsuario.reduce((acc, leitura) => {
            const key = `${leitura.id}-${leitura.titulo}`;
            if (!acc[key]) {
                acc[key] = {
                    titulo: leitura.titulo,
                    count: 0,
                    ultimaLeitura: leitura.dataLeitura
                };
            }
            acc[key].count++;
            acc[key].ultimaLeitura = leitura.dataLeitura; // Mantém a última data
            return acc;
        }, {});

        // Converter para array e ordenar pela última leitura
        const leiturasParaExibir = Object.values(leiturasAgrupadas).sort((a, b) => 
            new Date(b.ultimaLeitura) - new Date(a.ultimaLeitura)
        );

        const lista = document.createElement("ul");
        lista.classList.add("historico-lista");

        leiturasParaExibir.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `
                <span class="historico-titulo">${item.titulo}</span>
                <span class="historico-detalhe">Lido ${item.count} vez(es)</span>
                <span class="historico-data">Última: ${formatarData(item.ultimaLeitura)}</span>
            `;
            lista.appendChild(li);
        });

        historicoContainer.appendChild(lista);
    };

    // --- Nova Função: Registrar Interação (Leitura/Visualização) ---
    const registrarInteracao = (entradaId, titulo, tipo) => {
        if (usuarioLogado) {
            const email = usuarioLogado.email;
            if (!historicoLeituras[email]) {
                historicoLeituras[email] = [];
            }

            // Cria um identificador para a leitura
            const novaLeitura = {
                id: entradaId,
                titulo: titulo,
                dataLeitura: new Date().toISOString()
            };

            // Verifica se a leitura já foi registrada recentemente para evitar spam
            const ultimaLeitura = historicoLeituras[email].length > 0 ? historicoLeituras[email][historicoLeituras[email].length - 1] : null;
            const agora = new Date().getTime();
            const tempoMinimoEntreLeituras = 5000; // 5 segundos

            if (ultimaLeitura && ultimaLeitura.id === entradaId && (agora - new Date(ultimaLeitura.dataLeitura).getTime()) < tempoMinimoEntreLeituras) {
                // Leitura já registrada muito recentemente, ignora
                return;
            }

            historicoLeituras[email].push(novaLeitura);
            salvarUsuarios(); // Salva o histórico no localStorage
            atualizarEstatisticas(); // Atualiza o contador de leituras
            if (window.location.pathname.includes("perfil.html")) {
                exibirHistoricoLeituras(); // Atualiza a aba de perfil se estiver nela
            }
            showToast(`Interação "${titulo}" (${tipo}) registrada no histórico.`, "info", 3000);
        }
    };

    const renderizarEntradas = (filtro = "todos", termoBusca = "", ordenacao = "data", targetGrade = gradeEntradas, targetVazia = entradaVazia) => {
        if (!targetGrade) return; // Evita erro se o elemento não existir na página atual

        targetGrade.innerHTML = "";
        let entradasFiltradas = [...entradas];

        const mapeamentoFiltros = {
            "todos": "todos",
            "agradecimentos": "agradecimento",
            "pedidos": "pedido",
            "reflexoes": "reflexao",
            "devocionais": "devocional",
            "leituras": "leitura"
        };

        const tipoFiltro = mapeamentoFiltros[filtro] || filtro;

        if (tipoFiltro !== "todos") {
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
            if (ordenacao === "data") {
                return new Date(b.dataCriacao) - new Date(a.dataCriacao);
            } else if (ordenacao === "tipo") {
                return a.tipo.localeCompare(b.tipo);
            }
            return 0;
        });

        if (entradasFiltradas.length === 0) {
            if (targetVazia) targetVazia.style.display = "block";
        } else {
            if (targetVazia) targetVazia.style.display = "none";
            entradasFiltradas.forEach(entrada => {
                const card = document.createElement("div");
                card.classList.add("cardEntrada");
                card.dataset.id = entrada.id;
                
                const referenciaBiblica = entrada.referenciaBiblica ? 
                    `<div class="referenciaBiblica">📖 ${entrada.referenciaBiblica}</div>` : "";
                
                card.innerHTML = `
                    <div class="cabecalhoCard">
                        <h3 class="nomeEntrada">${entrada.titulo}</h3>
                    </div>
                    ${entrada.autor ? `<span class="autorTag">Autor: ${entrada.autor}</span>` : ""}
                    <span class="categoriaTag categoria-${entrada.tipo}">${entrada.tipo}</span>
                    ${referenciaBiblica}
                    <div class="detalhesCard">
                        <span class="detalheItem">🗓️ ${formatarData(entrada.dataCriacao)}</span>
                    </div>
                    <p class="previewConteudo">${entrada.conteudo}</p>
                `;
                card.addEventListener("click", () => abrirVisualizarEntrada(entrada.id));
                targetGrade.appendChild(card);
            });
        }
        if (targetGrade === gradeEntradas) { // Só atualiza estatísticas na página principal
            atualizarEstatisticas();
        }
    };

    const abrirModalEntrada = (entrada = null) => {
        formEntrada.reset();
        entradaId.value = "";
        tituloModalEntrada.textContent = "Nova Entrada";

        if (entrada) {
            entradaId.value = entrada.id;
            entradaTipo.value = entrada.tipo;
            entradaTitulo.value = entrada.titulo;
            entradaReferencia.value = entrada.referenciaBiblica || "";
            entradaConteudo.value = entrada.conteudo;
            tituloModalEntrada.textContent = "Editar Entrada";
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

        // Exibir autor se for um devocional global
        const autorInfo = document.getElementById("visualizarAutor");
        const isEntradaDoUsuario = !entrada.autor || entrada.emailAutor === usuarioLogado.email;

        if (entrada.autor && entrada.tipo === "devocional") {
            autorInfo.textContent = `Autor: ${entrada.autor}`;
            autorInfo.style.display = "block";
            // Desabilitar edição/exclusão para devocionais de outros usuários
            btnEditarEntrada.style.display = "none";
            btnExcluirEntrada.style.display = "none";
        } else {
            autorInfo.style.display = "none";
            // Habilitar edição/exclusão para entradas do próprio usuário
            btnEditarEntrada.style.display = isEntradaDoUsuario ? "inline-block" : "none";
            btnExcluirEntrada.style.display = isEntradaDoUsuario ? "inline-block" : "none";
        }
        
        if (entrada.referenciaBiblica) {
            visualizarReferencia.style.display = "flex";
            visualizarReferencia.querySelector(".textoReferencia").textContent = entrada.referenciaBiblica;
        } else {
            visualizarReferencia.style.display = "none";
        }
        
        visualizarData.textContent = formatarData(entrada.dataCriacao);
        visualizarConteudo.textContent = entrada.conteudo;

        // Registrar interação no histórico
        registrarInteracao(entrada.id, entrada.titulo, entrada.tipo);

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

    const salvarEntradaHandler = (e) => {
        e.preventDefault();

        const id = entradaId.value;
        const novaEntrada = {
            id: id ? parseInt(id) : Date.now(),
            tipo: entradaTipo.value,
            titulo: entradaTitulo.value.trim(),
            referenciaBiblica: entradaReferencia.value.trim(),
            conteudo: entradaConteudo.value.trim(),
            dataCriacao: id ? entradas.find(e => e.id == id).dataCriacao : new Date().toISOString()
        };

        if (!novaEntrada.titulo || !novaEntrada.conteudo) {
            showToast("Por favor, preencha o título e o conteúdo.", "warning");
            return;
        }

        if (id) {
            const index = entradas.findIndex(e => e.id == id);
            // Garante que só edita entradas do próprio usuário
            if (entradas[index].emailAutor && entradas[index].emailAutor !== usuarioLogado.email) {
                showToast("Você só pode editar suas próprias entradas.", "error");
                return;
            }
            // Mantém as propriedades de autor se existirem
            entradas[index] = {...entradas[index], ...novaEntrada};
        } else {
            entradas.push(novaEntrada);
        }

        salvarEntradas();
        renderizarEntradas();
        fecharModalEntrada();
        showToast("Entrada salva com sucesso!", "success");
    };

    const excluirEntrada = (id) => {
        const entradaParaExcluir = entradas.find(e => e.id == id);
        if (!entradaParaExcluir) return;

        // Garante que só exclui entradas do próprio usuário
        if (entradaParaExcluir.emailAutor && entradaParaExcluir.emailAutor !== usuarioLogado.email) {
            showToast("Você só pode excluir suas próprias entradas.", "error");
            return;
        }

        if (confirm("Tem certeza de que deseja excluir esta entrada?")) {
            entradas = entradas.filter(e => e.id != id);
            salvarEntradas();
            fecharVisualizarEntrada();
            renderizarEntradas();
            showToast("Entrada excluída com sucesso!", "success");
        }
    };

    // Event Listeners
    if (btnNovaEntrada) {
        btnNovaEntrada.addEventListener("click", () => abrirModalEntrada());
    }
    if (btnFecharModalEntrada) btnFecharModalEntrada.addEventListener("click", fecharModalEntrada);
    if (btnCancelarEntrada) btnCancelarEntrada.addEventListener("click", fecharModalEntrada);
    if (formEntrada) formEntrada.addEventListener("submit", salvarEntradaHandler);

    if (btnFecharModalVisualizarEntrada) btnFecharModalVisualizarEntrada.addEventListener("click", fecharVisualizarEntrada);

    // Event Listeners para a página principal (index1.html)
    if (inputBusca) {
        inputBusca.addEventListener("input", () => {
            const filtroAtivo = document.querySelector(".filtroRapido.ativo").dataset.filtro;
            renderizarEntradas(filtroAtivo, inputBusca.value, selectOrdenacao.value, gradeEntradas, entradaVazia);
        });
    }

    if (filtrosRapidos.length > 0 && inputBusca) { // Verifica se estamos na index1.html
        filtrosRapidos.forEach(filtro => {
            filtro.addEventListener("click", () => {
                filtrosRapidos.forEach(f => f.classList.remove("ativo"));
                filtro.classList.add("ativo");
                renderizarEntradas(filtro.dataset.filtro, inputBusca.value, selectOrdenacao.value, gradeEntradas, entradaVazia);
            });
        });
    }

    if (selectOrdenacao) {
        selectOrdenacao.addEventListener("change", () => {
            const filtroAtivo = document.querySelector(".filtroRapido.ativo").dataset.filtro;
            renderizarEntradas(filtroAtivo, inputBusca.value, selectOrdenacao.value, gradeEntradas, entradaVazia);
        });
    }

    // Event Listeners para a página de perfil (perfil.html)
    if (gradeEntradasPerfil) {
        const nomeUsuarioPerfil = document.getElementById("nomeUsuarioPerfil");
        const emailUsuarioPerfil = document.getElementById("emailUsuarioPerfil");

        if (usuarioLogado) {
            nomeUsuarioPerfil.textContent = usuarioLogado.nome;
            emailUsuarioPerfil.textContent = usuarioLogado.email;
            
            // Carrega e renderiza as entradas do perfil (apenas as do usuário logado)
            carregarEntradas();
            renderizarEntradas("todos", "", "data", gradeEntradasPerfil, entradaVaziaPerfil);
            exibirHistoricoLeituras(); // Carrega o histórico de leituras

            if (filtrosRapidosPerfil) {
                filtrosRapidosPerfil.forEach(filtro => {
                    filtro.addEventListener("click", () => {
                        filtrosRapidosPerfil.forEach(f => f.classList.remove("ativo"));
                        filtro.classList.add("ativo");
                        renderizarEntradas(filtro.dataset.filtro, "", selectOrdenacaoPerfil.value, gradeEntradasPerfil, entradaVaziaPerfil);
                    });
                });
            }

            if (selectOrdenacaoPerfil) {
                selectOrdenacaoPerfil.addEventListener("change", () => {
                    const filtroAtivoPerfil = document.querySelector("#filtrosRapidosPerfil .filtroRapido.ativo").dataset.filtro;
                    renderizarEntradas(filtroAtivoPerfil, "", selectOrdenacaoPerfil.value, gradeEntradasPerfil, entradaVaziaPerfil);
                });
            }

        } else {
            window.location.href = "login.html"; // Redireciona se não estiver logado
        }
    }

    const formLogin = document.querySelector(".formLogin");
    if (formLogin) {
        formLogin.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("emailLogin").value;
            const senha = document.getElementById("senhaLogin").value;
            fazerLogin(email, senha);
        });
    }

    const formCadastro = document.querySelector(".formCadastro");
    if (formCadastro) {
        formCadastro.addEventListener("submit", (e) => {
            e.preventDefault();
            const nome = document.getElementById("nomeCadastro").value;
            const email = document.getElementById("emailCadastro").value;
            const senha = document.getElementById("senhaCadastro").value;
            const confirmarSenha = document.getElementById("confirmarSenhaCadastro").value;

            if (senha !== confirmarSenha) {
                showToast("As senhas não coincidem!", "error");
                return;
            }
            if (registrarUsuario(nome, email, senha)) {
                // Redirecionamento já é feito dentro de registrarUsuario (via fazerLogin)
            }
        });
    }

    // Inicialização da verificação de login
    verificarLogin();
    // Carregar entradas se estiver logado
    if (usuarioLogado) {
        carregarEntradas();
        if (window.location.pathname.includes("index1.html")) {
            renderizarEntradas();
        } else if (window.location.pathname.includes("perfil.html")) {
            // A lógica de inicialização do perfil já está acima, mas garante que o histórico seja exibido
            exibirHistoricoLeituras();
        }
    }
});
