// ============================================================
// D00 · Caso de prueba (dummy)
// ============================================================
//
// Sustituye al Gmail Trigger (P01).
//
// Emite UN solo item con la misma forma que produce el
// Gmail Trigger con "Download Attachments" activado:
//
//   json.id                     -> gmailMessageId
//   json.threadId               -> threadId
//   json.payload.headers[]      -> From / Subject
//   binary.attachment_0         -> adjunto descargado
//
// P02 se encarga de normalizar binary.attachment_0 -> binary.data
//
// IMPORTANTE:
// El flujo original está escrito para UNA factura por
// ejecución (varios nodos usan .first()), por eso este nodo
// emite un único item.
//
// ------------------------------------------------------------
// >>> CAMBIA ESTE NÚMERO PARA PROBAR CADA ESCENARIO <<<
// ------------------------------------------------------------

const CASO = 1;

// ============================================================
// POLÍTICA DE VIÁTICOS SIMULADA
// (refleja la hoja "PoliticaViaticos" que consulta el agente)
// ============================================================
//
//   BREAKFAST          25   permitido
//   LUNCH              50   permitido
//   DINNER             55   permitido
//   MOBILITY           40   permitido
//   AIRFARE           900   permitido
//   LODGING           200   permitido (por noche)
//   ALLOWED_BEVERAGES  15   permitido
//   MINOR_PURCHASE    120   permitido
//   (bebidas alcohólicas: NO permitido)
//
// ============================================================

const COLABORADOR_OK = {
  email: 'carlos.ramirez@flum.pe',
  nombre: 'Carlos Andrés Ramírez',
  activo: 'SI',
  centroCosto: 'CC-COMERCIAL-001',
  row_number: 4,
};

// ------------------------------------------------------------
// Textos de comprobante (lo que devolvería el extractor de PDF)
// ------------------------------------------------------------

function facturaAlmuerzo(numero, subtotal, igv, total) {
  return [
    'RESTAURANTE EL MIRADOR S.A.C.',
    'Av. Larco 1234 - Miraflores - Lima',
    'RUC: 20512345678',
    '',
    'FACTURA ELECTRONICA',
    numero,
    '',
    'Fecha de Emision: 14/08/2026',
    'Hora de atencion: 13:12',
    '',
    'SEÑOR(ES): CONSULTORA FLUM S.A.C.',
    'RUC ADQUIRIENTE: 20601234567',
    '',
    'DESCRIPCION                            CANT   IMPORTE',
    'SERVICIO DE ALIMENTACION - ALMUERZO      1     ' + subtotal.toFixed(2),
    'MENU EJECUTIVO + BEBIDA NO ALCOHOLICA',
    '',
    'Sub Total Ventas: S/ ' + subtotal.toFixed(2),
    'IGV: S/ ' + igv.toFixed(2),
    'Importe Total: S/ ' + total.toFixed(2),
  ].join('\n');
}

const TEXTO_HOSPEDAJE = [
  'HOTEL COSTA DEL SOL S.A.',
  'Av. Ejercito 1010 - Cusco',
  'RUC: 20334455667',
  '',
  'FACTURA ELECTRONICA',
  'F002-0000318',
  '',
  'Fecha de Emision: 13/08/2026',
  '',
  'SEÑOR(ES): CONSULTORA FLUM S.A.C.',
  'RUC ADQUIRIENTE: 20601234567',
  '',
  'DESCRIPCION',
  'ALOJAMIENTO 03 NOCHES - HABITACION SIMPLE',
  'DEL 10/08/2026 AL 13/08/2026',
  'CHECK-IN: 10/08/2026',
  'CHECK-OUT: 13/08/2026',
  '',
  'Sub Total Ventas: S/ 457.63',
  'IGV: S/ 82.37',
  'Importe Total: S/ 540.00',
].join('\n');

const TEXTO_ALCOHOL = [
  'BAR RESTOBAR LA ESQUINA E.I.R.L.',
  'Calle Berlin 456 - Miraflores - Lima',
  'RUC: 20778899001',
  '',
  'FACTURA ELECTRONICA',
  'F003-0000097',
  '',
  'Fecha de Emision: 16/08/2026',
  'Hora de atencion: 22:40',
  '',
  'SEÑOR(ES): CONSULTORA FLUM S.A.C.',
  'RUC ADQUIRIENTE: 20601234567',
  '',
  'DESCRIPCION                       CANT   IMPORTE',
  'CERVEZA ARTESANAL 473ML             4      96.00',
  'PISCO SOUR                          2      54.00',
  'PIQUEO FRIO                         1      35.42',
  '',
  'Sub Total Ventas: S/ 156.78',
  'IGV: S/ 28.22',
  'Importe Total: S/ 185.00',
].join('\n');

const TEXTO_ILEGIBLE = [
  'COMPROBANTE',
  'documento escaneado sin datos legibles',
  'total: ---',
].join('\n');

const TEXTO_MOVILIDAD = [
  'TRANSPORTES ANDINOS S.A.C.',
  'Av. Javier Prado 2200 - San Isidro - Lima',
  'RUC: 20445566778',
  '',
  'FACTURA ELECTRONICA',
  'F004-0001120',
  '',
  'Fecha de Emision: 18/08/2026',
  '',
  'SEÑOR(ES): CONSULTORA FLUM S.A.C.',
  '',
  'DESCRIPCION                CANT   IMPORTE',
  'SERVICIO DE TAXI / TRASLADO  1      29.66',
  '',
  'Sub Total Ventas: S/ 29.66',
  'IGV: S/ 5.34',
  'Importe Total: S/ 35.00',
].join('\n');

// ------------------------------------------------------------
// Respuestas simuladas del agente clasificador (P16.2)
// ------------------------------------------------------------

function agente(categoria, label, confianza, limite, extra) {
  return Object.assign(
    {
      expenseCategory: categoria,
      expenseCategoryLabel: label,
      expenseConfidence: confianza,
      expenseEvidence: [],
      containsPotentiallyRestrictedItems: false,
      restrictedItems: [],
      classificationReason: 'Clasificación simulada para pruebas.',
      toolUsed: true,
      policyFound: true,
      policyAllowed: true,
      policyLimit: limite,
      policyRequiresReview: false,
      taxReviewRequired: false,
      policyVersion: 'PRUEBA-2026.08',
      requiresHumanReview: false,
    },
    extra || {}
  );
}

// ============================================================
// CATÁLOGO DE CASOS
// ============================================================

const CASOS = {
  // ---------- 1. Camino feliz: aprobación automática ----------
  1: {
    nombre: '01 · Almuerzo dentro del límite → ALLOW (aprobación automática)',
    recorridoEsperado:
      'P02→P03(PDF)→P04.1→P05→P06→P08(true)→P09(true)→P10(no)→P12.2→P13(no)→' +
      'P16.2→P18(ALLOW)→P20→P22(ALLOW)→P23.1→P24→P25→P27',
    fileName: 'Factura_Almuerzo_Lima.pdf',
    ext: 'pdf',
    mimeType: 'application/pdf',
    subject: 'Rendición almuerzo visita cliente Lima',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: facturaAlmuerzo('F001-0004521', 32.2, 5.8, 38.0),
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    agente: agente('LUNCH', 'Almuerzo', 0.94, 50, {
      expenseEvidence: ['SERVICIO DE ALIMENTACION - ALMUERZO', 'Hora de atencion 13:12'],
    }),
    aprobacionHumana: null,
  },

  // ---------- 2. Excede el límite y el humano aprueba ----------
  2: {
    nombre: '02 · Almuerzo excede el límite → REVIEW → humano APRUEBA',
    recorridoEsperado: '... P18(REVIEW)→P22(REVIEW)→P23.2(HITL)→P23.2.2(true)→P23.1→P25→P27',
    fileName: 'Factura_Almuerzo_Ejecutivo.pdf',
    ext: 'pdf',
    mimeType: 'application/pdf',
    subject: 'Rendición almuerzo con cliente',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: facturaAlmuerzo('F001-0004599', 80.51, 14.49, 95.0),
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    agente: agente('LUNCH', 'Almuerzo', 0.91, 50),
    aprobacionHumana: true,
  },

  // ---------- 3. Excede el límite y el humano rechaza ----------
  3: {
    nombre: '03 · Almuerzo excede el límite → REVIEW → humano RECHAZA',
    recorridoEsperado: '... P22(REVIEW)→P23.2(HITL)→P23.2.2(false)→P23.3→P09.12→P28→P30',
    fileName: 'Factura_Almuerzo_Ejecutivo.pdf',
    ext: 'pdf',
    mimeType: 'application/pdf',
    subject: 'Rendición almuerzo con cliente',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: facturaAlmuerzo('F001-0004600', 80.51, 14.49, 95.0),
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    agente: agente('LUNCH', 'Almuerzo', 0.91, 50),
    aprobacionHumana: false,
  },

  // ---------- 4. Hospedaje: límite POR NOCHE ----------
  4: {
    nombre: '04 · Hospedaje 3 noches (S/540 = S/180/noche, límite 200) → ALLOW',
    recorridoEsperado: 'Ejercita el cálculo de noches de P18 (TEXT_AND_DATES)',
    fileName: 'Factura_Hotel_Cusco.pdf',
    ext: 'pdf',
    mimeType: 'application/pdf',
    subject: 'Rendición hospedaje Cusco',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: TEXTO_HOSPEDAJE,
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    agente: agente('LODGING', 'Hospedaje', 0.96, 200, {
      expenseEvidence: ['ALOJAMIENTO 03 NOCHES', 'CHECK-IN 10/08/2026'],
    }),
    aprobacionHumana: null,
  },

  // ---------- 5. Categoría no permitida por política ----------
  5: {
    nombre: '05 · Consumo con alcohol → política NO permite → REJECT',
    recorridoEsperado: '... P18(REJECT)→P22(REJECT)→P23.3→P09.12→P28→P30',
    fileName: 'Factura_Cena_Bar.pdf',
    ext: 'pdf',
    mimeType: 'application/pdf',
    subject: 'Rendición cena equipo',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: TEXTO_ALCOHOL,
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    agente: agente('DINNER', 'Cena', 0.88, 55, {
      containsPotentiallyRestrictedItems: true,
      restrictedItems: ['CERVEZA ARTESANAL 473ML', 'PISCO SOUR'],
      policyAllowed: false,
      classificationReason: 'El comprobante incluye bebidas alcohólicas.',
    }),
    aprobacionHumana: null,
  },

  // ---------- 6. Comprobante ilegible / inválido ----------
  6: {
    nombre: '06 · Comprobante sin RUC ni total → factura inválida',
    recorridoEsperado: 'P05→P08.2→P09(false)→P09.2→Cerrar incidencia (INVALID_INVOICE)',
    fileName: 'escaneo_borroso.pdf',
    ext: 'pdf',
    mimeType: 'application/pdf',
    subject: 'Rendición',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: TEXTO_ILEGIBLE,
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    agente: agente('UNCERTAIN', 'No determinado', 0.2, null),
    aprobacionHumana: null,
  },

  // ---------- 7. Remitente no registrado ----------
  7: {
    nombre: '07 · Remitente que no está en Colaboradores',
    recorridoEsperado: 'P06(sin fila)→P07→P08(false)→P08.1→Cerrar incidencia (INVALID_COLLABORATOR)',
    fileName: 'Factura_Almuerzo_Lima.pdf',
    ext: 'pdf',
    mimeType: 'application/pdf',
    subject: 'Rendición almuerzo',
    from: 'Desconocido <externo.random@gmail.com>',
    rawText: facturaAlmuerzo('F001-0004777', 32.2, 5.8, 38.0),
    colaborador: null,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    agente: agente('LUNCH', 'Almuerzo', 0.94, 50),
    aprobacionHumana: null,
  },

  // ---------- 8. Archivo idéntico ya procesado ----------
  8: {
    nombre: '08 · Hash del archivo ya registrado → duplicado exacto',
    recorridoEsperado: 'P09.1→P10(existe)→P11(true)→P12.1→Cerrar incidencia (DUPLICATE_FILE)',
    fileName: 'Factura_Almuerzo_Lima.pdf',
    ext: 'pdf',
    mimeType: 'application/pdf',
    subject: 'Re: Rendición almuerzo visita cliente Lima',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: facturaAlmuerzo('F001-0004521', 32.2, 5.8, 38.0),
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: true,
    facturaDuplicada: false,
    agente: agente('LUNCH', 'Almuerzo', 0.94, 50),
    aprobacionHumana: null,
  },

  // ---------- 9. Mismo comprobante, archivo distinto ----------
  9: {
    nombre: '09 · Mismo RUC + número ya registrado en la hoja → factura duplicada',
    recorridoEsperado: 'P13(hit)→P14→P15(true)→P16.1→Cerrar incidencia (DUPLICATE_INVOICE)',
    fileName: 'Factura_Almuerzo_reenviada.pdf',
    ext: 'pdf',
    mimeType: 'application/pdf',
    subject: 'Reenvío rendición almuerzo',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: facturaAlmuerzo('F001-0004521', 32.2, 5.8, 38.0),
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: true,
    agente: agente('LUNCH', 'Almuerzo', 0.94, 50),
    aprobacionHumana: null,
  },

  // ---------- 10. Foto del comprobante, Vision responde bien ----------
  10: {
    nombre: '10 · Imagen (JPG) leída por Vision → ALLOW',
    recorridoEsperado: 'P03(IMAGE)→P04.3→P04.3.1→P04.3.2(true)→P05→...→P22(ALLOW)',
    fileName: 'Factura_Movilidad.jpg',
    ext: 'jpg',
    mimeType: 'image/jpeg',
    subject: 'Rendición movilidad',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: TEXTO_MOVILIDAD,
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    vision: {
      documentType: 'invoice',
      isFinancialDocument: true,
      supplierName: 'TRANSPORTES ANDINOS S.A.C.',
      supplierTaxId: '20445566778',
      documentNumber: 'F004-0001120',
      issueDate: '2026-08-18',
      currency: 'PEN',
      subtotal: 29.66,
      tax: 5.34,
      total: 35.0,
      rawText: TEXTO_MOVILIDAD,
      confidence: 0.93,
    },
    agente: agente('MOBILITY', 'Movilidad', 0.95, 40, {
      expenseEvidence: ['SERVICIO DE TAXI / TRASLADO'],
    }),
    aprobacionHumana: null,
  },

  // ---------- 11. Vision flojo → fallback a Gemini ----------
  11: {
    nombre: '11 · Imagen con Vision de baja confianza → fallback Gemini → ALLOW',
    recorridoEsperado: 'P04.3.2(false)→P04.3.3(Gemini)→P04.3.5(true)→P05→...',
    fileName: 'Factura_Movilidad_borrosa.jpg',
    ext: 'jpg',
    mimeType: 'image/jpeg',
    subject: 'Rendición movilidad',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: TEXTO_MOVILIDAD,
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    vision: {
      documentType: 'other',
      isFinancialDocument: false,
      supplierName: null,
      supplierTaxId: null,
      documentNumber: null,
      issueDate: null,
      currency: null,
      subtotal: null,
      tax: null,
      total: null,
      rawText: 'imagen poco legible',
      confidence: 0.31,
    },
    gemini: {
      documentType: 'invoice',
      isFinancialDocument: true,
      supplierName: 'TRANSPORTES ANDINOS S.A.C.',
      supplierTaxId: '20445566778',
      documentNumber: 'F004-0001121',
      issueDate: '2026-08-18',
      currency: 'PEN',
      subtotal: 29.66,
      tax: 5.34,
      total: 35.0,
      rawText: TEXTO_MOVILIDAD,
      confidence: 0.87,
    },
    agente: agente('MOBILITY', 'Movilidad', 0.95, 40),
    aprobacionHumana: null,
  },

  // ---------- 12. XML (rama que en producción está muerta) ----------
  12: {
    nombre: '12 · Comprobante XML → ALLOW  ⚠️ en producción esta rama NO está conectada',
    recorridoEsperado: 'P03(XML)→P04.2→P05→... (en el flujo real P04.2 no tiene salida)',
    fileName: '20512345678-01-F001-0004900.xml',
    ext: 'xml',
    mimeType: 'application/xml',
    subject: 'Rendición desayuno',
    from: 'Carlos Ramírez <carlos.ramirez@flum.pe>',
    rawText: 'Comprobante electrónico UBL 2.1 - DESAYUNO CONTINENTAL',
    datosXml: {
      supplierName: 'CAFETERIA LA MAÑANA S.A.C.',
      supplierTaxId: '20512345678',
      documentNumber: 'F001-0004900',
      issueDate: '2026-08-19',
      currency: 'PEN',
      subtotal: 15.25,
      tax: 2.75,
      total: 18.0,
    },
    colaborador: COLABORADOR_OK,
    hashYaRegistrado: false,
    facturaDuplicada: false,
    agente: agente('BREAKFAST', 'Desayuno', 0.92, 25, {
      expenseEvidence: ['DESAYUNO CONTINENTAL'],
    }),
    aprobacionHumana: null,
  },
};

// ============================================================
// EMISIÓN DEL ITEM
// ============================================================

const caso = CASOS[CASO];

if (!caso) {
  throw new Error(
    'CASO ' + CASO + ' no existe. Usa un número del 1 al ' + Object.keys(CASOS).length + '.'
  );
}

const contenidoArchivo =
  'ARCHIVO DE PRUEBA · ' +
  caso.fileName +
  '\n' +
  '(el contenido real no se lee: los extractores están simulados,\n' +
  ' pero este binario sí alimenta el hash de P09.1)\n\n' +
  String(caso.rawText || '');

const emailRemitente = caso.from;

return [
  {
    json: {
      id: 'msg-prueba-' + String(CASO).padStart(2, '0'),
      threadId: 'thread-prueba-' + String(CASO).padStart(2, '0'),
      labelIds: ['INBOX', 'UNREAD'],
      payload: {
        headers: [
          { name: 'From', value: emailRemitente },
          { name: 'To', value: 'rendiciones@flum.pe' },
          { name: 'Subject', value: caso.subject },
        ],
      },

      // Los nodos simulados leen este objeto con:
      //   $('D00 · Caso de prueba (dummy)').first().json._caso
      _caso: caso,
      _casoNumero: CASO,
      _casoNombre: caso.nombre,
    },

    binary: {
      attachment_0: {
        data: Buffer.from(contenidoArchivo, 'utf8').toString('base64'),
        mimeType: caso.mimeType,
        fileName: caso.fileName,
        fileExtension: caso.ext,
      },
    },
  },
];
