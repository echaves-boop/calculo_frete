const FATOR_CUBAGEM = 300; // kg por m³
const FRETE_MINIMO = 150;  // R$
function obterNumero(id) {
    const valor =
        document.getElementById(id).value;
    if (valor === "") {
        return 0;
    }
    return Number(valor);
}
function formatarMoeda(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}
function formatarNumero(valor) {

    return valor.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}
function calcularVolume(
    comprimento,
    largura,
    altura,
    quantidade
) {
    const comprimentoMetros =
        comprimento / 100;
    const larguraMetros =
        largura / 100;
    const alturaMetros =
        altura / 100;
    const volumeUnitario =
        comprimentoMetros *
        larguraMetros *
        alturaMetros;
    const volumeTotal =
        volumeUnitario * quantidade;
    return volumeTotal;
}
function validarCampos() {
    const campos = [
        "cliente",
        "cidade_nasc",
        "cidade_dest",
        "mercadoria",
        "distancia",
        "valor_nota",
        "quantidade",
        "peso_real",
        "comprimento",
        "largura",
        "altura",
        "tarifa",
        "pedagio",
        "ad_valorem",
        "gris"
    ];
    for (const id of campos) {
        const campo = document.getElementById(id);
        const valor = campo.value.trim();
        if (valor === "") {
            return {
                valido: false,
                mensagem: `Preencha o campo "${campo.previousElementSibling.textContent.trim()}".`
            };
        }
        // Campos numéricos não podem ser 0 ou negativos
        if (campo.type === "number") {
            const numero = Number(valor);
            if (numero <= 0 || isNaN(numero)) {
                return {
                    valido: false,
                    mensagem: `O campo "${campo.previousElementSibling.textContent.trim()}" deve ser maior que zero.`
                };
            }
        }
    }
    return {
        valido: true,
        mensagem: ""
    };
}
function calcularPesoCubado(volume) {

    return volume * FATOR_CUBAGEM;
}
function determinarPesoCobranca(
    pesoReal,
    pesoCubado
) {
    if (pesoReal > pesoCubado) {
        return {
            peso: pesoReal,
            tipo: "Peso real"
        };
    }
    return {
        peso: pesoCubado,
        tipo: "Peso cubado"
    };
}
function calcularFretePeso(
    pesoCobranca,
    tarifa,
    distancia
) {
    return (
        pesoCobranca *
        tarifa *
        distancia
    );
}
function aplicarFreteMinimo(fretePeso) {
    if (fretePeso < FRETE_MINIMO) {
        return {
            valor: FRETE_MINIMO,
            aplicado: true
        };
    }
    return {
        valor: fretePeso,
        aplicado: false
    };
}
function calcularAdValorem(valorNota,percentual) {
    return (valorNota *(percentual / 100));
}
function calcularGris(valorNota,percentual) {
    return (valorNota *(percentual / 100));
}
function calcularTotal(fretePeso,pedagio,adValorem,gris) {
    return (fretePeso + pedagio + adValorem + gris);
}
function gerarFrete() {
    const resultado = document.getElementById("resultado");
    const validacao = validarCampos();
    if (!validacao.valido) {
        resultado.innerHTML = `
            <div class="erro">
                ${validacao.mensagem}
            </div>
        `;
        return;
    }
    const cliente = document.getElementById("cliente").value;
    const cidadeOrigem = document.getElementById("cidade_nasc").value;
    const cidadeDestino = document.getElementById("cidade_dest").value;
    const mercadoria = document.getElementById("mercadoria").value;
    const distancia =
        obterNumero("distancia");
    const valorNota =
        obterNumero("valor_nota");
    const quantidade =
        obterNumero("quantidade");
    const pesoReal =
        obterNumero("peso_real");
    const comprimento =
        obterNumero("comprimento");
    const largura =
        obterNumero("largura");
    const altura =
        obterNumero("altura");
    const tarifa =
        obterNumero("tarifa");
    const pedagio =
        obterNumero("pedagio");
    const adValoremPercentual =
        obterNumero("ad_valorem");
    const grisPercentual =
        obterNumero("gris");
    resultado.innerHTML = "";
    if (tarifa <= 0) {
    resultado.innerHTML = `
        <div class="erro">
            A tarifa por KM deve ser maior que R$ 0,00.
        </div>
    `;
    return;
}
    if (
        cliente === "" ||
        cidadeOrigem === "" ||
        cidadeDestino === "" ||
        mercadoria === ""
    ) {
        resultado.innerHTML = `
            <div class="erro">
                Preencha todos os campos de texto.
            </div>
        `;
        return;
    }
    const volume =
        calcularVolume(comprimento,largura,altura,quantidade);
    const pesoCubado =
        calcularPesoCubado(volume);
    const pesoCobranca =
        determinarPesoCobranca(pesoReal,pesoCubado);
    const fretePesoOriginal =
        calcularFretePeso(pesoCobranca.peso,tarifa,distancia);
    const freteMinimo =
        aplicarFreteMinimo(fretePesoOriginal);
    const adValorem =
        calcularAdValorem(valorNota,adValoremPercentual);
    const gris =
        calcularGris(valorNota,grisPercentual);
    const total =
        calcularTotal(freteMinimo.valor,pedagio,adValorem,gris);
    resultado.innerHTML = `
        <table>
            <tr>
                <th colspan="2">
                    Resultado da Cotação
                </th>
            </tr>
            <tr>
                <td>Cliente</td>
                <td>${cliente}</td>
            </tr>
            <tr>
                <td>Origem</td>
                <td>${cidadeOrigem}</td>
            </tr>
            <tr>
                <td>Destino</td>
                <td>${cidadeDestino}</td>
            </tr>
            <tr>
                <td>Mercadoria</td>
                <td>${mercadoria}</td>
            </tr>
            <tr>
                <td>
                    Distância
                </td>
                <td>
                    ${formatarNumero(distancia)} KM
                </td>
            </tr>
            <tr>
                <td>
                    Quantidade de volumes
                </td>
                <td>
                    ${formatarNumero(quantidade)}
                </td>
            </tr>
            <tr>
                <td>
                    Volume total
                </td>
                <td>
                    ${formatarNumero(volume)} m³
                </td>
            </tr>
            <tr>
                <td>
                    Peso real
                </td>
                <td>
                    ${formatarNumero(pesoReal)} kg
                </td>
            </tr>
            <tr>
                <td>
                    Peso cubado
                </td>
                <td>
                    ${formatarNumero(pesoCubado)} kg
                </td>
            </tr>
            <tr>
                <td>
                    Peso utilizado para cobrança
                </td>
                <td>
                    ${formatarNumero(
                        pesoCobranca.peso
                    )} kg
                    (${pesoCobranca.tipo})
                </td>
            </tr>
            <tr>
                <td>
                    Frete-peso calculado
                </td>
                <td>
                    ${formatarMoeda(
                        fretePesoOriginal
                    )}
                </td>
            </tr>
            <tr>
                <td>
                    Frete-peso aplicado
                </td>
                <td>
                    ${formatarMoeda(freteMinimo.valor)}
                    ${
                        freteMinimo.aplicado
                            ? "(Frete mínimo aplicado)"
                            : ""
                    }
                </td>
            </tr>
            <tr>
                <td>
                    Pedágio
                </td>
                <td>
                    ${formatarMoeda(pedagio)}
                </td>
            </tr>
            <tr>
                <td>
                    Ad Valorem
                    (${formatarNumero(
                        adValoremPercentual
                    )}%)
                </td>
                <td>
                    ${formatarMoeda(adValorem)}
                </td>
            </tr>
            <tr>
                <td>
                    GRIS
                    (${formatarNumero(
                        grisPercentual
                    )}%)
                </td>
                <td>
                    ${formatarMoeda(gris)}
                </td>
            </tr>
            <tr> 
                <th>
                    VALOR TOTAL
                </th>
                <th>
                    ${formatarMoeda(total)}
              </th>
            </tr>
        </table>
    `;
}
function limparTudo() {
    document
        .querySelectorAll("input")
        .forEach(function(input) {

            input.value = "";
        });
    document
        .getElementById("resultado")
        .innerHTML = "";
}