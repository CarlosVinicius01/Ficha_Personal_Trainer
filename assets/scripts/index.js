async function enviarParaTrello() {
    const dados = {
        nome: document.getElementById('nome').value.trim(),
        dataNascimento: document.getElementById('dataNascimento').value.trim(),
        endereco: document.getElementById('endereco').value.trim(),
        telefone: document.getElementById('telefone').value.trim(),
        instagram: document.getElementById('instagram').value.trim(),
        peso: document.getElementById('weight').value.trim(),
        altura: document.getElementById('height').value.trim(),
        objetivo: document.getElementById('objective').value.trim(),
        bodyBothers: document.getElementById('bodyBothers').value.trim(),
        standingHours: document.getElementById('standingHours').value.trim(),
        hoursSlept: document.getElementById('hoursSlept').value.trim(),

        lesao: document.querySelector('input[name="a1"]:checked')?.value || '',
        lesaoDescricao: (document.querySelector('input[name="a1"]:checked')?.value === 'Sim') ? document.getElementById('a1-texto').value.trim() : '',

        atividadeFisica: document.querySelector('input[name="a2"]:checked')?.value || '',
        atividadeFisicaDescricao: (document.querySelector('input[name="a2"]:checked')?.value === 'Sim') ? document.getElementById('a2-texto').value.trim() : '',

        suplementacao: document.querySelector('input[name="a3"]:checked')?.value || '',
        suplementacaoDescricao: (document.querySelector('input[name="a3"]:checked')?.value === 'Sim') ? document.getElementById('a3-texto').value.trim() : '',

        nutricao: document.querySelector('input[name="a4"]:checked')?.value || '',
        tempoNutricao: (document.querySelector('input[name="a4"]:checked')?.value === 'Sim') ? document.getElementById('a4-texto').value.trim() : '',

        medicacao: document.querySelector('input[name="a5"]:checked')?.value || '',
        medicacaoDescricao: (document.querySelector('input[name="a5"]:checked')?.value === 'Sim') ? document.getElementById('a5-texto').value.trim() : '',

        obeso: document.querySelector('input[name="a6"]:checked')?.value || '',
        cardiaco: document.querySelector('input[name="a7"]:checked')?.value || '',
        hipertenso: document.querySelector('input[name="a8"]:checked')?.value || '',
        diabetico: document.querySelector('input[name="a9"]:checked')?.value || '',

        cirurgia: document.querySelector('input[name="a10"]:checked')?.value || '',
        cirurgiaDescricao: (document.querySelector('input[name="a10"]:checked')?.value === 'Sim') ? document.getElementById('a10-texto').value.trim() : '',

        psicologico: document.querySelector('input[name="a11"]:checked')?.value || '',

        personal: document.querySelector('input[name="a12"]:checked')?.value || '',
        tempoPersonal: (document.querySelector('input[name="a12"]:checked')?.value === 'Sim') ? document.getElementById('a12-texto').value.trim() : '',

        // PAR-Q
        q1: document.querySelector('input[name="q1"]:checked')?.value || '',
        q2: document.querySelector('input[name="q2"]:checked')?.value || '',
        q3: document.querySelector('input[name="q3"]:checked')?.value || '',
        q4: document.querySelector('input[name="q4"]:checked')?.value || '',
        q5: document.querySelector('input[name="q5"]:checked')?.value || '',
        q6: document.querySelector('input[name="q6"]:checked')?.value || '',
        q7: document.querySelector('input[name="q7"]:checked')?.value || ''
    };

    try {
        const response = await fetch('/api/enviar-trello', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            return true;
        } else {
            showMessage('Erro ao enviar para o servidor.', 'error');
            console.error('Erro:', await response.text());
            return false;
        }
    } catch (error) {
        showMessage('Erro ao conectar com o servidor.', 'error');
        console.error('Erro:', error);
        return false;
    }
}

// Mensagens temporárias 
function showMessage(msg, type = 'error') {
    const box = document.getElementById('message-box');
    box.textContent = msg;
    box.className = `message-box ${type}`;
    box.style.display = 'block';
    setTimeout(() => {
        box.style.opacity = '0';
        setTimeout(() => {
            box.style.display = 'none';
            box.style.opacity = '1';
        }, 300);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    // Atualiza título do passo
    const stepText = document.getElementById('step-text');
    const formStepOne = document.getElementById('form-step-1');
    const formStepTwo = document.getElementById('form-step-2');
    const cref = document.getElementById('cref');

    // Step 1 visível 
    formStepOne.style.display = 'block';
    formStepTwo.style.display = 'none';
    stepText.textContent = 'Etapa 1 de 2 - Dados Pessoais';

    // Máscara Telefone
    const telefoneInput = document.getElementById('telefone');
    telefoneInput.addEventListener('input', e => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 11) val = val.slice(0, 11);
        if (val.length > 10) {
            val = val.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (val.length > 6) {
            val = val.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (val.length > 2) {
            val = val.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        } else if (val.length > 0) {
            val = val.replace(/(\d{0,2})/, '($1');
        }
        e.target.value = val;
    });

    // Máscara Data (dd/mm/aaaa)
    const dataInput = document.getElementById('dataNascimento');
    dataInput.addEventListener('input', e => {
        let val = e.target.value.replace(/\D/g, '');
        if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
        if (val.length > 5) val = val.slice(0, 5) + '/' + val.slice(5, 9);
        e.target.value = val;
    });

    // Limitar números inputs (peso, altura)
    document.querySelectorAll('input[type=number]').forEach(input => {
        input.addEventListener('input', () => {
            const min = input.min ? parseInt(input.min) : null;
            const max = input.max ? parseInt(input.max) : null;
            let val = parseInt(input.value);
            if (!isNaN(val)) {
                if (min !== null && val < min) input.value = min;
                if (max !== null && val > max) input.value = max;
            }
        });
    });

    // Mostrar/esconder inputs 
    const perguntasComTexto = ['a1', 'a2', 'a3', 'a4', 'a5', 'a10', 'a12'];
    perguntasComTexto.forEach(id => {
        const simRadio = document.getElementById(`${id}-sim`);
        const naoRadio = document.getElementById(`${id}-nao`);
        const extraDiv = document.getElementById(`${id}-extra`);
        const inputExtra = document.getElementById(`${id}-texto`);

        function toggleExtra() {
            if (simRadio.checked) {
                extraDiv.style.display = 'block';
                inputExtra.setAttribute('required', 'required');
            } else {
                extraDiv.style.display = 'none';
                inputExtra.removeAttribute('required');
                inputExtra.value = '';
            }
            checkFieldsStepOne();
        }

        simRadio.addEventListener('change', toggleExtra);
        naoRadio.addEventListener('change', toggleExtra);
    });

    // Habilitar botão continuar
    const btnOne = document.getElementById('btnFormOne');
    const containerOne = document.getElementById('containerBtnFormOne');
    const requiredFieldsStepOne = formStepOne.querySelectorAll('input[required]');

    function toggleButton(button, container, enable) {
        if(enable) {
            button.classList.remove('disabled');
            container.classList.remove('disabled');
            button.disabled = false;
        } else {
            button.classList.add('disabled');
            container.classList.add('disabled');
            button.disabled = true;
        }
    }

    function checkFieldsStepOne() {
        let allFilled = true;
        const radiosChecked = new Set();

        requiredFieldsStepOne.forEach(input => {
            if(input.type === 'radio') {
                if(radiosChecked.has(input.name)) return;
                const checked = formStepOne.querySelector(`input[name="${input.name}"]:checked`);
                if(!checked) allFilled = false;
                radiosChecked.add(input.name);
            } else {
                if(input.value.trim() === '') allFilled = false;
            }
        });

        toggleButton(btnOne, containerOne, allFilled);
    }

    requiredFieldsStepOne.forEach(input => {
        input.addEventListener('input', checkFieldsStepOne);
        input.addEventListener('change', checkFieldsStepOne);
    });

    checkFieldsStepOne();

    // Habilitar botão concluir
    const btnTwo = document.getElementById('btnFormTwo');
    const containerTwo = document.getElementById('containerBtnFormTwo');
    const gruposRadioStepTwo = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7'];

    function checkFieldsStepTwo() {
        const allChecked = gruposRadioStepTwo.every(group => {
            return formStepTwo.querySelector(`input[name="${group}"]:checked`);
        });
        toggleButton(btnTwo, containerTwo, allChecked);
    }

    gruposRadioStepTwo.forEach(group => {
        const radios = formStepTwo.querySelectorAll(`input[name="${group}"]`);
        radios.forEach(radio => {
            radio.addEventListener('change', checkFieldsStepTwo);
        });
    });

    checkFieldsStepTwo();

    // Controle de steps no submit
    formStepOne.addEventListener('submit', e => {
        e.preventDefault();
        if(formStepOne.checkValidity()) {
            formStepOne.style.display = 'none';
            formStepTwo.style.display = 'block';
            stepText.textContent = 'Etapa 2 de 2 - Questionário de PAR-Q';
        } else {
            formStepOne.reportValidity();
        }
    });

    formStepTwo.addEventListener('submit', async e => {
        e.preventDefault();
        if (formStepTwo.checkValidity()) {
            const success = await enviarParaTrello();
            if (success) {
                formStepOne.style.display = 'none';
                formStepTwo.style.display = 'none';
                cref.style.display = 'none';

                const title = document.getElementById('title');
                title.textContent = 'Sucesso!';
                stepText.innerHTML = `Seus dados foram enviados.`;
            } else {
                showMessage('Erro ao enviar o formulário.', 'error');
            }
        } else {
            formStepTwo.reportValidity();
        }
    });
});