const params = [
    "Precisão",
    "Brutalidade",
    "Destreza",
    "Agilidade",
    "Canalização",
    "Arcanismo",
    "Espírito",
    "Vigor"
];

const know = [
    "Carisma",
    "Con. Místico",
    "Exploração",
    "Furtividade",
    "História",
    "Intimidação",
    "Intuição",
    "Medicina",
    "Percepção",
    "Performance",
    "Religião",
    "Sobrevivência",
    "Tecnologia",
    "Vontade"
];

function makeDots(name, count = 6) {

    let html = '<div class="dots">';

    for (let i = 1; i <= count; i++) {

        html += `
            <label>
                <input type="checkbox" name="${name}_${i}">
                <span></span>
            </label>
        `;
    }

    return html + '</div>';
}

function fillStats(containerId, items, prefix) {

    const el = document.getElementById(containerId);

    items.forEach(item => {

        const key = (prefix + '_' + item)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-zA-Z0-9]/g, "_")
            .toLowerCase();

        el.insertAdjacentHTML(
            'beforeend',
            `<div class="row">
                <span>${item}</span>
                ${makeDots(key)}
            </div>`
        );
    });
}

function fillChecks(selector, name, count) {

    const el = document.querySelector(selector);

    for (let i = 1; i <= count; i++) {

        el.insertAdjacentHTML(
            'beforeend',
            `
            <label class="diamond-check">
                <input type="checkbox" name="${name}_${i}">
                <span></span>
            </label>
            `
        );
    }
}

function fillTable(id, rows, cols, prefix) {

    const el = document.getElementById(id);

    for (let r = 1; r <= rows; r++) {

        let tr = '<tr>';

        for (let c = 1; c <= cols; c++) {

            tr += `
                <td>
                    <input name="${prefix}_${r}_${c}">
                </td>
            `;
        }

        tr += '</tr>';

        el.insertAdjacentHTML('beforeend', tr);
    }
}

function abilityCard(index) {

    return `
    <div class="ability-card">

        <input
            class="name"
            name="hab_${index}_nome"
            placeholder="Nome da habilidade">

        <div class="line-fields">

            <input
                name="hab_${index}_caminho"
                placeholder="Caminho / Especialização">

            <input
                name="hab_${index}_tipo"
                placeholder="Tipo da habilidade">

        </div>

        <div class="checks-inline">

            <strong>Tipo de Ação:</strong>

            ${["I", "A", "R", "S", "Ac"]
                .map(a => `
                    <label>
                        ${a}
                        <input
                            type="checkbox"
                            name="hab_${index}_acao_${a}">
                        <span></span>
                    </label>
                `)
                .join("")}

        </div>

        <div
            class="checks-inline"
            style="margin-top:6px">

            <strong>Marcadores:</strong>

            <label>
                Conjuração
                <input
                    type="checkbox"
                    name="hab_${index}_conjuracao">
                <span></span>
            </label>

            <label>
                Foco
                <input
                    type="checkbox"
                    name="hab_${index}_foco">
                <span></span>
            </label>

            <label>
                Transformação
                <input
                    type="checkbox"
                    name="hab_${index}_transformacao">
                <span></span>
            </label>

        </div>

        <div
            class="checks-inline"
            style="margin-top:6px">

            <strong>Aprimoramentos:</strong>

            <label>
                A
                <input
                    type="checkbox"
                    name="hab_${index}_apr_a">
                <span></span>
            </label>

            <label>
                B
                <input
                    type="checkbox"
                    name="hab_${index}_apr_b">
                <span></span>
            </label>

        </div>

        <div class="ability-meta">

            <div class="cost-row">

                <div class="cost">
                    <label>Custo PE</label>
                    <input
                        name="hab_${index}_custo_pe"
                        placeholder="Ex.: 1 PE">
                </div>

                <div class="cost">
                    <label>Custo PV / Outro</label>
                    <input
                        name="hab_${index}_custo_pv"
                        placeholder="Ex.: X PV">
                </div>

            </div>

            <div class="line-fields">

                <input
                    name="hab_${index}_alcance"
                    placeholder="Alcance / Área">

                <input
                    name="hab_${index}_duracao"
                    placeholder="Duração">

            </div>

            <div class="line-fields">

                <input
                    name="hab_${index}_teste"
                    placeholder="Teste / Defesa / Dif.">

                <input
                    name="hab_${index}_dano_cura"
                    placeholder="Dano / Cura / Efeito">

            </div>

        </div>

        <label
            style="font-family:Arial,sans-serif;font-weight:700">
            Descrição e observações
        </label>

        <textarea
            name="hab_${index}_descricao"
            placeholder="Resumo do efeito, condições, limitações e aprimoramentos...">
        </textarea>

    </div>
    `;
}

function fillAbilities(id, start) {

    const el = document.getElementById(id);

    for (let i = start; i < start + 6; i++) {

        el.insertAdjacentHTML(
            'beforeend',
            abilityCard(i)
        );
    }
}

fillStats("parametros", params, "param");
fillStats("conhecimentos", know, "con");

fillChecks(
    '[data-checks="exaustao"]',
    "exaustao",
    5
);

fillTable("weapons", 3, 4, "weapon");
fillTable("armor", 3, 4, "armor");

fillAbilities("abilities1", 1);
fillAbilities("abilities2", 7);

function formData() {

    const data = {};

    document
        .querySelectorAll(
            "#sheetForm input, #sheetForm textarea"
        )
        .forEach(el => {

            data[el.name] =
                el.type === "checkbox"
                    ? el.checked
                    : el.value;
        });

    return data;
}

function setFormData(data) {

    for (let i = 1; i <= 12; i++) {

        if (
            data[`hab_${i}_custo`] &&
            !data[`hab_${i}_custo_pe`]
        ) {

            data[`hab_${i}_custo_pe`] =
                data[`hab_${i}_custo`];
        }

        if (data[`hab_${i}_pagina`]) {

            delete data[`hab_${i}_pagina`];
        }
    }

    document
        .querySelectorAll(
            "#sheetForm input, #sheetForm textarea"
        )
        .forEach(el => {

            if (!(el.name in data)) {
                return;
            }

            if (el.type === "checkbox") {

                el.checked = !!data[el.name];

            } else {

                el.value = data[el.name];
            }
        });
}

function saveSheet() {

    localStorage.setItem(
        "praeludium_ficha",
        JSON.stringify(formData())
    );

    alert("Ficha salva neste navegador.");
}

function loadSheet() {

    const raw =
        localStorage.getItem("praeludium_ficha");

    if (raw) {

        setFormData(JSON.parse(raw));

    } else {

        alert(
            "Nenhuma ficha salva neste navegador."
        );
    }
}

function clearSheet() {

    if (confirm("Limpar todos os campos?")) {

        document
            .getElementById("sheetForm")
            .reset();
    }
}

function exportJSON() {

    const blob = new Blob(
        [JSON.stringify(formData(), null, 2)],
        {
            type: "application/json"
        }
    );

    const a = document.createElement("a");

    a.href = URL.createObjectURL(blob);
    a.download = "ficha-praeludium.json";

    a.click();
}

function importJSON(ev) {

    const file = ev.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {

        setFormData(
            JSON.parse(reader.result)
        );
    };

    reader.readAsText(file);
}

loadSheet();