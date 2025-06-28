import fetch from 'node-fetch';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const key = process.env.TRELLO_KEY;
    const token = process.env.TRELLO_TOKEN;
    const idList = process.env.TRELLO_LIST_ID;

    const dados = req.body;

    const desc = `
    📝 **Ficha de Anamnese**

    👤 **Dados Pessoais**
    - Nome: ${dados.nome}
    - Data de Nascimento: ${dados.dataNascimento}
    - Endereço: ${dados.endereco}
    - Telefone: ${dados.telefone}
    - Instagram: ${dados.instagram}
    - Peso: ${dados.peso} kg
    - Altura: ${dados.altura} cm
    - Objetivo: ${dados.objetivo}
    - Parte do corpo que mais incomoda: ${dados.bodyBothers}
    - Tempo em pé durante o dia: ${dados.standingHours}
    - Dorme quantas horas por noite: ${dados.hoursSlept}

    🧑‍⚕️ **Histórico de Saúde**
    - Lesão musculoesquelética: ${dados.lesao}, ${dados.lesaoDescricao}
    - Já foi obeso(a)?: ${dados.obeso}
    - Cardíaco?: ${dados.cardiaco}
    - Hipertenso?: ${dados.hipertenso}
    - Diabético?: ${dados.diabetico}
    - Já fez cirurgia?: ${dados.cirurgia}, ${dados.cirurgiaDescricao}
    - Faz acompanhamento psicológico ou psiquiátrico?: ${dados.psicologico}
    - Usa medicação controlada?: ${dados.medicacao} ${dados.medicacaoDescricao}

    🏋️ **Hábitos e Rotina**
    - Pratica atividade física?: ${dados.atividadeFisica}, ${dados.atividadeFisicaDescricao}
    - Já fez acompanhamento com personal?: ${dados.personal}, ${dados.tempoPersonal}

    🥗 **Nutrição e Suplementação**
    - Faz acompanhamento nutricional?: ${dados.nutricao}, ${dados.tempoNutricao}
    - Faz uso de suplementação?: ${dados.suplementacao}, ${dados.suplementacaoDescricao}

    ⚠️ **Questionário de PAR-Q**
    1. Algum médico já disse que você possui algum problema de coração e que só deveria realizar atividade física supervisionada?: ${dados.q1}
    2. Sente dores no peito quando pratica atividade física?: ${dados.q2}
    3. Sentiu dores no peito no último mês praticando atividade física?: ${dados.q3}
    4. Apresenta desequilíbrio devido à tontura e/ou perda de consciência?: ${dados.q4}
    5. Possui algum problema ósseo ou articular que pode ser piorado pela atividade física?: ${dados.q5}
    6. Usa algum medicamento para pressão arterial e/ou problema de coração?: ${dados.q6}
    7. Sabe de alguma outra razão pela qual não deve praticar atividade física?: ${dados.q7}

    ✅ **Fim da ficha**
    `;

    const params = new URLSearchParams({
        idList,
        key,
        token,
        name: `Ficha - ${dados.nome}`,
        desc
    });

    try {
        const response = await fetch(`https://api.trello.com/1/cards?${params.toString()}`, {
        method: 'POST'
        });

        if (response.ok) {
        return res.status(200).json({ success: true });
        } else {
        const error = await response.text();
        return res.status(500).json({ success: false, error });
        }
    } catch (err) {
        return res.status(500).json({ success: false, error: err.toString() });
    }
}
