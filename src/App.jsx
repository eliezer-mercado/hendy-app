import { useState, useEffect, useRef } from "react";

const QUESTIONS_ES = [
  {id:"situacion",pregunta:"¿Cómo describirías tu situación económica hoy?",sub:"Sé honesto/a. Nadie más lo verá.",
    opciones:[{emoji:"🔥",label:"Hendy total",desc:"No llego a fin de mes",value:"hendy_total"},{emoji:"😓",label:"Ajustado",desc:"Llego pero sin ahorrar nada",value:"ajustado"},{emoji:"😐",label:"Estable",desc:"Cubro mis gastos, algo queda",value:"estable"},{emoji:"💪",label:"Creciendo",desc:"Ahorro y quiero invertir",value:"creciendo"}]},
  {id:"deuda",pregunta:"¿Tenés deudas o préstamos activos?",sub:"Incluye cuotas, fiado, préstamos de amigos.",
    opciones:[{emoji:"🚨",label:"Sí, me asfixian",desc:"No puedo con los pagos",value:"deudas_criticas"},{emoji:"⚠️",label:"Sí, manejables",desc:"Pago pero me ajusta",value:"deudas_manejables"},{emoji:"📋",label:"Solo una pequeña",desc:"Casi la cancelo",value:"deuda_chica"},{emoji:"✅",label:"Sin deudas",desc:"Estoy limpio/a",value:"sin_deudas"}]},
  {id:"meta",pregunta:"¿Cuál es tu mayor sueño financiero ahora mismo?",sub:"Lo que más querés lograr en los próximos 12 meses.",
    opciones:[{emoji:"🏠",label:"Tener casa propia",desc:"O mejorar donde vivo",value:"casa"},{emoji:"💼",label:"Emprender",desc:"Arrancar o crecer mi negocio",value:"emprender"},{emoji:"🧘",label:"Tranquilidad",desc:"Solo quiero dejar de deber",value:"tranquilidad"},{emoji:"✈️",label:"Libertad",desc:"Viajar, estudiar, crecer",value:"libertad"}]},
];

const QUESTIONS_PT = [
  {id:"situacion",pregunta:"Como você descreveria sua situação financeira hoje?",sub:"Seja honesto/a. Ninguém mais verá.",
    opciones:[{emoji:"🔥",label:"Hendy total",desc:"Não chego ao fim do mês",value:"hendy_total"},{emoji:"😓",label:"Apertado",desc:"Chego mas sem poupar nada",value:"ajustado"},{emoji:"😐",label:"Estável",desc:"Cubro meus gastos, sobra algo",value:"estable"},{emoji:"💪",label:"Crescendo",desc:"Poupo e quero investir",value:"creciendo"}]},
  {id:"deuda",pregunta:"Você tem dívidas ou empréstimos ativos?",sub:"Inclui parcelas, fiado, empréstimos de amigos.",
    opciones:[{emoji:"🚨",label:"Sim, me sufocam",desc:"Não consigo pagar",value:"deudas_criticas"},{emoji:"⚠️",label:"Sim, gerenciáveis",desc:"Pago mas aperta",value:"deudas_manejables"},{emoji:"📋",label:"Só uma pequena",desc:"Quase quitei",value:"deuda_chica"},{emoji:"✅",label:"Sem dívidas",desc:"Estou limpo/a",value:"sin_deudas"}]},
  {id:"meta",pregunta:"Qual é o seu maior sonho financeiro agora?",sub:"O que você mais quer alcançar nos próximos 12 meses.",
    opciones:[{emoji:"🏠",label:"Casa própria",desc:"Ou melhorar onde moro",value:"casa"},{emoji:"💼",label:"Empreender",desc:"Começar ou crescer meu negócio",value:"emprender"},{emoji:"🧘",label:"Tranquilidade",desc:"Só quero parar de dever",value:"tranquilidad"},{emoji:"✈️",label:"Liberdade",desc:"Viajar, estudar, crescer",value:"libertad"}]},
];

const LECCIONES = [
  {id:1,emoji:"🪙",tES:"El truco del sobre",tPT:"O truque do envelope",cat:"Ahorro",catPT:"Poupança"},
  {id:2,emoji:"📊",tES:"¿Qué es un presupuesto real?",tPT:"O que é um orçamento real?",cat:"Básicos",catPT:"Básicos"},
  {id:3,emoji:"🚨",tES:"La deuda que más duele",tPT:"A dívida que mais dói",cat:"Deudas",catPT:"Dívidas"},
  {id:4,emoji:"💸",tES:"Remesas sin perder plata",tPT:"Remessas sem perder dinheiro",cat:"Pagos",catPT:"Pagamentos"},
  {id:5,emoji:"🌱",tES:"El fondo de emergencia mínimo",tPT:"O fundo de emergência mínimo",cat:"Ahorro",catPT:"Poupança"},
  {id:6,emoji:"🧾",tES:"Fiado: cuándo sí y cuándo no",tPT:"Fiado: quando sim e quando não",cat:"Básicos",catPT:"Básicos"},
  {id:7,emoji:"📱",tES:"PIX y pagos digitales",tPT:"PIX e pagamentos digitais",cat:"Pagos",catPT:"Pagamentos"},
  {id:8,emoji:"🎯",tES:"La regla del 50-30-20",tPT:"A regra 50-30-20",cat:"Ahorro",catPT:"Poupança"},
  {id:9,emoji:"📈",tES:"Inflación: tu enemigo invisible",tPT:"Inflação: seu inimigo invisível",cat:"Básicos",catPT:"Básicos"},
  {id:10,emoji:"🏦",tES:"¿Cooperativa o banco?",tPT:"Cooperativa ou banco?",cat:"Básicos",catPT:"Básicos"},
  {id:11,emoji:"💳",tES:"Tarjeta de crédito: herramienta o trampa",tPT:"Cartão: ferramenta ou armadilha",cat:"Deudas",catPT:"Dívidas"},
  {id:12,emoji:"🤝",tES:"Cómo negociar una deuda",tPT:"Como negociar uma dívida",cat:"Deudas",catPT:"Dívidas"},
  {id:13,emoji:"🛒",tES:"Comprar vs alquilar: la verdad",tPT:"Comprar vs alugar: a verdade",cat:"Ahorro",catPT:"Poupança"},
  {id:14,emoji:"🌐",tES:"Dólar, real o guaraní: ¿en qué guardar?",tPT:"Dólar, real ou guarani: onde guardar?",cat:"Pagos",catPT:"Pagamentos"},
  {id:15,emoji:"🚀",tES:"Emprender con poco capital",tPT:"Empreender com pouco capital",cat:"Emprender",catPT:"Empreender"},
  {id:16,emoji:"📦",tES:"Cómo validar tu idea de negocio",tPT:"Como validar sua ideia de negócio",cat:"Emprender",catPT:"Empreender"},
  {id:17,emoji:"💰",tES:"Inversiones simples para el Mercosur",tPT:"Investimentos simples para o Mercosul",cat:"Inversión",catPT:"Investimento"},
  {id:18,emoji:"🔄",tES:"Ingresos pasivos: mito vs realidad",tPT:"Renda passiva: mito vs realidade",cat:"Inversión",catPT:"Investimento"},
  {id:19,emoji:"📋",tES:"Tu historial crediticio",tPT:"Seu histórico de crédito",cat:"Básicos",catPT:"Básicos"},
  {id:20,emoji:"🌍",tES:"Negocios internacionales desde Paraguay",tPT:"Negócios internacionais do Mercosul",cat:"Emprender",catPT:"Empreender"},
  {id:21,emoji:"🏆",tES:"Tu plan financiero a 5 años",tPT:"Seu plano financeiro para 5 anos",cat:"Inversión",catPT:"Investimento"},
];

const FREE_LESSONS = 5;
const FORM = "https://docs.google.com/forms/d/e/1FAIpQLSf__KOLz0LH-ASXXiFwwktnfqnFi6-8CrpTBXaXD-13GJ_-gA/viewform?usp=sharing";
// 💳 PAGO PRO — Reemplazá esta URL con tu link de MercadoPago o Stripe
// MercadoPago: https://mpago.la/TU_LINK_AQUI
// Stripe: https://buy.stripe.com/TU_LINK_AQUI
const PRO_PAYMENT_LINK = "https://mpago.la/HENDY_PRO"; // ← reemplazar con link real
const CAT_COLOR = {Ahorro:"#facc15",Básicos:"#60a5fa",Deudas:"#f87171",Pagos:"#4ade80",Emprender:"#c084fc",Inversión:"#fb923c",Poupança:"#facc15",Dívidas:"#f87171",Pagamentos:"#4ade80",Empreender:"#c084fc",Investimento:"#fb923c"};

const LESSON_ES = {
  1:{g:"¿Sabías que el 80% gasta antes de ahorrar?",c:"El truco del sobre es una técnica simple: dividís tu ingreso en partes apenas lo recibís — comida, transporte, servicios y lo que queda.\n\nCuando el sobre de comida se vacía, terminó. No hay debate ni tarjeta que salve.\n\nEn Paraguay funciona especialmente bien para feriantes y trabajadores independientes.\n\nNo necesitás app. Un sobre de papel ya alcanza.",d:"Las personas que usan el sobre ahorran hasta 30% más en el primer mes.",a:"Separás tu plata en 4 partes apenas la recibás. Solo eso."},
  2:{g:"Un presupuesto no es para ricos — es para los que no quieren seguir siéndolo.",c:"Saber cuánto entra y cuánto sale antes de que salga. Eso es todo.\n\nEl presupuesto más básico tiene dos columnas: ENTRA y SALE. Cada semana anotás todo.\n\nSin uno, la plata desaparece sin que sepas adónde fue.\n\nEmpezá con papel y lápiz. Nada digital todavía.",d:"El 76% de los que llevan registro logran ahorrar algo al mes.",a:"Este mes anotás en papel todo lo que gastás, sin juzgarte."},
  3:{g:"No es la deuda más grande la que te hunde — es la que no ves.",c:"Los intereses son el tipo de deuda que nadie calcula bien. Cuando comprás en cuotas sin preguntar el total, ahí está la trampa.\n\nEn Paraguay, las financieras del barrio parecen fáciles pero tienen tasas que duplican lo que pediste en un año.\n\nLa regla: antes de aceptar cualquier crédito, preguntá cuánto pagás en total.\n\nSi no podés calcularlo, no firmés.",d:"Una deuda con 30% de interés anual duplica su valor en 3 años pagando solo mínimos.",a:"Agarrás una deuda que tenés y calculás cuánto pagaste ya vs cuánto pediste."},
  4:{g:"Cada vez que mandás dinero al exterior, alguien se queda con parte.",c:"El sistema tradicional de remesas cobra entre 5% y 15% por transferencia.\n\nNo es solo la comisión visible — también están los tipos de cambio manipulados y las tarifas ocultas.\n\nLas fintechs como NXB están cambiando esto para el Mercosur.\n\nMientras tanto, siempre comparás al menos 2 opciones antes de mandar.",d:"Los trabajadores del Mercosur pierden más de 2.000 millones de dólares al año en comisiones evitables.",a:"La próxima vez que mandés dinero, comparás el tipo de cambio en al menos 2 lugares."},
  5:{g:"No necesitás millones para un fondo de emergencia.",c:"Un fondo de emergencia es plata guardada para imprevistos: enfermedad, rotura, pérdida de cliente.\n\nCon un mes de gastos básicos ya cambia todo.\n\nLo importante: esa plata tiene que estar separada. Si está mezclada, la gastás sin darte cuenta.\n\nCuando la usés, la primera tarea es volver a llenarla.",d:"Las personas con fondo de emergencia tienen 3 veces menos probabilidad de caer en deudas de alto interés.",a:"Calculás cuánto son tus gastos básicos de un mes. Esa es tu primera meta."},
  6:{g:"El fiado puede ser tu mejor aliado o tu peor trampa.",c:"En Paraguay el fiado es parte de la cultura. Usado bien, es liquidez gratuita.\n\nLa regla de oro: solo fidás lo que ya sabés cómo vas a pagar.\n\nEl problema viene cuando el fiado cubre gastos que no podés pagar de otra forma.\n\nAhí empieza el espiral que daña relaciones y finanzas.",d:"El 40% de las deudas informales en Paraguay empezaron como fiados que se acumularon.",a:"Este mes revisás si tenés fiados pendientes y los anotás todos con el monto exacto."},
  7:{g:"PIX cambió Brasil de la noche a la mañana.",c:"PIX es el sistema de pagos instantáneos de Brasil. En 2 años superó al efectivo y las tarjetas.\n\nParaguay tiene SIPAP, Argentina tiene Transferencias 3.0. La idea: mover dinero gratis al instante.\n\nPara el trabajador informal esto es revolucionario — no necesitás cuenta bancaria tradicional.\n\nNXB está construyendo sobre esta infraestructura para conectar todo el Mercosur.",d:"PIX procesa más de 150 millones de transacciones diarias en Brasil.",a:"Este mes preguntás si podés recibir pagos por QR o transferencia instantánea."},
};
{
  const extras={
    8:{g:"¿Sabías que la mayoría de la gente no sabe en qué gasta el 30% de su dinero?",c:"La regla 50-30-20 es simple: 50% de tu ingreso para necesidades básicas, 30% para gustos y 20% para ahorro.\n\nNo es rígida. Si estás en modo supervivencia, empezás con 70-20-10 y vas ajustando.\n\nLo poderoso es tener un marco. Sin él, cada peso gasta solo.\n\nEn Paraguay donde los ingresos son variables, usás el porcentaje del mes anterior como referencia.",d:"Las personas que usan alguna regla de distribución ahorran 40% más que las que no tienen ninguna.",a:"Este mes calculás cuánto porcentaje de tu ingreso va a cada categoría. Solo el diagnóstico."},
    9:{g:"Mientras tu plata duerme debajo del colchón, la inflación la come.",c:"La inflación es el aumento general de los precios. Si guardás 100.000 guaraníes hoy, en un año con 5% de inflación, ese dinero vale como si fueran 95.000.\n\nEn Paraguay y Brasil la inflación promedia entre 4% y 8% anual. Eso significa que el efectivo guardado pierde valor solo.\n\nLa solución básica: tener el fondo de emergencia en una cuenta que dé aunque sea algún interés.\n\nNo tenés que invertir en bolsa. Solo mover la plata de la caja fuerte a una cuenta de ahorro ya hace diferencia.",d:"La inflación en el Mercosur promedia 6% anual. $1.000 guardados hoy valen $740 en 5 años si no los movés.",a:"Este mes buscás qué tasa de interés da tu banco o cooperativa en una cuenta de ahorro básica."},
    10:{g:"¿Cooperativa o banco? La respuesta depende de para qué.",c:"Los bancos tienen más cobertura, más tecnología y más productos. Pero suelen cobrar más comisiones y exigir más requisitos.\n\nLas cooperativas en Paraguay suelen dar mejores tasas de ahorro, menores costos de préstamos y más flexibilidad para el trabajador informal.\n\nLa clave está en comparar: ¿qué tasa de interés te dan en ahorros? ¿Qué comisiones te cobran? ¿Qué condiciones tienen los préstamos?\n\nMuchos paraguayos tienen ambos: la cooperativa para ahorro y crédito, el banco para pagos digitales.",d:"Las cooperativas en Paraguay dan hasta 3 veces más tasa de interés en cuentas de ahorro que los bancos comerciales.",a:"Este mes comparás la tasa de ahorro de tu banco actual con la de la cooperativa más cercana."},
    11:{g:"La tarjeta de crédito usada bien es gratis. Usada mal, es la trampa más cara del mercado.",c:"Una tarjeta de crédito tiene un período de gracia: si pagás el total antes del vencimiento, no pagás intereses. Ese es el único modo correcto de usarla.\n\nSi pagás el mínimo, los intereses se acumulan a tasas que pueden superar el 60% anual. Una deuda de $500 puede volverse $1.000 en poco tiempo.\n\nLa regla: nunca cargues en la tarjeta lo que no tenés ya en tu cuenta. La tarjeta es un método de pago, no un crédito extra.\n\nSi ya tenés deuda en tarjeta, ese es tu enemigo número uno.",d:"Los intereses promedio de tarjeta de crédito en el Mercosur superan el 50% anual — los más altos del sistema.",a:"Este mes revisás el saldo y los intereses de tu tarjeta si tenés una. ¿Cuánto pagás de más?"},
    12:{g:"El 70% de los acreedores acepta negociar. Solo hay que saber cómo pedir.",c:"Cuando estás atrasado en una deuda o sabés que no podés pagar, la peor opción es desaparecer. La mejor: llamar antes de que el problema crezca.\n\nLos acreedores prefieren cobrar menos a no cobrar nada. Eso te da poder de negociación.\n\nLo que podés pedir: extensión del plazo, reducción de intereses, quita parcial del capital, plan de cuotas especial.\n\nSiempre pedí todo por escrito y guardá los comprobantes. Una negociación verbal no vale.",d:"Las personas que negocian proactivamente sus deudas consiguen reducir el monto total en un promedio de 30%.",a:"Este mes identificás la deuda más difícil y preparás un argumento para llamar al acreedor."},
    13:{g:"Comprar casa no siempre es mejor que alquilar. Depende de cuánto tiempo te quedás.",c:"Existe una regla financiera: si el precio de la casa es más de 20 veces el alquiler anual, puede convenir alquilar e invertir la diferencia.\n\nEjemplo: si una casa cuesta 300 millones de guaraníes y el alquiler es 1 millón por mes (12 millones al año), la relación es 25. En ese caso, alquilar y ahorrar puede ser mejor opción.\n\nPero si planificás quedarte más de 7-10 años en el mismo lugar, comprar suele ganar.\n\nNunca tomes esa decisión sin calcular los números de tu situación específica.",d:"En Paraguay, el precio promedio de una casa equivale a 22 años de alquiler — justo en la zona gris de la decisión.",a:"Este mes hacés el cálculo con tu situación: precio de la casa que te interesa dividido por el alquiler anual."},
    14:{g:"La moneda en que guardás tu plata puede hacerte ganar o perder sin hacer nada.",c:"En el Mercosur conviven el guaraní, el real, el peso argentino y el dólar. Cada uno tiene comportamientos diferentes.\n\nEl dólar históricamente protege contra la inflación en la región. Pero si tus gastos son en guaraníes o reales, tener todo en dólares te expone al tipo de cambio.\n\nLa estrategia más común para el trabajador informal: guardar el fondo de emergencia en guaraníes o reales para el gasto diario, y el ahorro de largo plazo en dólares o activos dolarizados.\n\nNunca pongas todos los huevos en una sola canasta monetaria.",d:"El guaraní se devaluó un promedio de 4% anual contra el dólar en los últimos 10 años.",a:"Este mes preguntás en tu banco si podés abrir una cuenta en dólares o comprar una pequeña cantidad de forma segura."},
    15:{g:"Los negocios que arrancan con menos de $500 tienen más chances de sobrevivir.",c:"El error más común al emprender es gastar mucho antes de validar. Un local lindo, equipos nuevos, logo profesional — todo eso puede esperar.\n\nEl primer objetivo es conseguir el primer cliente que pague. Eso valida que el negocio existe.\n\nEn Paraguay hay sectores con muy baja inversión inicial: servicios (delivery, limpieza, reparaciones), reventa de productos, consultoría, clases particulares.\n\nLa regla: arrancás con lo mínimo necesario para cobrar el primer peso. Todo lo demás lo financia el propio negocio.",d:"El 65% de los emprendimientos que fracasan lo hacen por falta de clientes, no por falta de capital.",a:"Este mes escribís en papel el servicio más simple que podrías empezar a ofrecer hoy con lo que ya tenés."},
    16:{g:"Antes de invertir un guaraní, hay una pregunta que te ahorra todo el dinero del mundo.",c:"La pregunta es: ¿alguien pagaría por esto? No si les gustaría, no si lo usarían gratis — si pagarían.\n\nLa forma más rápida de validar: ofrecer el producto o servicio antes de tenerlo listo. Si conseguís un cliente que paga antes de que exista, la idea es válida.\n\nOtra forma: preguntar a 10 personas si comprarían y a qué precio. Si 3 o más dicen que sí con un precio razonable, hay negocio.\n\nEsto te ahorra meses de trabajo y todo el capital inicial en una idea que no funciona.",d:"El 42% de los emprendimientos fracasan porque construyeron algo que el mercado no necesitaba.",a:"Este mes ofrecés tu idea a 5 personas reales y les preguntás cuánto pagarían. Sin vergüenza."},
    17:{g:"No necesitás ser rico para invertir. Opciones reales desde $50.",c:"En el Mercosur hay opciones de inversión para todo nivel: fondos de inversión de bajo monto, letras del tesoro paraguayo, acciones fraccionadas, plataformas de criptomonedas reguladas.\n\nLa regla de oro: nunca invertís lo que no podés perder. Primero el fondo de emergencia, después la inversión.\n\nEl principio más poderoso es el interés compuesto: $100 al mes invertidos durante 20 años a 8% anual se convierten en más de $58.000.\n\nEl tiempo es tu mayor ventaja. Empezar hoy con poco vale más que esperar tener mucho.",d:"$100 al mes durante 20 años al 8% anual = $58.902. Los mismos $100 solo durante 10 años = $18.295.",a:"Este mes investigás una opción de inversión local segura y anotás cuánto sería el monto mínimo de entrada."},
    18:{g:"La mayoría de los ingresos pasivos requieren trabajo. Los reales son pocos — y valen mucho.",c:"El ingreso pasivo de verdad es aquel que genera dinero sin que trabajes activamente: alquiler de propiedades, dividendos de acciones, regalías de libros o música, negocios que funcionan solos.\n\nLos ingresos semipasivos requieren trabajo inicial pero luego se automatizan: cursos en línea, contenido digital, afiliaciones.\n\nLo que no es ingreso pasivo real: network marketing que requiere reclutamiento constante, freelance que depende de tu tiempo.\n\nPara llegar al ingreso pasivo real, primero necesitás capital o un activo. Y eso se construye con años de ahorro e inversión.",d:"Solo el 3% de las personas logra ingresos verdaderamente pasivos. El 97% restante tiene ingresos semi-pasivos que requieren mantenimiento.",a:"Este mes identificás un activo que ya tenés (habilidad, espacio, conocimiento) que podría generar ingreso con poco trabajo."},
    19:{g:"Un buen historial crediticio abre puertas que el dinero solo no puede abrir.",c:"El historial crediticio es el registro de cómo pagaste tus deudas en el pasado. Los bancos, cooperativas y muchos empleadores lo consultan.\n\nEn Paraguay existe la Central de Riesgos del Banco Central y varias centrales privadas. Tener deudas en mora puede bloquearte por años.\n\nPara construir buen historial: pagá siempre a tiempo aunque sea el mínimo, usá crédito pequeño y pagalo puntualmente, evitá tener muchas deudas abiertas simultáneamente.\n\nSi tenés historial negativo, el tiempo y el pago de deudas lo van mejorando gradualmente.",d:"El 40% de las solicitudes de préstamo en Paraguay son rechazadas por historial crediticio negativo.",a:"Este mes pedís en tu banco o en el Banco Central tu reporte de historial crediticio para saber en qué estado estás."},
    20:{g:"Paraguay tiene ventajas únicas para el comercio regional que muy poca gente aprovecha.",c:"Paraguay tiene el régimen tributario más bajo del Mercosur para importaciones y exportaciones. El régimen de maquila permite fabricar con beneficios impositivos especiales. Ciudad del Este es el tercer polo de compras libre del mundo.\n\nPara el emprendedor paraguayo esto significa: posibilidades de triangular comercio entre Brasil, Argentina y el resto del mundo con ventajas que otros países no tienen.\n\nNegocios que funcionan en este contexto: importación y reventa, servicios de logística, e-commerce regional, representación de marcas extranjeras.\n\nEl conocimiento de estas ventajas es por sí solo un activo competitivo.",d:"Paraguay es el 5to exportador mundial de soja y el 6to de energía eléctrica — con solo 7 millones de habitantes.",a:"Este mes investigás un producto o servicio que puedas triangular entre Paraguay y otro país del Mercosur."},
    21:{g:"El plan financiero a 5 años no es para ricos. Es el mapa que separa a los que llegan de los que nunca arrancan.",c:"Un plan financiero personal a 5 años tiene tres componentes: dónde estás hoy (diagnóstico), dónde querés estar en 5 años (objetivos concretos con números), cómo vas a llegar (acciones anuales específicas).\n\nNo hace falta que sea perfecto. Hace falta que exista. Las personas con un plan financiero escrito acumulan significativamente más que las que no tienen ninguno.\n\nEl plan se revisa una vez al año y se ajusta según lo que pasó. La vida cambia, el plan también.\n\nEste es el último paso de la Academia Hendy. Si llegaste acá, ya tenés más educación financiera que el 90% de la gente.",d:"Las personas con un plan financiero escrito acumulan en promedio 2.5 veces más patrimonio que las que no tienen ninguno.",a:"Este mes escribís en papel: dónde estás hoy en dinero, dónde querés estar en 5 años, y una acción concreta para el próximo mes."},
  };
  for(let k in extras){LESSON_ES[k]=extras[k];}
}

const LESSON_PT = {
  1:{g:"Você sabia que 80% das pessoas gastam antes de poupar?",c:"O truque do envelope é simples: divida sua renda assim que receber — comida, transporte, contas e o que sobra.\n\nQuando o envelope de comida esvazia, acabou. Sem debate, sem cartão que salve.\n\nNo Paraguai funciona muito bem para feirantes e trabalhadores independentes.\n\nNão precisa de app. Um envelope de papel já basta.",d:"Pessoas que usam o método do envelope poupam até 30% mais no primeiro mês.",a:"Separa seu dinheiro em 4 partes assim que receber. Só isso."},
  2:{g:"Um orçamento não é para ricos — é para quem não quer continuar pobre.",c:"Saber quanto entra e quanto sai antes de sair. É só isso.\n\nO orçamento mais básico tem duas colunas: ENTRA e SAI. Toda semana você anota tudo.\n\nSem um orçamento, o dinheiro desaparece sem que você saiba para onde foi.\n\nComece com papel e lápis. Nada digital ainda.",d:"76% das pessoas que registram seus gastos conseguem poupar algo por mês.",a:"Este mês anota no papel tudo que você gasta, sem se julgar. Só registra."},
  3:{g:"Não é a dívida maior que te afunda — é a que você não vê.",c:"Os juros são o tipo de dívida que ninguém calcula bem. Quando compra parcelado sem perguntar o total, está a armadilha.\n\nNo Paraguai, as financeiras do bairro parecem fáceis mas têm taxas que dobram o que você pediu em um ano.\n\nA regra: antes de aceitar qualquer crédito, pergunte quanto vai pagar no total.\n\nSe não consegue calcular, não assina.",d:"Uma dívida com 30% de juros ao ano dobra seu valor em 3 anos pagando só o mínimo.",a:"Pega uma dívida que você tem e calcula quanto já pagou vs quanto pediu."},
  4:{g:"Toda vez que você envia dinheiro para o exterior, alguém fica com parte.",c:"O sistema tradicional de remessas cobra entre 5% e 15% por transferência.\n\nNão é só a taxa visível — também há câmbio manipulado e tarifas ocultas.\n\nFintechs como a NXB estão mudando isso para o Mercosul.\n\nEnquanto isso, sempre compare pelo menos 2 opções antes de enviar.",d:"Os trabalhadores do Mercosul perdem mais de 2 bilhões de dólares por ano em taxas evitáveis.",a:"Na próxima vez que enviar dinheiro, compare o câmbio em pelo menos 2 lugares."},
  5:{g:"Você não precisa de milhões para um fundo de emergência.",c:"Um fundo de emergência é dinheiro guardado para imprevistos: doença, conserto, perda de cliente.\n\nCom um mês de gastos básicos já muda tudo.\n\nO importante: esse dinheiro precisa estar separado. Se estiver misturado, você gasta sem perceber.\n\nQuando usar, a primeira tarefa é repor.",d:"Pessoas com fundo de emergência têm 3 vezes menos probabilidade de cair em dívidas.",a:"Calcula quanto são seus gastos básicos de um mês. Essa é sua primeira meta."},
  6:{g:"O fiado pode ser seu melhor aliado ou sua pior armadilha.",c:"No Paraguai o fiado faz parte da cultura. Bem usado, é liquidez gratuita.\n\nA regra de ouro: só fiade o que você já sabe como vai pagar.\n\nO problema vem quando o fiado cobre gastos que você não consegue pagar de outra forma.\n\nAí começa a espiral que prejudica relações e finanças.",d:"40% das dívidas informais no Paraguai começaram como fiados que foram se acumulando.",a:"Este mês verifica se tem fiados pendentes e anota todos com o valor exato."},
  7:{g:"O PIX mudou o Brasil da noite para o dia.",c:"PIX é o sistema de pagamentos instantâneos do Brasil. Em 2 anos superou dinheiro e cartões.\n\nO Paraguai tem SIPAP, a Argentina tem Transferências 3.0. A ideia: mover dinheiro grátis e instantâneo.\n\nPara o trabalhador informal isso é revolucionário — não precisa de conta bancária tradicional.\n\nA NXB está construindo sobre essa infraestrutura para conectar todo o Mercosul.",d:"O PIX processa mais de 150 milhões de transações diárias no Brasil.",a:"Este mês pergunta se você pode receber pagamentos por QR ou transferência instantânea."},
};
{
  const extras={
    8:{g:"Você sabia que a maioria das pessoas não sabe onde gasta 30% do seu dinheiro?",c:"A regra 50-30-20 é simples: 50% da sua renda para necessidades básicas, 30% para lazer e 20% para poupança.\n\nNão é rígida. Se está em modo sobrevivência, começa com 70-20-10 e vai ajustando.\n\nO poderoso é ter um critério. Sem ele, cada real gasta sozinho.\n\nNo Paraguai e Brasil com renda variável, usa o percentual do mês anterior como referência.",d:"Pessoas que usam alguma regra de distribuição poupam 40% mais do que as que não têm nenhuma.",a:"Este mês calcula que percentual da sua renda vai para cada categoria. Só o diagnóstico."},
    9:{g:"Enquanto seu dinheiro dorme debaixo do colchão, a inflação o come.",c:"A inflação é o aumento geral dos preços. Se você guarda R$1.000 hoje, com 5% de inflação em um ano esse dinheiro vale como se fossem R$950.\n\nNo Paraguai e Brasil a inflação média fica entre 4% e 8% ao ano. Isso significa que o dinheiro em espécie perde valor sozinho.\n\nA solução básica: ter o fundo de emergência em uma conta que dê pelo menos algum rendimento.\n\nNão precisa investir em bolsa. Só mover o dinheiro para uma poupança já faz diferença.",d:"A inflação no Mercosul média 6% ao ano. R$1.000 guardados hoje valem R$740 em 5 anos se não os movimentar.",a:"Este mês busca qual taxa de juros seu banco ou cooperativa dá em uma conta poupança básica."},
    10:{g:"Cooperativa ou banco? A resposta depende do que você precisa.",c:"Os bancos têm mais cobertura, mais tecnologia e mais produtos. Mas costumam cobrar mais tarifas e exigir mais requisitos.\n\nAs cooperativas geralmente dão melhores taxas de poupança, menores custos de empréstimos e mais flexibilidade para o trabalhador informal.\n\nA chave está em comparar: qual taxa de juros te pagam na poupança? Quais tarifas cobram? Quais condições têm os empréstimos?\n\nMuitos brasileiros têm os dois: a cooperativa para poupança e crédito, o banco para pagamentos digitais.",d:"As cooperativas no Mercosul dão até 3 vezes mais taxa de juros em poupança do que os bancos comerciais.",a:"Este mês compara a taxa de poupança do seu banco atual com a da cooperativa mais próxima."},
    11:{g:"O cartão de crédito bem usado é de graça. Mal usado, é a armadilha mais cara do mercado.",c:"Um cartão de crédito tem um período de graça: se você pagar o total antes do vencimento, não paga juros. Esse é o único modo correto de usar.\n\nSe pagar o mínimo, os juros se acumulam a taxas que podem superar 100% ao ano no Brasil. Uma dívida de R$500 pode virar R$1.000 rapidinho.\n\nA regra: nunca coloca no cartão o que você não tem já na conta. O cartão é método de pagamento, não crédito extra.\n\nSe já tem dívida no cartão, esse é seu inimigo número um.",d:"Os juros médios do cartão de crédito no Brasil superam 100% ao ano — os mais altos do mundo.",a:"Este mês verifica o saldo e os juros do seu cartão se tiver um. Quanto você paga a mais?"},
    12:{g:"70% dos credores aceitam negociar. Só precisa saber como pedir.",c:"Quando está atrasado em uma dívida ou sabe que não consegue pagar, a pior opção é sumir. A melhor: ligar antes que o problema cresça.\n\nOs credores preferem receber menos a não receber nada. Isso te dá poder de negociação.\n\nO que você pode pedir: extensão do prazo, redução de juros, desconto no principal, plano de parcelas especial.\n\nSempre peça tudo por escrito e guarde os comprovantes. Uma negociação verbal não vale nada.",d:"Pessoas que negociam proativamente suas dívidas conseguem reduzir o valor total em média 30%.",a:"Este mês identifica a dívida mais difícil e prepara um argumento para ligar para o credor."},
    13:{g:"Comprar casa nem sempre é melhor do que alugar. Depende de quanto tempo você fica.",c:"Existe uma regra financeira: se o preço da casa é mais de 20 vezes o aluguel anual, pode convir alugar e investir a diferença.\n\nExemplo: se uma casa custa R$300.000 e o aluguel é R$1.500 por mês (R$18.000 por ano), a relação é 16,7. Nesse caso comprar pode ser melhor.\n\nMas se planeja ficar mais de 7-10 anos no mesmo lugar, comprar geralmente ganha.\n\nNunca tome essa decisão sem calcular os números da sua situação específica.",d:"No Brasil, o preço médio de uma casa equivale a 22 anos de aluguel — exatamente na zona cinza da decisão.",a:"Este mês faz o cálculo com sua situação: preço da casa que te interessa dividido pelo aluguel anual."},
    14:{g:"A moeda em que você guarda seu dinheiro pode te fazer ganhar ou perder sem fazer nada.",c:"No Mercosul convivem o guarani, o real, o peso argentino e o dólar. Cada um tem comportamentos diferentes.\n\nO dólar historicamente protege contra a inflação na região. Mas se seus gastos são em reais, ter tudo em dólares te expõe ao câmbio.\n\nA estratégia mais comum para o trabalhador informal: guardar o fundo de emergência em reais para o gasto diário, e a poupança de longo prazo em dólares ou ativos dolarizados.\n\nNunca ponha todos os ovos em uma cesta só.",d:"O real se desvalorizou em média 6% ao ano contra o dólar nos últimos 10 anos.",a:"Este mês pergunta no seu banco se pode abrir uma conta em dólares ou comprar uma pequena quantidade de forma segura."},
    15:{g:"Negócios que começam com menos de R$500 têm mais chances de sobreviver.",c:"O erro mais comum ao empreender é gastar muito antes de validar. Loja bonita, equipamentos novos, logo profissional — tudo isso pode esperar.\n\nO primeiro objetivo é conseguir o primeiro cliente que pague. Isso valida que o negócio existe.\n\nNo Brasil e Paraguai há setores com baixíssimo investimento inicial: serviços (delivery, limpeza, reparos), revenda de produtos, consultoria, aulas particulares.\n\nA regra: começa com o mínimo necessário para cobrar o primeiro real. Todo o resto o próprio negócio financia.",d:"65% dos empreendimentos que fracassam o fazem por falta de clientes, não por falta de capital.",a:"Este mês escreve no papel o serviço mais simples que poderia começar a oferecer hoje com o que já tem."},
    16:{g:"Antes de investir um real, há uma pergunta que te economiza todo o dinheiro do mundo.",c:"A pergunta é: alguém pagaria por isso? Não se gostariam, não se usariam de graça — se pagariam.\n\nA forma mais rápida de validar: oferecer o produto ou serviço antes de tê-lo pronto. Se conseguir um cliente que pague antes de existir, a ideia é válida.\n\nOutra forma: perguntar a 10 pessoas se comprariam e a que preço. Se 3 ou mais dizem sim com preço razoável, há negócio.\n\nIsso te economiza meses de trabalho e todo o capital inicial em uma ideia que não funciona.",d:"42% dos empreendimentos fracassam porque construíram algo que o mercado não precisava.",a:"Este mês oferece sua ideia a 5 pessoas reais e pergunta quanto pagariam. Sem vergonha."},
    17:{g:"Você não precisa ser rico para investir. Opções reais a partir de R$50.",c:"No Mercosul há opções de investimento para todo nível: fundos de investimento de baixo valor, Tesouro Direto no Brasil, ações fracionadas, plataformas de criptomoedas reguladas.\n\nA regra de ouro: nunca investe o que não pode perder. Primeiro o fundo de emergência, depois o investimento.\n\nO princípio mais poderoso é o juro composto: R$100 por mês durante 20 anos a 8% ao ano viram mais de R$58.000.\n\nO tempo é sua maior vantagem. Começar hoje com pouco vale mais do que esperar ter muito.",d:"R$100 por mês durante 20 anos a 8% ao ano = R$58.902. Os mesmos R$100 só por 10 anos = R$18.295.",a:"Este mês pesquisa uma opção de investimento local segura e anota qual seria o valor mínimo de entrada."},
    18:{g:"A maioria das rendas passivas exige trabalho. As reais são poucas — e valem muito.",c:"A renda passiva de verdade é aquela que gera dinheiro sem que você trabalhe ativamente: aluguel de imóveis, dividendos de ações, direitos autorais, negócios que funcionam sozinhos.\n\nAs rendas semi-passivas exigem trabalho inicial mas depois se automatizam: cursos online, conteúdo digital, afiliações.\n\nO que não é renda passiva real: marketing de rede que exige recrutamento constante, freelance que depende do seu tempo.\n\nPara chegar à renda passiva real, primeiro precisa de capital ou ativo. E isso se constrói com anos de poupança e investimento.",d:"Só 3% das pessoas consegue renda verdadeiramente passiva. Os outros 97% têm renda semi-passiva que exige manutenção.",a:"Este mês identifica um ativo que você já tem (habilidade, espaço, conhecimento) que poderia gerar renda com pouco trabalho."},
    19:{g:"Um bom histórico de crédito abre portas que o dinheiro sozinho não consegue abrir.",c:"O histórico de crédito é o registro de como você pagou suas dívidas no passado. Bancos, cooperativas e muitos empregadores o consultam.\n\nNo Brasil existe o Serasa, SPC e o SCR do Banco Central. Ter dívidas em atraso pode te bloquear por anos.\n\nPara construir bom histórico: pague sempre no prazo mesmo que seja o mínimo, use crédito pequeno e quite pontualmente, evite ter muitas dívidas abertas simultâneas.\n\nSe tem histórico negativo, o tempo e o pagamento das dívidas vão melhorando gradualmente.",d:"40% das solicitações de empréstimo no Brasil são recusadas por histórico de crédito negativo.",a:"Este mês pede no seu banco ou no Serasa seu relatório de histórico de crédito para saber em que situação está."},
    20:{g:"O Paraguai tem vantagens únicas para o comércio regional que pouquíssimas pessoas aproveitam.",c:"O Paraguai tem o regime tributário mais baixo do Mercosul para importações e exportações. O regime de maquila permite fabricar com benefícios fiscais especiais. Ciudad del Este é o terceiro polo de compras livre do mundo.\n\nPara o empreendedor brasileiro isso significa: possibilidades de triangular comércio entre Brasil, Argentina e o resto do mundo com vantagens que outros países não têm.\n\nNegócios que funcionam nesse contexto: importação e revenda, serviços de logística, e-commerce regional, representação de marcas estrangeiras.\n\nO conhecimento dessas vantagens é por si só um ativo competitivo.",d:"O Paraguai é o 5º exportador mundial de soja e o 6º de energia elétrica — com apenas 7 milhões de habitantes.",a:"Este mês pesquisa um produto ou serviço que poderia triangular entre o Brasil e o Paraguai."},
    21:{g:"O plano financeiro para 5 anos não é para ricos. É o mapa que separa quem chega de quem nunca começa.",c:"Um plano financeiro pessoal para 5 anos tem três componentes: onde você está hoje (diagnóstico), onde quer estar em 5 anos (objetivos concretos com números), como vai chegar lá (ações anuais específicas).\n\nNão precisa ser perfeito. Precisa existir. As pessoas com um plano financeiro escrito acumulam significativamente mais do que as que não têm nenhum.\n\nO plano é revisado uma vez por ano e ajustado conforme o que aconteceu. A vida muda, o plano também.\n\nEste é o último passo da Academia Hendy. Se chegou até aqui, você já tem mais educação financeira do que 90% das pessoas.",d:"Pessoas com um plano financeiro escrito acumulam em média 2,5 vezes mais patrimônio do que as que não têm nenhum.",a:"Este mês escreve no papel: onde você está hoje em dinheiro, onde quer estar em 5 anos, e uma ação concreta para o próximo mês."},
  };
  for(let k in extras){LESSON_PT[k]=extras[k];}
}

const LESSON_CONTENT = LESSON_ES;
function getLessonContent(id, lang){ return (lang==="pt" ? LESSON_PT[id] : LESSON_ES[id]) || LESSON_ES[1]; }

const BADGES = [
  {id:"p1",emoji:"🌱",tES:"Primera chispa",tPT:"Primeira faísca",dES:"Completaste tu primera lección",dPT:"Concluiu sua primeira lição",req:function(c){return c>=1;}},
  {id:"r3",emoji:"🔥",tES:"Racha de 3",tPT:"Sequência de 3",dES:"3 días seguidos aprendiendo",dPT:"3 dias seguidos aprendendo",req:function(c,s){return s>=3;}},
  {id:"mi",emoji:"⚡",tES:"A mitad de camino",tPT:"Na metade do caminho",dES:"Completaste más de la mitad",dPT:"Concluiu mais da metade",req:function(c){return c>=11;}},
  {id:"mc",emoji:"💪",tES:"Mente clara",tPT:"Mente clara",dES:"Respondiste sobre tus deudas",dPT:"Respondeu sobre suas dívidas",req:function(c,s,u){return !!u;}},
  {id:"r7",emoji:"🏅",tES:"Una semana seguida",tPT:"Uma semana seguida",dES:"7 días de racha",dPT:"7 dias de sequência",req:function(c,s){return s>=7;}},
  {id:"gr",emoji:"🎓",tES:"Graduado Hendy",tPT:"Graduado Hendy",dES:"Completaste todas las lecciones",dPT:"Concluiu todas as lições",req:function(c){return c>=21;}},
];

const DIAG = {
  hendy_total:{deudas_criticas:{casa:{score:18,titulo:"En el punto más difícil — pero no el final.",resumen:"Tu situación es dura y lo sabés. Las deudas pesan y llegar a fin de mes parece imposible. Pero el hecho de que estés acá ya dice mucho.",fortaleza:"Reconocés tu realidad sin escaparte de ella. Esa honestidad es el primer ingrediente para cambiar.",riesgo:"Con deudas que asfixian y sin llegar a fin de mes, cualquier imprevisto puede empeorar todo.",primer_paso:"Este mes anotá todas tus deudas con el monto exacto. Solo verlas juntas ya es el primer paso."},emprender:{score:22,titulo:"Sueño grande, momento difícil — se puede.",resumen:"Querés emprender pero las deudas frenan todo. No es imposible, pero necesitás un plan que arranque desde donde estás.",fortaleza:"Tener el sueño de emprender en el momento más difícil dice que tenés visión.",riesgo:"Emprender sin estabilidad básica puede sumar más presión. Primero la base.",primer_paso:"Anotá una sola idea de negocio simple que puedas arrancar con menos de 100.000 guaraníes."},tranquilidad:{score:20,titulo:"Querés paz — y es posible conseguirla.",resumen:"Tu meta más urgente es salir de las deudas y tener tranquilidad. Es la meta más honesta y poderosa que podés tener ahora.",fortaleza:"Reconocer que querés tranquilidad antes que crecimiento te pone en el camino correcto.",riesgo:"Sin un plan concreto de pago, las deudas crecen solas.",primer_paso:"Hablá con uno de tus acreedores este mes y pedí un plan de pago."},libertad:{score:19,titulo:"La libertad empieza por ordenar lo de adentro.",resumen:"Soñás con crecer, pero las deudas son el primer obstáculo real. La libertad financiera empieza por dentro.",fortaleza:"Tener metas grandes en el peor momento significa que no te rendiste.",riesgo:"Ignorar la situación actual para enfocarse solo en el sueño puede empeorar todo.",primer_paso:"Este mes calculás exactamente cuánto debés en total. Un número concreto."}},deudas_manejables:{casa:{score:30,titulo:"Ajustado pero con rumbo — eso cambia todo.",resumen:"No llegar a fin de mes con deudas manejables es difícil pero solucionable.",fortaleza:"Que las deudas sean manejables significa que todavía tenés control.",riesgo:"Sin cambiar el patrón de gasto, el mes que viene va a ser igual.",primer_paso:"Anotá los 3 gastos más grandes del mes y mirá cuál podés reducir un 10%."},emprender:{score:28,titulo:"El negocio puede ser tu salida — con orden.",resumen:"Querés emprender y tenés deudas manejables. Puede funcionar si el negocio mejora el ingreso sin sumar riesgo.",fortaleza:"Ver el emprendimiento como salida financiera es pensar como empresario.",riesgo:"Un negocio nuevo suma gastos antes de generar ingresos.",primer_paso:"Calculás cuánto necesitás para vivir un mes básico. Esa es tu red de seguridad mínima."},tranquilidad:{score:32,titulo:"La tranquilidad está más cerca de lo que creés.",resumen:"Con deudas manejables y el objetivo de tranquilizarte, tenés una combinación que puede resolverse en 90 días.",fortaleza:"Reconocer que querés tranquilidad antes que crecimiento es una decisión madura.",riesgo:"La tranquilidad sin fondo de emergencia dura poco.",primer_paso:"Calculás cuánto pagarías de más si cancelás la deuda más chica antes. Empezás por esa."},libertad:{score:29,titulo:"Libertad con base sólida — ese es el camino.",resumen:"Soñás en grande con una situación difícil. La clave es construir la base sin abandonar el sueño.",fortaleza:"Combinar ambición con consciencia de tu situación es exactamente lo que hace falta.",riesgo:"Moverse hacia la libertad sin resolver lo urgente puede terminar en más deudas.",primer_paso:"Este mes definís una meta financiera concreta para los próximos 3 meses."}},sin_deudas:{casa:{score:48,titulo:"Sin deudas y con meta — vas bien.",resumen:"No llegar a fin de mes pero estar libre de deudas es una situación especial. El problema es el gasto, no el pasado.",fortaleza:"Vivir sin deudas cuando el dinero ajusta requiere disciplina real.",riesgo:"Sin deudas pero sin ahorro, cualquier gasto grande obliga a endeudarse.",primer_paso:"Calculás cuánto necesitás ahorrar por mes para la cuota inicial de una casa en 2 años."},emprender:{score:50,titulo:"Sin deudas y con visión — la base está.",resumen:"Libre de deudas y con ganas de emprender es uno de los mejores puntos de partida posibles.",fortaleza:"Emprender sin deudas significa que el negocio no nace con carga.",riesgo:"Sin capital inicial, emprender puede requerir endeudarse.",primer_paso:"Este mes anotás el costo total de arrancar tu negocio."},tranquilidad:{score:52,titulo:"La tranquilidad está más cerca de lo que creés.",resumen:"Sin deudas y buscando tranquilidad, tu situación tiene una base sólida. Solo falta construir sobre ella.",fortaleza:"Cero deudas es el activo más valioso que podés tener ahora.",riesgo:"Sin ahorro de emergencia, la tranquilidad es frágil.",primer_paso:"Este mes abrís un lugar separado y ponés aunque sea el 5% de tu ingreso."},libertad:{score:51,titulo:"Sin deudas y soñando en grande — perfecto.",resumen:"La libertad financiera sin deudas de por medio es un camino más corto.",fortaleza:"Cero deudas con metas grandes es la combinación ideal.",riesgo:"La libertad financiera requiere ingresos crecientes o activos.",primer_paso:"Este mes investigás una fuente de ingreso adicional sin inversión inicial."}},deuda_chica:{casa:{score:38,titulo:"Casi limpio — y con una meta clara.",resumen:"Llegás justo pero tenés solo una deuda pequeña y una meta concreta.",fortaleza:"Una sola deuda pequeña cuando la situación es difícil es un logro real.",riesgo:"Sin cancelar esa deuda chica pronto, puede crecer o distraerte.",primer_paso:"Calculás cuándo podés cancelar esa deuda de una vez."},emprender:{score:40,titulo:"Un paso de empezar — literal.",resumen:"Con una sola deuda pequeña y ganas de emprender, estás en un punto de arranque real.",fortaleza:"Casi sin deudas queriendo emprender es una posición envidiable.",riesgo:"Emprender con ingresos ajustados requiere retorno rápido.",primer_paso:"Cancelás la deuda chica primero — aunque tarde un mes más."},tranquilidad:{score:42,titulo:"La tranquilidad está a un paso.",resumen:"Casi sin deudas y buscando tranquilidad, tu situación es mejor de lo que parece.",fortaleza:"Haber reducido tus deudas a una sola pequeña es disciplina real.",riesgo:"Sin fondo de emergencia, la tranquilidad puede irse al primer problema.",primer_paso:"Cuando canceles la deuda, ese mismo monto mensual va a emergencias."},libertad:{score:39,titulo:"Casi libre — y lo sabés.",resumen:"Una deuda chica no te frena. Con orden, la libertad está más cerca que el promedio.",fortaleza:"Soñar en grande con casi cero deudas es una combinación poderosa.",riesgo:"Sin ingresos estables, la libertad financiera es difícil de mantener.",primer_paso:"Este mes definís qué significa libertad financiera para vos en números concretos."}}},
  ajustado:{deudas_criticas:{casa:{score:35,titulo:"Ajustado con peso encima — pero hay salida.",resumen:"Llegás pero las deudas te comen el margen. La buena noticia es que llegás.",fortaleza:"Llegar a fin de mes con deudas encima requiere habilidad real.",riesgo:"Sin margen, cualquier mes malo puede romper el equilibrio.",primer_paso:"Listás todas tus deudas con el monto y la tasa. La más cara va primero."},emprender:{score:33,titulo:"El emprendimiento puede ser la salida — con plan.",resumen:"Ajustado con deudas pero queriendo emprender. El camino es posible si el negocio genera flujo rápido.",fortaleza:"Ver el emprendimiento como solución es pensar estratégicamente.",riesgo:"Un negocio que no genera en 3 meses puede hundir una situación ya ajustada.",primer_paso:"Pensás en un servicio que podés ofrecer este mes con lo que ya sabés hacer."},tranquilidad:{score:36,titulo:"La tranquilidad es posible — en 90 días.",resumen:"Ajustado con deudas pero con el objetivo claro de tranquilizarte.",fortaleza:"Priorizar la tranquilidad sobre el crecimiento cuando estás ajustado es inteligente.",riesgo:"Sin atacar las deudas activamente, la tranquilidad se sigue alejando.",primer_paso:"Llamás a uno de tus acreedores y pedís renegociar la cuota."},libertad:{score:34,titulo:"Libertad grande, base por construir.",resumen:"Soñás con libertad financiera desde un punto ajustado con deudas. El sueño es válido — la base necesita trabajo.",fortaleza:"Mantener la visión de libertad cuando la situación aprieta es lo que separa a los que progresan.",riesgo:"Sin resolver lo urgente, la libertad puede tardar mucho más.",primer_paso:"Este mes separás lo urgente de lo importante. Las deudas son urgentes."}},sin_deudas:{casa:{score:55,titulo:"Ajustado y limpio — muy buen punto.",resumen:"Llegás a fin de mes sin deudas. Eso es más de lo que tiene la mitad de la gente.",fortaleza:"Vivir ajustado sin endeudarse requiere disciplina real.",riesgo:"Sin ahorro activo, la casa propia puede sentirse siempre lejana.",primer_paso:"Calculás cuánto necesitás para la cuota inicial y dividís entre 24 meses."},emprender:{score:57,titulo:"Base limpia para empezar algo propio.",resumen:"Ajustado pero sin deudas y con visión de emprender. La combinación correcta.",fortaleza:"Sin deudas tenés libertad de movimiento.",riesgo:"Emprender con ingresos ajustados requiere ser lean desde el día uno.",primer_paso:"Este mes validás tu idea con 5 personas reales."},tranquilidad:{score:58,titulo:"Tranquilidad al alcance — un fondo es todo.",resumen:"Sin deudas y llegando a fin de mes, la tranquilidad depende de un solo paso.",fortaleza:"Llegar sin deudas ya es tranquilidad parcial.",riesgo:"Un mes de emergencias sin fondo puede obligarte a endeudarte.",primer_paso:"Este mes empezás a guardar el 5% de tu ingreso en un lugar separado."},libertad:{score:56,titulo:"Sin deudas y soñando — la base está.",resumen:"Ajustado pero limpio con metas de libertad. Estás construyendo sobre terreno firme.",fortaleza:"La libertad financiera sin deudas es más alcanzable de lo que se cree.",riesgo:"Los ingresos ajustados limitan la velocidad de crecimiento.",primer_paso:"Este mes investigás una habilidad tuya que podría generar ingreso extra."}},deudas_manejables:{casa:{score:44,titulo:"Manejable y con meta concreta — bien.",resumen:"Ajustado con deudas controladas y la meta de tener casa propia.",fortaleza:"Tener deudas manejables mientras llegás a fin de mes muestra que sabés administrarte.",riesgo:"Sin cancelar las deudas primero, ahorrar para la casa cuesta el doble.",primer_paso:"Calculás en cuántos meses podés cancelar todas tus deudas."},emprender:{score:42,titulo:"Casi listo para arrancar — falta la base.",resumen:"Ajustado con deudas manejables y ganas de emprender. Con un plan de 6 meses el escenario puede cambiar.",fortaleza:"Querer emprender con las deudas bajo control muestra que entendés que necesitás una base.",riesgo:"Emprender antes de cancelar las deudas divide tu energía.",primer_paso:"Hacés una lista de todo lo que necesitarías para emprender y el costo de cada cosa."},tranquilidad:{score:46,titulo:"Tranquilidad en construcción — va bien.",resumen:"Con deudas manejables y el objetivo de tranquilizarte, el camino es claro.",fortaleza:"Priorizar la tranquilidad cuando tenés deudas es la decisión correcta.",riesgo:"Sin un plan de pago activo, las deudas manejables pueden volverse problemáticas.",primer_paso:"Este mes destinás un monto fijo extra a la deuda más pequeña."},libertad:{score:43,titulo:"Libertad con plan — es posible.",resumen:"Ajustado, con deudas controladas y soñando con libertad.",fortaleza:"Ver la libertad como meta mientras gestionás deudas muestra madurez financiera.",riesgo:"La libertad financiera requiere primero estabilidad.",primer_paso:"Este mes definís qué significa exactamente libertad financiera para vos."}},deuda_chica:{casa:{score:50,titulo:"Casi listo para el gran paso.",resumen:"Ajustado con una deuda chica y la meta de casa propia.",fortaleza:"Reducir las deudas a una sola pequeña mientras llegás a fin de mes es un logro.",riesgo:"Sin acelerar el ahorro después de cancelar la deuda, el objetivo puede dilatarse.",primer_paso:"Calculás cuánto antes podés cancelar la deuda si le ponés un monto extra."},emprender:{score:52,titulo:"A un paso del arranque.",resumen:"Una deuda chica y ganas de emprender. Cancelás eso primero y tenés el escenario ideal.",fortaleza:"Casi sin deudas queriendo emprender — estás en la posición que muchos quisieran.",riesgo:"La impaciencia de emprender antes de cerrar esa deuda puede complicar el arranque.",primer_paso:"Ponés una fecha para cancelar la deuda y otra para arrancar el negocio."},tranquilidad:{score:54,titulo:"La tranquilidad está a la vuelta.",resumen:"Con una deuda chica y buscando tranquilidad, estás muy cerca.",fortaleza:"Haber reducido todo a una deuda pequeña es resultado de trabajo real.",riesgo:"Celebrar antes de tener el fondo de emergencia puede dejarte expuesto.",primer_paso:"Cuando canceles la deuda, ese mismo monto mensual pasa a emergencias."},libertad:{score:51,titulo:"Un paso de ser completamente libre.",resumen:"Una deuda chica y la meta de libertad financiera. El escenario es muy bueno.",fortaleza:"Ver la libertad como meta con casi cero deudas es exactamente el estado correcto.",riesgo:"La libertad real requiere ingresos crecientes además de deudas cero.",primer_paso:"Este mes investigás cómo aumentar tus ingresos aunque sea un 10%."}}},
  estable:{sin_deudas:{casa:{score:68,titulo:"Estable y limpio — el momento es ahora.",resumen:"Cubrís gastos sin deudas y con meta de casa propia. Estás en el mejor punto para empezar a ahorrar.",fortaleza:"La estabilidad sin deudas es la plataforma perfecta para construir patrimonio.",riesgo:"Sin acelerar el ahorro ahora que la situación es favorable, el tiempo puede jugarte en contra.",primer_paso:"Este mes abrís una cuenta exclusiva para la casa y hacés el primer depósito."},emprender:{score:70,titulo:"El momento ideal para arrancar.",resumen:"Estable, sin deudas y queriendo emprender. Difícilmente vas a tener un escenario mejor.",fortaleza:"Emprender desde la estabilidad y sin deudas multiplica las chances de éxito.",riesgo:"La comodidad de la estabilidad puede frenar el primer paso.",primer_paso:"Este mes definís la fecha de lanzamiento de tu negocio en el calendario."},tranquilidad:{score:72,titulo:"La tranquilidad ya es tuya — solo falta asegurarla.",resumen:"Estable y sin deudas buscando tranquilidad. Estás muy cerca.",fortaleza:"Alcanzar estabilidad sin deudas con consciencia de que querés tranquilidad es sabiduría financiera.",riesgo:"La tranquilidad sin fondo de emergencia depende de que nada salga mal.",primer_paso:"Este mes calculás 3 meses de tus gastos básicos. Esa es tu meta del fondo."},libertad:{score:69,titulo:"Estable hoy, libre mañana — el camino está.",resumen:"Estabilidad sin deudas con metas de libertad. La base está construida.",fortaleza:"Alcanzar estabilidad sin deudas ya es libertad parcial.",riesgo:"La libertad financiera total requiere activos que generen ingresos.",primer_paso:"Este mes investigás una inversión simple con bajo riesgo para empezar."}},deudas_manejables:{casa:{score:58,titulo:"Bien encaminado — con un ajuste final.",resumen:"Estable con deudas manejables y meta de casa.",fortaleza:"Manejar deudas mientras cubrís gastos es una habilidad concreta.",riesgo:"Ahorrar para la casa mientras pagás deudas divide el esfuerzo.",primer_paso:"Calculás en cuánto tiempo cancelás las deudas si las priorizás."},emprender:{score:60,titulo:"Estable con plan — casi listo.",resumen:"Estabilidad con deudas manejables y visión de emprender.",fortaleza:"Querer emprender desde la estabilidad con deudas bajo control es la posición correcta.",riesgo:"Emprender mientras pagás deudas divide el capital disponible.",primer_paso:"¿Cuánto antes emprendés si cancelás las deudas primero? Hacés ese cálculo."},tranquilidad:{score:62,titulo:"La tranquilidad está cerca — último paso.",resumen:"Estable, con deudas manejables y buscando tranquilidad.",fortaleza:"Buscar tranquilidad cuando la situación es estable es construir sobre lo que funciona.",riesgo:"Las deudas manejables de hoy pueden volverse difíciles si la situación cambia.",primer_paso:"Este mes acelerás el pago de la deuda más pequeña."},libertad:{score:59,titulo:"Estable y con visión — bien posicionado.",resumen:"Estabilidad con deudas controladas y metas de libertad.",fortaleza:"La libertad financiera desde la estabilidad es mucho más alcanzable que desde el caos.",riesgo:"Las deudas frenan la acumulación de capital necesaria para la libertad.",primer_paso:"Este mes definís en qué orden atacás las deudas."}},deuda_chica:{casa:{score:63,titulo:"Muy cerca del siguiente nivel.",resumen:"Estable, casi sin deudas y con meta de casa.",fortaleza:"Llegar a una sola deuda pequeña desde la estabilidad es un recorrido exitoso.",riesgo:"Sin cancelar esa deuda pronto, puede postergarse indefinidamente.",primer_paso:"Calculás cuánto antes podés cancelar esa deuda con un extra."},emprender:{score:65,titulo:"Listo para el siguiente capítulo.",resumen:"Estable, con deuda mínima y ganas de emprender.",fortaleza:"Una sola deuda pequeña con estabilidad es el punto de partida perfecto.",riesgo:"La impaciencia puede llevar a emprender antes de cerrar esa deuda.",primer_paso:"Cerrás la deuda primero. Después definís la fecha de lanzamiento."},tranquilidad:{score:66,titulo:"La tranquilidad está a días de distancia.",resumen:"Estable, casi sin deudas y buscando tranquilidad. Estás a semanas de conseguirla.",fortaleza:"Haber llegado a este punto demuestra que podés ejecutar un plan.",riesgo:"Relajarse antes de tener el fondo completo puede dejar una vulnerabilidad.",primer_paso:"Cerrás la deuda chica y el mes siguiente arrancás el fondo de emergencia."},libertad:{score:64,titulo:"Un paso de ser completamente libre.",resumen:"Estable, casi sin deudas y con metas de libertad.",fortaleza:"Casi cero deudas con visión de libertad es el estado mental ganador.",riesgo:"La libertad real requiere ingresos que crezcan además de deudas que desaparezcan.",primer_paso:"Este mes investigás cómo invertir el monto que hoy pagás de deuda."}},deudas_criticas:{casa:{score:45,titulo:"Estable pero con una carga que liberar.",resumen:"Cubrís gastos pero las deudas pesan. La estabilidad es un punto de apoyo real.",fortaleza:"Ser estable con deudas que asfixian es resistencia real.",riesgo:"La estabilidad puede dar falsa tranquilidad mientras las deudas crecen solas.",primer_paso:"Identificás la deuda con mayor interés y calculás cuánto te cuesta por mes no pagarla."},emprender:{score:43,titulo:"Estabilidad más deudas más sueño — hay orden.",resumen:"Querés emprender desde la estabilidad pero con deudas pesadas. Primero las deudas.",fortaleza:"Mantener estabilidad con deudas fuertes ya es un logro.",riesgo:"Emprender con deudas que asfixian puede colapsar la estabilidad actual.",primer_paso:"Calculás cuánto tiempo necesitás para dejar las deudas en manejables."},tranquilidad:{score:46,titulo:"La tranquilidad requiere atacar las deudas.",resumen:"Estable pero con deudas que asfixian buscando tranquilidad. Hay que atacar las deudas.",fortaleza:"Reconocer que las deudas son el obstáculo principal es el diagnóstico correcto.",riesgo:"Ignorar las deudas esperando que mejoren solas solo aumenta la distancia.",primer_paso:"Este mes llamás a tus acreedores y renegociás las condiciones."},libertad:{score:44,titulo:"La libertad pasa primero por las deudas.",resumen:"Estable con deudas que pesan y soñando con libertad. El camino requiere orden claro.",fortaleza:"Tener visión de libertad con deudas fuertes pero estabilidad muestra que no perdiste el norte.",riesgo:"Sin atacar las deudas directamente, la libertad puede tardar décadas.",primer_paso:"Este mes armás un plan de ataque de deudas: de la más cara a la más barata."}}},
  creciendo:{sin_deudas:{casa:{score:82,titulo:"Creciendo y limpio — el momento es ahora.",resumen:"Ahorrás, no tenés deudas y querés casa propia. Estás en el mejor escenario posible.",fortaleza:"Crecer financieramente sin deudas es el resultado de decisiones consistentes.",riesgo:"Sin un plan específico para la casa, el ahorro puede irse a otras cosas.",primer_paso:"Este mes abrís una cuenta exclusiva para la casa y calculás la fecha de compra."},emprender:{score:85,titulo:"Listo para el siguiente nivel.",resumen:"Creciendo sin deudas y con ganas de emprender. Este es el escenario ideal.",fortaleza:"Emprender desde el crecimiento y sin deudas multiplica las probabilidades de éxito.",riesgo:"La sobreconfianza en un buen momento puede llevar a no planificar bien.",primer_paso:"Este mes definís la fecha de lanzamiento, el producto mínimo y el primer cliente."},tranquilidad:{score:84,titulo:"Creciendo y en paz — el objetivo está cumplido.",resumen:"Ahorrás, no tenés deudas y buscás tranquilidad. Probablemente ya la tenés.",fortaleza:"Crecer sin deudas buscando tranquilidad es la combinación más sólida que existe.",riesgo:"La tranquilidad real requiere un fondo de emergencia sólido.",primer_paso:"Este mes verificás que tenés al menos 3 meses de gastos guardados."},libertad:{score:83,titulo:"En camino directo a la libertad financiera.",resumen:"Creciendo, sin deudas y con meta de libertad. Estás exactamente donde tenés que estar.",fortaleza:"La libertad financiera desde el crecimiento y sin deudas no es un sueño — es un plan.",riesgo:"La libertad requiere ingresos pasivos o activos que trabajen por vos.",primer_paso:"Este mes investigás la primera inversión concreta que podés hacer."}},deudas_manejables:{casa:{score:68,titulo:"Creciendo con deudas — casi perfecto.",resumen:"Ahorrás con deudas manejables y meta de casa.",fortaleza:"Crecer mientras gestionás deudas demuestra capacidad real de administración.",riesgo:"Las deudas frenan la velocidad de acumulación para la casa.",primer_paso:"Calculás si conviene más acelerar el pago de deudas o aumentar el ahorro."},emprender:{score:70,titulo:"Creciendo y listo para emprender — casi.",resumen:"La combinación de crecimiento con deudas manejables y visión emprendedora es muy fuerte.",fortaleza:"Emprender desde el crecimiento con deudas bajo control es un punto privilegiado.",riesgo:"Las deudas consumen capital que podría ir al negocio.",primer_paso:"Hacés el plan financiero del negocio incluyendo cómo afectan las deudas."},tranquilidad:{score:72,titulo:"Creciendo hacia la tranquilidad total.",resumen:"Crecimiento con deudas controladas buscando tranquilidad.",fortaleza:"Crecer mientras gestionás deudas y apuntás a la tranquilidad es ejecutar todo a la vez.",riesgo:"La tranquilidad real llega cuando las deudas desaparecen.",primer_paso:"Este mes calculás la fecha exacta en que quedás libre de deudas."},libertad:{score:69,titulo:"Creciendo hacia la libertad — muy bien posicionado.",resumen:"Crecimiento con deudas manejables y visión de libertad.",fortaleza:"Crecer financieramente mientras apuntás a la libertad total es la actitud correcta.",riesgo:"Las deudas frenan la libertad aunque sean manejables.",primer_paso:"Armás un calendario: fecha de cero deudas y fecha de primera inversión."}},deudas_criticas:{casa:{score:52,titulo:"Creciendo a pesar de todo — respeto.",resumen:"Ahorrás con deudas que asfixian. Eso muestra una fuerza real.",fortaleza:"Crecer con deudas pesadas es algo que muy poca gente logra.",riesgo:"Las deudas con altos intereses pueden crecer más rápido que tus ahorros.",primer_paso:"Este mes comparás la tasa de tus deudas vs el rendimiento de tus ahorros."},emprender:{score:50,titulo:"Capacidad de crecer — ahora con orden.",resumen:"Si crecés con deudas pesadas, imaginá lo que podés hacer sin ellas.",fortaleza:"Crecer con deudas que asfixian demuestra capacidad empresarial concreta.",riesgo:"Emprender con deudas fuertes puede desestabilizar hasta el crecimiento que ya lograste.",primer_paso:"Calculás cuánto capital liberarías por mes si resolvieras las deudas."},tranquilidad:{score:53,titulo:"Crecés pero las deudas frenan la paz.",resumen:"Crecimiento con deudas que asfixian buscando tranquilidad.",fortaleza:"Buscar tranquilidad cuando crecés con deudas pesadas es sabiduría pura.",riesgo:"Crecer e ignorar las deudas pesadas es como correr con una mochila llena.",primer_paso:"Destinás toda la capacidad de ahorro extra a atacar la deuda con mayor tasa."},libertad:{score:51,titulo:"Potencial de libertad — primero orden.",resumen:"Crecés con deudas fuertes y visión de libertad. El potencial es enorme.",fortaleza:"Crecer con deudas pesadas y visión de libertad demuestra resiliencia y ambición.",riesgo:"La libertad con deudas de altos intereses requiere primero vencer esas deudas.",primer_paso:"Armás un plan de ataque de deudas de 6 meses."}},deuda_chica:{casa:{score:74,titulo:"A un cierre de estar en el nivel ideal.",resumen:"Creciendo, con deuda mínima y meta de casa.",fortaleza:"Crecer con solo una deuda chica es resultado de trabajo muy bien hecho.",riesgo:"Cuanto antes cierres esa deuda, antes el 100% va a la casa.",primer_paso:"Calculás si conviene cancelar la deuda de una vez o seguir las cuotas."},emprender:{score:76,titulo:"Casi en el punto ideal para arrancar.",resumen:"Creciendo con deuda mínima y ganas de emprender.",fortaleza:"Una sola deuda pequeña con crecimiento y visión emprendedora es la combinación ganadora.",riesgo:"La impaciencia puede hacer que pases por alto esa deuda.",primer_paso:"Ponés una fecha para cancelar la deuda y otra para arrancar el negocio."},tranquilidad:{score:77,titulo:"La tranquilidad ya es casi tuya.",resumen:"Creciendo con una deuda mínima buscando tranquilidad.",fortaleza:"Haber llegado a este punto demuestra que ejecutás bien los planes.",riesgo:"Relajarse antes de cerrar esa deuda chica y tener el fondo completo sería el único error.",primer_paso:"Este mes cerrás la deuda si podés, y el mes siguiente arrancás el fondo."},libertad:{score:75,titulo:"Un paso de la libertad financiera total.",resumen:"Creciendo, casi sin deudas y con meta de libertad.",fortaleza:"Casi cero deudas con visión de libertad es exactamente el estado mental ganador.",riesgo:"El único riesgo es no capitalizar este momento con una inversión concreta.",primer_paso:"Este mes investigás la primera inversión en un activo que podés hacer ahora."}}},
};

// Score dinámico: diagnóstico base + bonus por lecciones completadas → max 100
function calcScore(diagScore, completedCount) {
  if(!diagScore) return 0;
  var base = diagScore || 0;
  var bonus = Math.round((100 - base) * (completedCount / 21));
  return Math.min(100, base + bonus);
}

const SITUACION_SCORE = {hendy_total:15, ajustado:42, estable:68, creciendo:90};
const DEUDA_SCORE = {deudas_criticas:18, deudas_manejables:50, deuda_chica:75, sin_deudas:100};

// Desglose del Hendy Score por categoría — Gastos / Ahorro / Deudas / Educación / Objetivos
function calcBreakdown(userData, completedCount, goal){
  var a = (userData && userData.answers) || {};
  var gastos = SITUACION_SCORE[a.situacion] != null ? SITUACION_SCORE[a.situacion] : 40;
  var deudas = DEUDA_SCORE[a.deuda] != null ? DEUDA_SCORE[a.deuda] : 50;
  var ahorro = goal && goal.objetivo > 0
    ? Math.min(100, Math.round(((goal.ahorrado||0)/goal.objetivo)*100))
    : Math.round(gastos*0.5);
  var educacion = Math.round((completedCount/21)*100);
  var objetivos = goal ? 65 : (userData ? 35 : 5);
  return {gastos:gastos, ahorro:ahorro, deudas:deudas, educacion:educacion, objetivos:objetivos};
}

const DIAG_PT = {
  hendy_total:{
    deudas_criticas:{
      casa:{score:18,titulo:"No ponto mais difícil — mas não é o fim.",resumen:"Sua situação é pesada e você sabe disso. As dívidas sufocam e chegar ao fim do mês parece impossível. Mas o fato de você estar aqui buscando respostas já diz muito sobre quem você é.",fortaleza:"Você enfrenta sua realidade sem fugir dela. Essa honestidade brutal é o primeiro ingrediente para mudar de verdade.",riesgo:"Com dívidas que sufocam e sem chegar ao fim do mês, qualquer imprevisto pode piorar tudo. A urgência é real.",primer_paso:"Este mês anota no papel todas as suas dívidas com o valor exato. Só vê-las juntas já é o primeiro passo."},
      emprender:{score:22,titulo:"Sonho grande, momento difícil — é possível.",resumen:"Você quer empreender mas as dívidas e a situação atual travam tudo. Não é impossível, mas precisa de um plano que comece de onde você está agora.",fortaleza:"Ter o sonho de empreender no momento mais difícil diz que você tem visão. Isso não é para qualquer um.",riesgo:"Empreender sem estabilidade básica pode somar mais pressão. Primeiro a base, depois o voo.",primer_paso:"Anota uma única ideia de negócio simples que pode começar com menos de R$200. Só uma."},
      tranquilidad:{score:20,titulo:"Você quer paz — e é possível consegui-la.",resumen:"Sua meta mais urgente é sair das dívidas e ter tranquilidade. É a meta mais honesta e poderosa que você pode ter agora.",fortaleza:"Saber que o que você mais quer é tranquilidade te coloca no caminho certo. Não é resignação — é sabedoria.",riesgo:"Sem um plano concreto de pagamento, as dívidas crescem sozinhas e a tranquilidade se afasta.",primer_paso:"Este mes fala com um dos seus credores e pede um plano de pagamento. Muitos preferem receber menos a não receber nada."},
      libertad:{score:19,titulo:"A liberdade começa por organizar o interior.",resumen:"Você sonha em crescer mas as dívidas são o primeiro obstáculo real. A liberdade financeira começa de dentro para fora.",fortaleza:"Ter metas grandes no pior momento significa que você não desistiu. Isso tem muito valor.",riesgo:"Ignorar a situação atual para focar só no grande sonho pode fazer tudo piorar.",primer_paso:"Este mês calcula exatamente quanto você deve no total. Um número concreto, não uma sensação."}
    },
    deudas_manejables:{
      casa:{score:30,titulo:"Apertado mas com rumo — isso muda tudo.",resumen:"Não chegar ao fim do mês com dívidas administráveis é uma combinação difícil mas resolvível. O problema não é sua renda — é como ela está distribuída.",fortaleza:"Que as dívidas sejam administráveis significa que você ainda tem controle. Não perdeu.",riesgo:"Sem mudar o padrão de gasto, o próximo mês vai ser igual. O ciclo se quebra com um plano, não com esperança.",primer_paso:"Anota os 3 maiores gastos do seu mês. Vê qual pode reduzir pelo menos 10% este mês."},
      emprender:{score:28,titulo:"O negócio pode ser sua saída — com ordem.",resumen:"Você quer empreender e tem dívidas administráveis. A combinação pode funcionar se o negócio ajudar a aumentar a renda sem somar risco.",fortaleza:"Ver o empreendimento como saída financeira é pensar como empresário. Isso é uma vantagem real.",riesgo:"Um negócio novo soma gastos antes de gerar receita. Você precisa de um colchão mínimo antes de começar.",primer_paso:"Calcula quanto precisa para viver um mês básico. Esse número é sua rede de segurança mínima antes de empreender."},
      tranquilidad:{score:32,titulo:"A tranquilidade está mais perto do que você pensa.",resumen:"Com dívidas administráveis e o objetivo de se tranquilizar, sua situação tem uma combinação que pode se resolver em 90 dias com um plano.",fortaleza:"Reconhecer que quer tranquilidade antes que crescimento é uma decisão madura e estratégica.",riesgo:"A tranquilidade sem um fundo de emergência dura pouco. O próximo imprevisto pode desestabilizar tudo.",primer_paso:"Calcula quanto pagaria a mais se quitasse uma dívida pequena antes do prazo. Começa pela menor."},
      libertad:{score:29,titulo:"Liberdade com base sólida — esse é o caminho.",resumen:"Você sonha em grande com uma situação difícil. A chave é construir a base sem abandonar o sonho.",fortaleza:"Combinar ambição com consciência da sua situação atual é exatamente o que é necessário para avançar.",riesgo:"Mover-se em direção à liberdade sem resolver o urgente pode acabar em mais dívidas e menos liberdade.",primer_paso:"Este mês define uma meta financeira concreta para os próximos 3 meses. Um número, uma data."}
    },
    deuda_chica:{
      casa:{score:38,titulo:"Quase limpo — e com uma meta clara.",resumen:"Você chega apertado mas tem só uma dívida pequena e uma meta concreta. Está mais perto do que sente.",fortaleza:"Ter uma única dívida pequena numa situação difícil é uma conquista real. Muita gente não chega aqui.",riesgo:"Sem quitar essa dívida logo, pode se postergar e roubar margem para poupar para a casa.",primer_paso:"Calcula quando pode quitar essa dívida de uma vez se colocar um valor extra este mês."},
      emprender:{score:40,titulo:"Um passo para começar — literalmente.",resumen:"Com uma única dívida pequena e vontade de empreender, você está num ponto de partida real.",fortaleza:"Quase sem dívidas querendo empreender — você está na posição que muitos empreendedores gostariam de estar.",riesgo:"A impaciência pode levar a empreender antes de fechar essa dívida. Esse mês de espera vale a pena.",primer_paso:"Coloca uma data concreta para quitar a dívida e outra para começar o negócio. As duas no papel."},
      tranquilidad:{score:42,titulo:"A tranquilidade está a um passo.",resumen:"Quase sem dívidas e buscando tranquilidade. Você está muito perto — um par de meses de disciplina e chega lá.",fortaleza:"Ter reduzido tudo a uma dívida pequena é resultado de trabalho real. Não aconteceu sozinho.",riesgo:"Comemorar antes de ter o fundo de emergência completo pode te deixar vulnerável ao primeiro imprevisto.",primer_paso:"Quando quitar a dívida, esse mesmo valor mensal vai automaticamente para o fundo de emergências."},
      libertad:{score:39,titulo:"Quase livre — e você sabe disso.",resumen:"Uma dívida pequena não te frena. Com ordem e clareza, a liberdade está mais perto que a média das pessoas.",fortaleza:"Sonhar grande com quase zero dívidas é uma combinação poderosa. Você está construindo sobre base real.",riesgo:"Sem renda crescente, a liberdade financeira é difícil de manter mesmo sem dívidas.",primer_paso:"Este mês define exatamente o que significa liberdade financeira para você em números concretos."}
    },
    sin_deudas:{
      casa:{score:48,titulo:"Sem dívidas e com meta — você vai bem.",resumen:"Não chegar ao fim do mês mas estar livre de dívidas é uma situação especial. O problema é o gasto, não o passado.",fortaleza:"Viver sem dívidas quando o dinheiro aperta requer disciplina real. Isso já diz muito sobre você.",riesgo:"Sem dívidas mas sem poupança, qualquer gasto grande obriga a se endividar novamente.",primer_paso:"Calcula quanto precisa poupar por mês para a entrada de uma casa em 2 anos. Um número real."},
      emprender:{score:50,titulo:"Sem dívidas e com visão — a base está.",resumen:"Livre de dívidas e com vontade de empreender é um dos melhores pontos de partida possíveis.",fortaleza:"Empreender sem dívidas significa que o negócio não nasce com peso. A liberdade de movimento é real.",riesgo:"Sem capital inicial, empreender pode exigir se endividar. Planeja isso antes de começar.",primer_paso:"Este mes anota o custo total de começar seu negócio. Cada item, com valor exato."},
      tranquilidad:{score:52,titulo:"Sem dívidas e buscando paz — a base está.",resumen:"Sem dívidas e buscando tranquilidade, sua situação tem uma base sólida. Só falta construir sobre ela.",fortaleza:"Zero dívidas é o ativo mais valioso que você pode ter agora. Está no ponto certo.",riesgo:"Sem poupança de emergência, a tranquilidade é frágil. O próximo imprevisto pode desfazer tudo.",primer_paso:"Este mês abre um lugar separado e coloca pelo menos 5% da sua renda. Mesmo que seja pouco."},
      libertad:{score:51,titulo:"Sem dívidas e sonhando grande — perfeito.",resumen:"A liberdade financeira sem dívidas de base é um caminho mais curto. Você está no ponto de partida correto.",fortaleza:"Zero dívidas com metas grandes é a combinação ideal para construir algo real e duradouro.",riesgo:"A liberdade financeira requer rendas crescentes ou ativos. A estabilidade sozinha não basta.",primer_paso:"Este mês pesquisa uma fonte de renda adicional pequena que pode começar sem investimento."}
    }
  },
  ajustado:{
    deudas_criticas:{
      casa:{score:35,titulo:"Apertado com peso por cima — mas há saída.",resumen:"Você chega ao fim do mês mas as dívidas comem a margem. A boa notícia é que você chega.",fortaleza:"Chegar ao fim do mês com dívidas que sufocam requer uma habilidade financeira real.",riesgo:"Com dívidas fortes e sem margem, qualquer mês ruim pode romper o equilíbrio. O risco é real.",primer_paso:"Lista todas as suas dívidas com o valor e a taxa. A mais cara em juros vai primeiro."},
      emprender:{score:33,titulo:"O empreendimento pode ser sua saída — com plano.",resumen:"Apertado com dívidas mas querendo empreender. O caminho é possível se o negócio gerar fluxo rápido.",fortaleza:"Ver o empreendimento como solução e não só como sonho é pensar estrategicamente. Isso é raro.",riesgo:"Um negócio que não gera renda nos primeiros 3 meses pode afundar uma situação já apertada.",primer_paso:"Pensa num serviço que pode oferecer este mes com o que já sabe fazer. Sem investimento."},
      tranquilidad:{score:36,titulo:"A tranquilidade é possível — em 90 dias.",resumen:"Apertado com dívidas mas com o objetivo claro de se tranquilizar. Um plano de 90 dias pode mudar tudo.",fortaleza:"Priorizar a tranquilidade sobre o crescimento quando está apertado é uma decisão inteligente.",riesgo:"Sem atacar as dívidas ativamente, a tranquilidade vai continuar se afastando.",primer_paso:"Liga para um dos seus credores e pede para renegociar a parcela. Agora, não depois."},
      libertad:{score:34,titulo:"Liberdade grande, base para construir.",resumen:"Você sonha com liberdade financeira estando apertado com dívidas. O sonho é válido — a base precisa de trabalho.",fortaleza:"Manter a visão de liberdade quando a situação aperta é o que separa quem progride de quem não.",riesgo:"Sem resolver o urgente primeiro, a liberdade pode demorar muito mais do que o necessário.",primer_paso:"Este mês separa o urgente do importante. As dívidas são urgentes. A liberdade é importante."}
    },
    deudas_manejables:{
      casa:{score:44,titulo:"Administrável e com meta concreta — bem.",resumen:"Apertado com dívidas controladas e a meta de ter casa própria. O caminho existe e não é tão longo.",fortaleza:"Ter as dívidas administráveis enquanto chega ao fim do mês mostra que você sabe se organizar.",riesgo:"Sem quitar as dívidas primeiro, poupar para a casa vai custar o dobro do tempo.",primer_paso:"Calcula em quantos meses pode quitar todas as dívidas. Esse prazo é sua primeira meta."},
      emprender:{score:42,titulo:"Quase pronto para começar — falta a base.",resumen:"Apertado com dívidas administráveis e vontade de empreender. Com um plano de 6 meses o cenário pode mudar.",fortaleza:"Querer empreender com as dívidas sob controle mostra que você entende que precisa de uma base.",riesgo:"Empreender antes de quitar as dívidas divide sua energia e seu capital. Primeiro a ordem.",primer_paso:"Faz uma lista de tudo que precisaria para empreender e o custo de cada coisa."},
      tranquilidad:{score:46,titulo:"Tranquilidade em construção — vai bem.",resumen:"Com dívidas administráveis e o objetivo de se tranquilizar, o caminho é claro. Só precisa executar.",fortaleza:"Priorizar a tranquilidade antes do crescimento quando você tem dívidas é a decisão correta.",riesgo:"Sem um plano de pagamento ativo, as dívidas administráveis podem se tornar problemáticas.",primer_paso:"Este mes destina um valor fixo extra à menor dívida para quitá-la antes do prazo."},
      libertad:{score:43,titulo:"Liberdade com plano — é possível.",resumen:"Apertado, com dívidas controladas e sonhando com liberdade. O caminho existe se for construído com ordem.",fortaleza:"Ver a liberdade como meta enquanto gerencia dívidas mostra maturidade financeira real.",riesgo:"A liberdade financeira requer primeiro estabilidade. Sem ela, o sonho se afasta em vez de se aproximar.",primer_paso:"Este mês define o que significa exatamente liberdade financeira para você. Um número concreto."}
    },
    deuda_chica:{
      casa:{score:50,titulo:"Quase pronto para o grande passo.",resumen:"Apertado com uma dívida pequena e a meta de casa própria. Quite essa dívida e começa a poupar com força.",fortaleza:"Reduzir as dívidas a uma única pequena enquanto chega ao fim do mês é uma conquista real.",riesgo:"Sem quitar essa dívida logo, pode se postergar indefinidamente e atrasar anos a poupança.",primer_paso:"Calcula quanto antes pode quitar a dívida pequena se colocar um extra este mês."},
      emprender:{score:52,titulo:"A um passo do início.",resumen:"Uma dívida pequena e vontade de empreender. Quite isso primeiro e você tem o cenário ideal para começar.",fortaleza:"Quase sem dívidas querendo empreender — você está na posição que muitos empreendedores gostariam.",riesgo:"A impaciência pode levar a empreender antes de fechar essa dívida. Não faça isso.",primer_paso:"Coloca uma data concreta para quitar a dívida e outra para lançar o negócio."},
      tranquilidad:{score:54,titulo:"A tranquilidade está na esquina.",resumen:"Com uma dívida pequena buscando tranquilidade, você está muito perto. Um par de meses de disciplina e chega lá.",fortaleza:"Ter reduzido tudo a uma dívida pequena é resultado de trabalho real. Não acontece por acaso.",riesgo:"Comemorar antes de ter o fundo de emergência pode te deixar exposto ao primeiro imprevisto.",primer_paso:"Quando quitar a dívida, esse mesmo valor mensal vai automaticamente para emergências."},
      libertad:{score:51,titulo:"Um passo de ser completamente livre.",resumen:"Uma dívida pequena e a meta de liberdade financeira. O cenário é muito bom. Só falta executar.",fortaleza:"Ver a liberdade como meta com quase zero dívidas é exatamente o estado mental correto.",riesgo:"A liberdade financeira real requer renda crescente além de dívidas zero. Os dois ao mesmo tempo.",primer_paso:"Este mês pesquisa como aumentar sua renda atual pelo menos 10% nos próximos 3 meses."}
    },
    sin_deudas:{
      casa:{score:55,titulo:"Apertado e limpo — muito bom ponto.",resumen:"Você chega ao fim do mês sem dívidas. Isso é mais do que metade das pessoas tem. Agora é otimizar.",fortaleza:"Viver apertado sem se endividar requer disciplina real. Muita gente não consegue fazer isso.",riesgo:"Sem poupança ativa, a casa própria pode parecer sempre distante. O tempo joga contra você.",primer_paso:"Este mês calcula quanto precisa poupar por mês para a entrada de uma casa em 2 anos."},
      emprender:{score:57,titulo:"Base limpa para começar algo próprio.",resumen:"Apertado mas sem dívidas e com visão de empreender. A combinação certa para começar algo real.",fortaleza:"Sem dívidas você tem liberdade de movimento. Pode assumir um risco calculado sem que tudo desabe.",riesgo:"Empreender com renda apertada requer que o negócio gere retorno rápido. Precisa de clareza nisso.",primer_paso:"Este mes valida sua ideia de negócio com 5 pessoas reais. Se 3 pagariam por ela, você tem algo."},
      tranquilidad:{score:58,titulo:"Tranquilidade ao alcance — um fundo é tudo.",resumen:"Sem dívidas e chegando ao fim do mês, a tranquilidade que você busca depende de um único passo.",fortaleza:"Chegar sem dívidas já é tranquilidade parcial. Você está no meio do caminho sem saber.",riesgo:"Um mês de emergências sem fundo pode te obrigar a se endividar e voltar ao ponto de partida.",primer_paso:"Este mes começa a guardar 5% da sua renda em um lugar separado. Mesmo que seja pouco."},
      libertad:{score:56,titulo:"Sem dívidas e sonhando — a base está.",resumen:"Apertado mas limpo com metas de liberdade. Você está construindo em terreno firme.",fortaleza:"A liberdade financeira sem dívidas de base é mais alcançável do que a maioria acredita.",riesgo:"A renda apertada limita a velocidade de crescimento. Precisa pensar em como aumentá-la.",primer_paso:"Este mês pesquisa uma fonte de renda adicional pequena que pode começar sem investimento."}
    }
  },
  estable:{
    deudas_criticas:{
      casa:{score:45,titulo:"Estável mas com uma carga para liberar.",resumen:"Você cobre os gastos mas as dívidas pesam. A estabilidade é um ponto de apoio real.",fortaleza:"Ser estável com dívidas que sufocam é resistência real. Isso demonstra capacidade.",riesgo:"A estabilidade pode dar falsa tranquilidade enquanto as dívidas com juros crescem sozinhas.",primer_paso:"Este mês identifica a dívida com maior taxa de juros e calcula quanto te custa por mês não pagá-la."},
      emprender:{score:43,titulo:"Estabilidade mais dívidas mais sonho — há ordem.",resumen:"Você quer empreender a partir da estabilidade mas com dívidas pesadas. Primeiro as dívidas.",fortaleza:"Manter estabilidade com dívidas fortes já é uma conquista. Não é pouca coisa.",riesgo:"Empreender com dívidas que sufocam pode colapsar até a estabilidade atual que você conquistou.",primer_paso:"Calcula quanto tempo precisa para deixar as dívidas em administráveis. Esse é seu primeiro prazo."},
      tranquilidad:{score:46,titulo:"A tranquilidade requer atacar as dívidas.",resumen:"Estável mas com dívidas que sufocam buscando tranquilidade. A única forma de consegui-la é atacar as dívidas diretamente.",fortaleza:"Reconhecer que as dívidas são o obstáculo principal para sua tranquilidade é o diagnóstico correto.",riesgo:"Ignorar as dívidas esperando que melhorem sozinhas só aumenta a distância da tranquilidade.",primer_paso:"Este mês liga para seus credores e renegocia as condições. Proativo, não reativo."},
      libertad:{score:44,titulo:"A liberdade passa primeiro pelas dívidas.",resumen:"Estável com dívidas que pesam e sonhando com liberdade. O caminho existe mas requer ordem clara.",fortaleza:"Ter visão de liberdade com dívidas fortes mas estabilidade mostra que não perdeu o norte.",riesgo:"Sem atacar as dívidas diretamente, a liberdade financeira pode demorar décadas.",primer_paso:"Este mês monta um plano de ataque de dívidas: da mais cara à mais barata em juros."}
    },
    deudas_manejables:{
      casa:{score:58,titulo:"Bem encaminhado — com um ajuste final.",resumen:"Estável com dívidas administráveis e meta de casa. Quite as dívidas e a poupança para a casa se torna real.",fortaleza:"Gerenciar dívidas enquanto cobre os gastos e mantém estabilidade é uma habilidade financeira concreta.",riesgo:"Poupar para a casa enquanto paga dívidas divide o esforço. É mais eficiente atacar as dívidas primeiro.",primer_paso:"Calcula em quanto tempo quita todas as dívidas se as priorizar sobre a poupança para a casa."},
      emprender:{score:60,titulo:"Estável com plano — quase pronto.",resumen:"Estabilidade com dívidas administráveis e visão de empreender. Quite as dívidas e você tem o cenário ideal.",fortaleza:"Querer empreender a partir da estabilidade e com as dívidas sob controle é a posição correta.",riesgo:"Empreender enquanto paga dívidas divide o capital disponível. Um dos dois vai sofrer.",primer_paso:"Este mês faz o cálculo: quanto antes você empreende se quitar as dívidas primeiro versus agora?"},
      tranquilidad:{score:62,titulo:"A tranquilidade está perto — último passo.",resumen:"Estável, com dívidas administráveis e buscando tranquilidade. Um plano de 6 meses pode mudar tudo.",fortaleza:"Buscar tranquilidade quando a situação já é estável é construir sobre o que funciona.",riesgo:"As dívidas administráveis de hoje podem se tornar difíceis se a situação mudar. Precisa fechá-las.",primer_paso:"Este mes acelera o pagamento da menor dívida. Quitá-la dá um impulso psicológico enorme."},
      libertad:{score:59,titulo:"Estável e com visão — bem posicionado.",resumen:"Estabilidade com dívidas controladas e metas de liberdade. O mapa está claro e o caminho também.",fortaleza:"A liberdade financeira a partir da estabilidade é muito mais alcançável do que a partir do caos.",riesgo:"As dívidas, embora administráveis, freiam o acúmulo de capital necessário para a liberdade.",primer_paso:"Este mês define em que ordem ataca as dívidas e quando vai ficar livre delas."}
    },
    deuda_chica:{
      casa:{score:63,titulo:"Muito perto do próximo nível.",resumen:"Estável, quase sem dívidas e com meta de casa. Quite a dívida pequena e começa a poupar com toda a força.",fortaleza:"Chegar a uma única dívida pequena a partir da estabilidade é um percurso bem-sucedido.",riesgo:"Sem quitar essa dívida pequena logo, pode se postergar e roubar margem para a poupança.",primer_paso:"Este mês calcula quanto antes pode quitar essa dívida se colocar um extra este mês."},
      emprender:{score:65,titulo:"Pronto para o próximo capítulo.",resumen:"Estável, com dívida mínima e vontade de empreender. Você está a um passo do cenário ideal para começar.",fortaleza:"Uma única dívida pequena com estabilidade financeira é o ponto de partida perfeito para empreender.",riesgo:"A impaciência pode levar a empreender antes de fechar essa dívida. Esse mês de espera vale a pena.",primer_paso:"Quite a dívida pequena primeiro. Depois disso define a data de lançamento."},
      tranquilidad:{score:66,titulo:"A tranquilidade está a dias de distância.",resumen:"Estável, quase sem dívidas e buscando tranquilidade. Literalmente você está a semanas de consegui-la.",fortaleza:"Ter chegado a este ponto demonstra que você executa bem os planos quando decide.",riesgo:"Relaxar antes de ter o fundo de emergência completo pode deixar uma vulnerabilidade oculta.",primer_paso:"Quite a dívida pequena e no mês seguinte começa o fundo de emergência com o mesmo valor."},
      libertad:{score:64,titulo:"Um passo de ser completamente livre.",resumen:"Estável, quase sem dívidas e com metas de liberdade. O cenário é excelente. Só falta o último passo.",fortaleza:"Chegar a quase zero dívidas com visão de liberdade financeira é exatamente o estado mental vencedor.",riesgo:"A liberdade real requer renda que cresça além de dívidas que desapareçam.",primer_paso:"Este mês pesquisa como investir o valor que hoje paga de dívida uma vez que a fechar."}
    },
    sin_deudas:{
      casa:{score:68,titulo:"Estável e limpo — o momento é agora.",resumen:"Você cobre os gastos sem dívidas e com meta de casa própria. Você está no melhor ponto para poupar.",fortaleza:"A estabilidade sem dívidas é a plataforma perfeita para construir patrimônio. Poucos chegam aqui.",riesgo:"Sem acelerar a poupança agora que a situação é favorável, o tempo pode jogar contra você.",primer_paso:"Este mês abre uma conta exclusiva para a casa e faz o primeiro depósito, mesmo que simbólico."},
      emprender:{score:70,titulo:"O momento ideal para começar.",resumen:"Estável, sem dívidas e querendo empreender. Dificilmente você vai ter um cenário melhor que este.",fortaleza:"Empreender a partir da estabilidade e sem dívidas multiplica as chances de sucesso. É a combinação vencedora.",riesgo:"O conforto da estabilidade pode frear o primeiro passo. Não deixe o possível esperar o perfeito.",primer_paso:"Este mês define a data de lançamento do seu negócio. Uma data real no calendário."},
      tranquilidad:{score:72,titulo:"A tranquilidade já é sua — só falta garantir.",resumen:"Estável e sem dívidas buscando tranquilidade. Você está muito perto — só falta o fundo de emergência.",fortaleza:"Alcançar estabilidade sem dívidas com consciência de que quer tranquilidade é sabedoria financeira real.",riesgo:"A tranquilidade sem fundo de emergência depende de que nada dê errado. E algo sempre dá.",primer_paso:"Este mês calcula 3 meses dos seus gastos básicos. Esse número é sua meta do fundo de emergência."},
      libertad:{score:69,titulo:"Estável hoje, livre amanhã — o caminho existe.",resumen:"Estabilidade sem dívidas com metas de liberdade. A base está construída. Agora é acelerar.",fortaleza:"Alcançar estabilidade sem dívidas já é liberdade parcial. Você está construindo em terreno sólido.",riesgo:"A liberdade financeira total requer ativos que gerem renda. A estabilidade sozinha não basta.",primer_paso:"Este mês pesquisa um investimento simples com baixo risco disponível para começar."}
    }
  },
  creciendo:{
    deudas_criticas:{
      casa:{score:52,titulo:"Crescendo apesar de tudo — respeito.",resumen:"Você poupa e investe com dívidas que sufocam. Isso mostra uma força real e pouco comum.",fortaleza:"Crescer financeiramente com dívidas pesadas por cima é algo que muito pouca gente consegue fazer.",riesgo:"As dívidas com altos juros podem crescer mais rápido do que suas poupanças. Precisa olhar os números.",primer_paso:"Este mês compara a taxa das suas dívidas versus o rendimento das suas poupanças. O resultado diz o que atacar primeiro."},
      emprender:{score:50,titulo:"Capacidade de crescer — agora com ordem.",resumen:"Se você cresce com dívidas pesadas, imagine o que pode fazer sem elas. O potencial é real e enorme.",fortaleza:"Crescer financeiramente com dívidas que sufocam demonstra uma capacidade empresarial concreta.",riesgo:"Empreender com dívidas fortes pode desestabilizar até o crescimento que você já conquistou.",primer_paso:"Este mês calcula quanto capital liberaria por mês se resolvesse as dívidas. Esse número define sua prioridade."},
      tranquilidad:{score:53,titulo:"Você cresce mas as dívidas freiam a paz.",resumen:"Crescimento financeiro com dívidas que sufocam buscando tranquilidade. A solução é focar nas dívidas.",fortaleza:"Buscar tranquilidade quando você cresce financeiramente mas tem dívidas pesadas é sabedoria pura.",riesgo:"Crescer e ignorar as dívidas pesadas é como correr com uma mochila cheia. Cedo ou tarde pesa.",primer_paso:"Este mes destina toda a capacidade de poupança extra a atacar a dívida com maior taxa de juros."},
      libertad:{score:51,titulo:"Potencial de liberdade — primeiro ordem.",resumen:"Você cresce financeiramente com dívidas fortes e visão de liberdade. O potencial é enorme — a ordem é fundamental.",fortaleza:"Crescer com dívidas pesadas e visão de liberdade financeira demonstra resiliência e ambição. Poderoso.",riesgo:"A liberdade financeira com dívidas de altos juros requer primeiro vencer essas dívidas. São o inimigo número um.",primer_paso:"Este mês monta um plano de ataque de dívidas de 6 meses. Com data de início e data de dívida zero."}
    },
    deudas_manejables:{
      casa:{score:68,titulo:"Crescendo com dívidas — quase perfeito.",resumen:"Você poupa e investe com dívidas administráveis e meta de casa. Quitando as dívidas, o cenário fica excelente.",fortaleza:"Crescer financeiramente enquanto gerencia dívidas demonstra uma capacidade real de administração.",riesgo:"As dívidas, embora administráveis, freiam a velocidade de acumulação para a casa própria.",primer_paso:"Calcula se é melhor acelerar o pagamento das dívidas ou aumentar a poupança para a casa. Faz os números."},
      emprender:{score:70,titulo:"Crescendo e pronto para empreender — quase.",resumen:"A combinação de crescimento com dívidas administráveis e visão empreendedora é muito forte. Um ajuste e pronto.",fortaleza:"Empreender a partir do crescimento financeiro com dívidas sob controle é um ponto de partida privilegiado.",riesgo:"As dívidas consomem capital que poderia ir para o negócio. Calcula bem quanto pode destinar a cada coisa.",primer_paso:"Este mês faz o plano financeiro do negócio incluindo como as dívidas afetam o capital disponível."},
      tranquilidad:{score:72,titulo:"Crescendo em direção à tranquilidade total.",resumen:"Crescimento financeiro com dívidas controladas buscando tranquilidade. Você está muito perto do objetivo.",fortaleza:"Crescer enquanto gerencia dívidas e mira a tranquilidade é executar as três coisas ao mesmo tempo.",riesgo:"A tranquilidade real chega quando as dívidas desaparecem. É o último passo que falta.",primer_paso:"Este mês calcula a data exata em que fica livre de dívidas se priorizar o pagamento."},
      libertad:{score:69,titulo:"Crescendo para a liberdade — muito bem posicionado.",resumen:"Crescimento com dívidas administráveis e visão de liberdade. O mapa está claro e o caminho também.",fortaleza:"Crescer financeiramente enquanto mira a liberdade total é exatamente a atitude correta.",riesgo:"As dívidas freiam a liberdade mesmo sendo administráveis. Fechá-las acelera tudo.",primer_paso:"Este mês monta um calendário: data de zero dívidas e data do primeiro investimento em ativos."}
    },
    deuda_chica:{
      casa:{score:74,titulo:"A um fechamento do nível ideal.",resumen:"Crescendo, com dívida mínima e meta de casa. Feche essa dívida e o cenário fica praticamente perfeito.",fortaleza:"Chegar a crescer financeiramente com só uma dívida pequena é resultado de um trabalho muito bem feito.",riesgo:"Essa dívida pequena pode esperar — mas quanto antes fechar, mais cedo 100% da poupança vai para a casa.",primer_paso:"Este mês calcula se vale mais a pena quitar a dívida de uma vez ou continuar as parcelas."},
      emprender:{score:76,titulo:"Quase no ponto ideal para começar.",resumen:"Crescendo com dívida mínima e vontade de empreender. Feche essa dívida e você tem o cenário perfeito.",fortaleza:"Uma única dívida pequena com crescimento financeiro e visão empreendedora é a combinação vencedora.",riesgo:"A impaciência de empreender pode fazer você ignorar essa dívida. Não faça isso.",primer_paso:"Coloca uma data: em X semanas quito a dívida, em Y semanas lanço o negócio."},
      tranquilidad:{score:77,titulo:"A tranquilidade já é quase sua.",resumen:"Crescendo com uma dívida mínima buscando tranquilidade. Você está a semanas de ter exatamente o que busca.",fortaleza:"Ter chegado a este ponto a partir de uma situação mais difícil demonstra que você executa bem os planos.",riesgo:"Relaxar antes de fechar essa dívida pequena e ter o fundo completo seria o único erro possível.",primer_paso:"Este mês fecha a dívida de uma vez se puder, e no mês seguinte começa o fundo de emergência."},
      libertad:{score:75,titulo:"Um passo da liberdade financeira total.",resumen:"Crescendo, quase sem dívidas e com meta de liberdade. Você está literalmente a um passo do cenário ideal.",fortaleza:"Crescer financeiramente com quase zero dívidas e visão de liberdade é exatamente o estado mental vencedor.",riesgo:"O único risco é não capitalizar este momento privilegiado com um investimento concreto.",primer_paso:"Este mês pesquisa o primeiro investimento em um ativo que pode fazer com sua poupança atual."}
    },
    sin_deudas:{
      casa:{score:82,titulo:"Crescendo e limpo — o momento é agora.",resumen:"Você poupa, não tem dívidas e quer casa própria. Você está no melhor cenário possível. Só falta executar.",fortaleza:"Crescer financeiramente sem dívidas é o resultado de decisões consistentes. Você já sabe o que funciona.",riesgo:"Sem um plano específico para a casa, a poupança pode ir para outras coisas. Você precisa de um objetivo fixo.",primer_paso:"Este mês abre uma conta exclusiva para a casa e calcula a data em que pode comprar."},
      emprender:{score:85,titulo:"Pronto para o próximo nível.",resumen:"Crescendo sem dívidas e com vontade de empreender. Este é o cenário ideal. A pergunta é quando, não se.",fortaleza:"Empreender a partir do crescimento e sem dívidas multiplica exponencialmente as probabilidades de sucesso.",riesgo:"A autoconfiança num bom momento pode levar a não planejar bem. O plano sempre importa.",primer_paso:"Este mês define a data de lançamento, o produto mínimo viável e o primeiro cliente objetivo."},
      tranquilidad:{score:84,titulo:"Crescendo e em paz — o objetivo foi cumprido.",resumen:"Você poupa, não tem dívidas e busca tranquilidade. Você provavelmente já tem mais do que percebe.",fortaleza:"Crescer sem dívidas buscando tranquilidade é a combinação mais sólida que existe em finanças pessoais.",riesgo:"A tranquilidade real requer um fundo de emergência sólido além da poupança regular.",primer_paso:"Este mês verifica se tem pelo menos 3 meses de gastos guardados em um lugar separado."},
      libertad:{score:83,titulo:"No caminho direto para a liberdade financeira.",resumen:"Crescendo, sem dívidas e com meta de liberdade. Você está exatamente onde precisa estar para alcançá-la.",fortaleza:"A liberdade financeira a partir do crescimento e sem dívidas não é um sonho — é um plano com data.",riesgo:"A liberdade requer renda passiva ou ativos que trabalhem por você. A poupança sozinha não basta.",primer_paso:"Este mês pesquisa a primeira investimento concreto que pode fazer com sua poupança atual."}
    }
  }
};

function getDiag(a, lang) {
  var sk=a.situacion||"ajustado";
  var dk=a.deuda||"deudas_manejables";
  var mk=a.meta||"tranquilidad";
  var es=(DIAG[sk]&&DIAG[sk][dk]&&DIAG[sk][dk][mk])||{score:40,titulo:"Tu camino empieza acá.",resumen:"Cada situación es única. Lo importante es que diste el primer paso.",fortaleza:"Buscar ayuda cuando la necesitás es una fortaleza.",riesgo:"Sin un plan concreto, la situación tiende a mantenerse igual.",primer_paso:"Este mes anotás cuánto entra y cuánto sale. Solo eso ya cambia todo."};
  if(lang!=="pt") return es;
  // Use native PT version
  var pt=(DIAG_PT[sk]&&DIAG_PT[sk][dk]&&DIAG_PT[sk][dk][mk]);
  if(pt) return pt;
  // Translate to PT
  // Fallback: use ES with basic title translation
  var tmap={"Tu camino empieza acá.":"Seu caminho começa aqui."};
  return {score:es.score,titulo:tmap[es.titulo]||es.titulo,resumen:es.resumen,fortaleza:es.fortaleza,riesgo:es.riesgo,primer_paso:es.primer_paso};
}

const CSS=`
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  @keyframes fadeIn{from{opacity:0}to{opacity:1}}
  @keyframes flicker{0%,100%{opacity:1}45%{opacity:1}50%{opacity:.3}55%{opacity:1}80%{opacity:1}83%{opacity:.5}86%{opacity:1}}
  @keyframes slideOut{from{opacity:1;transform:scale(1)}to{opacity:0;transform:scale(1.03)}}
  @keyframes pulseBtn{0%,100%{box-shadow:0 0 0 0 rgba(255,75,43,.4)}50%{box-shadow:0 0 0 14px rgba(255,75,43,0)}}
  @keyframes orb{0%,100%{transform:translateY(0) translateX(0)}33%{transform:translateY(-20px) translateX(10px)}66%{transform:translateY(10px) translateX(-15px)}}
  @keyframes grain{0%,100%{transform:translate(0,0)}10%{transform:translate(-2%,-3%)}20%{transform:translate(3%,2%)}40%{transform:translate(4%,-1%)}}
  @keyframes lineGrow{from{width:0}to{width:60px}}
  @keyframes dp{0%,80%,100%{opacity:0;transform:scale(.8)}40%{opacity:1;transform:scale(1)}}
  @keyframes shimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
  @keyframes scoreIn{from{opacity:0;transform:scale(.5)}to{opacity:1;transform:scale(1)}}
  @keyframes rslide{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes bpop{0%{transform:scale(0);opacity:0}60%{transform:scale(1.15)}100%{transform:scale(1);opacity:1}}
  @keyframes toast{0%{transform:translateY(100px);opacity:0}15%{transform:translateY(0);opacity:1}80%{transform:translateY(0);opacity:1}100%{transform:translateY(100px);opacity:0}}
  @keyframes progFill{from{width:0%}to{width:var(--p)}}
  @keyframes proGlow{0%,100%{box-shadow:0 0 20px rgba(250,204,21,.1)}50%{box-shadow:0 0 40px rgba(250,204,21,.25)}}
  .btn{background:#FF4B2B;color:#fff;border:none;border-radius:16px;padding:18px;font-family:"Plus Jakarta Sans",sans-serif;font-weight:700;font-size:16px;cursor:pointer;width:100%;transition:all .2s;animation:pulseBtn 2.5s ease-in-out infinite;}
  .btn:hover{background:#e03d22;animation:none;}
  .btn:disabled{background:#2a1510;color:#5a2a20;cursor:not-allowed;animation:none;}
  .btng{background:transparent;color:#888;border:1px solid #222;border-radius:16px;padding:16px;font-family:"DM Sans",sans-serif;font-size:14px;cursor:pointer;width:100%;transition:all .2s;margin-top:12px;}
  .btng:hover{border-color:#444;color:#ccc;}
  .opt{background:#0e0e0e;border:1px solid #1e1e1e;border-radius:16px;padding:16px 18px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:all .2s;text-align:left;width:100%;}
  .opt:hover,.opt.sel{border-color:#FF4B2B;background:#130a09;}
  .card{background:#0e0e0e;border:1px solid #1e1e1e;border-radius:20px;padding:20px;}
  .stat{background:#111;border:1px solid #1e1e1e;border-radius:16px;padding:16px;flex:1;}
  .tag{display:inline-flex;align-items:center;gap:6px;background:#141414;border:1px solid #222;border-radius:100px;padding:6px 14px;font-size:12px;color:#888;font-family:"DM Sans",sans-serif;}
  .dotlive{width:6px;height:6px;border-radius:50%;background:#FF4B2B;animation:dp 1.5s ease infinite;}
  .td{width:8px;height:8px;border-radius:50%;background:#FF4B2B;display:inline-block;}
  .td:nth-child(1){animation:dp 1.2s .0s infinite}.td:nth-child(2){animation:dp 1.2s .2s infinite}.td:nth-child(3){animation:dp 1.2s .4s infinite}
  .lc{background:#0e0e0e;border:1px solid #1e1e1e;border-radius:18px;padding:18px;cursor:pointer;transition:all .2s;width:100%;text-align:left;}
  .lc:hover{border-color:#FF4B2B44;transform:translateY(-2px);}
  .lc.today{border-color:#FF4B2B;}
  .lc.done{border-color:#4ade8033;background:#0a130a;opacity:.7;}
  .lc.locked{border-color:#facc1522;background:#0e0e0e;}
  .nav{flex:1;display:flex;flex-direction:column;align-items:center;gap:4px;background:none;border:none;cursor:pointer;padding:12px 4px;}
  .pbar{background:#1a1a1a;border-radius:100px;height:6px;overflow:hidden;}
  .pfill{height:100%;background:#FF4B2B;border-radius:100px;animation:progFill .8s ease forwards;}
  .bc{background:#0e0e0e;border:1px solid #1e1e1e;border-radius:16px;padding:16px;display:flex;align-items:center;gap:14px;}
  .bc.earned{border-color:#facc1544;background:#141008;}
  .bc.locked{opacity:.3;}
  .sl{height:14px;border-radius:8px;background:linear-gradient(90deg,#1a1a1a 25%,#252525 50%,#1a1a1a 75%);background-size:800px 100%;animation:shimmer 1.5s infinite;}
  .fr{display:flex;align-items:flex-start;gap:16px;padding:16px 0;border-bottom:1px solid #161616;}
  .fr:last-child{border-bottom:none;}
  .toastbox{position:fixed;bottom:90px;left:16px;right:16px;max-width:358px;margin:0 auto;background:#1a1208;border:1px solid #FF4B2B44;border-radius:20px;padding:14px 20px;display:flex;align-items:center;gap:12px;z-index:300;animation:toast 3.5s ease forwards;box-shadow:0 8px 32px rgba(0,0,0,.6);}
  .inp{background:#111;border:1px solid #2a2a2a;border-radius:14px;padding:16px 20px;font-family:"Plus Jakarta Sans",sans-serif;font-size:22px;font-weight:700;color:#fff;width:100%;outline:none;text-align:center;}
  .inp:focus{border-color:#FF4B2B;}
`;

function Ambient(){
  return (
    <>
      <div style={{position:"fixed",inset:0,zIndex:999,pointerEvents:"none",opacity:.035,backgroundImage:"url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",animation:"grain .5s steps(1) infinite"}}/>
      <div style={{position:"fixed",top:"-10%",right:"-10%",width:400,height:400,borderRadius:"50%",pointerEvents:"none",background:"radial-gradient(circle,rgba(255,75,43,.12) 0%,transparent 70%)",animation:"orb 8s ease-in-out infinite"}}/>
      <div style={{position:"fixed",bottom:"-15%",left:"-10%",width:500,height:500,borderRadius:"50%",pointerEvents:"none",background:"radial-gradient(circle,rgba(255,75,43,.07) 0%,transparent 70%)",animation:"orb 10s ease-in-out infinite reverse"}}/>
    </>
  );
}

function Splash({done}){
  return(
    <div style={{position:"fixed",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",zIndex:100,background:"#0A0A0A",animation:done?"slideOut .5s ease forwards":"fadeIn .4s ease"}}>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:64,animation:"flicker 2s ease infinite",marginBottom:20,lineHeight:1}}>🔥</div>
        <div style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:800,fontSize:52,color:"#fff",letterSpacing:"-2px",lineHeight:1}}>hendy</div>
        <div style={{height:2,background:"#FF4B2B",borderRadius:2,marginTop:10,animation:"lineGrow 1.5s ease forwards",width:0}}/>
        <div style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:13,color:"#888",marginTop:16,letterSpacing:"3px",textTransform:"uppercase",animation:"fadeIn 1s ease 1s both"}}>Dejá de estarlo.</div>
      </div>
    </div>
  );
}

function NameScreen({onContinue,lang,setLang,savedName,onContinueSaved}){
  const [name,setName]=useState("");
  const [l,setL]=useState(lang||"es");
  const ref=useRef(null);
  useEffect(()=>{setTimeout(()=>{if(ref.current)ref.current.focus();},400);},[]);
  const sw=(nl)=>{setL(nl);setLang(nl);};
  const isPT=l==="pt";
  const t=isPT
    ?{t1:"Como é",t2:"seu nome?",sub:"Seu coach precisa saber com quem está falando.",ph:"Seu nome aqui...",sal:"Olá,",btn:"Começar meu diagnóstico →",foot:"Só seu nome. Nada mais. 🔒"}
    :{t1:"¿Cómo te",t2:"llamás?",sub:"Tu coach necesita saber con quién está hablando.",ph:"Tu nombre aquí...",sal:"Hola,",btn:"Empezar mi diagnóstico →",foot:"Solo tu nombre. Nada más. 🔒"};
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"24px 28px 48px",animation:"fadeIn .5s ease"}}>
      <div style={{textAlign:"center",marginBottom:32,width:"100%"}}>
        <div style={{fontSize:52,animation:"flicker 2s ease infinite",marginBottom:14}}>🔥</div>
        <h1 style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:30,color:"#fff",letterSpacing:"-1.5px",lineHeight:1.1,marginBottom:10}}>
          {t.t1}<br/><span style={{color:"#FF4B2B"}}>{t.t2}</span>
        </h1>
        <p style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:15,color:"#aaa",lineHeight:1.65}}>{t.sub}</p>
      </div>
      <input ref={ref} className="inp" placeholder={t.ph} value={name}
        onChange={e=>setName(e.target.value)}
        onKeyDown={e=>e.key==="Enter"&&name.trim()&&onContinue(name.trim())}
        maxLength={20} style={{width:"100%",marginBottom:name.trim()?8:0}}/>
      {name.trim()&&(
        <div style={{marginBottom:8,textAlign:"center",fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#aaa",animation:"fadeIn .3s ease"}}>
          {t.sal} <span style={{color:"#FF4B2B",fontWeight:600}}>{name.trim()}</span> 👋
        </div>
      )}
      <div style={{width:"100%",marginTop:16}}>
        <button className="btn" onClick={()=>name.trim()&&onContinue(name.trim())} disabled={!name.trim()}>{t.btn}</button>
      </div>
      <div style={{textAlign:"center",marginTop:12,fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#888"}}>{t.foot}</div>
      {savedName&&onContinueSaved&&(
        <div style={{textAlign:"center",marginTop:16}}>
          <button onClick={onContinueSaved} style={{background:"none",border:"none",fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#FF4B2B",cursor:"pointer",textDecoration:"underline"}}>
            {isPT?"Continuar como "+savedName+" →":"Continuar como "+savedName+" →"}
          </button>
        </div>
      )}
      <div style={{width:"100%",marginTop:32,paddingTop:24,borderTop:"1px solid #1a1a1a"}}>
        <div style={{textAlign:"center",fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#666",marginBottom:12}}>{isPT?"Selecione seu idioma":"Seleccioná tu idioma"}</div>
        <div style={{display:"flex",gap:12,justifyContent:"center",width:"100%"}}>
          {["es","pt"].map(opt=>(
            <button key={opt} onClick={()=>sw(opt)} style={{
              flex:1,background:l===opt?"#FF4B2B":"#111",
              border:"2px solid "+(l===opt?"#FF4B2B":"#2a2a2a"),
              borderRadius:14,padding:"12px 0",cursor:"pointer",
              fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,
              color:l===opt?"#fff":"#888",transition:"all .2s",
            }}>
              {opt==="es"?"🇵🇾 Español":"🇧🇷 Português"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}


function Home({onStart,userName,onBack,lang}){
  const pt=lang==="pt";
  const feats=pt
    ?[{i:"🧠",bg:"#1a1208",l:"Diagnóstico personalizado",d:"3 perguntas. Seu mapa financeiro real."},{i:"📅",bg:"#0d1a0d",l:"Micro-lições diárias",d:"60 segundos. Linguagem da rua, não do banco."},{i:"🏆",bg:"#1a1208",l:"Conquistas e badges",d:"Ganhe medalhas pelo seu progresso."},{i:"💸",bg:"#1a0d0d",l:"Conectado ao NXB",d:"Mova seu dinheiro sem taxas abusivas."}]
    :[{i:"🧠",bg:"#1a1208",l:"Diagnóstico personalizado",d:"3 preguntas. Tu mapa financiero real."},{i:"📅",bg:"#0d1a0d",l:"Micro-lecciones diarias",d:"60 segundos. Lenguaje de la feria, no del banco."},{i:"🏆",bg:"#1a1208",l:"Logros y badges",d:"Ganá medallas por tu progreso y tu racha."},{i:"💸",bg:"#1a0d0d",l:"Conectado a NXB",d:"Mové tu plata sin comisiones abusivas."}];
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"0 0 100px",animation:"fadeIn .6s ease"}}>
      <div style={{padding:"56px 28px 0",display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
        <div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}><span style={{fontSize:22}}>🔥</span><span style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:800,fontSize:24,color:"#fff",letterSpacing:"-1px"}}>hendy</span></div>
          <div className="tag"><span className="dotlive"/><span>{pt?"Coach financeiro IA · Mercosul":"Coach financiero IA · Paraguay"}</span></div>
        </div>
        <button onClick={onBack} style={{background:"#161616",border:"1px solid #2a2a2a",borderRadius:12,color:"#ccc",cursor:"pointer",fontFamily:"\"DM Sans\",sans-serif",fontSize:12,fontWeight:500,padding:"8px 12px",display:"flex",alignItems:"center",gap:4}}>{pt?"← Mudar nome":"← Cambiar nombre"}</button>
      </div>
      <div style={{padding:"32px 28px 0",animation:"fadeUp .6s ease .1s both"}}>
        {userName&&<div style={{fontFamily:"\"DM Sans\",sans-serif",fontSize:14,color:"#aaa",marginBottom:8}}>{pt?"Olá, ":"Hola, "}<span style={{color:"#FF4B2B",fontWeight:600}}>{userName}</span> 👋</div>}
        <h1 style={{fontWeight:800,fontSize:38,color:"#fff",lineHeight:1.05,letterSpacing:"-1.5px",marginBottom:8}}>
          {pt?<>"Hendy" é<br/><span style={{color:"#FF4B2B"}}>onde você está.</span></>:<>"Hendy" es<br/><span style={{color:"#FF4B2B"}}>donde estás.</span></>}
        </h1>
        <p style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:15,color:"#aaa",lineHeight:1.65,marginTop:12}}>{pt?"O app que te entende — e te ajuda a sair daí.":"La app que te entiende — y te ayuda a salir de ahí."}</p>
        <div style={{marginTop:18,display:"flex",alignItems:"flex-start",gap:12,background:"#111",border:"1px solid #2a2a2a",borderRadius:16,padding:"14px 18px"}}>
          <span style={{fontSize:20,flexShrink:0}}>🔥</span>
          <div>
            <div style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:700,fontSize:13,color:"#FF4B2B",marginBottom:4}}>{pt?"O que significa Hendy?":"¿Qué significa Hendy?"}</div>
            <p style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:13,color:"#aaa",lineHeight:1.6}}>{pt?"Hendy é uma palavra do guarani — língua nativa do Paraguai — que significa estar em dificuldade financeira. Aqui é o ponto de partida.":"Hendy es una palabra guaraní — el idioma nativo de Paraguay — que significa estar en dificultad económica. Acá es el punto de partida."}</p>
          </div>
        </div>
      </div>
      <div style={{padding:"24px 28px 0",display:"flex",gap:12,animation:"fadeUp .6s ease .2s both"}}>
        {[{l:pt?"Usuários":"Usuarios",v:"12K+",s:pt?"↑ crescendo":"↑ creciendo",c:"#FF4B2B"},{l:pt?"Lições":"Lecciones",v:"21",s:pt?"lições":"lecciones",c:"#aaa"},{l:"Países",v:"5",s:"Mercosur",c:"#aaa"}].map((s,i)=>(
          <div key={i} className="stat">
            <div style={{fontFamily:"\"DM Sans\",sans-serif",fontSize:11,color:"#888",letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>{s.l}</div>
            <div style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:800,fontSize:22,color:"#fff"}}>{s.v}</div>
            <div style={{fontFamily:"\"DM Sans\",sans-serif",fontSize:11,color:s.c,marginTop:2}}>{s.s}</div>
          </div>
        ))}
      </div>
      <div style={{margin:"24px 28px 0",background:"#0e0e0e",border:"1px solid #181818",borderRadius:20,padding:"4px 20px",animation:"fadeUp .6s ease .3s both"}}>
        {feats.map((f,i)=>(
          <div key={i} className="fr">
            <div style={{width:44,height:44,borderRadius:12,background:f.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,flexShrink:0}}>{f.i}</div>
            <div>
              <div style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:700,fontSize:14,color:"#fff",marginBottom:3}}>{f.l}</div>
              <div style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:13,color:"#aaa",lineHeight:1.5}}>{f.d}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{padding:"24px 28px 0",animation:"fadeUp .6s ease .5s both"}}>
        <button className="btn" onClick={onStart}>{pt?"Começar meu diagnóstico →":"Empezar mi diagnóstico →"}</button>
      </div>
      <div style={{textAlign:"center",marginTop:18,fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:12,color:"#555"}}>{pt?"Grátis. Sem cartão. Só sua decisão. 🔥":"Gratis. Sin tarjeta. Solo tu decisión. 🔥"}</div>
    </div>
  );
}

function Quiz({onFinish,onBack,lang}){
  const pt=lang==="pt";
  const QS=pt?QUESTIONS_PT:QUESTIONS_ES;
  const [step,setStep]=useState(0);
  const [answers,setAnswers]=useState({});
  const [sel,setSel]=useState(null);
  const [out,setOut]=useState(false);
  const q=QS[step];
  const isLast=step===QS.length-1;
  const next=()=>{
    if(!sel)return;
    const na={...answers,[q.id]:sel};
    setOut(true);
    setTimeout(()=>{if(isLast){onFinish(na);}else{setAnswers(na);setStep(s=>s+1);setSel(null);setOut(false);}},300);
  };
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 32px",animation:out?"slideOut .3s ease forwards":"fadeIn .4s ease"}}>
      <button onClick={step===0?onBack:()=>{setStep(s=>s-1);setSel(null);}} style={{background:"#161616",border:"1px solid #2a2a2a",borderRadius:12,color:"#ccc",cursor:"pointer",fontFamily:"\"DM Sans\",sans-serif",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6,marginBottom:40,padding:"8px 14px",width:"fit-content"}}>
        {step===0?(pt?"← Voltar":"← Volver"):(pt?"← Anterior":"← Anterior")}
      </button>
      <div style={{display:"flex",gap:6,marginBottom:48}}>{QS.map((_,i)=><div key={i} style={{height:3,flex:1,borderRadius:2,background:i<=step?"#FF4B2B":"#1e1e1e",transition:"background .3s"}}/>)}</div>
      <div style={{flex:1,display:"flex",flexDirection:"column"}}>
        <div style={{fontSize:11,fontFamily:"\"DM Sans\",sans-serif",color:"#888",letterSpacing:"2px",textTransform:"uppercase",marginBottom:14}}>{pt?"Pergunta":"Pregunta"} {step+1} {pt?"de":"de"} {QS.length}</div>
        <h2 style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:800,fontSize:28,color:"#fff",letterSpacing:"-1px",lineHeight:1.15,marginBottom:10}}>{q.pregunta}</h2>
        <p style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:14,color:"#aaa",marginBottom:32,lineHeight:1.6}}>{q.sub}</p>
        <div style={{display:"flex",flexDirection:"column",gap:10}}>
          {q.opciones.map((opt,i)=>(
            <button key={opt.value} className={"opt"+(sel===opt.value?" sel":"")} onClick={()=>setSel(opt.value)} style={{animation:"fadeUp .35s ease "+(i*.06)+"s both"}}>
              <span style={{fontSize:24,flexShrink:0}}>{opt.emoji}</span>
              <div style={{flex:1}}>
                <div style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:700,fontSize:15,color:"#fff",marginBottom:2}}>{opt.label}</div>
                <div style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:13,color:"#aaa"}}>{opt.desc}</div>
              </div>
              <div style={{color:sel===opt.value?"#FF4B2B":"#555",fontSize:18}}>{sel===opt.value?"●":"›"}</div>
            </button>
          ))}
        </div>
      </div>
      <div style={{marginTop:32}}><button className="btn" onClick={next} disabled={!sel}>{isLast?(pt?"Ver meu diagnóstico 🔥":"Ver mi diagnóstico 🔥"):(pt?"Próximo →":"Siguiente →")}</button></div>
      <div style={{textAlign:"center",marginTop:16,fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:12,color:"#888"}}>{pt?"Suas respostas são 100% privadas 🔒":"Tus respuestas son 100% privadas 🔒"}</div>
    </div>
  );
}

function Loading({lang}){
  const pt=lang==="pt";
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0 28px",animation:"fadeIn .4s ease"}}>
      <div style={{fontSize:52,animation:"flicker 1.5s ease infinite",marginBottom:24}}>🔥</div>
      <h2 style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:800,fontSize:24,color:"#fff",textAlign:"center",letterSpacing:"-1px",marginBottom:12}}>{pt?"Analisando sua situação...":"Analizando tu situación..."}</h2>
      <p style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:14,color:"#aaa",textAlign:"center",lineHeight:1.7,marginBottom:36}}>{pt?"A IA está construindo seu plano personalizado.":"La IA está construyendo tu plan personalizado."}</p>
      <div style={{display:"flex",gap:8}}><span className="td"/><span className="td"/><span className="td"/></div>
      <div style={{width:"100%",marginTop:48,display:"flex",flexDirection:"column",gap:12}}>{[100,80,65,90].map((w,i)=><div key={i} className="sl" style={{width:w+"%",animationDelay:(i*.15)+"s"}}/>)}</div>
    </div>
  );
}

function Result({data,onContinue,onBack,lang}){
  const pt=lang==="pt";
  const [copied,setCopied]=useState(false);
  const sc=data.score>=70?"#4ade80":data.score>=40?"#facc15":"#FF4B2B";
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .5s ease"}}>
      <button onClick={onBack} style={{background:"#161616",border:"1px solid #2a2a2a",borderRadius:12,color:"#ccc",cursor:"pointer",fontFamily:"\"DM Sans\",sans-serif",fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6,padding:"8px 14px",marginBottom:24,width:"fit-content"}}>{pt?"← Voltar":"← Volver"}</button>
      <div style={{textAlign:"center",marginBottom:24,animation:"scoreIn .6s ease .1s both",opacity:0}}>
        <div style={{display:"inline-flex",flexDirection:"column",alignItems:"center",background:"#0e0e0e",border:"1px solid #1e1e1e",borderRadius:24,padding:"22px 40px"}}>
          <div style={{fontSize:11,fontFamily:"\"DM Sans\",sans-serif",color:"#888",letterSpacing:"2px",textTransform:"uppercase",marginBottom:8}}>{pt?"Sua pontuação Hendy":"Tu puntaje Hendy"}</div>
          <div style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:800,fontSize:60,color:sc,lineHeight:1,letterSpacing:"-3px"}}>{data.score}</div>
          <div style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:12,color:"#888",marginTop:2}}>de 100</div>
        </div>
      </div>
      <div style={{animation:"fadeUp .5s ease .2s both",opacity:0}}>
        <div style={{fontSize:11,fontFamily:"\"DM Sans\",sans-serif",color:"#FF4B2B",letterSpacing:"2px",textTransform:"uppercase",marginBottom:8}}>{pt?"Seu diagnóstico":"Tu diagnóstico"}</div>
        <h2 style={{fontFamily:"\"Plus Jakarta Sans\",sans-serif",fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px",lineHeight:1.15,marginBottom:14}}>{data.titulo}</h2>
        <p style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:14,color:"#aaa",lineHeight:1.7}}>{data.resumen}</p>
      </div>
      <div style={{marginTop:20,display:"flex",flexDirection:"column",gap:10}}>
        {[{c:"#4ade80",l:pt?"💪 Seu ponto forte":"💪 Tu fortaleza",v:data.fortaleza},{c:"#FF4B2B",l:pt?"⚠️ Seu maior risco":"⚠️ Tu mayor riesgo",v:data.riesgo},{c:"#facc15",l:pt?"🎯 Seu primeiro passo":"🎯 Tu primer paso",v:data.primer_paso}].map((item,i)=>(
          <div key={i} className="card" style={{animation:"rslide .6s ease "+((.3+i*.1))+"s both"}}>
            <div style={{fontSize:11,fontFamily:"\"DM Sans\",sans-serif",color:item.c,letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>{item.l}</div>
            <p style={{fontFamily:"\"DM Sans\",sans-serif",fontWeight:300,fontSize:14,color:"#ccc",lineHeight:1.6}}>{item.v}</p>
          </div>
        ))}
      </div>
      <div style={{marginTop:20,animation:"rslide .5s ease .6s both",opacity:0}}>
        <button className="btn" onClick={onContinue} style={{animation:"none"}}>{pt?"Começar minhas lições →":"Comenzar mis lecciones →"}</button>
        <button onClick={()=>{
          var txt=(pt?"🔥 Meu diagnóstico Hendy:\n":"🔥 Mi diagnóstico Hendy:\n")+'"'+data.titulo+'"'+"\n\n"+(pt?"Descubra o seu em hendy.app":"Descubrí el tuyo en hendy.app");
          try{
            if(navigator.clipboard&&navigator.clipboard.writeText){
              navigator.clipboard.writeText(txt).then(()=>setCopied(true)).catch(()=>{var t=document.createElement('textarea');t.value=txt;document.body.appendChild(t);t.select();document.execCommand('copy');document.body.removeChild(t);setCopied(true);});
            } else {
              var t=document.createElement('textarea');t.value=txt;t.style.position='fixed';t.style.opacity='0';document.body.appendChild(t);t.focus();t.select();document.execCommand('copy');document.body.removeChild(t);setCopied(true);
            }
          } catch(e){setCopied(true);}
          setTimeout(()=>setCopied(false),2500);
        }} className="btng" style={{borderColor:copied?"#4ade80":"#222",color:copied?"#4ade80":"#888"}}>
          {copied?(pt?"✅ Copiado para a área de transferência":"✅ Copiado al portapapeles"):(pt?"📤 Compartilhar meu diagnóstico":"📤 Compartir mi diagnóstico")}
        </button>
      </div>
    </div>
  );
}


// ─── AI MONTHLY LESSON ────────────────────────────────────────────────────────
function AIMonthLesson({userData, lang, isPro, completed}){
  const pt = lang==="pt";
  const [loading, setLoading] = useState(false);
  const [lesson, setLesson] = useState(null);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  // Check if this month's lesson was already generated
  const monthKey = "hendy_ai_v2_"+new Date().getFullYear()+"_"+new Date().getMonth();
  useEffect(()=>{
    try{
      const saved = JSON.parse(localStorage.getItem(monthKey)||"null");
      if(saved) setLesson(saved);
    }catch(e){}
  },[]);

  const generate = async()=>{
    setLoading(true); setError(null);
    const diagScore = userData&&userData.diagnostico?userData.diagnostico.score:40;
    const score = calcScore(diagScore, completed.length);
    const situacion = userData&&userData.answers?userData.answers.situacion:"ajustado";
    const meta = userData&&userData.answers?userData.answers.meta:"tranquilidad";
    const lessonesCompletadas = completed.length;
    const prompt = pt
      ? `Você é Hendy, um coach financeiro especializado no Mercosul. Crie uma micro-lição financeira personalizada para um usuário que acabou de concluir todas as 21 lições da Academia Hendy com estas características:
- Pontuação financeira: ${score}/100 (máxima — concluiu todas as lições)
- Situação: ${situacion}
- Meta principal: ${meta}  
- Lições concluídas: ${lessonesCompletadas}/21
- Idioma: Português brasileiro

A lição deve ter exatamente este formato JSON (sem markdown, só JSON puro):
{"titulo":"título da lição em até 8 palavras","emoji":"um emoji relevante","gancho":"frase impactante de abertura em 1 linha","conteudo":"desenvolvimento em 4 parágrafos separados por \n\n, linguagem simples e direta, contexto do Mercosul","dado":"estatística ou fato relevante concreto","acao":"ação específica realizável este mês em 1 frase"}`
      : `Sos Hendy, un coach financiero especializado en el Mercosur. Creá una micro-lección financiera personalizada para un usuario que acaba de completar las 21 lecciones de la Academia Hendy con estas características:
- Puntaje financiero: ${score}/100 (máximo — completó todas las lecciones)
- Situación: ${situacion}
- Meta principal: ${meta}
- Lecciones completadas: ${lessonesCompletadas}/21
- Idioma: Español rioplatense

La lección debe tener exactamente este formato JSON (sin markdown, solo JSON puro):
{"titulo":"título de la lección en hasta 8 palabras","emoji":"un emoji relevante","gancho":"frase impactante de apertura en 1 línea","conteudo":"desarrollo en 4 párrafos separados por \n\n, lenguaje simple y directo, contexto del Mercosur","dado":"estadística o dato relevante concreto","acao":"acción específica realizable este mes en 1 frase"}`;

    try{
      const res = await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          messages:[{role:"user",content:prompt}]
        })
      });
      const data = await res.json();
      const text = data.content&&data.content[0]?data.content[0].text:"";
      const clean = text.replace(/```json|```/g,"").trim();
      const parsed = JSON.parse(clean);
      setLesson(parsed);
      localStorage.setItem(monthKey, JSON.stringify(parsed));
    }catch(e){
      setError(pt?"Erro ao gerar. Tente novamente.":"Error al generar. Intentá de nuevo.");
    }
    setLoading(false);
  };

  if(!isPro) return null;

  const months = pt
    ?["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"]
    :["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
  const mesActual = months[new Date().getMonth()];

  return(
    <div style={{marginBottom:20}}>
      <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#facc15",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>
        ⭐ {pt?"Lição do Mês":"Lección del Mes"} — {mesActual}
      </div>
      {!lesson&&!loading&&(
        <div style={{background:"linear-gradient(135deg,#1a1208,#120a1a)",border:"1px solid #facc1544",borderRadius:18,padding:20}}>
          <div style={{fontSize:32,marginBottom:12,textAlign:"center"}}>🤖</div>
          <p style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#aaa",lineHeight:1.6,marginBottom:16,textAlign:"center"}}>
            {pt?"A IA vai criar uma lição exclusiva baseada no seu perfil financeiro deste mês.":"La IA va a crear una lección exclusiva basada en tu perfil financiero de este mes."}
          </p>
          <button onClick={generate} style={{background:"linear-gradient(135deg,#facc15,#f59e0b)",color:"#000",border:"none",borderRadius:14,padding:"14px 20px",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:14,cursor:"pointer",width:"100%"}}>
            {pt?"Gerar minha lição do mês →":"Generar mi lección del mes →"}
          </button>
          {error&&<div style={{marginTop:10,fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#f87171",textAlign:"center"}}>{error}</div>}
        </div>
      )}
      {loading&&(
        <div style={{background:"#0e0e0e",border:"1px solid #facc1533",borderRadius:18,padding:24,textAlign:"center"}}>
          <div style={{fontSize:36,animation:"flicker 1.5s ease infinite",marginBottom:12}}>🤖</div>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#facc15",marginBottom:8}}>{pt?"Gerando sua lição personalizada...":"Generando tu lección personalizada..."}</div>
          <div style={{display:"flex",gap:8,justifyContent:"center"}}><span className="td"/><span className="td"/><span className="td"/></div>
        </div>
      )}
      {lesson&&!loading&&(
        <div style={{background:"linear-gradient(135deg,#1a1208,#0e0e0e)",border:"1px solid #facc1544",borderRadius:18,padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
            <span style={{fontSize:32}}>{lesson.emoji||"🤖"}</span>
            <div>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:10,color:"#facc15",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:4}}>IA · {mesActual}</div>
              <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:16,color:"#fff"}}>{lesson.titulo}</div>
            </div>
          </div>
          <div style={{background:"#130a09",border:"1px solid #FF4B2B33",borderRadius:12,padding:"12px 16px",marginBottom:14}}>
            <p style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#FF4B2B",lineHeight:1.5}}>"{lesson.gancho}"</p>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:12,marginBottom:14}}>
            {(lesson.conteudo||"").split("\n\n").filter(Boolean).map((p,i)=>(
              <p key={i} style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:14,color:"#ccc",lineHeight:1.75}}>{p}</p>
            ))}
          </div>
          {lesson.dado&&<div style={{background:"#0d1a0d",border:"1px solid #4ade8033",borderRadius:12,padding:"12px 16px",marginBottom:12}}>
            <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#4ade80",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>{pt?"📊 Dado chave":"📊 Dato clave"}</div>
            <p style={{fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#ccc",lineHeight:1.6}}>{lesson.dado}</p>
          </div>}
          {lesson.acao&&<div style={{background:"#1a1208",border:"1px solid #facc1533",borderRadius:12,padding:"12px 16px"}}>
            <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#facc15",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>{pt?"🎯 Sua ação deste mês":"🎯 Tu acción de este mes"}</div>
            <p style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:600,fontSize:14,color:"#fff",lineHeight:1.5}}>{lesson.acao}</p>
          </div>}
          {!done&&<button onClick={()=>setDone(true)} style={{marginTop:14,background:"#4ade8020",color:"#4ade80",border:"1px solid #4ade8033",borderRadius:12,padding:"12px",fontFamily:'"DM Sans",sans-serif',fontSize:13,cursor:"pointer",width:"100%"}}>
            {pt?"✓ Lição do mês concluída":"✓ Lección del mes completada"}
          </button>}
          {done&&<div style={{marginTop:14,textAlign:"center",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#4ade80"}}>✅ {pt?"Concluída este mês":"Completada este mes"}</div>}
        </div>
      )}
    </div>
  );
}

const FREE_COACH_LIMIT = 5;

function CoachIA({userData, completed, lang, isPro, onBack, onAction}){
  const pt = lang==="pt";
  const monthKey = "hendy_coach_v1_"+new Date().getFullYear()+"_"+new Date().getMonth();
  const [usage,setUsage] = useState(()=>{
    try{ return JSON.parse(localStorage.getItem(monthKey)||"0"); }catch(e){ return 0; }
  });
  const remaining = isPro ? null : Math.max(0, FREE_COACH_LIMIT - usage);
  const blocked = !isPro && remaining<=0;

  const [messages,setMessages] = useState([{
    role:"assistant",
    text: pt
      ? "Oi! Sou o Hendy 🤖 Pergunte qualquer coisa sobre suas finanças — dívidas, poupança, compras, decisões do dia a dia. Vou responder considerando seu perfil."
      : "¡Hola! Soy Hendy 🤖 Preguntame lo que quieras sobre tus finanzas — deudas, ahorro, compras, decisiones del día a día. Voy a responder considerando tu perfil."
  }]);
  const [input,setInput] = useState("");
  const [loading,setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(()=>{
    if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  },[messages,loading]);

  const send = async()=>{
    const q = input.trim();
    if(!q || loading || blocked) return;
    const newMsgs = [...messages, {role:"user", text:q}];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);

    const diagScore = userData&&userData.diagnostico?userData.diagnostico.score:40;
    const score = calcScore(diagScore, (completed&&completed.length)||0);
    const a = (userData&&userData.answers)||{};
    const contextLine = pt
      ? `Perfil do usuário: situação financeira "${a.situacion||'não informado'}", dívidas "${a.deuda||'não informado'}", meta principal "${a.meta||'não informado'}", pontuação Hendy ${score}/100.`
      : `Perfil del usuario: situación financiera "${a.situacion||'no informado'}", deudas "${a.deuda||'no informado'}", meta principal "${a.meta||'no informado'}", puntaje Hendy ${score}/100.`;

    const systemPrompt = pt
      ? `Você é Hendy, um coach financeiro pessoal especializado no Mercosul (Paraguai, Brasil, Argentina, Uruguai), com tom próximo, direto e sem julgamentos. ${contextLine} Responda a pergunta do usuário em português brasileiro, de forma prática e específica, em no máximo 3 parágrafos curtos. Use exemplos em guaranis ou reais quando fizer sentido. Não use markdown nem listas — texto corrido natural.`
      : `Sos Hendy, un coach financiero personal especializado en el Mercosur (Paraguay, Brasil, Argentina, Uruguay), con tono cercano, directo y sin juicios. ${contextLine} Respondé la pregunta del usuario en español rioplatense, de forma práctica y específica, en máximo 3 párrafos cortos. Usá ejemplos en guaraníes o reales cuando tenga sentido. No uses markdown ni listas — texto corrido natural.`;

    try{
      const res = await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          model:"claude-sonnet-4-6",
          max_tokens:1000,
          messages:[{role:"user", content: systemPrompt + "\n\nPregunta del usuario: " + q}]
        })
      });
      const data = await res.json();
      const text = data.content&&data.content[0]?data.content[0].text:(pt?"Não consegui responder agora. Tente novamente.":"No pude responder ahora. Intentá de nuevo.");
      setMessages(m=>[...m,{role:"assistant",text}]);
      onAction&&onAction();
      if(!isPro){
        const nu = usage+1;
        setUsage(nu);
        try{ localStorage.setItem(monthKey, JSON.stringify(nu)); }catch(e){}
      }
    }catch(e){
      setMessages(m=>[...m,{role:"assistant",text:pt?"Erro de conexão. Tente novamente em instantes.":"Error de conexión. Intentá de nuevo en un momento."}]);
    }
    setLoading(false);
  };

  return(
    <div style={{width:"100%",maxWidth:390,height:"100vh",display:"flex",flexDirection:"column",animation:"fadeIn .4s ease"}}>
      <div style={{padding:"56px 20px 14px",display:"flex",alignItems:"center",gap:12,borderBottom:"1px solid #161616",flexShrink:0}}>
        <button onClick={onBack} style={{background:"#161616",border:"1px solid #2a2a2a",borderRadius:12,width:36,height:36,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#ccc",cursor:"pointer",fontSize:18}}>←</button>
        <span style={{fontSize:22}}>🤖</span>
        <div style={{flex:1}}>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff"}}>{pt?"Coach Hendy":"Coach Hendy"}</div>
          <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#666"}}>
            {isPro?(pt?"Perguntas ilimitadas ⭐":"Preguntas ilimitadas ⭐"):(pt?`${remaining} perguntas restantes este mês`:`${remaining} preguntas restantes este mes`)}
          </div>
        </div>
      </div>

      <div ref={scrollRef} style={{flex:1,overflowY:"auto",padding:"20px 20px 10px",display:"flex",flexDirection:"column",gap:14}}>
        {messages.map((m,i)=>(
          <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
            <div style={{
              maxWidth:"82%",
              background:m.role==="user"?"#FF4B2B":"#111",
              border:m.role==="user"?"none":"1px solid #1e1e1e",
              borderRadius:m.role==="user"?"18px 18px 4px 18px":"18px 18px 18px 4px",
              padding:"12px 16px",
              fontFamily:'"DM Sans",sans-serif',fontSize:14,
              color:m.role==="user"?"#fff":"#ddd",
              lineHeight:1.55,
              whiteSpace:"pre-wrap"
            }}>{m.text}</div>
          </div>
        ))}
        {loading&&(
          <div style={{display:"flex",justifyContent:"flex-start"}}>
            <div style={{background:"#111",border:"1px solid #1e1e1e",borderRadius:"18px 18px 18px 4px",padding:"14px 18px",display:"flex",gap:6}}>
              <span className="td"/><span className="td"/><span className="td"/>
            </div>
          </div>
        )}
        {blocked&&(
          <div style={{background:"linear-gradient(135deg,#1a1208,#120a1a)",border:"1px solid #facc1544",borderRadius:18,padding:18,textAlign:"center",marginTop:8}}>
            <div style={{fontSize:26,marginBottom:8}}>⭐</div>
            <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#facc15",marginBottom:6}}>
              {pt?"Você usou suas perguntas grátis deste mês":"Usaste tus preguntas gratis de este mes"}
            </div>
            <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#aaa",lineHeight:1.6}}>
              {pt?"Assine o Hendy Pro para perguntas ilimitadas ao coach.":"Suscribite a Hendy Pro para preguntas ilimitadas al coach."}
            </div>
          </div>
        )}
      </div>

      <div style={{padding:"12px 20px",paddingBottom:"calc(env(safe-area-inset-bottom) + 90px)",borderTop:"1px solid #161616",flexShrink:0}}>
        <div style={{display:"flex",gap:8,alignItems:"flex-end"}}>
          <textarea
            value={input}
            onChange={e=>setInput(e.target.value)}
            onKeyDown={e=>{ if(e.key==="Enter" && !e.shiftKey){ e.preventDefault(); send(); } }}
            placeholder={blocked?(pt?"Limite mensal atingido":"Límite mensual alcanzado"):(pt?"Escreva sua pergunta...":"Escribí tu pregunta...")}
            disabled={blocked}
            rows={1}
            style={{flex:1,background:"#111",border:"1px solid #2a2a2a",borderRadius:14,padding:"12px 16px",fontFamily:'"DM Sans",sans-serif',fontSize:14,color:"#fff",outline:"none",resize:"none",maxHeight:80,opacity:blocked?.5:1}}
          />
          <button onClick={send} disabled={!input.trim()||loading||blocked} style={{background:(!input.trim()||loading||blocked)?"#2a1510":"#FF4B2B",color:(!input.trim()||loading||blocked)?"#5a2a20":"#fff",border:"none",borderRadius:14,width:44,height:44,flexShrink:0,fontSize:18,cursor:(!input.trim()||loading||blocked)?"not-allowed":"pointer"}}>→</button>
        </div>
      </div>
    </div>
  );
}

function Academy({userData,streak,completed,onComplete,isPro,onUpgrade,lang}){
  const pt=lang==="pt";
  const [active,setActive]=useState(null);
  const [content,setContent]=useState(null);
  const [loading,setLoading]=useState(false);
  const [done,setDone]=useState(false);
  const [timer,setTimer]=useState(60);
  const [timerOn,setTimerOn]=useState(false);
  useEffect(()=>{if(!timerOn||timer<=0)return;const t=setInterval(()=>setTimer(s=>s-1),1000);return()=>clearInterval(t);},[timerOn,timer]);
  const openL=(l)=>{
    if(completed.includes(l.id))return;
    setActive(l);setContent(null);setLoading(true);setDone(false);setTimer(60);setTimerOn(false);
    setTimeout(()=>{setContent(getLessonContent(l.id,lang));setLoading(false);setTimerOn(true);},700);
  };
  const finish=()=>{setDone(true);setTimerOn(false);setTimeout(()=>{onComplete(active.id);setActive(null);setContent(null);setDone(false);},1800);};
  if(active){
    const tit=pt?active.tPT:active.tES;
    const cat=pt?active.catPT:active.cat;
    return(
      <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 40px",animation:"fadeIn .4s ease"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:32}}>
          <button onClick={()=>setActive(null)} style={{background:"#161616",border:"1px solid #2a2a2a",borderRadius:12,color:"#ccc",cursor:"pointer",fontFamily:'"DM Sans",sans-serif',fontSize:13,fontWeight:500,padding:"8px 14px"}}>{pt?"← Voltar":"← Volver"}</button>
          {timerOn&&<div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:13,color:timer>20?"#FF4B2B":"#4ade80",background:"#111",border:"1px solid #1e1e1e",borderRadius:100,padding:"6px 14px"}}>{timer>0?"⏱ "+timer+"s":"✅"}</div>}
        </div>
        {loading?(<div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}><div style={{fontSize:48,animation:"flicker 1.5s ease infinite",marginBottom:20}}>{active.emoji}</div><div style={{display:"flex",gap:8}}><span className="td"/><span className="td"/><span className="td"/></div></div>)
        :content?(
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:24}}>
              <span style={{fontSize:36}}>{active.emoji}</span>
              <div>
                <span style={{display:"inline-flex",alignItems:"center",padding:"4px 10px",borderRadius:100,fontSize:11,fontFamily:'"DM Sans",sans-serif',fontWeight:500,background:(CAT_COLOR[cat]||"#888")+"20",color:CAT_COLOR[cat]||"#888"}}>{cat}</span>
                <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:20,color:"#fff",marginTop:6}}>{tit}</div>
              </div>
            </div>
            <div style={{background:"#130a09",border:"1px solid #FF4B2B33",borderRadius:16,padding:"16px 20px",marginBottom:20}}>
              <p style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#FF4B2B",lineHeight:1.5}}>"{content.g}"</p>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:14,marginBottom:20}}>
              {(content.c||"").split("\n\n").filter(Boolean).map((p,i)=><p key={i} style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:15,color:"#ccc",lineHeight:1.75}}>{p}</p>)}
            </div>
            {content.d&&<div style={{background:"#0d1a0d",border:"1px solid #4ade8033",borderRadius:16,padding:"16px 20px",marginBottom:16}}>
              <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#4ade80",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>{pt?"📊 Dado chave":"📊 Dato clave"}</div>
              <p style={{fontFamily:'"DM Sans",sans-serif',fontWeight:400,fontSize:14,color:"#ccc",lineHeight:1.6}}>{content.d}</p>
            </div>}
            {content.a&&<div style={{background:"#1a1208",border:"1px solid #facc1533",borderRadius:16,padding:"16px 20px",marginBottom:28}}>
              <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#facc15",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:8}}>{pt?"🎯 Sua ação deste mês":"🎯 Tu acción de este mes"}</div>
              <p style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:500,fontSize:15,color:"#fff",lineHeight:1.5}}>{content.a}</p>
            </div>}
            {done?(<div style={{textAlign:"center",animation:"bpop .5s ease"}}><div style={{fontSize:64,marginBottom:12}}>✅</div><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:22,color:"#4ade80"}}>{pt?"Lição concluída!":"¡Lección completada!"}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontSize:14,color:"#aaa",marginTop:8}}>{pt?"Sua sequência continua crescendo 🔥":"Tu racha sigue creciendo 🔥"}</div></div>)
            :<button className="btn" onClick={finish} style={{animation:"none"}}>{pt?"Marcar como concluída ✓":"Marcar como completada ✓"}</button>}
          </div>
        ):null}
      </div>
    );
  }
  const todayL=LECCIONES.find(l=>!completed.includes(l.id));
  const prog=Math.round((completed.length/LECCIONES.length)*100);
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .4s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px"}}>{pt?"Academia":"Academia"}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#aaa",marginTop:4}}>{pt?"Aprenda um pouco a cada dia":"Aprendé un poco cada día"}</div></div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#1a1208",border:"1px solid #3a2810",borderRadius:100,padding:"8px 16px"}}><span style={{fontSize:18}}>🔥</span><span style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:16,color:"#FF4B2B"}}>{streak}</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888"}}>{pt?"dias":"días"}</span></div>
      </div>
      <div className="card" style={{marginBottom:20}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#fff"}}>{pt?"Seu progresso":"Tu progreso"}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#FF4B2B",fontWeight:500}}>{completed.length}/{LECCIONES.length}</div></div>
        <div className="pbar"><div className="pfill" style={{"--p":prog+"%"}}/></div>
        <div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#888",marginTop:10}}>{prog===0?(pt?"Comece hoje!":"¡Empezá hoy!"):prog<50?(pt?"Indo bem!":"¡Vas bien!"):prog<100?(pt?"Mais da metade! 💪":"¡Ya más de la mitad! 💪"):(pt?"Tudo concluído! 🏆":"¡Todo completado! 🏆")}</div>
      </div>
      {isPro&&(
        <div style={{marginBottom:20}}>
          <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#facc15",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>
            ⭐ {lang==="pt"?"Lição do Mês":"Lección del Mes"}
          </div>
          {completed.length>=LECCIONES.length
            ?<AIMonthLesson userData={userData} lang={lang} isPro={isPro} completed={completed}/>
            :<div style={{background:"#111",border:"1px solid #facc1522",borderRadius:18,padding:20,textAlign:"center"}}>
              <div style={{fontSize:32,marginBottom:10}}>🔒</div>
              <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#facc15",marginBottom:8}}>
                {lang==="pt"?"Disponível após completar as 21 lições":"Disponible al completar las 21 lecciones"}
              </div>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#888",lineHeight:1.6}}>
                {lang==="pt"
                  ?`${LECCIONES.length-completed.length} lições restantes para desbloquear`
                  :`${LECCIONES.length-completed.length} lecciones restantes para desbloquear`}
              </div>
            </div>
          }
        </div>
      )}
      {todayL&&<div style={{marginBottom:16}}>
        <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#FF4B2B",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>{pt?"📅 Lição de hoje":"📅 Lección de hoy"}</div>
        <button className="lc today" onClick={()=>openL(todayL)}>
          <div style={{display:"flex",alignItems:"flex-start",gap:14}}><span style={{fontSize:30,flexShrink:0}}>{todayL.emoji}</span><div style={{flex:1}}><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff",marginBottom:6}}>{pt?todayL.tPT:todayL.tES}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#FF4B2B",fontWeight:500}}>{pt?"Começar →":"Empezar →"}</div></div></div>
        </button>
      </div>}
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#888",letterSpacing:"2px",textTransform:"uppercase"}}>{pt?"Todas as lições":"Todas las lecciones"} ({LECCIONES.length})</div>
        {!isPro&&<div style={{background:"#1a1208",border:"1px solid #facc1533",borderRadius:100,padding:"4px 10px",fontFamily:'"DM Sans",sans-serif',fontSize:10,color:"#facc15"}}>{FREE_LESSONS} {pt?"grátis · Pro ilimitado":"gratis · Pro ilimitado"}</div>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {LECCIONES.map((l,i)=>{
          const isDone=completed.includes(l.id);
          const isLocked=!isPro&&i>=FREE_LESSONS&&!isDone;
          const cat=pt?l.catPT:l.cat;
          return(
            <button key={l.id} className={"lc"+(isDone?" done":isLocked?" locked":"")} onClick={()=>{if(isLocked){onUpgrade();}else if(!isDone){openL(l);}}} style={{opacity:isDone?.65:isLocked?.5:1,position:"relative",overflow:"hidden",cursor:isLocked||isDone?"default":"pointer"}}>
              <div style={{display:"flex",alignItems:"center",gap:14,filter:isLocked?"blur(1px)":"none"}}>
                <span style={{fontSize:24,flexShrink:0}}>{isDone?"✅":l.emoji}</span>
                <div style={{flex:1}}>
                  <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:isDone?"#555":"#fff",marginBottom:4}}>{pt?l.tPT:l.tES}</div>
                  <span style={{display:"inline-flex",alignItems:"center",padding:"3px 8px",borderRadius:100,fontSize:10,fontFamily:'"DM Sans",sans-serif',background:(CAT_COLOR[cat]||"#888")+"15",color:isDone?"#555":CAT_COLOR[cat]||"#888"}}>{cat}</span>
                </div>
                {isDone?<span style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#4ade80"}}>{pt?"Feita":"Lista"}</span>:<span style={{color:"#555",fontSize:16}}>›</span>}
              </div>
              {isLocked&&<div style={{position:"absolute",inset:0,background:"rgba(10,10,10,.85)",borderRadius:18,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4}}><span style={{fontSize:20}}>🔒</span><span style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:11,color:"#facc15"}}>Hendy Pro</span></div>}
            </button>
          );
        })}
      </div>
      {!isPro&&<div style={{marginTop:20,background:"linear-gradient(135deg,#1a1208,#120a1a)",border:"1px solid #facc1544",borderRadius:20,padding:20}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}><span style={{fontSize:22}}>⭐</span><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#facc15"}}>{pt?"Desbloqueie tudo com o Pro":"Desbloqueá todo con Pro"}</div></div>
        <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:14}}>
          {[pt?"📚 21 lições disponíveis todo mês":"📚 21 lecciones disponibles cada mes",
            pt?"🔄 Lições renovadas no 1° de cada mês":"🔄 Lecciones renovadas el 1° de cada mes",
            pt?"🤖 +1 lição IA exclusiva ao concluir as 21":"🤖 +1 lección IA exclusiva al completar las 21",
            pt?"💰 Solo R$10/mês · Cancele quando quiser":"💰 Solo $2/mes · Cancelá cuando quieras"
          ].map((item,i)=>(
            <div key={i} style={{fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#ccc",display:"flex",alignItems:"center",gap:8}}>{item}</div>
          ))}
        </div>
        <button onClick={onUpgrade} style={{background:"linear-gradient(135deg,#facc15,#f59e0b)",color:"#000",border:"none",borderRadius:14,padding:"14px 20px",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:14,cursor:"pointer",width:"100%"}}>{pt?"Assinar Hendy Pro →":"Suscribirse a Hendy Pro →"}</button>
      </div>}
    </div>
  );
}

function ProScreen({onActivate,onBack,lang}){
  const pt=lang==="pt";
  const [payOpened,setPayOpened]=useState(false);
  const [confirming,setConfirming]=useState(false);
  const feats=pt?["📚 21 lições por mês + IA personalizada","🧠 Plano financeiro gerado pela IA","🎯 Diagnóstico completo do seu perfil","🏆 Todas as conquistas desbloqueadas","🔄 Lições renovadas todo mês"]:["📚 21 lecciones por mes + IA personalizada","🧠 Plan financiero generado por IA","🎯 Diagnóstico completo de tu perfil","🏆 Todos los logros desbloqueados","🔄 Lecciones renovadas cada mes"];
  const handlePay=()=>{
    window.open(PRO_PAYMENT_LINK,"_blank");
    setPayOpened(true);
  };
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 40px",animation:"fadeIn .4s ease"}}>
      <button onClick={onBack} style={{background:"#161616",border:"1px solid #2a2a2a",borderRadius:12,color:"#ccc",cursor:"pointer",fontFamily:'"DM Sans",sans-serif',fontSize:13,fontWeight:500,marginBottom:36,padding:"8px 14px",display:"flex",alignItems:"center",gap:6,width:"fit-content"}}>{pt?"← Voltar":"← Volver"}</button>
      <div style={{textAlign:"center",marginBottom:32}}>
        <div style={{fontSize:52,marginBottom:16}}>🔥</div>
        <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#1a1208",border:"1px solid #facc1544",borderRadius:100,padding:"6px 16px",marginBottom:16}}><span style={{fontSize:14}}>⭐</span><span style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:13,color:"#facc15"}}>HENDY PRO</span></div>
        <h1 style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:32,color:"#fff",letterSpacing:"-1.5px",lineHeight:1.1,marginBottom:12}}>{pt?<>Aprenda sem<br/><span style={{color:"#facc15"}}>limites.</span></>:<>Aprendé sin<br/><span style={{color:"#facc15"}}>límites.</span></>}</h1>
      </div>
      <div style={{background:"linear-gradient(135deg,#1a1208,#120a1a)",border:"1px solid #facc1544",borderRadius:20,padding:24,marginBottom:24,animation:"proGlow 3s ease infinite"}}>
        <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:40,color:"#facc15",letterSpacing:"-2px",textAlign:"center",lineHeight:1}}>$2<span style={{fontSize:16,color:"#888",fontWeight:300}}>{pt?"/mês":"/mes"}</span></div>
        <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#888",textAlign:"center",marginTop:4,marginBottom:20}}>{pt?"Menos que um café ☕":"Menos que un tereré 🧉"}</div>
        {feats.map((f,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 0",borderBottom:i<feats.length-1?"1px solid #1a1a1a":"none"}}><span style={{fontFamily:'"DM Sans",sans-serif',fontWeight:400,fontSize:14,color:"#ccc",flex:1}}>{f}</span><span style={{color:"#facc15",fontSize:14}}>✓</span></div>)}
      </div>
      {!payOpened&&(
        <button onClick={handlePay} style={{background:"linear-gradient(135deg,#facc15,#f59e0b)",color:"#000",border:"none",borderRadius:16,padding:"18px",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:16,cursor:"pointer",width:"100%",marginBottom:12,animation:"proGlow 2s ease infinite"}}>
          {pt?"Assinar Hendy Pro — $2/mês →":"Suscribirse a Hendy Pro — $2/mes →"}
        </button>
      )}
      {payOpened&&!confirming&&(
        <div style={{marginBottom:12}}>
          <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#aaa",marginBottom:12,textAlign:"center",lineHeight:1.6}}>
            {pt?"Complete o pagamento na página que abrimos e volte aqui para confirmar:":"Completá el pago en la página que abrimos y volvé acá para confirmar:"}
          </div>
          <button onClick={()=>setConfirming(true)} style={{background:"linear-gradient(135deg,#4ade80,#22c55e)",color:"#000",border:"none",borderRadius:16,padding:"16px",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:15,cursor:"pointer",width:"100%",marginBottom:10}}>
            {pt?"✓ Já realizei o pagamento":"✓ Ya realicé el pago"}
          </button>
          <button onClick={handlePay} style={{background:"none",border:"1px solid #2a2a2a",borderRadius:14,padding:"12px",fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#888",cursor:"pointer",width:"100%"}}>
            {pt?"Abrir página de pagamento novamente":"Abrir página de pago de nuevo"}
          </button>
        </div>
      )}
      {confirming&&(
        <div style={{marginBottom:12,textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:12}}>⏳</div>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#facc15",marginBottom:8}}>
            {pt?"Verificando pagamento...":"Verificando pago..."}
          </div>
          <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#aaa",marginBottom:16,lineHeight:1.6}}>
            {pt?"Se o pagamento foi confirmado, clique abaixo para ativar:":"Si el pago fue confirmado, hacé clic abajo para activar:"}
          </div>
          <button onClick={onActivate} style={{background:"linear-gradient(135deg,#facc15,#f59e0b)",color:"#000",border:"none",borderRadius:16,padding:"16px",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:15,cursor:"pointer",width:"100%"}}>
            {pt?"🔥 Ativar meu Hendy Pro":"🔥 Activar mi Hendy Pro"}
          </button>
        </div>
      )}
      <div style={{textAlign:"center",fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#555",lineHeight:1.8}}>
        {pt?"Cancele quando quiser · Sem compromisso":"Cancelá cuando quieras · Sin compromisos"}<br/>
        {pt?"Pagamento via MercadoPago 🔒":"Pago via MercadoPago 🔒"}
      </div>
    </div>
  );
}

const RETO_TEMPLATES = [
  {id:"emergencia",icon:"🛡️",es:"Fondo de emergencia",pt:"Fundo de emergência",sugES:1000000,sugPT:1000},
  {id:"vacaciones",icon:"🏖️",es:"Vacaciones",pt:"Férias",sugES:1500000,sugPT:1500},
  {id:"moto",icon:"🏍️",es:"Mi moto",pt:"Minha moto",sugES:8000000,sugPT:8000},
  {id:"casa",icon:"🏠",es:"Casa propia",pt:"Casa própria",sugES:50000000,sugPT:50000},
  {id:"estudio",icon:"🎓",es:"Mis estudios",pt:"Meus estudos",sugES:3000000,sugPT:3000},
  {id:"custom",icon:"✨",es:"Personalizado",pt:"Personalizado",sugES:0,sugPT:0},
];

function RetosScreen({retos,setRetos,lang,showToast,onAction,onNav}){
  const pt=lang==="pt";
  const [creating,setCreating]=useState(false);
  const [pickedTpl,setPickedTpl]=useState(null);
  const [nombre,setNombre]=useState("");
  const [objetivo,setObjetivo]=useState("");
  const [addingTo,setAddingTo]=useState(null);
  const [addAmount,setAddAmount]=useState("");

  const fmt=(n)=>"G "+Number(n||0).toLocaleString("es-PY");

  const pickTemplate=(tpl)=>{
    setPickedTpl(tpl);
    setNombre(pt?tpl.pt:tpl.es);
    setObjetivo(tpl.id==="custom"?"":String(tpl.sugES));
  };

  const createReto=()=>{
    const obj=parseInt(objetivo)||0;
    if(!nombre.trim()||obj<=0)return;
    const nuevo={id:Date.now(),nombre:nombre.trim(),icon:(pickedTpl&&pickedTpl.icon)||"🎯",objetivo:obj,ahorrado:0,creado:Date.now()};
    setRetos([...retos,nuevo]);
    setCreating(false);setPickedTpl(null);setNombre("");setObjetivo("");
    showToast&&showToast({emoji:"🎯",titulo:pt?"Desafio criado!":"¡Reto creado!",desc:pt?"Comece a guardar para sua meta.":"Empezá a guardar para tu meta."});
  };

  const addSavings=(retoId)=>{
    const amt=parseInt(addAmount)||0;
    if(amt<=0)return;
    setRetos(retos.map(r=>{
      if(r.id!==retoId)return r;
      const newAhorrado=(r.ahorrado||0)+amt;
      if(newAhorrado>=r.objetivo && (r.ahorrado||0)<r.objetivo){
        showToast&&showToast({emoji:"🎉",titulo:pt?"Meta alcançada!":"¡Meta alcanzada!",desc:r.nombre});
      }
      return {...r,ahorrado:newAhorrado};
    }));
    setAddAmount("");setAddingTo(null);
    onAction&&onAction();
  };

  const removeReto=(retoId)=>{
    setRetos(retos.filter(r=>r.id!==retoId));
  };

  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .4s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px"}}>{pt?"Desafios de poupança":"Retos de ahorro"}</div>
          <div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#aaa",marginTop:4}}>{pt?"Cumpra metas, ganhe motivação":"Cumplí metas, ganá motivación"}</div>
        </div>
        {onNav&&<button onClick={()=>onNav("simuladores")} style={{background:"#161616",border:"1px solid #2a2a2a",borderRadius:12,width:40,height:40,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,cursor:"pointer"}}>🧮</button>}
      </div>

      {retos.length===0&&!creating&&(
        <div className="card" style={{textAlign:"center",padding:"36px 20px",marginBottom:16}}>
          <div style={{fontSize:40,marginBottom:12}}>🎯</div>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff",marginBottom:8}}>{pt?"Ainda não tem desafios":"Todavía no tenés retos"}</div>
          <p style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#888",lineHeight:1.6}}>{pt?"Crie um desafio de poupança para uma meta concreta — moto, viagem, fundo de emergência.":"Creá un reto de ahorro para una meta concreta — moto, viaje, fondo de emergencia."}</p>
        </div>
      )}

      {retos.map(r=>{
        const pct=Math.min(100,Math.round(((r.ahorrado||0)/r.objetivo)*100));
        const complete=pct>=100;
        return(
          <div key={r.id} className="card" style={{marginBottom:14,borderColor:complete?"#4ade8044":"#1e1e1e"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
              <div style={{display:"flex",alignItems:"center",gap:10}}>
                <span style={{fontSize:24}}>{r.icon}</span>
                <div>
                  <div style={{fontSize:10,fontFamily:'"DM Sans",sans-serif',color:"#888",letterSpacing:"1px",textTransform:"uppercase"}}>{pt?"Meta:":"Meta:"}</div>
                  <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#fff"}}>{r.nombre}</div>
                </div>
              </div>
              <button onClick={()=>removeReto(r.id)} style={{background:"none",border:"none",color:"#555",cursor:"pointer",fontSize:16,padding:4}}>✕</button>
            </div>
            <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:20,color:"#fff",marginBottom:8}}>{fmt(r.objetivo)}</div>
            <div className="pbar" style={{marginBottom:8}}><div className="pfill" style={{"--p":pct+"%",background:complete?"#4ade80":"#FF4B2B"}}/></div>
            <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#aaa",marginBottom:complete?0:14}}>{pt?"Guardado: ":"Ahorrado: "}{fmt(r.ahorrado||0)} ({pct}%)</div>
            {complete?(
              <div style={{marginTop:10,textAlign:"center",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:13,color:"#4ade80"}}>🎉 {pt?"Meta alcançada!":"¡Meta alcanzada!"}</div>
            ):addingTo===r.id?(
              <div style={{display:"flex",gap:8}}>
                <NumInput value={parseInput(addAmount)} onChange={v=>setAddAmount(String(v))} placeholder={pt?"Valor":"Monto"} style={{padding:"10px 14px",fontSize:14}}/>
                <button onClick={()=>addSavings(r.id)} style={{background:"#FF4B2B",color:"#fff",border:"none",borderRadius:12,padding:"10px 18px",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:13,cursor:"pointer",flexShrink:0}}>OK</button>
              </div>
            ):(
              <button onClick={()=>setAddingTo(r.id)} className="btn" style={{animation:"none",padding:"11px 18px",fontSize:13}}>{pt?"+ Guardar":"+ Ahorrar"}</button>
            )}
          </div>
        );
      })}

      {!creating?(
        <button onClick={()=>setCreating(true)} className="btng" style={{marginTop:retos.length?6:0}}>
          {pt?"+ Criar novo desafio":"+ Crear nuevo reto"}
        </button>
      ):(
        <div className="card">
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff",marginBottom:14}}>{pt?"Novo desafio":"Nuevo reto"}</div>
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:16}}>
            {RETO_TEMPLATES.map(tpl=>(
              <button key={tpl.id} onClick={()=>pickTemplate(tpl)} style={{
                background:pickedTpl&&pickedTpl.id===tpl.id?"#FF4B2B":"#111",
                border:"1px solid "+(pickedTpl&&pickedTpl.id===tpl.id?"#FF4B2B":"#2a2a2a"),
                borderRadius:12,padding:"8px 12px",cursor:"pointer",
                fontFamily:'"DM Sans",sans-serif',fontSize:12,
                color:pickedTpl&&pickedTpl.id===tpl.id?"#fff":"#ccc",
                display:"flex",alignItems:"center",gap:6
              }}>
                <span>{tpl.icon}</span><span>{pt?tpl.pt:tpl.es}</span>
              </button>
            ))}
          </div>
          <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder={pt?"Nome do desafio":"Nombre del reto"}
            style={{width:"100%",background:"#111",border:"1px solid #2a2a2a",borderRadius:12,padding:"12px 14px",fontFamily:'"DM Sans",sans-serif',fontSize:14,color:"#fff",marginBottom:10,outline:"none"}}/>
          <NumInput value={parseInput(objetivo)} onChange={v=>setObjetivo(String(v))} placeholder={pt?"Valor objetivo":"Monto objetivo"} style={{marginBottom:16}}/>
          <button onClick={createReto} className="btn" style={{animation:"none",padding:"13px 20px",fontSize:14,marginBottom:8}}>{pt?"Criar desafio →":"Crear reto →"}</button>
          <button onClick={()=>{setCreating(false);setPickedTpl(null);setNombre("");setObjetivo("");}} style={{background:"none",border:"none",color:"#888",fontFamily:'"DM Sans",sans-serif',fontSize:12,cursor:"pointer",width:"100%",textAlign:"center"}}>{pt?"Cancelar":"Cancelar"}</button>
        </div>
      )}
    </div>
  );
}

function SimuladoresScreen({lang,onAction}){
  const pt=lang==="pt";
  const [tab,setTab]=useState("credito");
  const [c_monto,setC_monto]=useState(0);
  const [c_tasa,setC_tasa]=useState(0);
  const [c_meses,setC_meses]=useState(0);
  const [a_monto,setA_monto]=useState(0);
  const [a_tasa,setA_tasa]=useState(0);
  const [a_meses,setA_meses]=useState(0);
  const [fx_gs,setFx_gs]=useState("");
  const [fx_brl,setFx_brl]=useState("");
  const [fx_usd,setFx_usd]=useState("");
  const [tcUsd,setTcUsd]=useState(()=>{try{return parseInt(localStorage.getItem("hendy_tc_usd"))||6080;}catch(e){return 6080;}});
  const [tcBrl,setTcBrl]=useState(()=>{try{return parseInt(localStorage.getItem("hendy_tc_brl"))||1187;}catch(e){return 1187;}});
  const [editingRates,setEditingRates]=useState(false);
  const firedRef=useRef(false);

  const fmt=(n)=>Number(Math.round(n)||0).toLocaleString(pt?"pt-BR":"es-PY");

  const creditoResult=()=>{
    const P=c_monto||0, r=(c_tasa||0)/100/12, n=c_meses||0;
    if(P<=0||n<=0)return null;
    if(r===0)return{cuota:P/n,total:P,intereses:0};
    const cuota=P*(r*Math.pow(1+r,n))/(Math.pow(1+r,n)-1);
    return{cuota,total:cuota*n,intereses:cuota*n-P};
  };

  const ahorroResult=()=>{
    const P=a_monto||0, r=(a_tasa||0)/100/12, n=a_meses||0;
    if(P<=0||n<=0)return null;
    if(r===0)return{total:P*n,intereses:0};
    const total=P*(Math.pow(1+r,n)-1)/r;
    return{total,intereses:total-P*n};
  };

  const convertFx=(val,from)=>{
    const v=parseFloat(val)||0;
    if(from==="gs"){setFx_gs(String(v));setFx_brl(String(Math.round(v/tcBrl)));setFx_usd(String(Math.round(v/tcUsd)));}
    if(from==="brl"){setFx_brl(String(v));setFx_gs(String(Math.round(v*tcBrl)));setFx_usd(String((v/tcUsd*tcBrl).toFixed(2)));}
    if(from==="usd"){setFx_usd(String(v));setFx_gs(String(Math.round(v*tcUsd)));setFx_brl(String(Math.round(v*tcUsd/tcBrl)));}
    onAction&&onAction();
  };

  const saveRates=()=>{
    try{localStorage.setItem("hendy_tc_usd",String(tcUsd));localStorage.setItem("hendy_tc_brl",String(tcBrl));}catch(e){}
    setEditingRates(false);
  };

  const tabs=[
    {id:"credito",icon:"💳",es:"Crédito",pt:"Crédito"},
    {id:"ahorro",icon:"🐷",es:"Ahorro",pt:"Poupança"},
    {id:"cambio",icon:"💱",es:"Cambio",pt:"Câmbio"},
  ];

  const cr=creditoResult(), ar=ahorroResult();

  useEffect(()=>{
    if((cr||ar)&&!firedRef.current){
      firedRef.current=true;
      onAction&&onAction();
    }
  },[cr,ar]);

  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .4s ease"}}>
      <div style={{marginBottom:24}}>
        <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px"}}>{pt?"Simuladores":"Simuladores"}</div>
        <div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#aaa",marginTop:4}}>{pt?"Calcule antes de decidir":"Calculá antes de decidir"}</div>
      </div>

      <div style={{display:"flex",gap:8,marginBottom:20}}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,background:tab===t.id?"#FF4B2B":"#111",border:"1px solid "+(tab===t.id?"#FF4B2B":"#2a2a2a"),borderRadius:12,padding:"10px 4px",cursor:"pointer",fontFamily:'"DM Sans",sans-serif',fontSize:12,fontWeight:600,color:tab===t.id?"#fff":"#888",display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
            <span style={{fontSize:18}}>{t.icon}</span><span>{pt?t.pt:t.es}</span>
          </button>
        ))}
      </div>

      {tab==="credito"&&(
        <div>
          <div className="card" style={{marginBottom:14}}>
            <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff",marginBottom:16}}>{pt?"💳 Simulador de crédito":"💳 Simulador de crédito"}</div>
            <div style={{marginBottom:10}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:4}}>{pt?"Valor do empréstimo":"Monto del préstamo"}</div>
              <NumInput value={c_monto} onChange={setC_monto} placeholder="5.000.000"/>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:4}}>{pt?"Taxa de juros anual (%)":"Tasa de interés anual (%)"}</div>
              <NumInput value={c_tasa} onChange={setC_tasa} placeholder="24"/>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:4}}>{pt?"Prazo em meses":"Plazo en meses"}</div>
              <NumInput value={c_meses} onChange={setC_meses} placeholder="12"/>
            </div>
          </div>
          {cr&&(
            <div className="card" style={{borderColor:"#FF4B2B33"}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>{pt?"Resultado":"Resultado"}</div>
              {[
                {l:pt?"Parcela mensal":"Cuota mensual",v:fmt(cr.cuota),c:"#FF4B2B"},
                {l:pt?"Total a pagar":"Total a pagar",v:fmt(cr.total),c:"#facc15"},
                {l:pt?"Total em juros":"Total en intereses",v:fmt(cr.intereses),c:"#f87171"},
              ].map((row,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<2?"1px solid #161616":"none"}}>
                  <span style={{fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#aaa"}}>{row.l}</span>
                  <span style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:row.c}}>{row.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==="ahorro"&&(
        <div>
          <div className="card" style={{marginBottom:14}}>
            <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff",marginBottom:16}}>{pt?"🐷 Simulador de poupança":"🐷 Simulador de ahorro"}</div>
            <div style={{marginBottom:10}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:4}}>{pt?"Poupança mensal":"Ahorro mensual"}</div>
              <NumInput value={a_monto} onChange={setA_monto} placeholder="200.000"/>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:4}}>{pt?"Taxa de juros anual (%)":"Tasa de interés anual (%)"}</div>
              <NumInput value={a_tasa} onChange={setA_tasa} placeholder="8"/>
            </div>
            <div style={{marginBottom:10}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:4}}>{pt?"Prazo em meses":"Plazo en meses"}</div>
              <NumInput value={a_meses} onChange={setA_meses} placeholder="24"/>
            </div>
          </div>
          {ar&&(
            <div className="card" style={{borderColor:"#4ade8033"}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>{pt?"Resultado":"Resultado"}</div>
              {[
                {l:pt?"Total acumulado":"Total acumulado",v:fmt(ar.total),c:"#4ade80"},
                {l:pt?"O que você aporta":"Lo que aportás",v:fmt(a_monto*a_meses||0),c:"#fff"},
                {l:pt?"Juros ganhos":"Intereses ganados",v:fmt(ar.intereses),c:"#facc15"},
              ].map((row,i)=>(
                <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:i<2?"1px solid #161616":"none"}}>
                  <span style={{fontFamily:'"DM Sans",sans-serif',fontSize:13,color:"#aaa"}}>{row.l}</span>
                  <span style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:row.c}}>{row.v}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab==="cambio"&&(
        <div className="card">
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
            <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff"}}>{pt?"💱 Conversor de moedas":"💱 Conversor de monedas"}</div>
            <button onClick={()=>setEditingRates(!editingRates)} style={{background:"none",border:"none",color:"#FF4B2B",fontFamily:'"DM Sans",sans-serif',fontSize:11,cursor:"pointer"}}>{editingRates?(pt?"Fechar":"Cerrar"):(pt?"Editar taxa":"Editar tasa")}</button>
          </div>
          {editingRates?(
            <div style={{background:"#0a0a0a",border:"1px solid #2a2a2a",borderRadius:12,padding:12,marginBottom:14}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:8,lineHeight:1.5}}>
                {pt?"Não há API pública gratuita. Atualize manualmente com a cotação oficial do dia (dnit.gov.py/cotizaciones).":"No hay API pública gratuita. Actualizá manualmente con la cotización oficial del día (dnit.gov.py/cotizaciones)."}
              </div>
              <div style={{marginBottom:8}}>
                <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:3}}>1 USD = G</div>
                <NumInput value={tcUsd} onChange={setTcUsd} placeholder="7300" style={{fontSize:14,padding:"8px 12px"}}/>
              </div>
              <div style={{marginBottom:10}}>
                <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:3}}>1 BRL = G</div>
                <NumInput value={tcBrl} onChange={setTcBrl} placeholder="1350" style={{fontSize:14,padding:"8px 12px"}}/>
              </div>
              <button onClick={saveRates} style={{background:"#FF4B2B",color:"#fff",border:"none",borderRadius:10,padding:"8px 16px",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:12,cursor:"pointer",width:"100%"}}>{pt?"Salvar taxas":"Guardar tasas"}</button>
            </div>
          ):(
            <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#666",marginBottom:16}}>{pt?`Tipos de câmbio: 1 USD ≈ G ${fmt(tcUsd)} · 1 BRL ≈ G ${fmt(tcBrl)}`:`Tipos de cambio: 1 USD ≈ G ${fmt(tcUsd)} · 1 BRL ≈ G ${fmt(tcBrl)}`}</div>
          )}
          {[
            {label:"Guaraníes (G)",icon:"🇵🇾",val:fx_gs,from:"gs"},
            {label:"Reales (BRL)",icon:"🇧🇷",val:fx_brl,from:"brl"},
            {label:"Dólares (USD)",icon:"🇺🇸",val:fx_usd,from:"usd"},
          ].map((f,i)=>(
            <div key={i} style={{marginBottom:12}}>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginBottom:4,display:"flex",alignItems:"center",gap:6}}><span>{f.icon}</span>{f.label}</div>
              <NumInput value={parseInput(f.val)} onChange={v=>convertFx(String(v),f.from)} placeholder="0" style={{fontSize:16}}/>
            </div>
          ))}
          <div style={{background:"#111",borderRadius:12,padding:"10px 14px",marginTop:4}}>
            <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#666",lineHeight:1.7}}>
              {pt?"⚠️ Tipo de câmbio referencial (fonte: DNIT), definido manualmente. Consulte dnit.gov.py/cotizaciones para o valor de hoje.":"⚠️ Tipo de cambio referencial (fuente: DNIT), definido manualmente. Consultá dnit.gov.py/cotizaciones para el valor de hoy."}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Logros({completed,streak,userData,lang}){
  const pt=lang==="pt";
  const earned=BADGES.filter(b=>b.req(completed.length,streak,userData));
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .4s ease"}}>
      <div style={{marginBottom:28}}><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px"}}>{pt?"Suas conquistas":"Tus logros"}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#aaa",marginTop:4}}>{earned.length} de {BADGES.length} {pt?"conquistadas":"ganados"}</div></div>
      <div className="card" style={{marginBottom:24}}>
        <div className="pbar" style={{marginBottom:10}}><div className="pfill" style={{"--p":Math.round(earned.length/BADGES.length*100)+"%",background:"#facc15"}}/></div>
        <div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#888"}}>{earned.length===0?(pt?"Conclua sua primeira lição para desbloquear.":"Completá tu primera lección para desbloquear."):earned.length===BADGES.length?(pt?"Coleção completa! 🏆":"¡Colección completa! 🏆"):(BADGES.length-earned.length)+" "+(pt?"conquistas por desbloquear.":"logros por desbloquear.")}</div>
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:10}}>
        {BADGES.map((b,i)=>{
          const isE=b.req(completed.length,streak,userData);
          return(
            <div key={b.id} className={"bc"+(isE?" earned":" locked")} style={{animation:isE?"bpop .5s ease "+(i*.07)+"s both":"fadeIn .3s ease "+(i*.05)+"s both"}}>
              <div style={{width:52,height:52,borderRadius:14,background:isE?"#1a1208":"#111",border:"1px solid "+(isE?"#facc1544":"#1e1e1e"),display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,filter:isE?"none":"grayscale(1)"}}>{b.emoji}</div>
              <div style={{flex:1}}><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:isE?"#fff":"#333",marginBottom:3}}>{pt?b.tPT:b.tES}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:isE?"#888":"#2a2a2a"}}>{pt?b.dPT:b.dES}</div></div>
              {isE&&<div style={{fontSize:16}}>✨</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Sistema de niveles basado en score
const NIVELES = [
  {min:0,  max:19, num:1, esNombre:"Hendy",              ptNombre:"Hendy",              emoji:"🔥", color:"#888"},
  {min:20, max:39, num:2, esNombre:"Organizado",          ptNombre:"Organizado",         emoji:"📋", color:"#60a5fa"},
  {min:40, max:59, num:3, esNombre:"Ahorrador",           ptNombre:"Poupador",           emoji:"🐷", color:"#facc15"},
  {min:60, max:79, num:4, esNombre:"Inversionista",       ptNombre:"Investidor",         emoji:"📈", color:"#4ade80"},
  {min:80, max:100,num:5, esNombre:"Embajador Financiero",ptNombre:"Embaixador Financeiro",emoji:"🏆",color:"#FF4B2B"},
];
function getNivel(score){
  return NIVELES.find(n=>score>=n.min&&score<=n.max)||NIVELES[0];
}
function getProxNivel(score){
  return NIVELES.find(n=>n.min>score)||null;
}

// ── Misiones diarias ──────────────────────────────────────────────────────────
const MISIONES_ES = [
  {id:"m1", emoji:"📝", texto:"Anotá un gasto que hiciste hoy", xp:20, action:null},
  {id:"m2", emoji:"🎯", texto:"Revisá el progreso de tu meta financiera", xp:15, action:null},
  {id:"m3", emoji:"📚", texto:"Completá una lección de la Academia", xp:30, action:"academy"},
  {id:"m4", emoji:"💬", texto:"Hacele una pregunta al Coach Hendy", xp:25, action:"coach"},
  {id:"m5", emoji:"💰", texto:"Agregá un ahorro a uno de tus retos", xp:20, action:"retos"},
  {id:"m6", emoji:"🧮", texto:"Usá el simulador de crédito o ahorro", xp:15, action:"simuladores"},
  {id:"m7", emoji:"🔥", texto:"Revisá tu Hendy Score y tus categorías", xp:10, action:null},
];
const MISIONES_PT = [
  {id:"m1", emoji:"📝", texto:"Anota um gasto que você fez hoje", xp:20, action:null},
  {id:"m2", emoji:"🎯", texto:"Verifique o progresso da sua meta financeira", xp:15, action:null},
  {id:"m3", emoji:"📚", texto:"Conclua uma lição da Academia", xp:30, action:"academy"},
  {id:"m4", emoji:"💬", texto:"Faça uma pergunta ao Coach Hendy", xp:25, action:"coach"},
  {id:"m5", emoji:"💰", texto:"Adicione uma poupança a um dos seus desafios", xp:20, action:"retos"},
  {id:"m6", emoji:"🧮", texto:"Use o simulador de crédito ou poupança", xp:15, action:"simuladores"},
  {id:"m7", emoji:"🔥", texto:"Verifique seu Hendy Score e categorias", xp:10, action:null},
];
function getMisionDelDia(lang){
  var day=new Date().getDay();
  return lang==="pt"?MISIONES_PT[day%MISIONES_PT.length]:MISIONES_ES[day%MISIONES_ES.length];
}
function getTodayMisionKey(){
  return "mision_"+new Date().toISOString().slice(0,10);
}

// Formatea número con separadores de miles (500000 → "500.000")
function fmtInput(val){
  if(!val&&val!==0)return "";
  var n=String(val).replace(/[^0-9]/g,"");
  if(!n)return "";
  return n.replace(/\B(?=(\d{3})+(?!\d))/g,".");
}
// Quita formato y devuelve número limpio
function parseInput(str){
  return parseInt(String(str).replace(/\./g,""))||0;
}

// Input numérico con separadores de miles mientras se digita
function NumInput({value,onChange,placeholder,style}){
  return(
    <input
      value={fmtInput(value)}
      onChange={e=>{
        var raw=e.target.value.replace(/\./g,"").replace(/[^0-9]/g,"");
        onChange(raw?parseInt(raw):0);
      }}
      placeholder={placeholder||"0"}
      inputMode="numeric"
      style={Object.assign({},{background:"#0a0a0a",border:"1px solid #2a2a2a",borderRadius:12,padding:"12px 14px",fontFamily:'"DM Sans",sans-serif',fontSize:15,color:"#fff",outline:"none",width:"100%"},style||{})}
    />
  );
}

const GOAL_DEFAULTS = {
  casa:{icon:"🏠",es:"Casa propia",pt:"Casa própria"},
  emprender:{icon:"💼",es:"Mi negocio",pt:"Meu negócio"},
  tranquilidad:{icon:"🧘",es:"Tranquilidad financiera",pt:"Tranquilidade financeira"},
  libertad:{icon:"✈️",es:"Libertad financiera",pt:"Liberdade financeira"},
};

function SuenoCard({userData,lang,goal,setGoal}){
  const pt=lang==="pt";
  const metaType=(userData&&userData.answers&&userData.answers.meta)||"tranquilidad";
  const def=GOAL_DEFAULTS[metaType]||GOAL_DEFAULTS.tranquilidad;
  const [editing,setEditing]=useState(false);
  const [addOpen,setAddOpen]=useState(false);
  const [nombre,setNombre]=useState((goal&&goal.nombre)||(pt?def.pt:def.es));
  const [objetivo,setObjetivo]=useState((goal&&goal.objetivo)||"");
  const [addAmount,setAddAmount]=useState("");

  const save=()=>{
    const obj=parseInt(objetivo)||0;
    if(obj<=0)return;
    setGoal({nombre:nombre||(pt?def.pt:def.es),objetivo:obj,ahorrado:(goal&&goal.ahorrado)||0});
    setEditing(false);
  };

  const addSavings=()=>{
    const amt=parseInt(addAmount)||0;
    if(amt<=0)return;
    setGoal({...goal,ahorrado:(goal.ahorrado||0)+amt});
    setAddAmount("");
    setAddOpen(false);
  };

  const fmt=(n)=>"G "+Number(n||0).toLocaleString("es-PY");

  if(!goal||editing){
    return(
      <div style={{background:"linear-gradient(135deg,#1a0a08,#0a0d1a)",border:"1px solid #FF4B2B33",borderRadius:20,padding:20,marginBottom:14,animation:"fadeUp .5s ease both"}}>
        <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:14}}>
          <span style={{fontSize:24}}>{def.icon}</span>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff"}}>{pt?"Sua meta financeira":"Tu meta financiera"}</div>
        </div>
        <input value={nombre} onChange={e=>setNombre(e.target.value)} placeholder={pt?"Ex: Notebook para a faculdade":"Ej: Notebook para la facultad"}
          style={{width:"100%",background:"#111",border:"1px solid #2a2a2a",borderRadius:12,padding:"12px 14px",fontFamily:'"DM Sans",sans-serif',fontSize:14,color:"#fff",marginBottom:10,outline:"none"}}/>
        <NumInput value={parseInt(objetivo)||0} onChange={v=>setObjetivo(String(v))} placeholder={pt?"Valor objetivo em guaranis":"Monto objetivo en guaraníes"} style={{marginBottom:14}}/>
        <button onClick={save} className="btn" style={{animation:"none",padding:"12px 20px",fontSize:14}}>{pt?"Salvar meta →":"Guardar meta →"}</button>
        {goal&&<button onClick={()=>setEditing(false)} style={{background:"none",border:"none",color:"#888",fontFamily:'"DM Sans",sans-serif',fontSize:12,cursor:"pointer",width:"100%",marginTop:10,textAlign:"center"}}>{pt?"Cancelar":"Cancelar"}</button>}
      </div>
    );
  }

  const pct=Math.min(100,Math.round(((goal.ahorrado||0)/goal.objetivo)*100));

  return(
    <div style={{background:"linear-gradient(135deg,#1a0a08,#0a0d1a)",border:"1px solid #FF4B2B33",borderRadius:20,padding:20,marginBottom:14,animation:"fadeUp .5s ease both"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <span style={{fontSize:22}}>{def.icon}</span>
          <div>
            <div style={{fontSize:10,fontFamily:'"DM Sans",sans-serif',color:"#888",letterSpacing:"1px",textTransform:"uppercase"}}>{pt?"Meta:":"Meta:"}</div>
            <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff"}}>{goal.nombre}</div>
          </div>
        </div>
        <button onClick={()=>setEditing(true)} style={{background:"none",border:"none",color:"#666",cursor:"pointer",fontSize:14,padding:4}}>✎</button>
      </div>
      <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:24,color:"#fff",marginBottom:8}}>{fmt(goal.objetivo)}</div>
      <div className="pbar" style={{marginBottom:8}}><div className="pfill" style={{"--p":pct+"%"}}/></div>
      <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#aaa",marginBottom:14}}>{pt?"Guardado: ":"Ahorrado: "}{fmt(goal.ahorrado||0)} ({pct}%)</div>
      {addOpen?(
        <div style={{display:"flex",gap:8}}>
          <NumInput value={parseInput(addAmount)} onChange={v=>setAddAmount(String(v))} placeholder={pt?"Valor":"Monto"} style={{padding:"10px 14px",fontSize:14}}/>
          <button onClick={addSavings} style={{background:"#FF4B2B",color:"#fff",border:"none",borderRadius:12,padding:"10px 18px",fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:13,cursor:"pointer",flexShrink:0}}>OK</button>
        </div>
      ):(
        <button onClick={()=>setAddOpen(true)} className="btn" style={{animation:"none",padding:"12px 20px",fontSize:13}}>{pt?"+ Adicionar poupança":"+ Agregar ahorro"}</button>
      )}
    </div>
  );
}

function Dashboard({userData,streak,completed,onNav,userName,showToast,onGoHome,lang,goal,setGoal,xp,setXp,misionDone,setMisionDone}){
  const pt=lang==="pt";
  const [waitDone,setWaitDone]=useState(false);
  const diagScore=userData&&userData.diagnostico?userData.diagnostico.score:0;
  const score=calcScore(diagScore,completed.length);
  const breakdown=calcBreakdown(userData,completed.length,goal);
  const sc=score>=70?"#4ade80":score>=40?"#facc15":"#FF4B2B";
  const nivel=getNivel(score);
  const proxNivel=getProxNivel(score);
  const mision=getMisionDelDia(lang);
  const todayKey="mision_"+new Date().toISOString().slice(0,10);
  const misionHecha=misionDone===todayKey;
  const completarMision=()=>{
    if(misionHecha)return;
    if(mision.action){ onNav(mision.action); return; }
    setMisionDone(todayKey);
    setXp(function(x){return x+(mision.xp||20);});
    showToast&&showToast({emoji:mision.emoji,titulo:pt?"Missão concluída! +"+mision.xp+" XP":"¡Misión completada! +"+mision.xp+" XP",desc:mision.texto});
  };
  const [formOpened,setFormOpened]=useState(false);
  const handleWait=()=>{if(FORM!=="TU")window.open(FORM,"_blank");setFormOpened(true);};
  const handleConfirm=()=>{setWaitDone(true);showToast({emoji:"🔥",titulo:pt?"Cadastrado!":"¡Anotado!",desc:pt?"Avisamos quando o NXB estiver pronto 🔥":"Te avisamos cuando NXB esté listo 🔥"});};
  const prog=Math.round((completed.length/LECCIONES.length)*100);
  const todayL=LECCIONES.find(l=>!completed.includes(l.id));
  const earned=BADGES.filter(b=>b.req(completed.length,streak,userData)).length;
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .5s ease"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:24}}>
        <div>
          <div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#aaa",marginBottom:4}}>{userName?(pt?"Bem-vindo/a, ":"Bienvenido/a, ")+userName+" 👋":(pt?"Bem-vindo/a de volta":"Bienvenido/a de vuelta")}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>🔥</span><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px",cursor:"pointer"}} onClick={onGoHome}>hendy</div></div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={()=>showToast&&showToast({emoji:"🔔",titulo:pt?"Em breve":"Próximamente",desc:pt?"Notificações chegando em breve.":"Notificaciones llegando pronto."})} style={{background:"#161616",border:"1px solid #2a2a2a",borderRadius:12,width:38,height:38,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16,flexShrink:0}}>🔔</button>
          <div style={{display:"inline-flex",alignItems:"center",gap:8,background:"#1a1208",border:"1px solid #3a2810",borderRadius:100,padding:"8px 16px"}}><span style={{fontSize:18}}>🔥</span><span style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:16,color:"#FF4B2B"}}>{streak}</span><span style={{fontFamily:'"DM Sans",sans-serif',fontSize:10,color:"#888"}}>{pt?"dias":"días"}</span></div>
        </div>
      </div>
      <div style={{display:"flex",gap:10,alignItems:"center",background:"#111",border:"1px solid #1e1e1e",borderRadius:16,padding:"12px 16px",marginBottom:14,animation:"fadeUp .5s ease .05s both"}}>
        <div style={{width:44,height:44,borderRadius:12,background:nivel.color+"22",border:"1px solid "+nivel.color+"44",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,flexShrink:0}}>{nivel.emoji}</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:10,color:"#888",letterSpacing:"1px",textTransform:"uppercase",marginBottom:2}}>{pt?"Nível atual":"Nivel actual"} {nivel.num}</div>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:nivel.color}}>{pt?nivel.ptNombre:nivel.esNombre}</div>
          {proxNivel&&<div className="pbar" style={{marginTop:6,height:4}}><div className="pfill" style={{"--p":Math.round(((score-nivel.min)/(proxNivel.min-nivel.min))*100)+"%",background:nivel.color,height:"100%"}}/></div>}
        </div>
        <div style={{textAlign:"right",flexShrink:0}}>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:20,color:"#fff"}}>{xp||0}</div>
          <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:10,color:"#888"}}>XP</div>
        </div>
      </div>
      <div className="card" style={{marginBottom:14,animation:"fadeUp .5s ease .1s both"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div><div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#888",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:6}}>{pt?"Sua pontuação Hendy":"Tu puntaje Hendy"}</div><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:48,color:sc,letterSpacing:"-2px",lineHeight:1}}>{score||"—"}</div></div>
          <div style={{textAlign:"right"}}><div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#888",lineHeight:1.6,maxWidth:150}}>{userData&&userData.diagnostico?userData.diagnostico.titulo:(pt?"Complete seu diagnóstico":"Completá tu diagnóstico")}</div></div>
        </div>
        <div className="pbar" style={{marginBottom:16}}><div className="pfill" style={{"--p":score+"%",background:sc}}/></div>
        {userData&&(
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[
              {l:pt?"Gastos":"Gastos",v:breakdown.gastos},
              {l:pt?"Poupança":"Ahorro",v:breakdown.ahorro},
              {l:pt?"Dívidas":"Deudas",v:breakdown.deudas},
              {l:pt?"Educação":"Educación",v:breakdown.educacion},
              {l:pt?"Objetivos":"Objetivos",v:breakdown.objetivos},
            ].map((row,i)=>(
              <div key={i} style={{display:"flex",alignItems:"center",gap:10}}>
                <div style={{width:70,fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",flexShrink:0}}>{row.l}</div>
                <div style={{flex:1,background:"#1a1a1a",borderRadius:100,height:5,overflow:"hidden"}}>
                  <div style={{width:row.v+"%",height:"100%",background:row.v>=70?"#4ade80":row.v>=40?"#facc15":"#FF4B2B",borderRadius:100}}/>
                </div>
                <div style={{width:32,textAlign:"right",fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#666",flexShrink:0}}>{row.v}</div>
              </div>
            ))}
          </div>
        )}
      </div>
      <button onClick={()=>onNav("coach")} style={{width:"100%",background:"linear-gradient(135deg,#1a0a08,#1a0d1a)",border:"1px solid #FF4B2B44",borderRadius:18,padding:"16px 18px",display:"flex",alignItems:"center",gap:12,cursor:"pointer",marginBottom:14,animation:"fadeUp .5s ease .15s both"}}>
        <span style={{fontSize:26}}>🤖</span>
        <div style={{flex:1,textAlign:"left"}}>
          <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#fff"}}>{pt?"Pergunte ao Hendy":"Preguntale a Hendy"}</div>
          <div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#888",marginTop:2}}>{pt?"Seu coach financeiro 24/7":"Tu coach financiero 24/7"}</div>
        </div>
        <span style={{color:"#FF4B2B",fontSize:18}}>›</span>
      </button>
      <SuenoCard userData={userData} lang={lang} goal={goal} setGoal={setGoal}/>

      <div style={{display:"flex",gap:12,marginBottom:14,animation:"fadeUp .5s ease .2s both"}}>
        {[{l:pt?"Lições":"Lecciones",v:completed.length,s:pt?"concluídas":"completadas"},{l:pt?"Progresso":"Progreso",v:prog+"%",s:pt?"do plano":"del plan",c:"#FF4B2B"},{l:pt?"Conquistas":"Logros",v:earned+"🏆",s:pt?"conquistadas":"ganados"}].map((s,i)=>(
          <div key={i} className="stat"><div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>{s.l}</div><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:22,color:s.c||"#fff"}}>{s.v}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontSize:11,color:"#888",marginTop:2}}>{s.s}</div></div>
        ))}
      </div>
      {todayL&&<div style={{animation:"fadeUp .5s ease .3s both",marginBottom:14}}>
        <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#FF4B2B",letterSpacing:"2px",textTransform:"uppercase",marginBottom:10}}>{pt?"📅 Lição de hoje":"📅 Lección de hoy"}</div>
        <button className="lc today" onClick={()=>onNav("academy")} style={{width:"100%"}}><div style={{display:"flex",alignItems:"center",gap:12}}><span style={{fontSize:28}}>{todayL.emoji}</span><div><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff"}}>{pt?todayL.tPT:todayL.tES}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#FF4B2B",marginTop:3}}>{pt?"Começar agora →":"Empezar ahora →"}</div></div></div></button>
      </div>}
      {completed.length>=LECCIONES.length&&(
        <div style={{marginBottom:14,padding:"16px 20px",background:"#0a130a",border:"1px solid #4ade8033",borderRadius:20,display:"flex",alignItems:"center",gap:12,animation:"fadeUp .5s ease .35s both"}}>
          <span style={{fontSize:28}}>🎓</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#4ade80"}}>{pt?"Parabéns! Academia concluída!":"¡Felicitaciones! Academia completada."}</div>
            <button onClick={()=>{onNav("logros");}} style={{background:"none",border:"none",fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#4ade80",cursor:"pointer",padding:0,marginTop:4,textDecoration:"underline"}}>{pt?"Ver suas conquistas →":"Ver tus logros →"}</button>
          </div>
        </div>
      )}
      <div onClick={completarMision} style={{background:misionHecha?"#0a130a":"#111",border:"1px solid "+(misionHecha?"#4ade8033":"#2a2a2a"),borderRadius:18,padding:"16px 18px",marginBottom:14,cursor:misionHecha?"default":"pointer",animation:"fadeUp .5s ease .35s both",transition:"all .2s"}}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:26}}>{misionHecha?"✅":mision.emoji}</span>
          <div style={{flex:1}}>
            <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:10,color:misionHecha?"#4ade80":"#FF4B2B",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:3}}>{pt?"Missão do dia":"Misión del día"} · +{mision.xp} XP</div>
            <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:600,fontSize:13,color:misionHecha?"#4ade80":"#fff"}}>{mision.texto}</div>
          </div>
          {!misionHecha&&<div style={{background:"#FF4B2B",borderRadius:8,padding:"4px 10px",fontFamily:'"DM Sans",sans-serif',fontSize:11,fontWeight:600,color:"#fff",flexShrink:0}}>{mision.action?(pt?"Ir →":"Ir →"):(pt?"Marcar feita":"Marcar lista")}</div>}
        </div>
      </div>
      <div style={{background:"linear-gradient(135deg,#1a0a08,#0d0d1a)",border:"1px solid #2a1520",borderRadius:20,padding:20,animation:"fadeUp .5s ease .4s both"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:20}}>💸</span><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#ddd"}}>{pt?"NXB · Pagamentos internacionais":"NXB · Pagos internacionales"}</div></div>
          <div style={{background:"#1a1208",border:"1px solid #facc1533",borderRadius:100,padding:"4px 10px",fontFamily:'"DM Sans",sans-serif',fontSize:10,color:"#facc15",textTransform:"uppercase",flexShrink:0}}>{pt?"🚧 Em desenvolvimento":"🚧 En desarrollo"}</div>
        </div>
        <p style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#aaa",lineHeight:1.6,marginBottom:14}}>{pt?"Em breve você poderá mover seu dinheiro sem taxas abusivas em todo o Mercosul.":"Muy pronto podrás mover tu plata sin comisiones abusivas en todo el Mercosur."}</p>
        {waitDone?(
          <div style={{display:"flex",alignItems:"center",gap:12,padding:"14px 20px",background:"#0a130a",border:"1px solid #4ade8033",borderRadius:16,animation:"fadeIn .4s ease"}}>
            <span style={{fontSize:24}}>✅</span>
            <div>
              <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#4ade80"}}>{pt?"Cadastrado!":"¡Anotado!"}</div>
              <div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#aaa",marginTop:2}}>{pt?"Avisamos quando o NXB estiver pronto 🔥":"Te avisamos cuando NXB esté listo 🔥"}</div>
            </div>
          </div>
        ):formOpened?(
          <div>
            <div style={{fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#aaa",marginBottom:10,lineHeight:1.5}}>
              {pt?"Complete o formulário que abrimos e volte aqui para confirmar:":"Completá el formulario que abrimos y volvé acá para confirmar:"}
            </div>
            <button onClick={handleConfirm} className="btn" style={{animation:"none",padding:"13px 20px",fontSize:13,background:"#0a130a",color:"#4ade80",border:"1px solid #4ade8033"}}>
              {pt?"✓ Já preenchi o formulário":"✓ Ya completé el formulario"}
            </button>
            <button onClick={handleWait} style={{background:"none",border:"none",fontFamily:'"DM Sans",sans-serif',fontSize:12,color:"#666",cursor:"pointer",marginTop:8,width:"100%",textAlign:"center"}}>
              {pt?"Abrir formulário novamente":"Abrir formulario de nuevo"}
            </button>
          </div>
        ):(
          <button onClick={handleWait} className="btn" style={{animation:"none",padding:"13px 20px",fontSize:13,background:"#1a1208",color:"#facc15",border:"1px solid #facc1533"}}>
            {pt?"Quero acesso antecipado ao NXB →":"Anotarme en la lista de espera →"}
          </button>
        )}
      </div>
    </div>
  );
}

function Profile({userData,streak,completed,onReset,userName,notifEnabled,onToggleNotif,isPro,lang}){
  const pt=lang==="pt";
  return(
    <div style={{width:"100%",maxWidth:390,minHeight:"100vh",display:"flex",flexDirection:"column",padding:"56px 28px 100px",animation:"fadeIn .4s ease"}}>
      <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:800,fontSize:26,color:"#fff",letterSpacing:"-1px",marginBottom:24}}>{pt?"Seu perfil":"Tu perfil"}</div>
      <div className="card" style={{marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:20}}>
          <div style={{width:56,height:56,borderRadius:16,background:"#1a0d09",border:"2px solid #FF4B2B",display:"flex",alignItems:"center",justifyContent:"center",fontSize:28}}>🔥</div>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:18,color:"#fff"}}>{userName||"Usuario"}</div>{isPro&&<div style={{background:"#1a1208",border:"1px solid #facc1544",borderRadius:100,padding:"2px 8px",fontFamily:'"DM Sans",sans-serif',fontSize:10,color:"#facc15",fontWeight:600}}>⭐ PRO</div>}</div>
            <div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#aaa",marginTop:3}}>{isPro?(pt?"Plano Pro ativo 🔥":"Plan Pro activo 🔥"):(pt?"No caminho de sair 💪":"En camino de salir 💪")}</div>
          </div>
        </div>
        {[{l:pt?"Sequência atual":"Racha actual",v:streak+" "+(pt?"dias 🔥":"días 🔥")},{l:pt?"Lições concluídas":"Lecciones completadas",v:completed.length+" de "+LECCIONES.length},{l:pt?"Pontuação Hendy":"Puntaje Hendy",v:userData&&userData.diagnostico?calcScore(userData.diagnostico.score,completed.length)+"/100":"—"}].map((s,i)=>(
          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"12px 0",borderBottom:i<2?"1px solid #161616":"none"}}><span style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:14,color:"#aaa"}}>{s.l}</span><span style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:14,color:"#fff"}}>{s.v}</span></div>
        ))}
      </div>
      <div className="card" style={{marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:15,color:"#fff",marginBottom:4}}>{pt?"🔔 Lembrete diário":"🔔 Recordatorio diario"}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#aaa"}}>{notifEnabled?(pt?"Você receberá um lembrete às 8:00":"Recibirás un recordatorio a las 8:00"):(pt?"Lembramos sua lição do dia":"Te recordamos tu lección del día")}</div></div>
          <button onClick={onToggleNotif} style={{width:52,height:28,borderRadius:100,border:"none",cursor:"pointer",background:notifEnabled?"#FF4B2B":"#2a2a2a",position:"relative",transition:"background .3s",flexShrink:0}}><div style={{width:20,height:20,borderRadius:50,background:"#fff",position:"absolute",top:4,transition:"left .3s",left:notifEnabled?28:4}}/></button>
        </div>
      </div>
      {userData&&userData.diagnostico&&userData.diagnostico.primer_paso&&(
        <div className="card" style={{marginBottom:14}}>
          <div style={{fontSize:11,fontFamily:'"DM Sans",sans-serif',color:"#888",letterSpacing:"1.5px",textTransform:"uppercase",marginBottom:12}}>{pt?"Seu diagnóstico":"Tu diagnóstico"}</div>
          <p style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:14,color:"#aaa",lineHeight:1.7,marginBottom:14}}>{userData.diagnostico.titulo}</p>
          <div style={{padding:"12px 16px",background:"#1a1208",border:"1px solid #facc1522",borderRadius:12}}>
            <div style={{fontSize:11,color:"#facc15",fontFamily:'"DM Sans",sans-serif',letterSpacing:"1px",textTransform:"uppercase",marginBottom:6}}>{pt?"🎯 Seu próximo passo":"🎯 Tu próximo paso"}</div>
            <p style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:13,color:"#ccc",lineHeight:1.6}}>{userData.diagnostico.primer_paso}</p>
          </div>
        </div>
      )}
      <button onClick={onReset} className="btng" style={{marginTop:0}}>{pt?"🔄 Refazer diagnóstico":"🔄 Repetir diagnóstico"}</button>
      <div style={{textAlign:"center",marginTop:24,fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:12,color:"#333"}}>{pt?"hendy · Mercosul 🔥 v1.0":"hendy · Paraguay 🔥 v1.0"}</div>
    </div>
  );
}

function BottomNav({active,onNav,lang}){
  const pt=lang==="pt";
  const leftItems=[{id:"academy",icon:"📚",label:"Academia"},{id:"retos",icon:"🎯",label:pt?"Desafios":"Retos"}];
  const rightItems=[{id:"coach",icon:"🤖",label:"Coach"},{id:"profile",icon:"👤",label:"Perfil"}];
  const isHome=active==="dashboard";
  return(
    <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:390,background:"rgba(10,10,10,.95)",backdropFilter:"blur(20px)",borderTop:"1px solid #161616",display:"flex",alignItems:"center",zIndex:50}}>
      {leftItems.map(n=>(
        <button key={n.id} className="nav" onClick={()=>{window.scrollTo(0,0);onNav(n.id);}}>
          <span style={{fontSize:20,filter:active===n.id?"none":"grayscale(1)",opacity:active===n.id?1:.35,transition:"all .2s"}}>{n.icon}</span>
          <span style={{fontFamily:'"DM Sans",sans-serif',fontSize:10,color:active===n.id?"#FF4B2B":"#555",fontWeight:active===n.id?500:300,transition:"color .2s"}}>{n.label}</span>
        </button>
      ))}
      <button onClick={()=>{window.scrollTo(0,0);onNav("dashboard");}} style={{
        width:56,height:56,borderRadius:"50%",flexShrink:0,cursor:"pointer",
        background:isHome?"linear-gradient(135deg,#FF4B2B,#ff7a5c)":"linear-gradient(135deg,#FF4B2B,#d63a1f)",
        border:"4px solid #0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",
        marginTop:-22,boxShadow:isHome?"0 0 22px rgba(255,75,43,.55)":"0 4px 14px rgba(255,75,43,.35)",
        transition:"all .25s"
      }}>
        <span style={{fontSize:26,animation:isHome?"flicker 2s ease infinite":"none"}}>🔥</span>
      </button>
      {rightItems.map(n=>(
        <button key={n.id} className="nav" onClick={()=>{window.scrollTo(0,0);onNav(n.id);}}>
          <span style={{fontSize:20,filter:active===n.id?"none":"grayscale(1)",opacity:active===n.id?1:.35,transition:"all .2s"}}>{n.icon}</span>
          <span style={{fontFamily:'"DM Sans",sans-serif',fontSize:10,color:active===n.id?"#FF4B2B":"#555",fontWeight:active===n.id?500:300,transition:"color .2s"}}>{n.label}</span>
        </button>
      ))}
    </div>
  );
}

function ToastBox({msg}){
  return(<div className="toastbox"><span style={{fontSize:20}}>{msg.emoji}</span><div><div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',fontWeight:700,fontSize:13,color:"#fff"}}>{msg.titulo}</div><div style={{fontFamily:'"DM Sans",sans-serif',fontWeight:300,fontSize:11,color:"#888"}}>{msg.desc}</div></div></div>);
}

export default function HendyApp(){
  const getSaved=()=>{try{return JSON.parse(localStorage.getItem("hendy_v5")||"{}");}catch(e){return{};}};
  const sv=getSaved();
  // Monthly reset for Pro: completed lessons reset each calendar month
  const currentMonth=new Date().getFullYear()+"-"+(new Date().getMonth()+1);
  const savedMonth=sv.completedMonth||"";
  const [lang,setLang]=useState(sv.lang||"es");
  const [screen,setScreen]=useState("splash");
  const [splashDone,setSplash]=useState(false);
  const [userName,setUserName]=useState(sv.userName||"");
  const [userData,setUserData]=useState(sv.userData||null);
  const [streak,setStreak]=useState(sv.streak||0);
  const [completed,setCompleted]=useState((sv.isPro&&savedMonth!==currentMonth)?[]:(sv.completed||[]));
  const [navTab,setNavTab]=useState("dashboard");
  const [notif,setNotif]=useState(sv.notif||false);
  // Only trust isPro from localStorage if user has real paid data
  const [isPro,setIsPro]=useState((sv.isPro&&sv.userName)?true:false);
  const [goal,setGoal]=useState(sv.goal||null);
  const [retos,setRetos]=useState(sv.retos||[]);
  const [xp,setXp]=useState(sv.xp||0);
  const [misionDone,setMisionDone]=useState(sv.misionDone||null);
  const [toast,setToast]=useState(null);

  useEffect(()=>{
    setTimeout(()=>setSplash(true),2800);
    setTimeout(()=>setScreen("name"),3300);
  },[]);

  useEffect(()=>{
    try{localStorage.setItem("hendy_v5",JSON.stringify({lang,userName,userData,streak,completed,notif,isPro,goal,retos,xp,misionDone,completedMonth:currentMonth}));}catch(e){}
  },[lang,userName,userData,streak,completed,notif,isPro,goal,retos,xp,misionDone]);

  const showToast=(msg)=>{setToast(msg);setTimeout(()=>setToast(null),3500);};

  const checkMision=(actionId)=>{
    const todayKey=getTodayMisionKey();
    if(misionDone===todayKey)return;
    const mision=getMisionDelDia(lang);
    if(mision.action===actionId){
      setMisionDone(todayKey);
      setXp(x=>x+(mision.xp||20));
      showToast({emoji:mision.emoji,titulo:(lang==="pt"?"Missão concluída! +":"¡Misión completada! +")+mision.xp+" XP",desc:mision.texto});
    }
  };

  const completeLesson=(id)=>{
    const nc=[...completed,id];
    setCompleted(nc);
    setStreak(s=>s+1);
    const prev=BADGES.filter(b=>b.req(completed.length,streak,userData));
    const next=BADGES.filter(b=>b.req(nc.length,streak+1,userData));
    const nb=next.find(b=>!prev.find(p=>p.id===b.id));
    if(nb)setTimeout(()=>showToast({emoji:nb.emoji,titulo:(lang==="pt"?"Nova conquista! ":"¡Nuevo logro! ")+(lang==="pt"?nb.tPT:nb.tES),desc:lang==="pt"?nb.dPT:nb.dES}),1500);
    checkMision("academy");
  };

  const toggleNotif=()=>{
    const n=!notif;setNotif(n);const pt=lang==="pt";
    if(n)showToast({emoji:"🔔",titulo:pt?"Lembrete ativado":"Recordatorio activado",desc:pt?"Avisamos todos os dias às 8:00":"Te avisamos todos los días a las 8:00"});
    else showToast({emoji:"🔕",titulo:pt?"Lembrete desativado":"Recordatorio desactivado",desc:pt?"Pode ativar quando quiser":"Podés activarlo cuando quieras"});
  };

  const renderApp=()=>(
    <>
      {navTab==="dashboard"&&<Dashboard userData={userData} streak={streak} completed={completed} onNav={setNavTab} userName={userName} showToast={showToast} onGoHome={()=>setScreen("home")} lang={lang} goal={goal} setGoal={setGoal} xp={xp} setXp={setXp} misionDone={misionDone} setMisionDone={setMisionDone}/>}
      {navTab==="academy"&&<Academy userData={userData} streak={streak} completed={completed} onComplete={completeLesson} isPro={isPro} onUpgrade={()=>setNavTab("pro")} lang={lang}/>}
      {navTab==="logros"&&<Logros completed={completed} streak={streak} userData={userData} lang={lang}/>}
      {navTab==="retos"&&<RetosScreen retos={retos} setRetos={setRetos} lang={lang} showToast={showToast} onAction={()=>checkMision("retos")} onNav={setNavTab}/>}
      {navTab==="simuladores"&&<SimuladoresScreen lang={lang} onAction={()=>checkMision("simuladores")}/>}
      {navTab==="profile"&&<Profile userData={userData} streak={streak} completed={completed} userName={userName} notifEnabled={notif} onToggleNotif={toggleNotif} isPro={isPro} lang={lang} onReset={()=>{setUserData(null);setCompleted([]);setStreak(0);setScreen("name");setNavTab("dashboard");setUserName("");setIsPro(false);try{localStorage.removeItem("hendy_v5");}catch(e){}}}/>}
      {navTab==="pro"&&<ProScreen lang={lang} onActivate={()=>{setIsPro(true);setNavTab("academy");showToast({emoji:"🔥",titulo:lang==="pt"?"Bem-vindo ao Hendy Pro!":"¡Bienvenido a Hendy Pro!",desc:lang==="pt"?"Acesso ilimitado ativado.":"Acceso ilimitado activado."});}} onBack={()=>setNavTab("academy")}/>}
      {navTab==="coach"&&<CoachIA userData={userData} completed={completed} lang={lang} isPro={isPro} onBack={()=>setNavTab("dashboard")} onAction={()=>checkMision("coach")}/>}
      <BottomNav active={navTab} onNav={setNavTab} lang={lang}/>
    </>
  );

  return(
    <div style={{fontFamily:'"Plus Jakarta Sans",sans-serif',background:"#0A0A0A",minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden",position:"relative"}}>
      <style>{CSS}</style>
      <Ambient/>
      {toast&&<ToastBox msg={toast}/>}
      {screen==="splash"&&<Splash done={splashDone}/>}
      {screen==="name"&&<NameScreen onContinue={n=>{setUserName(n);setScreen("home");}} lang={lang} setLang={setLang} savedName={userName||""} onContinueSaved={userName?()=>setScreen("app"):null}/>}
      {screen==="home"&&<Home onStart={()=>setScreen("quiz")} userName={userName} onBack={()=>setScreen("name")} lang={lang}/>}
      {screen==="quiz"&&<Quiz onFinish={a=>{setScreen("loading");setTimeout(()=>{const d=getDiag(a,lang);setUserData({answers:a,diagnostico:d});setScreen("result");},2200);}} onBack={()=>setScreen("home")} lang={lang}/>}
      {screen==="loading"&&<Loading lang={lang}/>}
      {screen==="result"&&userData&&<Result data={userData.diagnostico} onContinue={()=>{setScreen("app");setNavTab("dashboard");}} onBack={()=>setScreen("quiz")} lang={lang}/>}
      {screen==="app"&&renderApp()}
    </div>
  );
}

    
