# ⚽ Fútbol 7 App

Una aplicación moderna para organizar partidos de fútbol 7 en tiempo real con sincronización en vivo.

## ✨ Características

- 📱 **Interfaz Responsive**: Diseño moderno y deportivo
- 🌐 **Sincronización en Tiempo Real**: Cambios instantáneos entre dispositivos (Supabase Realtime)
- 📸 **Almacenamiento de Fotos**: Guarda y ve fotos de jugadores
- 👥 **Gestión de Equipos**: Organiza jugadores en equipo Blanco y Negro
- 📊 **Exportación a Excel**: Descarga registros de jugadores
- 💬 **Integración WhatsApp**: Notifica automáticamente nuevos registros
- 🔄 **Reiniciar Partido**: Botón para limpiar todos los datos
- 🗄️ **Base de Datos Supabase**: Almacenamiento persistente y seguro

## 🚀 Quick Start

### Instalación

```bash
# Clonar o descargar el proyecto
cd futbol7-app

# Instalar dependencias
npm install

# Configurar variables de entorno
# Copia .env.local y agrega tus credenciales de Supabase
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## 🛠️ Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| **Framework** | Next.js | 16.2.6 |
| **UI Library** | React | 19.2.4 |
| **Lenguaje** | TypeScript | 5 |
| **Estilos** | Tailwind CSS | 4 |
| **Backend** | Supabase | Latest |
| **Base de Datos** | PostgreSQL (Supabase) | - |
| **Almacenamiento** | Supabase Storage | - |
| **Excel** | XLSX | 0.18.5 |

## 📁 Estructura del Proyecto

```
futbol7-app/
├── app/
│   ├── components/           # Componentes React
│   │   ├── FootballApp.tsx      (Principal)
│   │   ├── PlayerForm.tsx       (Formulario)
│   │   ├── PlayerCard.tsx       (Tarjeta)
│   │   ├── TeamSection.tsx      (Sección equipo)
│   │   ├── PhotoCapture.tsx     (Captura foto)
│   │   ├── Toast.tsx            (Notificaciones)
│   │   └── RestartMatchModal.tsx (Reinicio)
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── hooks/
│   ├── usePlayers.ts        # Lógica + Supabase
│   └── useToast.ts          # Notificaciones
│
├── lib/
│   ├── supabase.ts          # Cliente Supabase
│   ├── supabaseStorage.ts   # Fotos
│   ├── database.types.ts    # Tipos TypeScript
│   ├── types.ts             # Tipos App
│   ├── excel.ts             # Exportación
│   ├── storage.ts           # [DEPRECATED] localStorage
│   └── whatsapp.ts          # WhatsApp
│
├── .env.local               # Variables de entorno
├── DEPLOYMENT_GUIDE.md      # Guía de despliegue
├── package.json
├── tsconfig.json
└── next.config.ts
```

## 🔧 Configuración Requerida

### Variables de Entorno

Crea un archivo `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=player-photos
NEXT_PUBLIC_ORGANIZER_PHONE=573136135417
```

### Supabase Setup

Lee [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para:
1. Crear proyecto en Supabase
2. Crear tabla `players`
3. Configurar bucket de fotos
4. Habilitar Realtime

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción (producción)
npm run build

# Iniciar servidor (producción)
npm start

# Linting
npm run lint
```

## 🎯 Funcionalidades Principales

### Registrar Jugador
1. Captura o carga foto
2. Ingresa datos personales
3. Selecciona posición
4. Elige equipo
5. Confirma → Se notifica por WhatsApp

### Editar/Eliminar
- Hover en tarjeta → opciones de editar/eliminar
- Cambios se sincronizan en tiempo real

### Reiniciar Partido
1. Haz clic en botón "🔄 Reiniciar"
2. Confirma en el modal
3. Se eliminan todos los jugadores

### Exportar a Excel
- Botón "📊 Descargar"
- Genera archivo con lista de jugadores

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Git debe estar configurado
git add .
git commit -m "Initial commit"
git push

# En Vercel.com:
# 1. Importa tu repositorio
# 2. Agrega variables de entorno
# 3. Deploy automático
```

Lee [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para instrucciones detalladas.

### Otras plataformas

- **Netlify**: Similar a Vercel
- **Railway.app**: Auto-detecta Next.js
- **Render.com**: Alternativa a Railway

## 🔐 Seguridad

- ✅ RLS (Row Level Security) habilitado en Supabase
- ✅ Variables de entorno protegidas
- ✅ Políticas públicas de lectura/escritura
- ✅ CORS configurado

## 📊 Sincronización en Tiempo Real

Gracias a Supabase Realtime:
- Cambios instantáneos entre dispositivos
- Múltiples usuarios ven actualizaciones en vivo
- Sin necesidad de recargar página

## 🐛 Solución de Problemas

| Problema | Solución |
|----------|----------|
| "Missing Supabase variables" | Verifica `.env.local` |
| "Error al cargar jugadores" | Comprueba credenciales Supabase |
| "Fotos no se cargan" | Crea bucket `player-photos` |
| "Sin cambios en tiempo real" | Habilita Realtime en Supabase |

Ver [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para más ayuda.

## 📚 Documentación

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React 19](https://react.dev)

## 🎨 Diseño

- **Tema**: Oscuro (Dark Mode)
- **Colores**: Amarillo y Blanco (deportivo)
- **Animaciones**: Transiciones suaves
- **Responsive**: Funciona en mobile y desktop

## 📱 Dispositivos Soportados

- ✅ Smartphone (iOS/Android)
- ✅ Tablet
- ✅ Desktop
- ✅ Navegadores modernos (Chrome, Firefox, Safari, Edge)

## 🚀 Próximas Mejoras

- [ ] Autenticación de usuarios
- [ ] Validación avanzada (Zod)
- [ ] Tests unitarios (Vitest)
- [ ] Analytics
- [ ] Estadísticas de jugadores
- [ ] Historial de partidos

## 📄 Licencia

Libre para uso personal y comercial.

## 👨‍💻 Autor

Creado con ⚽ y Next.js

---

**¿Necesitas ayuda?** Lee [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para configuración paso a paso.
