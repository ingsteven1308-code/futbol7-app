# 🚀 Guía Completa: Migración a Supabase y Despliegue en Vercel

## 📋 Índice
1. [Configuración Supabase](#configuración-supabase)
2. [Configuración Local](#configuración-local)
3. [Despliegue en Vercel](#despliegue-en-vercel)
4. [Verificación Final](#verificación-final)
5. [Solución de Problemas](#solución-de-problemas)

---

## 1️⃣ Configuración Supabase

### Paso 1.1: Crear Proyecto en Supabase

1. Accede a [supabase.com](https://supabase.com)
2. Haz clic en **"New Project"** (arriba a la derecha)
3. Completa el formulario:
   - **Name**: `futbol7-app` (o el nombre que prefieras)
   - **Database Password**: Crea una contraseña fuerte y **guárdala**
   - **Region**: Elige la más cercana a ti (ej: `South America - São Paulo` para Latinoamérica)
4. Haz clic en **"Create new project"**
5. Espera 3-5 minutos mientras se inicializa

### Paso 1.2: Obtener Credenciales API

Una vez creado el proyecto:

1. En el menú izquierdo, ve a **Settings** → **API**
2. Copia estos valores (los necesitarás):
   ```
   Project URL:        https://xxxxx.supabase.co
   anon public key:    eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
3. Guarda estos valores en un lugar seguro

### Paso 1.3: Crear Tabla de Jugadores

1. En el menú izquierdo, haz clic en **SQL Editor**
2. Haz clic en **"New Query"**
3. Copia y pega este SQL:

```sql
-- Crear tabla de jugadores
CREATE TABLE public.players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  document_number TEXT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('Arquero', 'Defensa', 'Mediocampista', 'Delantero')),
  team TEXT NOT NULL CHECK (team IN ('Blanco', 'Negro')),
  photo_url TEXT,
  created_at BIGINT NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW(),
  deleted_at TIMESTAMP
);

-- Crear índices para mejor rendimiento
CREATE INDEX idx_team ON public.players(team);
CREATE INDEX idx_created_at ON public.players(created_at DESC);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

-- Política: Todos pueden leer
CREATE POLICY "Enable read access for all users"
  ON public.players FOR SELECT
  USING (true);

-- Política: Todos pueden insertar
CREATE POLICY "Enable insert for all users"
  ON public.players FOR INSERT
  WITH CHECK (true);

-- Política: Todos pueden actualizar
CREATE POLICY "Enable update for all users"
  ON public.players FOR UPDATE
  USING (true);

-- Política: Todos pueden eliminar
CREATE POLICY "Enable delete for all users"
  ON public.players FOR DELETE
  USING (true);
```

4. Haz clic en **"Run"** (botón azul)
5. Deberías ver: **Query executed successfully**

### Paso 1.4: Crear Bucket de Almacenamiento (Fotos)

1. En el menú izquierdo, ve a **Storage**
2. Haz clic en **"Create a new bucket"**
3. Completa:
   - **Name**: `player-photos`
   - **Make it public**: Activa la opción (ON)
4. Haz clic en **Create bucket**
5. Verás confirmación

---

## 2️⃣ Configuración Local

### Paso 2.1: Instalar Dependencias

En la terminal de tu proyecto:

```bash
npm install
```

Esto instalará `@supabase/supabase-js` junto con las otras dependencias.

### Paso 2.2: Configurar Variables de Entorno

1. En la raíz del proyecto, abre el archivo `.env.local`
2. Reemplaza los valores:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=player-photos
NEXT_PUBLIC_ORGANIZER_PHONE=573136135417
```

**⚠️ IMPORTANTE**: 
- `NEXT_PUBLIC_*` es visible en el cliente (seguro)
- Nunca uses la `service_role` key en el cliente
- Usa SIEMPRE la `anon public` key

### Paso 2.3: Verificar en Local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

Prueba:
- ✅ Registra un jugador
- ✅ Edítalo
- ✅ Elimínalo
- ✅ Abre otra ventana del navegador → deberías ver cambios en tiempo real
- ✅ Prueba "Reiniciar Partido"

---

## 3️⃣ Despliegue en Vercel

### Paso 3.1: Preparar Repositorio Git

Si no tienes Git:

```bash
git init
git add .
git commit -m "Migrate to Supabase and add Restart Match button"
```

Si ya tienes un repositorio:

```bash
git add .
git commit -m "Migrate to Supabase and add Restart Match button"
git push origin main
```

### Paso 3.2: Crear Proyecto en Vercel

1. Accede a [vercel.com](https://vercel.com)
2. Haz clic en **"New Project"** (arriba a la derecha)
3. **Conecta tu repositorio**:
   - Haz clic en **"Import Git Repository"**
   - Selecciona tu repositorio (ej: futbol7-app)
   - Haz clic en **"Import"**

### Paso 3.3: Configurar Variables de Entorno

En Vercel, durante el setup:

1. Ve a la sección **"Environment Variables"**
2. Agrega estas variables:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://tuproyecto.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET` | `player-photos` |
| `NEXT_PUBLIC_ORGANIZER_PHONE` | `573136135417` |

3. Haz clic en **"Deploy"**

### Paso 3.4: Esperar Despliegue

Vercel mostrará:
- ⏳ **Building...** (compilando el código)
- ✅ **Ready** (cuando termine)

Cuando veas ✅, tu app está en vivo.

---

## 4️⃣ Verificación Final

### ✅ Checklist de Verificación

1. **Accede a tu URL de Vercel**
   - Ej: `https://futbol7-app.vercel.app`

2. **Prueba el flujo completo**:
   - [ ] Registra un jugador
   - [ ] Verifica que aparece en Supabase (Dashboard → Table Editor → players)
   - [ ] Edítalo
   - [ ] Elimínalo
   - [ ] Abre otra ventana del navegador → cambios en tiempo real
   - [ ] Prueba "Reiniciar Partido"
   - [ ] Descarga Excel
   - [ ] Comparte la URL con alguien → verá cambios en tiempo real

3. **Verifica logs de error**
   - En Vercel: Haz clic en tu deployment
   - Ve a **"Function Logs"** o **"Runtime Logs"**
   - Busca cualquier error rojo

---

## 5️⃣ Solución de Problemas

### ❌ "Missing Supabase environment variables"

**Solución**: Verifica que `.env.local` tenga las variables correctas

```bash
cat .env.local
```

Debe mostrar:
```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### ❌ "Error al cargar los jugadores"

**Posibles causas**:

1. **Las credenciales son incorrectas**
   - Copia de nuevo desde Supabase Dashboard → Settings → API

2. **RLS no está configurado correctamente**
   - Ve a Supabase → Authentication → Policies
   - Verifica que existan las 4 políticas

3. **La tabla no existe**
   - Ve a Supabase → SQL Editor → ejecuta el SQL de nuevo

### ❌ "Las fotos no se cargan"

**Solución**:

1. Verifica que el bucket `player-photos` exista
2. Verifica que sea público
3. Supabase → Storage → player-photos → Policies

### ❌ Cambios no se sincronizan en tiempo real

**Solución**:

1. Verifica conexión a internet
2. Recarga la página (F5)
3. Verifica que Realtime esté habilitado:
   - Supabase → Settings → Realtime → Enable

### ❌ Error de CORS

**Solución**: Supabase ya tiene CORS configurado. Si persiste:

1. Ve a Supabase → Settings → API
2. Asegúrate que `CORS allowed origins` incluya tu URL de Vercel

---

## 📱 Despliegue Rápido (Sin Vercel)

Si prefieres otras plataformas:

### **Netlify**
```bash
npm run build
# Sube la carpeta .next a Netlify
```

### **Railway.app**
```bash
# Conecta tu GitHub
# Railway auto-detecta Next.js
```

### **Render.com**
```bash
# Similar a Railway
```

---

## 🔐 Mejores Prácticas de Seguridad

1. ✅ Nunca commits credenciales reales (usa `.env.local`)
2. ✅ Usa variables de entorno en Vercel
3. ✅ Mantén Supabase RLS habilitado
4. ✅ Usa `NEXT_PUBLIC_*` solo para datos no sensibles
5. ✅ Revisa logs regularmente

---

## 📚 Recursos Útiles

- [Documentación Supabase](https://supabase.com/docs)
- [Documentación Vercel](https://vercel.com/docs)
- [Next.js Guide](https://nextjs.org/docs)
- [Supabase Realtime](https://supabase.com/docs/guides/realtime)

---

## 🎯 Próximas Mejoras (Opcionales)

1. **Autenticación**: Agregar login para usuarios
2. **Validación**: Zod o Yup para validar datos
3. **Testing**: Vitest para tests unitarios
4. **Analytics**: Supabase Analytics o Vercel Analytics
5. **Backup**: Configurar backups automáticos en Supabase

---

**¡Tu app está lista para producción! 🚀**
