// ============================================================
// P31 · Preparar fila de base de datos
// ============================================================
//
// Punto único de convergencia del flujo.
//
// Recibe items de las 7 salidas terminales (aprobada, rechazada,
// factura inválida, colaborador no válido, documento no procesable,
// archivo duplicado, comprobante duplicado) y produce UNA fila
// plana con el estado final de la rendición.
//
// No decide nada: solo traduce el estado que ya trae el item.
// ============================================================

const item = $input.item;
const j = item.json ?? {};

// ------------------------------------------------------------
// Helpers de formato para hoja de cálculo
// ------------------------------------------------------------

function txt(v) {
  return v === null || v === undefined ? '' : String(v).trim();
}

function num(v) {
  if (v === null || v === undefined || v === '') return '';
  const n = Number(v);
  return Number.isFinite(n) ? n : '';
}

function siNo(v) {
  if (v === true) return 'SI';
  if (v === false) return 'NO';
  return '';
}

function lista(v) {
  if (!Array.isArray(v)) return txt(v);
  return v.map((x) => String(x ?? '').trim()).filter(Boolean).join(' | ');
}

// ------------------------------------------------------------
// Catálogo de estados
// ------------------------------------------------------------
//
// bloquea = true  -> la clave del comprobante se guarda y por tanto
//                    un reenvío del mismo RUC + número se marcará
//                    como duplicado (comportamiento actual del flujo).
// bloquea = false -> el comprobante puede volver a enviarse corregido.
// ------------------------------------------------------------

const ESTADOS = {
  AUTO_APPROVED: {
    etiqueta: 'Aprobada automáticamente',
    resultado: 'APROBADA',
    accion: 'NONE',
    bloquea: true,
  },
  HUMAN_APPROVED: {
    etiqueta: 'Aprobada por el aprobador',
    resultado: 'APROBADA',
    accion: 'NONE',
    bloquea: true,
  },
  REJECTED: {
    etiqueta: 'Rechazada',
    resultado: 'RECHAZADA',
    accion: 'NONE',
    bloquea: true,
  },
  DUPLICATE_FILE: {
    etiqueta: 'Archivo ya recibido antes',
    resultado: 'NO_PROCESADA',
    accion: 'NONE',
    bloquea: false,
  },
  DUPLICATE_INVOICE: {
    etiqueta: 'Comprobante ya registrado',
    resultado: 'NO_PROCESADA',
    accion: 'NONE',
    bloquea: false,
  },
  INVALID_INVOICE: {
    etiqueta: 'Comprobante inválido',
    resultado: 'NO_PROCESADA',
    accion: 'REPLACE_DOCUMENT',
    bloquea: false,
  },
  INVALID_COLLABORATOR: {
    etiqueta: 'Remitente no autorizado',
    resultado: 'NO_PROCESADA',
    accion: 'CONTACT_ADMIN',
    bloquea: false,
  },
  UNPROCESSABLE_DOCUMENT: {
    etiqueta: 'Documento no procesable',
    resultado: 'NO_PROCESADA',
    accion: 'REPLACE_DOCUMENT',
    bloquea: false,
  },
};

// ------------------------------------------------------------
// 1. Estado
// ------------------------------------------------------------
//
// Las ramas de error lo traen en dbOutcome (nodos Set).
// Las ramas de resolución lo traen en finalStatus (P23.1 / P23.3).
// ------------------------------------------------------------

const estado = txt(j.dbOutcome) || txt(j.finalStatus) || 'UNKNOWN';

const meta =
  ESTADOS[estado] ?? {
    etiqueta: 'Estado no determinado',
    resultado: 'NO_PROCESADA',
    accion: 'CONTACT_ADMIN',
    bloquea: false,
  };

// ------------------------------------------------------------
// 2. Motivo
// ------------------------------------------------------------

const motivos = [];

if (estado === 'REJECTED' && j.rejectionType === 'HUMAN') {
  motivos.push('RECHAZADA_POR_EL_APROBADOR');
}

motivos.push(...(Array.isArray(j.policyRejectReasons) ? j.policyRejectReasons : []));
motivos.push(...(Array.isArray(j.policyReviewReasons) ? j.policyReviewReasons : []));

if (motivos.length === 0) {
  motivos.push(...(Array.isArray(j.invoiceValidationErrors) ? j.invoiceValidationErrors : []));
}

if (motivos.length === 0 && txt(j.dbReason)) {
  motivos.push(txt(j.dbReason));
}

const motivo = lista([...new Set(motivos)]);

// ------------------------------------------------------------
// 3. Huella del archivo
// ------------------------------------------------------------
//
// Preparar duplicado (P14) reconstruye el item desde Evaluar
// factura (P08.2), que es anterior al cálculo del hash, así que
// en las ramas largas fileHash ya no viene en $json. Lo pedimos
// al nodo que lo calculó. En las ramas que fallan antes de P09.1
// ese nodo no se ejecutó y la huella simplemente no existe.
// ------------------------------------------------------------

let fileHash = txt(j.fileHash);

if (!fileHash) {
  try {
    fileHash = txt($('Calcular huella archivo (P09.1)').first().json.fileHash);
  } catch (error) {
    fileHash = '';
  }
}

// ------------------------------------------------------------
// 4. Identificador de la fila
// ------------------------------------------------------------
//
// La clave primaria es el correo recibido, no la factura:
// un reenvío del mismo comprobante es una fila nueva marcada
// como duplicada, no un pisotón sobre la fila original.
// ------------------------------------------------------------

const id =
  txt(j.gmailMessageId) ||
  txt(j.duplicateKey) ||
  'sin-id-' + new Date().toISOString();

// ------------------------------------------------------------
// 5. Fila
// ------------------------------------------------------------

const fila = {
  id,
  procesadoEn: new Date().toISOString(),

  estado,
  estadoEtiqueta: txt(j.finalStatusLabel) || meta.etiqueta,
  resultado: meta.resultado,
  motivo,
  accionRequerida: meta.accion,

  senderEmail: txt(j.senderEmail),
  colaborador: txt(j.collaboratorName),
  centroCosto: txt(j.collaboratorCostCenter),
  colaboradorEstado: txt(j.collaboratorStatus),

  gmailMessageId: txt(j.gmailMessageId),
  asunto: txt(j.subject),
  fileName: txt(j.fileName),
  fileType: txt(j.sourceType) || txt(j.fileType),
  fileHash,

  proveedor: txt(j.supplierName),
  ruc: txt(j.supplierTaxId),
  documento: txt(j.documentNumber),
  fechaEmision: txt(j.issueDate),
  moneda: txt(j.currency),
  subtotal: num(j.subtotal),
  igv: num(j.tax),
  total: num(j.total),

  categoria: txt(j.expenseCategory),
  categoriaEtiqueta: txt(j.expenseCategoryLabel),
  confianza: num(j.expenseConfidence),

  politicaVersion: txt(j.policyVersion),
  politicaLimite: num(j.policyLimit),
  baseComparacion: txt(j.policyComparisonBasis),
  montoComparado: num(j.policyComparisonAmount),
  dentroLimite: siNo(j.withinPolicyLimit),
  excedente: num(j.amountOverLimit),
  usoPct: num(j.policyUsagePercent),

  noches: num(j.lodgingNights),
  montoPorNoche: num(j.lodgingAmountPerNight),

  decisionPolitica: txt(j.policyDecision),
  tipoAprobacion: txt(j.approvalType),
  respondidoEn: txt(j.humanApprovalRespondedAt),

  // Solo los estados que bloquean reenvíos guardan la clave del
  // comprobante. Así una factura inválida puede corregirse y
  // reenviarse sin que el flujo la trate como duplicada.
  duplicateKey: meta.bloquea ? txt(j.duplicateKey) : '',
};

// ------------------------------------------------------------
// 6. Salida
// ------------------------------------------------------------
//
// Se conserva todo el contexto anterior para que los nodos que
// vienen después de la base de datos (correos, cierre de
// incidencia) sigan teniendo lo que necesitan.
// ------------------------------------------------------------

return {
  json: {
    ...j,
    fila,
    dbEstado: estado,
    dbResultado: meta.resultado,
    dbAccionRequerida: meta.accion,
  },
  binary: item.binary,
};
