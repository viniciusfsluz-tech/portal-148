/*
 * PORTAL DA 148 — comportamento das páginas
 * Usa config.js (config, grupos, itensMenu) e dados.js (trabalhos).
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

// "2026-10-29" -> "29/10/2026"
function formatarData(data = null) {
    if (!data) return "Não informada";
    const [ano, mes, dia] = data.split("-");
    return `${dia}/${mes}/${ano}`;
}

// **negrito**, *itálico* e \* literal (usado nos textos de Português)
function formatarInline(texto) {
    return escaparHTML(texto)
        .replace(/\\\*/g, "\u0000")
        .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.+?)\*/g, "<em>$1</em>")
        .replace(/\u0000/g, "*");
}

const nomeDaArea = area => area === "portugues" ? "Língua Portuguesa" : "Geografia";

const urlDoTrabalho = t => `trabalho.html?area=${t.area}&id=${encodeURIComponent(t.id)}`;

// Trabalhos de uma área, respeitando as chaves liga/desliga do config.js
const areaAtiva = area => config[area] !== false;
const trabalhosDaArea = area => areaAtiva(area) ? trabalhos.filter(t => t.area === area) : [];

function corDoGrupo(nome) {
    const grupo = grupos.find(g => g.nome === nome);
    return grupo ? grupo.cor : 1;
}

// Texto sem marcadores, usado na busca
const textoPuro = t => t.texto
    .map(b => b.replace(/^!\[(.*?)\]\(.*?\)/, "$1").replace(/^(#{2,3}|>>|>|-)\s+/, "").replace(/\*/g, ""))
    .join(" ");


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



function trocarIcones() {
    const claro = document.documentElement.dataset.theme === "claro";

    document.querySelector(".logo_claro").style.display = claro ? "block" : "none";
    document.querySelector(".logo_escuro").style.display = claro ? "none" : "block";

    const favicon = document.querySelector('link[rel="icon"]');
    if (favicon) {
        favicon.href = claro ? "img/logoclaro.png" : "img/logoportal.png";
    }
}
    

}

function configurarVoltarTopo() {
    const botao = document.querySelector("#voltar-topo");
    if (!botao) return;
    const atualizar = () => { botao.hidden = window.scrollY < 280; };
    window.addEventListener("scroll", atualizar, { passive: true });
    botao.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
    atualizar();
}


/* ---------- Texto dos trabalhos (Geografia e Português) ---------- */

function renderizarTexto(blocos, area) {
    const portugues = area === "portugues";
    const inline = portugues ? formatarInline : escaparHTML;
    let html = "";
    let lista = [];
    let destaque = null;

    const fecharLista = () => {
        if (lista.length) html += `<ul>${lista.map(i => `<li>${inline(i)}</li>`).join("")}</ul>`;
        lista = [];
    };
    const fecharDestaque = () => {
        if (destaque) html += `<aside class="destaque">${destaque.titulo ? `<strong>${escaparHTML(destaque.titulo)}</strong>` : ""}${destaque.linhas.map(l => `<p>${escaparHTML(l)}</p>`).join("")}</aside>`;
        destaque = null;
    };

    blocos.forEach(bloco => {
        const imagem = bloco.match(/^!\[(.*?)\]\((.+?)\)\s*(.*)$/);
        if (imagem) {
            fecharLista(); fecharDestaque();
            const [, alt, src, legenda] = imagem;
            html += `<figure><img src="${escaparHTML(src)}" alt="${escaparHTML(alt)}" loading="lazy">${legenda ? `<figcaption>${inline(legenda)}</figcaption>` : ""}</figure>`;
        } else if (bloco.startsWith(">> ")) {
            fecharLista(); fecharDestaque();
            destaque = { titulo: bloco.slice(3), linhas: [] };
        } else if (bloco.startsWith("> ")) {
            fecharLista();
            if (portugues) {
                html += `<blockquote>${inline(bloco.slice(2))}</blockquote>`;
            } else {
                if (!destaque) destaque = { titulo: "", linhas: [] };
                destaque.linhas.push(bloco.slice(2));
            }
        } else {
            fecharDestaque();
            if (bloco.startsWith("- ")) {
                lista.push(bloco.slice(2));
            } else {
                fecharLista();
                if (bloco.startsWith("## ")) html += `<h2>${inline(bloco.slice(3))}</h2>`;
                else if (bloco.startsWith("### ")) html += `<h3>${inline(bloco.slice(4))}</h3>`;
                else if (bloco.includes("\n")) html += `<p class="verso">${inline(bloco)}</p>`;
                else html += `<p>${inline(bloco)}</p>`;
            }
        }
    });
    fecharLista(); fecharDestaque();
    return html;
}

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

function criarCard(t) {
    return `
        <a class="card" href="${urlDoTrabalho(t)}" style="--cor-grupo: var(--cor-${corDoGrupo(t.grupo)})">
            <img src="${escaparHTML(t.imagem.src)}" alt="${escaparHTML(t.imagem.alt)}" loading="lazy">
            <div class="card-corpo">
                <span class="selo-grupo">${escaparHTML(t.grupo)}</span>
                <span class="categoria">${escaparHTML(t.categoria)}</span>
                <h3>${escaparHTML(t.titulo)}</h3>
                <p>${escaparHTML(t.resumo)}</p>
                <span class="card-acao">Abrir trabalho <span aria-hidden="true">→</span></span>
            </div>
        </a>`;
}

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

function iniciarLista() {
    const lista = document.querySelector("#lista-trabalhos");
    if (!lista) return;
    const area = document.body.dataset.area;
    const vazio = document.querySelector("#mensagem-vazia");
    const contador = document.querySelector("#total-trabalhos");

    if (!areaAtiva(area)) {
        lista.innerHTML = "";
        if (vazio) { vazio.hidden = false; vazio.querySelector("p").textContent = `A área de ${nomeDaArea(area)} está desativada neste portal.`; }
        document.querySelector(".filtros")?.setAttribute("hidden", "");
        return;
    }

    const doArea = trabalhosDaArea(area);
    const busca = document.querySelector("#busca");
    const filtroGrupo = document.querySelector("#filtro-grupo");
    const filtroCategoria = document.querySelector("#filtro-categoria");

    const preencher = (select, rotulo, valores) => {
        select.innerHTML = `<option value="todos">${rotulo}</option>` +
            [...new Set(valores)].sort((a, b) => a.localeCompare(b, "pt-BR"))
                .map(v => `<option value="${escaparHTML(v)}">${escaparHTML(v)}</option>`).join("");
    };
    preencher(filtroGrupo, "Todos os grupos", doArea.map(t => t.grupo));
    preencher(filtroCategoria, area === "portugues" ? "Todos os gêneros" : "Todos os temas", doArea.map(t => t.categoria));

    const params = new URLSearchParams(location.search);
    if (params.get("grupo")) filtroGrupo.value = params.get("grupo");

    function filtrar() {
        const termo = normalizar(busca.value.trim());
        const resultado = doArea.filter(t =>
            (filtroGrupo.value === "todos" || t.grupo === filtroGrupo.value) &&
            (filtroCategoria.value === "todos" || t.categoria === filtroCategoria.value) &&
            normalizar([t.titulo, t.resumo, t.grupo, t.categoria, textoPuro(t), ...t.autores].join(" ")).includes(termo)
        ).sort((a, b) => a.grupo.localeCompare(b.grupo, "pt-BR") || a.titulo.localeCompare(b.titulo, "pt-BR"));

        lista.innerHTML = resultado.map(criarCard).join("");
        contador.textContent = `${resultado.length} ${resultado.length === 1 ? "trabalho encontrado" : "trabalhos encontrados"}`;
        vazio.hidden = resultado.length !== 0;
    }
    [busca, filtroGrupo, filtroCategoria].forEach(c => c.addEventListener(c === busca ? "input" : "change", filtrar));
    filtrar();
}

function iniciarDetalhe() {
    const destino = document.querySelector("#detalhe-trabalho");
    if (!destino) return;

    const params = new URLSearchParams(location.search);
    const t = trabalhos.find(x => x.id === params.get("id"));

    if (!t || !areaAtiva(t.area)) {
        destino.innerHTML = `<section class="vazio"><h1>Trabalho não encontrado</h1><p>Confira o endereço ou volte e escolha outro trabalho.</p><a class="botao" href="index.html">Voltar ao início</a></section>`;
        document.title = `Trabalho não encontrado | ${config.titulo}`;
        return;
    }

    const grupo = grupos.find(g => g.nome === t.grupo);
    const modalidade = t.modo === "grupo" ? "Produção em grupo" : "Produção individual";
    const links = t.links?.length ? `<section class="detalhe-links"><h2>Para saber mais</h2><ul>${t.links.map(l => `<li><a href="${escaparHTML(l.url)}" target="_blank" rel="noopener noreferrer">${escaparHTML(l.texto)}</a></li>`).join("")}</ul></section>` : "";
    const video = t.video ? `<section class="detalhe-video"><h2>Vídeo</h2><div class="video-frame">${criarPlayer(t.video, t.titulo)}</div></section>` : "";
    const legenda = [t.imagem.legenda, t.imagem.credito ? `<span class="credito">Crédito: ${escaparHTML(t.imagem.credito)}</span>` : ""].filter(Boolean);

    destino.style.setProperty("--cor-grupo", `var(--cor-${corDoGrupo(t.grupo)})`);
    destino.innerHTML = `
        <a class="voltar" href="${t.area}.html">← Voltar para ${nomeDaArea(t.area)}</a>
        <header class="detalhe-topo">
            <p class="categoria">${nomeDaArea(t.area)} · ${escaparHTML(t.categoria)}</p>
            <h1>${escaparHTML(t.titulo)}</h1>
            <p class="detalhe-resumo">${escaparHTML(t.resumo)}</p>
            <dl class="detalhe-meta">
                <div><dt>Grupo</dt><dd><span class="selo-grupo">${escaparHTML(t.grupo)}</span></dd></div>
                <div><dt>Autoria</dt><dd>${escaparHTML(t.autores.join(", ") || "Não informada")}</dd></div>
                <div><dt>Modalidade</dt><dd>${modalidade}</dd></div>
                <div><dt>Data</dt><dd>${escaparHTML(formatarData(t.data))}</dd></div>
                ${grupo?.sites?.[t.area] ? `<div><dt>Site do grupo</dt><dd><a href="${escaparHTML(grupo.sites[t.area])}" target="_blank" rel="noopener noreferrer">Abrir ↗</a></dd></div>` : ""}
            </dl>
        </header>
        <figure class="capa"><img src="${escaparHTML(t.imagem.src)}" alt="${escaparHTML(t.imagem.alt)}"><figcaption>${legenda.join(" ")}</figcaption></figure>
        <article class="texto ${t.area}" aria-label="Texto completo do trabalho">${renderizarTexto(t.texto, t.area)}</article>
        ${video}
        ${links}`;
    document.title = `${t.titulo} | ${config.titulo}`;
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
        const total = trabalhosDaArea(area).length;
        const qtd = card.querySelector(".materia-qtd");
        if (qtd) qtd.textContent = `${total} ${total === 1 ? "trabalho" : "trabalhos"}`;
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
                ${integrantes.length ? `<p class="integrantes"><strong>Integrantes:</strong> ${escaparHTML(integrantes.join(", "))}</p>` : ""}
                ${links ? `<p class="equipe-links">${links}</p>` : ""}
            </article>`;
    }).join("");
}
// Seção "Conheça os professores": avatar, nome e matéria (vem do config.js)
function iniciarProfessores() {
    const lista = document.querySelector("#lista-professores");
    if (!lista) return;

    lista.innerHTML = config.professores.map(p => {
        const iniciais = p.nome.trim().split(/\s+/).map(n => n[0]).slice(0, 2).join("").toUpperCase();
        const avatar = p.foto
            ? `<img class="avatar" src="${escaparHTML(p.foto)}" alt="Foto de ${escaparHTML(p.nome)}" data-iniciais="${escaparHTML(iniciais)}" width="110" height="110" loading="lazy">`
            : `<span class="avatar avatar-iniciais" aria-hidden="true">${escaparHTML(iniciais)}</span>`;
        return `
            <li class="professor">
                ${avatar}
                <h3>${escaparHTML(p.nome)}</h3>
                <p>${escaparHTML(p.materia)}</p>
            </li>`;
    }).join("");

    // Se a foto não existir, troca por um círculo com as iniciais
    lista.querySelectorAll("img.avatar").forEach(img => {
        img.addEventListener("error", () => {
            const inicial = document.createElement("span");
            inicial.className = "avatar avatar-iniciais";
            inicial.setAttribute("aria-hidden", "true");
            inicial.textContent = img.dataset.iniciais;
            img.replaceWith(inicial);
        });
    });
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
    iniciarLista();
    iniciarDetalhe();
    iniciarEquipe();
});
