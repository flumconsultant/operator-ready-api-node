# Extrae las tablas por fecha y motor del PDF histórico de Trinity → JSON.
import pdfplumber, re, json, sys, collections
PDF = sys.argv[1]
MESES = {'ene':1,'feb':2,'mar':3,'abr':4,'may':5,'jun':6,'jul':7,'ago':8,'sep':9,'oct':10,'nov':11,'dic':12}
MOTOR = {'ChatGPT':'chatgpt','Gemini':'gemini','Google AI Overview':'ai_overview'}
cab = re.compile(r'(\d{2})-(\w{3})-(\d{4}) · (ChatGPT|Gemini|Google AI Overview)\s*$')
pdf = pdfplumber.open(PDF)
# Vocabulario para unir palabras cortadas por el ancho de la columna («recomiend|an»).
vocab = collections.Counter(w.lower() for w in re.findall(r'[\wáéíóúñü]+', open('h.txt').read()))
def unir(celda):
    if celda is None: return ''
    partes = [x.strip() for x in celda.split('\n') if x.strip()]
    out = ''
    for p in partes:
        if not out: out = p; continue
        a = re.findall(r'[\wáéíóúñü]+$', out); b = re.findall(r'^[\wáéíóúñü]+', p)
        if a and b:
            junta = (a[0] + b[0]).lower()
            # Se une si la palabra junta existe y alguna mitad no, o la junta es más frecuente.
            if vocab[junta] and (not vocab[a[0].lower()] or not vocab[b[0].lower()] or vocab[junta] > min(vocab[a[0].lower()], vocab[b[0].lower()])):
                out += p; continue
        out += ' ' + p
    return out
# Estructura fija del documento: por cada corrida (en este orden) vienen tres
# bloques —ChatGPT, Gemini, AI Overview— numerados 1..20. Un bloque nuevo
# empieza cuando la numeración vuelve atrás.
texto = open('h.txt').read()
FECHAS = [f'{a}-{MESES[m]:02d}-{int(d):02d}' for d, m, a in re.findall(r'^Corrida (\d{2})-(\w{3})-(\d{4})', texto, re.M)]
ORDEN = ['chatgpt', 'gemini', 'ai_overview']
filas = []; ultimo = None; bloque = -1
for i, page in enumerate(pdf.pages):
    for t in sorted(page.find_tables(), key=lambda t: t.bbox[1]):
        rows = t.extract()
        if not rows or len(rows[0]) != 13: continue
        for r in rows:
            c0 = (r[0] or '').strip()
            if c0 == '':
                if ultimo is not None:
                    for k in range(1, 13):
                        if r[k]: ultimo['_raw'][k] = (ultimo['_raw'][k] or '') + '\n' + r[k]
                continue
            if not c0.isdigit(): continue
            n = int(c0)
            if ultimo is None or n <= ultimo['n']: bloque += 1
            fila = {'fecha': FECHAS[bloque // 3], 'motor': ORDEN[bloque % 3], 'n': n, 'pagina': i + 1, '_raw': list(r)}
            filas.append(fila); ultimo = fila
for f in filas:
    c = [unir(x) for x in f.pop('_raw')]
    f.update({'prompt': c[1], 'categoria': c[2], 'mencion': c[3], 'pos': c[4], 'sov': c[5], 'sov_ant': c[6], 'cita': c[7], 'sent': c[8],
              'fuentes': c[9], 'links': c[10], 'pmd': c[11], 'marcas': c[12]})
json.dump(filas, open('trinity.json', 'w'), ensure_ascii=False, indent=1)
cnt = collections.Counter((f['fecha'], f['motor']) for f in filas)
for k in sorted(cnt): print(k, cnt[k])
print('total', len(filas))

# ─── Filas que find_tables no ve (tablas de una fila al pie de página) ──────
# Se sacan del texto con -layout, cortando por la posición de cada columna.
lineas = open('h.txt').read().split('\n')
NOMBRES_MOTOR = {v: k for k, v in MOTOR.items()}
inv = {v: k for k, v in MESES.items()}
def tramo(fecha, motor):
    a, m, d = fecha.split('-'); et = f'{d}-{inv[int(m)]}-{a} · {NOMBRES_MOTOR[motor]}'
    ini = next(i for i, l in enumerate(lineas) if l.strip() == et)
    fin = next((i for i in range(ini + 1, len(lineas)) if cab.search(lineas[i].strip()) or lineas[i].startswith('Corrida ')), len(lineas))
    return ini, fin
def filas_de_texto(fecha, motor):
    ini, fin = tramo(fecha, motor); out = {}; cols = None; act = None
    for l in lineas[ini:fin]:
        if re.match(r'^\s*#\s+Prompt', l):
            idx = []
            for nombre in ['Prompt', 'Categoría', 'Menció', 'Pos.', 'SOV', 'SOV', 'Cita', 'Sent.', 'Fuente', 'Links', 'PMD', 'Marcas']:
                desde = idx[-1] + 1 if idx else 0
                idx.append(l.index(nombre, desde))
            cols = [0] + idx; act = None; continue
        if cols is None or 'Page ' in l or l.startswith('Histórico'): act = None if 'Page ' in l else act; continue
        m = re.match(r'^\s*(\d{1,2})\s{2,}', l)
        if m and int(m.group(1)) <= 20 and l[:cols[1]].strip().isdigit():
            act = int(m.group(1)); out[act] = [''] * 13
        if act is None or not l.strip(): continue
        for k in range(13):
            pedazo = l[cols[k]:(cols[k + 1] if k + 1 < 13 else None)].strip()
            if pedazo: out[act][k] = (out[act][k] + '\n' + pedazo) if out[act][k] else pedazo
    return out
tenidas = {(f['fecha'], f['motor'], f['n']) for f in filas}
agregadas = 0
for fecha in FECHAS:
    for motor in ORDEN:
        faltan = [n for n in range(1, 21) if (fecha, motor, n) not in tenidas]
        if not faltan: continue
        txt = filas_de_texto(fecha, motor)
        for n in faltan:
            if n not in txt: print('SIN DATO', fecha, motor, n); continue
            c = [unir(x) for x in txt[n]]
            filas.append({'fecha': fecha, 'motor': motor, 'n': n, 'pagina': None, 'prompt': c[1], 'categoria': c[2], 'mencion': c[3], 'pos': c[4], 'sov': c[5],
                          'sov_ant': c[6], 'cita': c[7], 'sent': c[8], 'fuentes': c[9], 'links': c[10], 'pmd': c[11], 'marcas': c[12], 'origen': 'texto'})
            agregadas += 1
filas.sort(key=lambda f: (FECHAS.index(f['fecha']), ORDEN.index(f['motor']), f['n']))
json.dump(filas, open('trinity.json', 'w'), ensure_ascii=False, indent=1)
print('agregadas desde el texto:', agregadas, '· total', len(filas))
