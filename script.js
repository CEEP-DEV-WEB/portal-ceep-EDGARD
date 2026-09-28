const DEFAULT_DATA = {
  nome: "Aluno CEEP",
  matricula: "20260001",
  turma: "3º Ano • A",
  frequencia: 92,
  observacao: "Aluno inteligente, participativo e com bom desenvolvimento. Continue mantendo a rotina de estudos.",
  disciplinas: [
    { nome: "Matemática", nota: 8.5, professor: "Prof. Carlos" },
    { nome: "Português", nota: 9.0, professor: "Prof. Ana" },
    { nome: "História", nota: 7.5, professor: "Prof. Marcos" },
    { nome: "Ciências", nota: 8.0, professor: "Prof. Júlia" },
    { nome: "Geografia", nota: 9.5, professor: "Prof. Rafael" }
  ]
};

let dados = carregarDados();
let chartColunas = null;
let chartPizza = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("anoAtual").textContent = new Date().getFullYear();
  preencherFormulario();
  atualizarPainel();
  criarGraficos();
  configurarEventos();
});

function carregarDados() {
  const salvo = localStorage.getItem("portalCEEP");
  if (!salvo) return structuredClone(DEFAULT_DATA);
  try {
    return { ...structuredClone(DEFAULT_DATA), ...JSON.parse(salvo) };
  } catch {
    return structuredClone(DEFAULT_DATA);
  }
}

function salvarNoNavegador() {
  localStorage.setItem("portalCEEP", JSON.stringify(dados));
}

function media() {
  const total = dados.disciplinas.reduce((soma, d) => soma + Number(d.nota), 0);
  return dados.disciplinas.length ? total / dados.disciplinas.length : 0;
}

function atualizarPainel() {
  const m = media();
  const partes = dados.nome.trim().split(/\s+/);
  const iniciais = partes.slice(0, 2).map(p => p[0]).join("").toUpperCase();

  document.getElementById("tituloAluno").textContent = `Olá, ${dados.nome.split(" ")[0] || "Aluno"} 👋`;
  document.getElementById("nomeMini").textContent = dados.nome;
  document.getElementById("turmaMini").textContent = dados.turma;
  document.getElementById("avatarAluno").textContent = iniciais || "AC";
  document.getElementById("mediaGeral").textContent = m.toFixed(1).replace(".", ",");
  document.getElementById("frequencia").textContent = `${dados.frequencia}%`;
  document.getElementById("qtdDisciplinas").textContent = dados.disciplinas.length;
  document.getElementById("situacao").textContent = m >= 6 && dados.frequencia >= 75 ? "Regular" : "Atenção";
  document.getElementById("situacao").style.color = m >= 6 && dados.frequencia >= 75 ? "var(--green)" : "var(--orange)";
  document.getElementById("presencas").textContent = `${dados.frequencia}%`;
  document.getElementById("faltas").textContent = `${100 - dados.frequencia}%`;
  document.getElementById("observacao").textContent = dados.observacao;
  document.getElementById("matricula").textContent = dados.matricula;
  document.getElementById("turma").textContent = dados.turma;
  document.getElementById("ultimaAtualizacao").textContent = new Date().toLocaleDateString("pt-BR");

  const tbody = document.getElementById("tabelaNotas");
  tbody.innerHTML = dados.disciplinas.map(d => `
    <tr>
      <td><strong>${esc(d.nome)}</strong></td>
      <td><strong>${Number(d.nota).toFixed(1).replace(".", ",")}</strong></td>
      <td><span class="status ${d.nota >= 6 ? "approved" : "attention"}">${d.nota >= 6 ? "Aprovado" : "Atenção"}</span></td>
      <td>${esc(d.professor)}</td>
    </tr>
  `).join("");

  if (chartColunas) atualizarGraficos();
}

function criarGraficos() {
  const ctxBar = document.getElementById("graficoColunas").getContext("2d");
  chartColunas = new Chart(ctxBar, {
    type: "bar",
    data: {
      labels: dados.disciplinas.map(d => d.nome),
      datasets: [{
        label: "Nota",
        data: dados.disciplinas.map(d => d.nota),
        backgroundColor: "#2563eb",
        borderRadius: 7,
        maxBarThickness: 45
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true, max: 10, ticks: { stepSize: 2 } },
        x: { grid: { display: false } }
      },
      plugins: { legend: { display: false } }
    }
  });

  const ctxPie = document.getElementById("graficoPizza").getContext("2d");
  chartPizza = new Chart(ctxPie, {
    type: "doughnut",
    data: {
      labels: ["Presente", "Ausente"],
      datasets: [{
        data: [dados.frequencia, 100 - dados.frequencia],
        backgroundColor: ["#16a34a", "#e5e7eb"],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "72%",
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function atualizarGraficos() {
  chartColunas.data.labels = dados.disciplinas.map(d => d.nome);
  chartColunas.data.datasets[0].data = dados.disciplinas.map(d => d.nota);
  chartColunas.update();

  chartPizza.data.datasets[0].data = [dados.frequencia, 100 - dados.frequencia];
  chartPizza.update();
}

function preencherFormulario() {
  document.getElementById("inputNome").value = dados.nome;
  document.getElementById("inputMatricula").value = dados.matricula;
  document.getElementById("inputTurma").value = dados.turma;
  document.getElementById("inputFrequencia").value = dados.frequencia;
  document.getElementById("inputObservacao").value = dados.observacao;

  const editor = document.getElementById("gradeEditor");
  editor.innerHTML = dados.disciplinas.map((d, i) => `
    <label class="grade-item">${esc(d.nome)}
      <input class="nota-input" data-index="${i}" type="number" min="0" max="10" step="0.1" value="${d.nota}">
    </label>
  `).join("");
}

function configurarEventos() {
  document.querySelectorAll(".profile-btn").forEach(btn => {
    btn.addEventListener("click", () => mudarPerfil(btn.dataset.profile));
  });

  document.getElementById("btnSalvar").addEventListener("click", salvarAlteracoes);
  document.getElementById("btnRestaurar").addEventListener("click", restaurarDados);

  document.getElementById("btnTema").addEventListener("click", () => {
    document.body.classList.toggle("dark");
    localStorage.setItem("portalTema", document.body.classList.contains("dark") ? "dark" : "light");
    document.getElementById("btnTema").textContent = document.body.classList.contains("dark") ? "☀" : "☾";
  });

  if (localStorage.getItem("portalTema") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("btnTema").textContent = "☀";
  }
}

function mudarPerfil(perfil) {
  document.querySelectorAll(".profile-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.profile === perfil);
  });
  document.getElementById("visaoPais").classList.toggle("active-view", perfil === "pais");
  document.getElementById("visaoProfessor").classList.toggle("active-view", perfil === "professor");
}

function salvarAlteracoes() {
  dados.nome = document.getElementById("inputNome").value.trim() || "Aluno CEEP";
  dados.matricula = document.getElementById("inputMatricula").value.trim() || "Sem matrícula";
  dados.turma = document.getElementById("inputTurma").value.trim() || "Turma não informada";
  dados.frequencia = limitar(Number(document.getElementById("inputFrequencia").value) || 0, 0, 100);
  dados.observacao = document.getElementById("inputObservacao").value.trim() || "Nenhuma observação registrada.";

  document.querySelectorAll(".nota-input").forEach(input => {
    const index = Number(input.dataset.index);
    dados.disciplinas[index].nota = limitar(Number(input.value) || 0, 0, 10);
  });

  salvarNoNavegador();
  atualizarPainel();

  const msg = document.getElementById("saveMessage");
  msg.textContent = "✓ Dados salvos com sucesso!";
  setTimeout(() => msg.textContent = "", 3000);
}

function restaurarDados() {
  if (!confirm("Restaurar os dados de exemplo?")) return;
  dados = structuredClone(DEFAULT_DATA);
  localStorage.removeItem("portalCEEP");
  preencherFormulario();
  atualizarPainel();
}

function limitar(valor, min, max) {
  return Math.min(Math.max(valor, min), max);
}

function esc(texto) {
  return String(texto)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
