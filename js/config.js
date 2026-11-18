/*
 * PORTAL DA 148 — configurações
 * Tudo que muda de uma turma para outra fica aqui.
 */

const config = {
    titulo: "Portal da 148",
    campus: "IFSP — Campus Cubatão",
    turma: "148",
    ano: 2026,
    professores: [
        { nome: "Nelson",  materia: "Programação",     areas: ["geografia","portugues"] },
        { nome: "Augusto", materia: "Geografia",   areas: ["geografia"] },
        { nome: "Fabiana", materia: "Português",     areas: ["portugues"] }
    ],
    // Vídeo da página inicial: null ou { tipo: "youtube", id: "CODIGO", titulo: "..." }
    videoInicio: null,

    // Liga/desliga a área de Língua Portuguesa em todo o portal
    portugues: true,
    geografia: true,

    // Link do portal publicado (usado no QR Code e no README)
    urlPublicada: "preencher",
    repositorioPortal: "preencher"
};

/*
 * Um objeto por grupo produtor.
 *   nome:          IGUAL ao campo "grupo" dos trabalhos em dados.js
 *   representante: quem fica na Equipe do Portal (um por grupo)
 *   cor:           número da paleta de cores (1 a 8), diferente em cada grupo
 *   sites:         link do SITE PUBLICADO do grupo em cada matéria (GitHub Pages), não do repositório.
 *                  Use null onde o grupo não entregou site. O botão "Acessar site" abre esse link direto.
 */
const grupos = [
    {
        nome: "Royal Code",
        representante: "Vinícius Ferreira",
        integrantes: ["Vinícius Ferreira", "Luis Gustavo", "Ruan Silva", "Gabriel Mariano"],
        areas: ["portugues", "geografia"],
        sites: {
            geografia: "https://viniciusfsluz-tech.github.io/conexao-terra/",
            portugues: "https://viniciusfsluz-tech.github.io/CadernoDeLetras/"
    },
    LinkGithub: {
        geografia: "https://github.com/viniciusfsluz-tech/conexao-terra",
        portugues: "https://github.com/viniciusfsluz-tech/CadernoDeLetras"
    },
        nomesSites: {
        geografia: "Conexão Terra",
        portugues: "Caderno de Letras"
    },
        cor: 1
    },

    {
        nome: "Instituto verdade digital",
        representante: "Lucas Antônio",
        integrantes: ["Lucas Antônio", "Cauan Victor", "Enzo Novais", "Enzo Ricci", "Miguel Godke Silva", "Ruan Ribeiro"],
        sites: {
            geografia: "https://cauanvictorcavalcanti-a11y.github.io/ecobyte/",
            portugues: "https://miguelgodke.github.io/SitePortugues",
        },
        LinkGithub: { geografia: "https://github.com/cauanvictorcavalcanti-a11y/ecobyte", portugues: "https://github.com/miguelgodke/SitePortugues" },
        nomesSites: {
        geografia: "EcoByte",
        portugues: "PenteFino"
    },
        cor: 2
    },
    {
        nome: "Os Bardenistas",
        representante: "Lavínnia",
        integrantes: ["Lavínnia", "Julia Sophia","Vitor","Kauã Hentique"],
        sites: { geografia: null, portugues: null },
        LinkGithub: { geografia: null, portugues: null },
        nomesSites: {
        geografia: "ecosofia",
        portugues: "Flânerie"
    },
        cor: 3
    },
    {
        nome:"El Machos",
        representante: "Kauã Hideyuki",
        integrantes: ["Arthur Seiji", "Luis Carlos", "Davi Silva", "Kauã Hideyuki"],
        sites: { geografia: "https://arthurshibukawa-sudo.github.io/Trabalho_4BIM_Geografia/" , portugues: "https://arthurshibukawa-sudo.github.io/trabalho-4BIM/" },
        LinkGithub: { geografia: "https://github.com/arthurshibukawa-sudo/Trabalho_4BIM_Geografia", portugues: "https://github.com/arthurshibukawa-sudo/trabalho_4BIM_portugues" },
        nomesSites: {
        geografia: "MinerTech",
        portugues: "Límpidamente"
    },
        cor: 4
    },

    {
        nome: "Blue Flow",
        sala: "148",
        representante: "Geovanna Vital",
        integrantes: ["Geovanna Vital", "Maria Eduarda Lira", "Rhuan Fonseca", "Marina Matos", "Giovanna Fernandes", "Luis Felipe"],
        areas: ["portugues", "geografia"],  
        sites: {
            geografia: "https://geovanna2403.github.io/OConsumoDeAguaDaIntelig-nciaArtificial/",
            portugues: "https://geovanna2403.github.io/Trabalho_Portugues/"
        },
        LinkGithub: { geografia: "https://github.com/geovanna2403/OConsumoDeAguaDaIntelig-nciaArtificial.git", portugues:"https://github.com/geovanna2403/OConsumoDeAguaDaIntelig-nciaArtificial.git"},
        nomesSites: {
        geografia: "consumo de água da IA",
        portugues: "trabalho de português"
    },
        cor:5  
    },
    {
        nome: " Um passo abaixo - Uma incrível potência ou uma possível venda?",
        representante: "Nicole",
        integrantes: ["Nicole","Miuke","Marcelo","Maria eduarda","Isabelly"],
        sites: { geografia: null , portugues: null },
        LinkGithub: { geografia: https://github.com/max-093/trabalho-Geo.git , portugues: null },
        nomesSites: {
        geografia: "Um passo abaixo - Uma incrível potência ou uma possível venda?",
        portugues: "A Redescoberta: Entre Flores, Versos e Palavras"
    },
        cor: 6
    },
    {
        nome: "Oceon",
        representante: "Alessandra",
        integrantes: ["Alessandra","Izabella","Eduarda R"],
        sites: { geografia: null, portugues: null },
        LinkGithub: { geografia: null, portugues: null },
        nomesSites: {
        geografia: "Tecnologia Azul",
        portugues: "Ponto de Vista"
    },
        cor: 7
    },
        {
        nome: "gp8",
        representante: "Daphne",
        integrantes: ["Daphne","Laura","Anna","Gaby"],
        sites: { geografia: null, portugues: null },
        LinkGithub: { geografia: null, portugues: null },
        nomesSites: {
        geografia: null,
        portugues: null
    },
        cor: 8
    }
];
    
    
    
const itensMenu = [
    { texto: "Início",    href: "index.html",     pagina: "inicio" },
    { texto: "Português", href: "portugues.html", pagina: "portugues" },
    { texto: "Geografia", href: "geografia.html", pagina: "geografia" },
    { texto: "Equipe",    href: "equipe.html",    pagina: "equipe" },
    { texto: "Estilo",    href: "estilo.html",    pagina: "estilo" }
];
