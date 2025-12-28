# 🗄️ ArtConnect CRM - Supabase Database Setup

Dokumentasi lengkap untuk setup database Supabase untuk ArtConnect CRM.

## 📋 Prerequisites

- Akun Supabase (sudah dibuat)
- Project URL: `https://lpxmljbpcxyhzcwsmzkv.supabase.co`

## 🚀 Quick Start

### 1. Jalankan Migrations di Supabase SQL Editor

Buka [Supabase SQL Editor](https://supabase.com/dashboard/project/lpxmljbpcxyhzcwsmzkv/sql) dan jalankan file-file SQL berikut secara berurutan:

1. **`001_initial_schema.sql`** - Schema utama (tables, types, functions, triggers, RLS policies)
2. **`002_seed_data.sql`** - Seed data dan helper functions
3. **`003_storage_buckets.sql`** - Storage buckets configuration

### 2. Cara Menjalankan SQL

1. Buka link SQL Editor di atas
2. Copy seluruh isi file SQL
3. Paste ke SQL Editor
4. Klik "Run" atau tekan Ctrl+Enter
5. Pastikan tidak ada error

## 📊 Database Schema

### Tables

| Table | Deskripsi |
|-------|-----------|
| `users` | User profiles (synced with Firebase Auth) |
| `artworks` | Artwork/karya seni data |
| `contacts` | CRM contacts (galleries, collectors, museums, curators) |
| `sales` | Transaction/sales records |
| `activity_logs` | Activity audit log |
| `reports` | Generated reports |
| `scheduled_reports` | Scheduled/recurring reports |
| `pipeline_items` | Kanban pipeline items |
| `tags` | Tags for artworks |
| `notifications` | User notifications |

### Enums

| Enum | Values |
|------|--------|
| `user_role` | admin, artist, collector, user |
| `artwork_status` | concept, wip, finished, sold |
| `contact_type` | gallery, collector, museum, curator |
| `sale_status` | pending, completed, cancelled, refunded |
| `activity_type` | artwork_created, artwork_updated, artwork_sold, contact_added, etc. |
| `report_type` | sales, artworks, contacts, performance, custom |
| `report_format` | pdf, csv, excel |
| `report_frequency` | daily, weekly, monthly, quarterly |

### Views

| View | Deskripsi |
|------|-----------|
| `dashboard_stats` | Aggregated stats for dashboard |
| `monthly_sales_summary` | Monthly sales aggregation |

### Storage Buckets

| Bucket | Visibility | Limit | Allowed Types |
|--------|------------|-------|---------------|
| `artworks` | Public | 10MB | JPEG, PNG, WebP, GIF |
| `avatars` | Public | 5MB | JPEG, PNG, WebP |
| `reports` | Private | 50MB | PDF, CSV, Excel |
| `documents` | Private | 20MB | PDF, Images, Word |

## 🔐 Row Level Security (RLS)

Semua tables sudah dilengkapi dengan RLS policies:

- Users hanya bisa mengakses data milik mereka sendiri
- Data di-isolasi berdasarkan `user_id` yang terhubung ke `auth_id`
- Public buckets (artworks, avatars) bisa dilihat siapa saja
- Private buckets (reports, documents) hanya bisa diakses pemilik

## 🔗 Supabase Auth Setup

Database ini menggunakan **Supabase Auth** (bukan Firebase Auth):

### Email & Password
Email/Password sudah otomatis tersedia di Supabase Auth.

### Google OAuth Setup

Untuk mengaktifkan Google OAuth:

#### 1. Buat OAuth credentials di Google Cloud Console
1. Buka [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Pilih atau buat project baru
3. Klik "Create Credentials" → "OAuth 2.0 Client IDs"
4. Pilih "Web application"
5. Tambahkan **Authorized redirect URI**:
   ```
   https://lpxmljbpcxyhzcwsmzkv.supabase.co/auth/v1/callback
   ```
6. Copy **Client ID** dan **Client Secret**

#### 2. Konfigurasi di Supabase Dashboard
1. Buka [Supabase Auth Providers](https://supabase.com/dashboard/project/lpxmljbpcxyhzcwsmzkv/auth/providers)
2. Cari "Google" dan klik untuk expand
3. Enable "Sign in with Google"
4. Paste **Client ID** dan **Client Secret**
5. Klik "Save"

### Cara Kerja Auth:

```typescript
// Sign in with email
await supabase.auth.signInWithPassword({
  email: 'user@email.com',
  password: 'password123',
});

// Sign in with Google
await supabase.auth.signInWithOAuth({
  provider: 'google',
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
await supabase.auth.signOut();
```

## 📁 File Structure

```
supabase/
└── migrations/
    ├── 001_initial_schema.sql    # Main schema
    ├── 002_seed_data.sql         # Seed data & helpers
    └── 003_storage_buckets.sql   # Storage config

src/lib/
├── supabase.ts                   # Supabase client
├── database.types.ts             # TypeScript types
└── services/
    ├── index.ts                  # Services export
    ├── artworks.service.ts       # Artworks CRUD
    ├── contacts.service.ts       # Contacts CRUD
    └── sales.service.ts          # Sales CRUD
```

## 🛠️ Development Usage

### Artworks Service

```typescript
import { artworksService } from '@/lib/services';

// Get all artworks
const { data, count } = await artworksService.getAll(userId, {
  status: 'finished',
  search: 'sunset',
});

// Create artwork
const newArtwork = await artworksService.create({
  user_id: userId,
  title: 'New Artwork',
  medium: 'Oil on Canvas',
  status: 'concept',
});

// Update
await artworksService.update(artworkId, { status: 'wip' });

// Delete
await artworksService.delete(artworkId);
```

### Contacts Service

```typescript
import { contactsService } from '@/lib/services';

// Get contacts by type
const { data } = await contactsService.getAll(userId, {
  type: 'collector',
});

// Get VIP contacts
const vips = await contactsService.getVips(userId);

// Search
const results = await contactsService.search(userId, 'ahmad');
```

### Sales Service

```typescript
import { salesService } from '@/lib/services';

// Get sales stats
const stats = await salesService.getStats(userId);

// Get monthly data
const monthly = await salesService.getMonthlySales(userId, 2024);

// Complete a sale
await salesService.complete(saleId, 'bank_transfer', 'REF123');
```

### Storage

```typescript
import { uploadArtworkImage, getArtworkImageUrl } from '@/lib/supabase';

// Upload artwork image
const result = await uploadArtworkImage(userId, file);
console.log(result.url);

// Get public URL
const url = getArtworkImageUrl('user-id/image.jpg');
```

### Realtime Subscriptions

```typescript
import { subscribeToTable } from '@/lib/supabase';

// Subscribe to artworks changes
const unsubscribe = subscribeToTable('artworks', (payload) => {
  console.log('Change:', payload.eventType, payload.new);
});

// Cleanup
unsubscribe();
```

## 🧪 Testing

### Test Database Connection

```typescript
import { supabase } from '@/lib/supabase';

const testConnection = async () => {
  const { data, error } = await supabase.from('users').select('count');
  if (error) {
    console.error('Connection failed:', error);
  } else {
    console.log('Connected successfully!');
  }
};
```

## 🔧 Troubleshooting

### Error: Missing environment variables

Pastikan file `.env` ada dan berisi:

```
VITE_SUPABASE_URL=https://lpxmljbpcxyhzcwsmzkv.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Error: RLS policies blocking access

Pastikan:
1. User sudah terdaftar di table `users`
2. Firebase token valid dan dikirim via header
3. `firebase_uid` match dengan token

### Error: Type errors di service

Regenerate types dengan Supabase CLI:

```bash
npx supabase gen types typescript --project-id lpxmljbpcxyhzcwsmzkv > src/lib/database.types.ts
```

## 📚 Resources

- [Supabase Dashboard](https://supabase.com/dashboard/project/lpxmljbpcxyhzcwsmzkv)
- [Supabase Docs](https://supabase.com/docs)
- [Table Editor](https://supabase.com/dashboard/project/lpxmljbpcxyhzcwsmzkv/editor)
- [SQL Editor](https://supabase.com/dashboard/project/lpxmljbpcxyhzcwsmzkv/sql)
- [Storage](https://supabase.com/dashboard/project/lpxmljbpcxyhzcwsmzkv/storage)

---

**Next Steps:** Setup Firebase Auth untuk complete integration.
