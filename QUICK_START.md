# ⚡ Quick Start - Tu Aplicación Supabase

## 🎯 Lo Que Cambió

Tu app ahora usa **Supabase** en lugar de localStorage:
- ✅ Datos guardados en la nube
- ✅ Sincronización en tiempo real entre dispositivos
- ✅ Fotos almacenadas online
- ✅ Nuevo botón "Reiniciar Partido"

---

## 1️⃣ AHORA MISMO (5 minutos)

### A. Instalar dependencias
```bash
cd futbol7-app
npm install
```

### B. Obtener credenciales de Supabase

1. Ve a [supabase.com](https://supabase.com)
2. Crea un nuevo proyecto o usa uno existente
3. Ve a **Settings** → **API**
4. Copia:
   - `Project URL` (ej: `https://xxxxx.supabase.co`)
   - `anon public` key (la larga)

### C. Crear tabla en Supabase

1. En Supabase, ve a **SQL Editor**
2. Copia todo el código de [aquí](#sql)
3. Ejecuta (click azul)

### D. Configurar variables locales

Edita `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://tuproyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_clave_publica
NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET=player-photos
NEXT_PUBLIC_ORGANIZER_PHONE=573136135417
```

### E. Probar localmente
```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000)

✅ **¡Listo! Prueba a registrar un jugador.**

---

## 2️⃣ DESPUÉS (Desplegar)

Lee [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para desplegar en **Vercel** (5 minutos adicionales).

---

## ⚠️ Problemas Comunes

| Error | Solución |
|-------|----------|
| "Missing Supabase variables" | Verifica que `.env.local` tenga los valores correctos |
| "Error al cargar jugadores" | Copia de nuevo las credenciales desde Supabase |
| "No ves cambios en tiempo real" | Recarga la página (F5) y verifica WiFi |

---

## 📋 SQL para Crear Tabla

Copia y pega en Supabase → SQL Editor:

```sql
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

CREATE INDEX idx_team ON public.players(team);
CREATE INDEX idx_created_at ON public.players(created_at DESC);

ALTER TABLE public.players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users"
  ON public.players FOR SELECT USING (true);

CREATE POLICY "Enable insert for all users"
  ON public.players FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for all users"
  ON public.players FOR UPDATE USING (true);

CREATE POLICY "Enable delete for all users"
  ON public.players FOR DELETE USING (true);
```

Luego, en **Storage**, crea un bucket llamado `player-photos` y hazlo público.

---

## ✅ Checklist

- [ ] Instalar `npm install`
- [ ] Crear proyecto en Supabase
- [ ] Copiar credenciales
- [ ] Ejecutar SQL
- [ ] Crear bucket `player-photos`
- [ ] Configurar `.env.local`
- [ ] `npm run dev` funciona
- [ ] Registrar jugador de prueba
- [ ] Ver en Supabase Dashboard
- [ ] Leer [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)
- [ ] Desplegar en Vercel (opcional)

---

## 🔗 Links Útiles

- [Supabase Dashboard](https://supabase.com/dashboard)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Instrucciones completas
- [README.md](./README.md) - Documentación

---

## 💡 Próximas Funciones (Listo)

- ✅ Sincronización en tiempo real
- ✅ Fotos en la nube
- ✅ Botón "Reiniciar Partido"
- ✅ Base de datos persistente
- ✅ Múltiples dispositivos simultáneos

---

**¿Necesitas ayuda?** Lee [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

**¡Listo para empezar! 🚀**
