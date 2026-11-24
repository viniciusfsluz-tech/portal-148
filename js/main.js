/*
 * PORTAL DA 148 — comportamento das páginas
 * Usa config.js (config, grupos, itensMenu).
 */

/* ---------- Utilidades ---------- */

const normalizar = (valor = "") => String(valor)
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

function escaparHTML(valor = "") {
    return String(valor).replace(/[&<>"']/g, c => ({
        "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    })[c]);
}

const nomeDaArea = area => area === "portugues" ? "Língua Portuguesa" : "Geografia";

// Matéria ligada/desligada no config.js (chaves portugues e geografia)
const areaAtiva = area => config[area] !== false;

/* ---------- Menu, tema e navegação ---------- */

function criarMenu(paginaAtual = "") {
    const nav = document.querySelector("#menu-principal");
    if (!nav) return;
    const destaque = paginaAtual === "trabalho" ? "" : paginaAtual;
    nav.innerHTML = itensMenu
        .filter(item => item.pagina !== "portugues" || config.portugues !== false)
        .filter(item => item.pagina !== "geografia" || config.geografia !== false)
        .map(item => `<a href="${item.href}" ${item.pagina === destaque ? 'aria-current="page"' : ""}>${item.texto}</a>`)
        .join("");
}

function configurarNavegacao() {
    const botao = document.querySelector("#menu-toggle");
    const nav = document.querySelector("#menu-principal");
    if (!botao || !nav) return;

    const fechar = (foco = false) => {
        nav.classList.remove("is-open");
        botao.setAttribute("aria-expanded", "false");
        botao.setAttribute("aria-label", "Abrir menu");
        if (foco) botao.focus();
    };
    botao.addEventListener("click", () => {
        const aberto = nav.classList.toggle("is-open");
        botao.setAttribute("aria-expanded", String(aberto));
        botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
    });
    nav.addEventListener("click", e => { if (e.target.closest("a")) fechar(); });
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && nav.classList.contains("is-open")) fechar(true);
    });
}

function configurarTema() {





    

    
    const botao = document.querySelector("#theme-toggle");
    let salvo = null;
    try { salvo = localStorage.getItem("portal-tema"); } catch (e) { /* sem armazenamento */ }
    if (salvo === "claro") document.documentElement.dataset.theme = "claro";
    if (!botao) return;

    const atualizar = () => {
        const claro = document.documentElement.dataset.theme === "claro";
        botao.textContent = claro ? "Tema escuro" : "Tema claro";
        botao.setAttribute("aria-pressed", String(claro));
    };
    botao.addEventListener("click", () => {
        const vaiClaro = document.documentElement.dataset.theme !== "claro";
        if (vaiClaro) document.documentElement.dataset.theme = "claro";
        else delete document.documentElement.dataset.theme;
        try { localStorage.setItem("portal-tema", vaiClaro ? "claro" : "escuro"); } catch (e) { /* ignora */ }
        atualizar();
    });
    atualizar();

}

function configurarVoltarTopo() {
    const botao = document.querySelector("#voltar-topo");
    if (!botao) return;
    const atualizar = () => { botao.hidden = window.scrollY < 280; };
    window.addEventListener("scroll", atualizar, { passive: true });
    botao.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    atualizar();
}


/* ---------- Vídeo ---------- */

function criarPlayer(video, titulo) {
    const t = escaparHTML(video.titulo || titulo);
    if (video.tipo === "youtube") {
        return `<iframe src="https://www.youtube-nocookie.com/embed/${encodeURIComponent(video.id)}" title="${t}" loading="lazy" allowfullscreen></iframe>`;
    }
    if (video.tipo === "embed") {
        return `<iframe src="${escaparHTML(video.src)}" title="${t}" loading="lazy" allowfullscreen></iframe>`;
    }
    if (video.tipo === "externo") {
        return `<a class="video-externo" href="${escaparHTML(video.url)}" target="_blank" rel="noopener noreferrer"><span aria-hidden="true">▶</span><strong>${t}</strong><small>Assistir no site oficial ↗</small></a>`;
    }
    return `<video controls preload="metadata" src="${escaparHTML(video.src)}">Seu navegador não reproduz este vídeo.</video>`;
}


/* ---------- Cartões e listas ---------- */

function criarCardGrupo(g, area) {
    const integrantes = (g.integrantes || []).filter(Boolean);
    return `
        <article class="grupo-card" style="--cor-grupo: var(--cor-${g.cor})">
            <p class="categoria">Grupo</p>
            <h2>${escaparHTML(g.nome)}</h2>
            ${g.nomesSites && g.nomesSites[area] ? `<p class="nome-site">${escaparHTML(g.nomesSites[area])}</p>` : ""}
            ${integrantes.length ? `<ul class="integrantes-lista" aria-label="Integrantes de ${escaparHTML(g.nome)}">${integrantes.map(n => `<li>${escaparHTML(n)}</li>`).join("")}</ul>` : ""}
            <a class="botao" href="${escaparHTML(g.sites[area])}" target="_blank" rel="noopener noreferrer">Acessar site <span aria-hidden="true">↗</span><span class="so-leitor"> (abre em nova aba)</span></a>
        </article>`;
}

// Página de uma matéria: um cartão por grupo que entregou site nessa matéria
function iniciarMateria() {
    const lista = document.querySelector("#lista-grupos");
    if (!lista) return;
    const area = document.body.dataset.area;
    const vazio = document.querySelector("#mensagem-vazia");
    const contador = document.querySelector("#total-grupos");
        // Professores da matéria (config.professores filtrados pela área)
    const campoProfs = document.querySelector("#professores-materia");
    const profs = config.professores
        .filter(p => p.areas.includes(area))
        .map(p => p.nome);
    if (campoProfs && profs.length) {
        campoProfs.textContent = "Professores: " + profs.join(", ");
    }

    const doGrupo = areaAtiva(area) ? grupos.filter(g => g.sites && g.sites[area]) : [];
    lista.innerHTML = doGrupo.map(g => criarCardGrupo(g, area)).join("");
    contador.textContent = `${doGrupo.length} ${doGrupo.length === 1 ? "grupo" : "grupos"}`;
    vazio.hidden = doGrupo.length !== 0;
    if (!areaAtiva(area)) vazio.querySelector("p").textContent = `A área de ${nomeDaArea(area)} está desativada neste portal.`;
}

/* ---------- Trabalhos: todos os sites dos grupos, com busca e filtros ---------- */

// Transforma os grupos em uma lista com um item por site publicado (grupo + matéria)
function listarSites() {
    return grupos.flatMap(g =>
        ["geografia", "portugues"]
            .filter(area => areaAtiva(area) && g.sites && g.sites[area])
            .map(area => ({
                area,
                grupo: g.nome.trim(),
                cor: g.cor,
                nome: (g.nomesSites && g.nomesSites[area]) || g.nome.trim(),
                integrantes: (g.integrantes || []).filter(Boolean),
                site: g.sites[area],
                codigo: g.LinkGithub && g.LinkGithub[area]
            }))
    );
}

function criarCardSite(s) {
    return `
        <article class="grupo-card" style="--cor-grupo: var(--cor-${s.cor})">
            <p class="categoria">${nomeDaArea(s.area)}</p>
            <h2>${escaparHTML(s.nome)}</h2>
            <p class="nome-site">Grupo ${escaparHTML(s.grupo)}</p>
            <ul class="integrantes-lista" aria-label="Integrantes de ${escaparHTML(s.grupo)}">${s.integrantes.map(n => `<li>${escaparHTML(n)}</li>`).join("")}</ul>
            <a class="botao" href="${escaparHTML(s.site)}" target="_blank" rel="noopener noreferrer">Acessar site <span aria-hidden="true">↗</span><span class="so-leitor"> (abre em nova aba)</span></a>
            ${s.codigo ? `<a class="link-codigo" href="${escaparHTML(s.codigo)}" target="_blank" rel="noopener noreferrer">Ver código no GitHub ↗</a>` : ""}
        </article>`;
}

function iniciarTrabalhos() {
    const lista = document.querySelector("#lista-sites");
    if (!lista) return;
    const todos = listarSites();
    const busca = document.querySelector("#busca-sites");
    const filtroMateria = document.querySelector("#filtro-materia");
    const filtroGrupo = document.querySelector("#filtro-grupo-sites");
    const limpar = document.querySelector("#limpar-filtros");
    const contador = document.querySelector("#total-sites");
    const vazio = document.querySelector("#mensagem-vazia");

    // Opções do filtro de grupo geradas a partir dos dados
    const nomesGrupos = [...new Set(todos.map(s => s.grupo))].sort((a, b) => a.localeCompare(b, "pt-BR"));
    filtroGrupo.innerHTML = `<option value="todos">Todos os grupos</option>` +
        nomesGrupos.map(n => `<option value="${escaparHTML(n)}">${escaparHTML(n)}</option>`).join("");

    function filtrar() {
        const termo = normalizar(busca.value.trim());
        const resultado = todos.filter(s =>
            (filtroMateria.value === "todas" || s.area === filtroMateria.value) &&
            (filtroGrupo.value === "todos" || s.grupo === filtroGrupo.value) &&
            normalizar([s.nome, s.grupo, nomeDaArea(s.area), ...s.integrantes].join(" ")).includes(termo)
        );
        lista.innerHTML = resultado.map(criarCardSite).join("");
        contador.textContent = `${resultado.length} ${resultado.length === 1 ? "trabalho encontrado" : "trabalhos encontrados"}`;
        vazio.hidden = resultado.length !== 0;
    }

    busca.addEventListener("input", filtrar);
    filtroMateria.addEventListener("change", filtrar);
    filtroGrupo.addEventListener("change", filtrar);
    limpar.addEventListener("click", () => {
        busca.value = "";
        filtroMateria.value = "todas";
        filtroGrupo.value = "todos";
        filtrar();
    });
    document.querySelector("#filtros-sites").addEventListener("submit", e => e.preventDefault());
    filtrar();
}


/* ---------- Início, equipe e rodapé ---------- */

function iniciarInicio() {
    const info = document.querySelector("#info-turma");
    if (!info) return;
    info.innerHTML = `
        <div><dt>Campus</dt><dd>${escaparHTML(config.campus)}</dd></div>
        <div><dt>Turma</dt><dd>${escaparHTML(config.turma)} · ${config.ano}</dd></div>
        <div><dt>Professores</dt><dd>${escaparHTML(config.professores.map(p => p.nome).join(", "))}</dd></div>`;

    document.querySelectorAll("[data-materia]").forEach(card => {
        const area = card.dataset.materia;
        if (!areaAtiva(area)) { card.hidden = true; return; }
        const total = grupos.filter(g => g.sites && g.sites[area]).length;
        const qtd = card.querySelector(".materia-qtd");
        if (qtd) qtd.textContent = `${total} ${total === 1 ? "grupo" : "grupos"}`;
    });


    const secao = document.querySelector("#video-inicio");
    if (secao) {
        if (config.videoInicio) {
            secao.hidden = false;
            secao.querySelector(".video-frame").innerHTML = criarPlayer(config.videoInicio, "Vídeo do portal");
        } else secao.hidden = true;
    }
}

function iniciarEquipe() {
    const lista = document.querySelector("#lista-equipe");
    if (!lista) return;
    lista.innerHTML = grupos.map(g => {
 const links = Object.entries(g.LinkGithub || {})
    .filter(([area, url]) => url && areaAtiva(area))
    .map(([area, url]) => `<a href="${escaparHTML(url)}" target="_blank" rel="noopener noreferrer">Código de ${nomeDaArea(area)} ↗</a>`).join("");
        const integrantes = (g.integrantes || []).filter(Boolean);
        return `
            <article class="equipe-card" style="--cor-grupo: var(--cor-${g.cor})">
                <p class="categoria">Grupo</p>
                <h2>${escaparHTML(g.nome)}</h2>
                <p class="representante"><strong>Representante:</strong> ${escaparHTML(g.representante)}</p>
                <p class="papel"><strong>Papel na equipe:</strong> ${escaparHTML(g.papel || "A definir")}</p>
                ${integrantes.length ? `<p class="integrantes"><strong>Integrantes:</strong> ${escaparHTML(integrantes.join(", "))}</p>` : ""}
                ${links ? `<p class="equipe-links">${links}</p>` : ""}
            </article>`;
    }).join("");
}
// Seção "Conheça os professores": um cartão por professor (nome, texto e foto vêm do config.js)
function iniciarProfessores() {
    const lista = document.querySelector("#lista-professores");
    if (!lista) return;
    lista.innerHTML = config.professores.map(p => `
        <div class="card_prof">
            <img src="${escaparHTML(p.foto)}" class="prof" alt="Foto do professor ${escaparHTML(p.nome)}" loading="lazy">
            <h3>${escaparHTML(p.nome)}</h3>
            <hr class="barra_prof">
            <p class="prof_p">${escaparHTML(p.texto || p.materia)}</p>
        </div>`).join("");
}

function iniciarRodape() {
    const rodape = document.querySelector("#rodape-info");
    if (rodape) rodape.textContent = `${config.titulo} · ${config.campus} · Turma ${config.turma} · ${config.ano}`;
}

document.addEventListener("DOMContentLoaded", () => {
    configurarNavegacao();
    criarMenu(document.body.dataset.page || "");
    configurarTema();
    configurarVoltarTopo();
    iniciarRodape();
    iniciarInicio();
    iniciarProfessores();
    iniciarMateria();
    iniciarEquipe();
    iniciarTrabalhos();
});


/*====== carrossel (só roda na página inicial) ====== */
const imagens = document.querySelectorAll(".carrossel-imagens img");
const indicadores = document.querySelectorAll(".indicadores button");
let imagemAtual = 0;

function mostrarImagem(indice) {
    imagens[imagemAtual].classList.remove("ativa");
    indicadores[imagemAtual].classList.remove("ativo");
    imagemAtual = indice;
    imagens[imagemAtual].classList.add("ativa");
    indicadores[imagemAtual].classList.add("ativo");
}

function mudarImagem(direcao) {
    let proxima = imagemAtual + direcao;
    if (proxima >= imagens.length) proxima = 0;
    if (proxima < 0) proxima = imagens.length - 1;
    mostrarImagem(proxima);
}

// Troca automática a cada 5 segundos (só se houver carrossel na página)
if (imagens.length) {
    setInterval(() => mudarImagem(1), 5000);
}
