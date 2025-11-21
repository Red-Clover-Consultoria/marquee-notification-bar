# Guía de Desarrollo - Marquee Notification Bar Widget

Esta guía te ayudará a entender la arquitectura del widget, cómo desarrollar nuevas funcionalidades, y cómo integrarlo con Koru App Manager.

## 📋 Tabla de Contenidos

1. [Arquitectura del Widget](#arquitectura-del-widget)
2. [Configuración del Entorno](#configuración-del-entorno)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Koru SDK Integration](#koru-sdk-integration)
5. [Desarrollo Local](#desarrollo-local)
6. [Testing](#testing)
7. [Build y Deployment](#build-y-deployment)
8. [Buenas Prácticas](#buenas-prácticas)
9. [Troubleshooting](#troubleshooting)

---

## 🏗️ Arquitectura del Widget

### Componentes Principales

```
MarqueeNotificationBarWidget (MarqueeWidget.ts)
├── Hereda de KoruWidget (del SDK)
├── Lifecycle Hooks
│   ├── onInit()          - Inicialización y validación
│   ├── onRender()        - Renderizado del DOM
│   ├── onConfigUpdate()  - Actualización dinámica
│   └── onDestroy()       - Limpieza de recursos
└── Core Logic (MarqueeCore.ts)
    ├── Configuración y defaults
    ├── Generación de HTML
    └── Gestión de estilos
```

### Flujo de Inicialización

```
1. Constructor se ejecuta
   ├── Detecta modo debug (localhost o ?debug)
   ├── Configura opciones del SDK (cache, retry, analytics)
   └── Inicializa MarqueeCore con config por defecto

2. start() es llamado (automático con script tag)
   └── SDK maneja autorización con Koru App Manager

3. onInit(config) es llamado por el SDK
   ├── Parsea configuración desde Koru (message1_text, etc.)
   ├── Valida configuración (campos requeridos, formatos)
   └── Actualiza MarqueeCore con nueva config

4. onRender(config) es llamado por el SDK
   ├── Verifica si hay mensajes para mostrar
   ├── Crea/obtiene contenedor DOM
   ├── Construye estructura del marquee
   ├── Configura event listeners (pause on hover)
   └── Emite evento de analytics

5. Widget está listo y visible
```

---

## 🛠️ Configuración del Entorno

### Prerequisitos

- **Node.js**: v16 o superior
- **npm**: v7 o superior
- **Git**: Para control de versiones
- **Editor**: VSCode recomendado (con extensión TypeScript)

### Instalación

```bash
# Clonar el repositorio
git clone https://github.com/Red-Clover-Consultoria/marquee-notification-bar.git
cd marquee-notification-bar/widget

# Instalar dependencias
npm install

# Verificar instalación
npm run build
```

### Extensiones VSCode Recomendadas

```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "ms-vscode.vscode-typescript-next"
  ]
}
```

---

## 📁 Estructura del Proyecto

```
widget/
├── src/
│   ├── core/                    # Lógica de negocio compartida
│   │   ├── MarqueeCore.ts       # Core del marquee
│   │   └── types.ts             # Tipos TypeScript
│   ├── MarqueeWidget.ts         # Clase principal del widget
│   ├── index.ts                 # Entry point y modo dual
│   └── styles.css               # Estilos del widget
├── examples/
│   └── local.html               # Test local sin Koru
├── dist/                        # Output del build (generado)
│   ├── marquee-widget.js        # Build UMD
│   ├── marquee-widget.min.js    # Build minificado
│   └── index.d.ts               # Definiciones TypeScript
├── test.html                    # Test principal con Koru
├── config-schema.json           # Schema para Koru App Manager
├── package.json                 # Dependencias y scripts
├── tsconfig.json                # Configuración TypeScript
├── webpack.config.js            # Configuración de build
├── README.md                    # Documentación principal
└── DEVELOPMENT.md               # Esta guía
```

### Archivos Clave

#### `src/MarqueeWidget.ts`
Clase principal que implementa la integración con Koru SDK:
- **Constructor (líneas 31-55)**: Configuración del SDK y detección de modo debug
- **onInit (líneas 61-83)**: Parseo y validación de configuración
- **validateConfig (líneas 90-178)**: Validación exhaustiva de configuración
- **parseKoruConfig (líneas 184-213)**: Convierte message1_text, etc. a array
- **onRender (líneas 220-259)**: Renderizado del DOM
- **onDestroy (líneas 280-293)**: Limpieza de recursos

#### `src/core/MarqueeCore.ts`
Lógica de negocio independiente de Koru:
- Gestión de configuración y defaults
- Generación de HTML para mensajes
- Cálculo de estilos CSS
- Utilidades de validación

#### `config-schema.json`
Define la interfaz de configuración en Koru App Manager:
- Campos disponibles (message1_text, backgroundColor, etc.)
- Validaciones (required, pattern, enum)
- UI hints (textarea, color picker, etc.)
- Agrupación de campos

---

## 🔌 Koru SDK Integration

### Configuración del SDK

El widget configura el SDK en el constructor (MarqueeWidget.ts:38-47):

```typescript
super({
  name: 'marquee-notification-bar',
  version: '0.0.3',
  cache: true,           // Cache de configuración (1 hora)
  cacheDuration: 3600,   // TTL en segundos
  retryAttempts: 3,      // Reintentos de autorización
  retryDelay: 1000,      // Delay entre reintentos (ms)
  analytics: true,       // Habilita tracking
  debug: isDebug         // Logs en desarrollo
})
```

### Lifecycle Hooks

#### onInit(config)
Se ejecuta después de la autorización exitosa con Koru:

```typescript
async onInit(config: MarqueeWidgetConfig): Promise<void> {
  // 1. Parsear configuración de Koru
  const parsedConfig = this.parseKoruConfig(config)

  // 2. Validar configuración
  this.validateConfig(parsedConfig)

  // 3. Guardar configuración validada
  this.widgetConfig = { ...defaults, ...parsedConfig }

  // 4. Actualizar core
  this.core.updateConfig(this.widgetConfig)
}
```

#### onRender(config)
Crea y monta el widget en el DOM:

```typescript
async onRender(config: MarqueeWidgetConfig): Promise<void> {
  // 1. Verificar si debe renderizar
  if (!this.core.shouldRender()) return

  // 2. Crear/obtener contenedor
  this.container = this.getOrCreateContainer()

  // 3. Construir estructura del marquee
  this.buildMarqueeStructure()

  // 4. Setup event listeners
  this.setupEventListeners()

  // 5. Track evento de analytics
  this.track('marquee_rendered', { ... })
}
```

#### onConfigUpdate(config)
Actualiza el widget sin recargar la página:

```typescript
async onConfigUpdate(config: Partial<MarqueeWidgetConfig>): Promise<void> {
  // Re-renderizar completamente
  await this.onDestroy()
  await this.onRender({ ...this.widgetConfig, ...config })
}
```

#### onDestroy()
Limpia recursos para prevenir memory leaks:

```typescript
async onDestroy(): Promise<void> {
  // 1. Remover event listeners
  this.removeEventListeners()

  // 2. Remover del DOM
  this.container?.parentNode?.removeChild(this.container)

  // 3. Limpiar referencias
  this.container = null
  this.wrapper = null
}
```

### Helpers del SDK

```typescript
// Logging (solo si debug: true)
this.log('Message', data)

// Analytics tracking (si analytics: true)
this.track('event_name', { key: 'value' })

// Crear elementos DOM
this.createElement('div', {
  className: 'my-class',
  style: { color: 'red' },
  children: [/* ... */]
})

// Detectar mobile
if (this.isMobile()) {
  // Lógica mobile
}

// Acceder a configuración actual
const config = this.config

// Acceder a datos de autorización
const authData = this.authData
```

---

## 💻 Desarrollo Local

### Modo 1: Desarrollo con Hot Reload

```bash
# Inicia webpack-dev-server en puerto 8080
npm run serve

# Abre automáticamente el navegador en http://localhost:8080
# Los cambios se reflejan automáticamente
```

### Modo 2: Build y Watch

```bash
# Build automático al detectar cambios
npm run watch

# Abre test.html o examples/local.html en tu navegador
# Recarga manualmente para ver cambios
```

### Modo 3: Test Local sin Koru

Usa `examples/local.html` para testear sin backend de Koru:

```bash
# Abrir en navegador
open examples/local.html
# O con servidor local
python -m http.server 8000
# http://localhost:8000/examples/local.html
```

El archivo usa data attributes para configuración local:
```html
<script
  src="../dist/marquee-widget.js"
  data-messages='[{"text":"Envío gratis","icon":"🚚"}]'
  data-background-color="#0066cc"
  data-position="top"
></script>
```

El widget detecta automáticamente `data-messages` y entra en **modo local** (sin Koru).

### Modo 4: Test con Koru Local

1. **Build del widget:**
   ```bash
   npm run build
   ```

2. **Iniciar servidor local:**
   ```bash
   npm run serve
   # O usa otro servidor HTTP
   python -m http.server 8080
   ```

3. **Configurar en Koru App Manager local:**
   - Website ID: `test-website-001`
   - App ID: `marquee-notification-bar`
   - Widget URL: `http://localhost:8080/dist/marquee-widget.min.js`

4. **Configurar mensajes en Koru dashboard**

5. **Testear con:**
   ```
   http://localhost:8080/test.html
   ```

### Modo 5: Test con Koru en Producción

1. **Deploy a GitHub Pages o CDN:**
   ```bash
   npm run deploy:gh
   ```

2. **Configurar en Koru App Manager:**
   - Website ID: tu website ID
   - App ID: `marquee-notification-bar`
   - Widget URL: `https://tu-dominio.com/dist/marquee-widget.min.js`

3. **Testear en tu sitio web**

### Debug Mode

Para activar logs detallados:

```
# Opción 1: URL parameter
http://localhost:8080/?debug

# Opción 2: Localhost (automático)
http://localhost:8080/
http://127.0.0.1:8080/

# Logs aparecen en consola del navegador:
[MarqueeWidget] Marquee Notification Bar Widget initialized {...}
[MarqueeWidget] Configuration validation passed {...}
[MarqueeWidget] Widget rendered successfully
```

---

## 🧪 Testing

### Testing Manual

1. **Verificar lifecycle hooks:**
   - Abrir consola del navegador (F12)
   - Activar `?debug` en URL
   - Verificar secuencia de logs: `initialized` → `validation passed` → `rendered`

2. **Testing de configuración:**
   ```javascript
   // En consola del navegador
   const widget = new MarqueeNotificationBarWidget()

   // Test con config inválida (debe lanzar error)
   widget.onInit({})

   // Test con config válida
   widget.onInit({
     message1_text: 'Test message'
   })
   ```

3. **Testing de eventos:**
   - Hover sobre el marquee (debe pausar si `pauseOnHover: true`)
   - Verificar eventos de analytics en consola

4. **Testing visual:**
   - Cambiar `position` (top/bottom)
   - Cambiar `speed` (slow/normal/fast)
   - Cambiar colores
   - Verificar responsive en mobile

### Checklist de Testing

- [ ] Widget se inicializa correctamente
- [ ] Validación rechaza configs inválidas
- [ ] Mensajes se muestran correctamente
- [ ] Animación funciona (si `showMarquee: true`)
- [ ] Pause on hover funciona
- [ ] Posición top/bottom funciona
- [ ] Colores personalizados funcionan
- [ ] No hay errores en consola
- [ ] No hay memory leaks (verificar con DevTools)
- [ ] Funciona en mobile
- [ ] Funciona con múltiples mensajes (1-10)

---

## 🚀 Build y Deployment

### Build de Producción

```bash
# Limpia dist/ y genera nuevos builds
npm run build

# Output:
# dist/marquee-widget.js       - UMD sin minificar
# dist/marquee-widget.min.js   - UMD minificado
# dist/index.d.ts              - TypeScript definitions
```

### Deployment a GitHub Pages

```bash
# Build + deploy automático
npm run deploy:gh

# Widget disponible en:
# https://red-clover-consultoria.github.io/marquee-notification-bar/dist/marquee-widget.min.js
```

### Deployment a Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Seguir prompts
# Widget disponible en: https://tu-proyecto.vercel.app/dist/marquee-widget.min.js
```

### Deployment a CDN Propio

1. Build del widget
2. Subir `dist/` a tu CDN (S3, CloudFront, etc.)
3. Asegurar CORS habilitado
4. URL final: `https://cdn.tudominio.com/marquee-widget.min.js`

### Versionado

Al hacer cambios que rompen compatibilidad:

1. **Actualizar versión en package.json:**
   ```json
   {
     "version": "1.0.0"
   }
   ```

2. **Actualizar versión en MarqueeWidget.ts:**
   ```typescript
   super({
     name: 'marquee-notification-bar',
     version: '1.0.0',  // <- Cambiar aquí
     // ...
   })
   ```

3. **Commit y tag:**
   ```bash
   git commit -am "v1.0.0"
   git tag v1.0.0
   git push origin main --tags
   ```

---

## 📚 Buenas Prácticas

### TypeScript

- ✅ **Usa tipos estrictos**: No usar `any` sin justificación
- ✅ **Define interfaces**: Para toda configuración
- ✅ **Documenta tipos**: Usa JSDoc para propiedades
- ❌ **No uses @ts-ignore**: Soluciona el problema correctamente

### Lifecycle Hooks

- ✅ **Valida en onInit**: Antes de renderizar
- ✅ **Cleanup en onDestroy**: Siempre limpia recursos
- ✅ **No bloquees render**: onInit/onRender deben ser rápidos
- ❌ **No hagas requests HTTP**: El SDK maneja eso

### Performance

- ✅ **Usa cache del SDK**: Configurado en constructor
- ✅ **Minimiza DOM reflows**: Batch cambios de estilo
- ✅ **Usa CSS animations**: No JavaScript para animaciones
- ❌ **No uses setInterval**: Usa CSS animations

### Error Handling

- ✅ **Valida configuración**: En onInit antes de renderizar
- ✅ **Mensajes claros**: Indica qué está mal y cómo arreglarlo
- ✅ **Try-catch en async**: Especialmente en lifecycle hooks
- ✅ **Renderiza estado de error**: No dejes widget en blanco

### Analytics

- ✅ **Track eventos clave**: Render, interactions, errors
- ✅ **Include context**: Datos útiles para análisis
- ❌ **No tracks PII**: Nunca datos personales

---

## 🔧 Troubleshooting

### Widget no aparece

**Problema**: El widget no se muestra en la página.

**Soluciones**:
1. Verificar que script tag tiene los data attributes correctos
2. Abrir consola y buscar errores
3. Activar `?debug` y verificar logs
4. Verificar que `message1_text` está configurado en Koru
5. Verificar CORS si widget está en CDN diferente

### Error: "At least one message is required"

**Problema**: Validación falla en onInit.

**Solución**: Configurar al menos `message1_text` en Koru App Manager dashboard.

### Animación no funciona

**Problema**: Marquee está estático.

**Soluciones**:
1. Verificar `showMarquee: true` en configuración
2. Verificar que CSS está cargado correctamente
3. Revisar `animation` en DevTools (puede estar pausado)

### Widget no actualiza al cambiar config en Koru

**Problema**: Cambios en Koru no se reflejan.

**Soluciones**:
1. Limpiar cache del navegador (Ctrl+F5)
2. Verificar `cacheDuration` no es muy largo
3. Usar `widget.reload()` programáticamente
4. Verificar que `onConfigUpdate` funciona correctamente

### Memory leaks

**Problema**: Uso de memoria crece con el tiempo.

**Soluciones**:
1. Verificar que `onDestroy` limpia todos los event listeners
2. Usar Chrome DevTools → Memory → Take heap snapshot
3. Buscar referencias retenidas al widget
4. Asegurar que `this.container = null` se ejecuta

### TypeScript errors al compilar

**Problema**: `npm run build` falla con errores de tipos.

**Soluciones**:
1. Verificar que tipos del SDK están instalados: `npm install`
2. Limpiar y reinstalar: `rm -rf node_modules && npm install`
3. Verificar tsconfig.json `strict: true`
4. Corregir tipos en lugar de usar `any` o `@ts-ignore`

---

## 📞 Soporte

- **GitHub Issues**: https://github.com/Red-Clover-Consultoria/marquee-notification-bar/issues
- **Documentación Koru SDK**: https://github.com/redclover-appmanager/widget-sdk
- **Email**: support@redclover.com

---

## 📝 Contribuir

1. Fork el repositorio
2. Crear feature branch: `git checkout -b feature/mi-feature`
3. Hacer cambios y commit: `git commit -am 'Add mi-feature'`
4. Push al branch: `git push origin feature/mi-feature`
5. Crear Pull Request

Asegurar que:
- [ ] Código pasa `npm run build` sin errores
- [ ] Tipos TypeScript son correctos
- [ ] Testing manual realizado
- [ ] Documentación actualizada si es necesario
