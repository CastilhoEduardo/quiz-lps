let quiz = null;

// 🔹 Carregar quiz
function carregarQuiz(nome) {
    const antigo = document.getElementById("quiz-script");
    if (antigo) antigo.remove();

    const script = document.createElement("script");
    script.src = `quizzes/${nome}.js`;
    script.id = "quiz-script";

    script.onload = () => iniciarQuiz();

    document.body.appendChild(script);
    document.getElementById("resultado").style.display = "none";
}

// 🔹 Iniciar quiz
function iniciarQuiz() {
    if (!window.quiz) {
        alert("Erro ao carregar o quiz")
        return;
    }
    quiz = window.quiz;

    document.getElementById("titulo").innerText = quiz.titulo;
    document.getElementById("resultado").innerText = "";

    mostrarTodasPerguntas();
}

// 🔹 Mostrar todas as perguntas
function mostrarTodasPerguntas() {
    const container = document.getElementById("quiz-container");
    container.innerHTML = "";

    const letras = ["A", "B", "C", "D"];

    quiz.perguntas.forEach((p, index) => {
        const div = document.createElement("div");

        div.innerHTML = `
        <h3>${index + 1}. ${p.pergunta}</h3>
        ${p.opcoes.map((opcao, i) => `
            <label class="opcao">
                <input type="radio" name="pergunta${index}" value="${i}" onclick="toggleRadio(this); atualizarProgresso()">
                <span class="letra">${letras[i]}</span>
                <span>${opcao}</span>
            </label>
        `).join("")}
    `;

    container.appendChild(div);
  });
}

function atualizarProgresso() {
    const total = quiz.perguntas.length;
    const respondidas = document.querySelectorAll("input:checked").length;

    const porcentagem = (respondidas / total) * 100;

    document.getElementById("progresso").style.width = porcentagem + "%";
}

const selecionadas = {};

function toggleRadio(radio) {
    const name = radio.name;

    if (selecionadas[name] === radio) {
        radio.checked = false;
        selecionadas[name] = null;
    } else {
        selecionadas[name] = radio;
    }
}

// 🔹 Finalizar Quiz
function finalizarQuiz() {
    // 🔹 Verifica não respondidas
    const naoRespondidas = [];

    quiz.perguntas.forEach((p, index) => {
        const selecionada = document.querySelector(`input[name="pergunta${index}"]:checked`);
        if (!selecionada) naoRespondidas.push(index + 1);
    });

    if (!confirm("Tem certeza que deseja finalizar o quiz?")) return;

    if (naoRespondidas.length > 0) {
        alert("Você não respondeu as questões: " + naoRespondidas.join(", "));
        return;
    }

    // 🔹 Calcula pontuação
    let pontuacao = 0;

    quiz.perguntas.forEach((p, index) => {
        const selecionada = document.querySelector(`input[name="pergunta${index}"]:checked`);
        const bloco = document.querySelectorAll("#quiz-container div")[index];

        if (parseInt(selecionada.value) === p.correta) {
            pontuacao++;
            bloco.style.border = "2px solid green";
        } else {
            bloco.style.border = "2px solid red";
        }
    });

    // 🔹 Mostrar resultado (FORA do loop)
    const resultado = document.getElementById("resultado");
    resultado.innerText = `Resultado: ${pontuacao} / ${quiz.perguntas.length}`;
    resultado.style.display = "block";

    // 🔹 Bloquear inputs (FORA do loop)
    document.querySelectorAll("input[type='radio']").forEach(input => {
        input.disabled = true;
    });

    // 🔹 Mensagem final
    const total = quiz.perguntas.length;
    const percentual = (pontuacao / total) * 100;

    let mensagem = "";

    if (percentual === 100) mensagem = "🏆 Excelente!";
    else if (percentual >= 70) mensagem = "👏 Muito bom!";
    else if (percentual >= 50) mensagem = "👍 Bom, mas pode melhorar";
    else mensagem = "📚 Continue estudando!";

    document.getElementById("titulo-resultado").innerText = mensagem;
    document.getElementById("texto-resultado").innerText =
        `Você acertou ${pontuacao} de ${total} questões`;

    // 🔹 Mostrar modal
    document.getElementById("modal-resultado").classList.add("ativo");
}

function fecharResultado() {
  document.getElementById("modal-resultado").classList.remove("ativo");
}

// 🔹 Carregar padrão
window.onload = () => {
    carregarQuiz("matematica");
};