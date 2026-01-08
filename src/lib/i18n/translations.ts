// ============================================================================
// ARTCONNECT CRM - INTERNATIONALIZATION (i18n)
// ============================================================================

export type Language = 'id' | 'en';

export interface Translations {
  // Common
  common: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    loading: string;
    noData: string;
    viewAll: string;
    close: string;
    confirm: string;
    back: string;
    next: string;
    submit: string;
    refresh: string;
  };
  
  // Navigation
  nav: {
    dashboard: string;
    artworks: string;
    contacts: string;
    pipeline: string;
    analytics: string;
    reports: string;
    settings: string;
    logout: string;
  };
  
  // Dashboard
  dashboard: {
    title: string;
    greeting: {
      morning: string;
      afternoon: string;
      evening: string;
      night: string;
    };
    subtitle: string;
    stats: {
      totalArtworks: string;
      totalContacts: string;
      totalSales: string;
      activePipeline: string;
    };
    hero: {
      artworks: string;
      sales: string;
      addArtwork: string;
      addArtworkShort: string;
      viewPipeline: string;
    };
    recentArtworks: {
      title: string;
      count: string;
      viewAll: string;
      noArtworks: string;
      noArtworksDesc: string;
      priceShown: string;
      priceHidden: string;
    };
    recentContacts: {
      title: string;
      count: string;
      viewAll: string;
      noContacts: string;
      noContactsDesc: string;
      emailShown: string;
      emailHidden: string;
    };
    activityFeed: string;
    activitySection: {
      title: string;
      subtitle: string;
      hide: string;
      showAll: string;
      noActivity: string;
      noActivityDesc: string;
      clickToShow: string;
    };
    artworkStatus: {
      title: string;
      subtitle: string;
      concept: string;
      wip: string;
      finished: string;
      sold: string;
      total: string;
      noArtworks: string;
      noArtworksDesc: string;
    };
    salesChart: {
      title: string;
      subtitle: string;
      totalSales: string;
      artworksSold: string;
      vsLastMonth: string;
      noData: string;
      noDataDesc: string;
      artworkSoldTooltip: string;
    };
    quickActions: string;
    quickActionsSection: {
      title: string;
      subtitle: string;
      addArtwork: string;
      addArtworkDesc: string;
      addContact: string;
      addContactDesc: string;
      viewPipeline: string;
      viewPipelineDesc: string;
      recordSale: string;
      recordSaleDesc: string;
      navigatingTo: string;
    };
  };
  
  // Artworks
  artworks: {
    title: string;
    subtitle: string;
    addArtwork: string;
    searchPlaceholder: string;
    noArtworks: string;
    noArtworksDesc: string;
    status: {
      concept: string;
      wip: string;
      finished: string;
      sold: string;
    };
    fields: {
      title: string;
      medium: string;
      dimensions: string;
      year: string;
      price: string;
      status: string;
      description: string;
      image: string;
    };
  };
  
  // Contacts
  contacts: {
    title: string;
    subtitle: string;
    addContact: string;
    searchPlaceholder: string;
    noContacts: string;
    noContactsDesc: string;
    types: {
      collector: string;
      gallery: string;
      curator: string;
      artist: string;
      other: string;
    };
    fields: {
      name: string;
      email: string;
      phone: string;
      company: string;
      type: string;
      location: string;
      notes: string;
    };
  };
  
  // Pipeline
  pipeline: {
    title: string;
    subtitle: string;
    addItem: string;
    columns: {
      concept: string;
      wip: string;
      finished: string;
      sold: string;
    };
    summary: string;
    totalItems: string;
    totalValue: string;
    emptyColumn: string;
  };
  
  // Reports
  reports: {
    title: string;
    subtitle: string;
    generateReport: string;
    reportTypes: {
      inventory: string;
      sales: string;
      contacts: string;
      activity: string;
    };
    exportPDF: string;
    exportCSV: string;
    exportExcel: string;
    scheduledReports: string;
    recentReports: string;
  };
  
  // Settings
  settings: {
    title: string;
    subtitle: string;
    profile: {
      title: string;
      editProfile: string;
      emailVerified: string;
      freePlan: string;
    };
    appearance: {
      title: string;
      darkMode: string;
      darkModeDesc: string;
      language: string;
    };
    notifications: {
      title: string;
      emailNotifs: string;
      emailNotifsDesc: string;
    };
    security: {
      title: string;
      changePassword: string;
      changePasswordDesc: string;
    };
    help: {
      title: string;
      helpCenter: string;
      terms: string;
      about: string;
    };
    logout: string;
    logoutDesc: string;
  };
  
  // Auth
  auth: {
    login: {
      title: string;
      subtitle: string;
      email: string;
      password: string;
      rememberMe: string;
      forgotPassword: string;
      loginButton: string;
      noAccount: string;
      registerLink: string;
      orContinueWith: string;
      googleButton: string;
    };
    register: {
      title: string;
      subtitle: string;
      fullName: string;
      email: string;
      password: string;
      confirmPassword: string;
      registerButton: string;
      hasAccount: string;
      loginLink: string;
    };
    forgotPassword: {
      title: string;
      subtitle: string;
      email: string;
      sendButton: string;
      backToLogin: string;
    };
    resetPassword: {
      title: string;
      subtitle: string;
      newPassword: string;
      confirmPassword: string;
      resetButton: string;
    };
  };
  
  // Dialogs
  dialogs: {
    changePassword: {
      title: string;
      subtitle: string;
      newPassword: string;
      confirmPassword: string;
      saveButton: string;
      saving: string;
    };
    selectLanguage: {
      title: string;
      subtitle: string;
    };
  };
  
  // Messages
  messages: {
    success: {
      saved: string;
      deleted: string;
      updated: string;
      loggedOut: string;
      passwordChanged: string;
      languageChanged: string;
      emailNotifOn: string;
      emailNotifOff: string;
    };
    error: {
      generic: string;
      saveFailed: string;
      deleteFailed: string;
      loginFailed: string;
      logoutFailed: string;
      passwordChangeFailed: string;
      settingsUpdateFailed: string;
    };
  };
}

// Indonesian translations
export const id: Translations = {
  common: {
    save: 'Simpan',
    cancel: 'Batal',
    delete: 'Hapus',
    edit: 'Edit',
    add: 'Tambah',
    search: 'Cari',
    loading: 'Memuat...',
    noData: 'Tidak ada data',
    viewAll: 'Lihat Semua',
    close: 'Tutup',
    confirm: 'Konfirmasi',
    back: 'Kembali',
    next: 'Lanjut',
    submit: 'Kirim',
    refresh: 'Refresh',
  },
  
  nav: {
    dashboard: 'Dashboard',
    artworks: 'Karya Seni',
    contacts: 'Kontak',
    pipeline: 'Pipeline',
    analytics: 'Analitik',
    reports: 'Laporan',
    settings: 'Pengaturan',
    logout: 'Keluar',
  },
  
  dashboard: {
    title: 'Dashboard',
    greeting: {
      morning: 'Selamat Pagi',
      afternoon: 'Selamat Siang',
      evening: 'Selamat Sore',
      night: 'Selamat Malam',
    },
    subtitle: 'Pantau perkembangan karya seni dan kelola bisnis Anda dengan mudah.',
    stats: {
      totalArtworks: 'Total Karya',
      totalContacts: 'Total Kontak',
      totalSales: 'Total Penjualan',
      activePipeline: 'Pipeline Aktif',
    },
    hero: {
      artworks: 'karya',
      sales: 'penjualan',
      addArtwork: 'Tambah Karya Baru',
      addArtworkShort: 'Tambah Karya',
      viewPipeline: 'Lihat Pipeline',
    },
    recentArtworks: {
      title: 'Karya Terbaru',
      count: 'karya ditampilkan',
      viewAll: 'Lihat Semua',
      noArtworks: 'Belum Ada Karya',
      noArtworksDesc: 'Tambahkan karya seni pertama Anda untuk memulai',
      priceShown: 'Harga ditampilkan',
      priceHidden: 'Harga disembunyikan',
    },
    recentContacts: {
      title: 'Kontak Terbaru',
      count: 'kontak ditampilkan',
      viewAll: 'Lihat Semua',
      noContacts: 'Belum Ada Kontak',
      noContactsDesc: 'Tambahkan kontak pertama Anda untuk membangun jaringan',
      emailShown: 'Email ditampilkan',
      emailHidden: 'Email disembunyikan',
    },
    activityFeed: 'Aktivitas Terbaru',
    activitySection: {
      title: 'Aktivitas Terkini',
      subtitle: 'Pembaruan terbaru',
      hide: 'Sembunyikan',
      showAll: 'Semua',
      noActivity: 'Belum Ada Aktivitas',
      noActivityDesc: 'Aktivitas akan muncul saat Anda mulai menggunakan aplikasi',
      clickToShow: 'Klik untuk menampilkan aktivitas lainnya',
    },
    artworkStatus: {
      title: 'Status Karya',
      subtitle: 'Ringkasan status semua karya',
      concept: 'Konsep',
      wip: 'Proses',
      finished: 'Selesai',
      sold: 'Terjual',
      total: 'Total Karya',
      noArtworks: 'Belum Ada Karya',
      noArtworksDesc: 'Status karya akan muncul setelah Anda menambahkan karya seni',
    },
    salesChart: {
      title: 'Ringkasan Penjualan',
      subtitle: '6 bulan terakhir',
      totalSales: 'Total Penjualan',
      artworksSold: 'Karya Terjual',
      vsLastMonth: 'vs bulan lalu',
      noData: 'Belum Ada Data Penjualan',
      noDataDesc: 'Grafik akan muncul setelah ada transaksi penjualan karya seni Anda',
      artworkSoldTooltip: 'karya terjual',
    },
    quickActions: 'Aksi Cepat',
    quickActionsSection: {
      title: 'Aksi Cepat',
      subtitle: 'Akses fitur utama dengan cepat',
      addArtwork: 'Tambah Karya',
      addArtworkDesc: 'Tambah karya seni baru ke inventaris',
      addContact: 'Tambah Kontak',
      addContactDesc: 'Tambah kontak baru ke jejaring',
      viewPipeline: 'Lihat Pipeline',
      viewPipelineDesc: 'Pantau progres karya seni',
      recordSale: 'Catat Penjualan',
      recordSaleDesc: 'Rekam transaksi penjualan baru',
      navigatingTo: 'Menuju',
    },
  },
  
  artworks: {
    title: 'Inventaris Karya Seni',
    subtitle: 'Kelola koleksi karya seni Anda.',
    addArtwork: 'Tambah Karya',
    searchPlaceholder: 'Cari karya seni...',
    noArtworks: 'Belum Ada Karya',
    noArtworksDesc: 'Tambahkan karya seni pertama Anda untuk memulai.',
    status: {
      concept: 'Konsep',
      wip: 'Proses',
      finished: 'Selesai',
      sold: 'Terjual',
    },
    fields: {
      title: 'Judul',
      medium: 'Media',
      dimensions: 'Dimensi',
      year: 'Tahun',
      price: 'Harga',
      status: 'Status',
      description: 'Deskripsi',
      image: 'Gambar',
    },
  },
  
  contacts: {
    title: 'Manajemen Kontak',
    subtitle: 'Kelola jejaring profesional Anda.',
    addContact: 'Tambah Kontak',
    searchPlaceholder: 'Cari kontak...',
    noContacts: 'Belum Ada Kontak',
    noContactsDesc: 'Tambahkan kontak pertama Anda untuk memulai.',
    types: {
      collector: 'Kolektor',
      gallery: 'Galeri',
      curator: 'Kurator',
      artist: 'Seniman',
      other: 'Lainnya',
    },
    fields: {
      name: 'Nama',
      email: 'Email',
      phone: 'Telepon',
      company: 'Perusahaan',
      type: 'Tipe',
      location: 'Lokasi',
      notes: 'Catatan',
    },
  },
  
  pipeline: {
    title: 'Pipeline Karya',
    subtitle: 'Kelola alur kerja karya seni Anda.',
    addItem: 'Tambah Karya',
    columns: {
      concept: 'Konsep',
      wip: 'Proses',
      finished: 'Selesai',
      sold: 'Terjual',
    },
    summary: 'Ringkasan Pipeline',
    totalItems: 'Total Karya',
    totalValue: 'Total Nilai',
    emptyColumn: 'Belum ada karya',
  },
  
  reports: {
    title: 'Laporan',
    subtitle: 'Generate dan unduh laporan bisnis Anda.',
    generateReport: 'Buat Laporan',
    reportTypes: {
      inventory: 'Laporan Inventaris',
      sales: 'Laporan Penjualan',
      contacts: 'Laporan Kontak',
      activity: 'Laporan Aktivitas',
    },
    exportPDF: 'Export PDF',
    exportCSV: 'Export CSV',
    exportExcel: 'Export Excel',
    scheduledReports: 'Laporan Terjadwal',
    recentReports: 'Laporan Terbaru',
  },
  
  settings: {
    title: 'Pengaturan',
    subtitle: 'Kelola preferensi akun dan aplikasi Anda.',
    profile: {
      title: 'Profil',
      editProfile: 'Edit Profil',
      emailVerified: 'Email Terverifikasi',
      freePlan: 'Free Plan',
    },
    appearance: {
      title: 'Tampilan & Bahasa',
      darkMode: 'Tema Gelap',
      darkModeDesc: 'Aktifkan tampilan gelap untuk kenyamanan mata',
      language: 'Bahasa',
    },
    notifications: {
      title: 'Notifikasi',
      emailNotifs: 'Email Notifikasi',
      emailNotifsDesc: 'Terima update mingguan tentang portofolio Anda',
    },
    security: {
      title: 'Keamanan',
      changePassword: 'Ubah Password',
      changePasswordDesc: 'Perbarui kata sandi akun Anda secara berkala',
    },
    help: {
      title: 'Bantuan',
      helpCenter: 'Pusat Bantuan',
      terms: 'Syarat & Ketentuan',
      about: 'Tentang Aplikasi',
    },
    logout: 'Keluar dari Aplikasi',
    logoutDesc: 'Anda akan diarahkan kembali ke halaman login.',
  },
  
  auth: {
    login: {
      title: 'Selamat Datang Kembali',
      subtitle: 'Masuk ke akun ArtConnect Anda',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Ingat Saya',
      forgotPassword: 'Lupa Password?',
      loginButton: 'Masuk',
      noAccount: 'Belum punya akun?',
      registerLink: 'Daftar Sekarang',
      orContinueWith: 'atau lanjutkan dengan',
      googleButton: 'Lanjutkan dengan Google',
    },
    register: {
      title: 'Buat Akun Baru',
      subtitle: 'Bergabung dengan ArtConnect hari ini',
      fullName: 'Nama Lengkap',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Konfirmasi Password',
      registerButton: 'Daftar',
      hasAccount: 'Sudah punya akun?',
      loginLink: 'Masuk',
    },
    forgotPassword: {
      title: 'Lupa Password',
      subtitle: 'Masukkan email Anda untuk reset password',
      email: 'Email',
      sendButton: 'Kirim Link Reset',
      backToLogin: 'Kembali ke Login',
    },
    resetPassword: {
      title: 'Reset Password',
      subtitle: 'Masukkan password baru Anda',
      newPassword: 'Password Baru',
      confirmPassword: 'Konfirmasi Password',
      resetButton: 'Reset Password',
    },
  },
  
  dialogs: {
    changePassword: {
      title: 'Ubah Password',
      subtitle: 'Masukkan password baru Anda. Password minimal 6 karakter.',
      newPassword: 'Password Baru',
      confirmPassword: 'Konfirmasi Password',
      saveButton: 'Simpan Password',
      saving: 'Menyimpan...',
    },
    selectLanguage: {
      title: 'Pilih Bahasa',
      subtitle: 'Pilih bahasa tampilan aplikasi',
    },
  },
  
  messages: {
    success: {
      saved: 'Berhasil disimpan',
      deleted: 'Berhasil dihapus',
      updated: 'Berhasil diperbarui',
      loggedOut: 'Berhasil keluar',
      passwordChanged: 'Password berhasil diubah!',
      languageChanged: 'Bahasa berhasil diubah',
      emailNotifOn: 'Email notifikasi diaktifkan',
      emailNotifOff: 'Email notifikasi dimatikan',
    },
    error: {
      generic: 'Terjadi kesalahan',
      saveFailed: 'Gagal menyimpan',
      deleteFailed: 'Gagal menghapus',
      loginFailed: 'Gagal masuk',
      logoutFailed: 'Gagal keluar. Silakan coba lagi.',
      passwordChangeFailed: 'Gagal mengubah password',
      settingsUpdateFailed: 'Gagal memperbarui pengaturan',
    },
  },
};

// English translations
export const en: Translations = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    loading: 'Loading...',
    noData: 'No data',
    viewAll: 'View All',
    close: 'Close',
    confirm: 'Confirm',
    back: 'Back',
    next: 'Next',
    submit: 'Submit',
    refresh: 'Refresh',
  },
  
  nav: {
    dashboard: 'Dashboard',
    artworks: 'Artworks',
    contacts: 'Contacts',
    pipeline: 'Pipeline',
    analytics: 'Analytics',
    reports: 'Reports',
    settings: 'Settings',
    logout: 'Logout',
  },
  
  dashboard: {
    title: 'Dashboard',
    greeting: {
      morning: 'Good Morning',
      afternoon: 'Good Afternoon',
      evening: 'Good Evening',
      night: 'Good Night',
    },
    subtitle: 'Track your artwork progress and manage your business with ease.',
    stats: {
      totalArtworks: 'Total Artworks',
      totalContacts: 'Total Contacts',
      totalSales: 'Total Sales',
      activePipeline: 'Active Pipeline',
    },
    hero: {
      artworks: 'artworks',
      sales: 'sales',
      addArtwork: 'Add New Artwork',
      addArtworkShort: 'Add Artwork',
      viewPipeline: 'View Pipeline',
    },
    recentArtworks: {
      title: 'Recent Artworks',
      count: 'artworks displayed',
      viewAll: 'View All',
      noArtworks: 'No Artworks Yet',
      noArtworksDesc: 'Add your first artwork to get started',
      priceShown: 'Price shown',
      priceHidden: 'Price hidden',
    },
    recentContacts: {
      title: 'Recent Contacts',
      count: 'contacts displayed',
      viewAll: 'View All',
      noContacts: 'No Contacts Yet',
      noContactsDesc: 'Add your first contact to build your network',
      emailShown: 'Email shown',
      emailHidden: 'Email hidden',
    },
    activityFeed: 'Recent Activity',
    activitySection: {
      title: 'Recent Activity',
      subtitle: 'Latest updates',
      hide: 'Hide',
      showAll: 'All',
      noActivity: 'No Activity Yet',
      noActivityDesc: 'Activity will appear as you start using the app',
      clickToShow: 'Click to show more activities',
    },
    artworkStatus: {
      title: 'Artwork Status',
      subtitle: 'Summary of all artwork statuses',
      concept: 'Concept',
      wip: 'In Progress',
      finished: 'Finished',
      sold: 'Sold',
      total: 'Total Artworks',
      noArtworks: 'No Artworks Yet',
      noArtworksDesc: 'Status will appear after you add artwork',
    },
    salesChart: {
      title: 'Sales Summary',
      subtitle: 'Last 6 months',
      totalSales: 'Total Sales',
      artworksSold: 'Artworks Sold',
      vsLastMonth: 'vs last month',
      noData: 'No Sales Data Yet',
      noDataDesc: 'Chart will appear after you make a sale',
      artworkSoldTooltip: 'artworks sold',
    },
    quickActions: 'Quick Actions',
    quickActionsSection: {
      title: 'Quick Actions',
      subtitle: 'Access main features quickly',
      addArtwork: 'Add Artwork',
      addArtworkDesc: 'Add new artwork to inventory',
      addContact: 'Add Contact',
      addContactDesc: 'Add new contact to network',
      viewPipeline: 'View Pipeline',
      viewPipelineDesc: 'Track artwork progress',
      recordSale: 'Record Sale',
      recordSaleDesc: 'Record a new transaction',
      navigatingTo: 'Going to',
    },
  },
  
  artworks: {
    title: 'Artwork Inventory',
    subtitle: 'Manage your art collection.',
    addArtwork: 'Add Artwork',
    searchPlaceholder: 'Search artworks...',
    noArtworks: 'No Artworks Yet',
    noArtworksDesc: 'Add your first artwork to get started.',
    status: {
      concept: 'Concept',
      wip: 'In Progress',
      finished: 'Finished',
      sold: 'Sold',
    },
    fields: {
      title: 'Title',
      medium: 'Medium',
      dimensions: 'Dimensions',
      year: 'Year',
      price: 'Price',
      status: 'Status',
      description: 'Description',
      image: 'Image',
    },
  },
  
  contacts: {
    title: 'Contact Management',
    subtitle: 'Manage your professional network.',
    addContact: 'Add Contact',
    searchPlaceholder: 'Search contacts...',
    noContacts: 'No Contacts Yet',
    noContactsDesc: 'Add your first contact to get started.',
    types: {
      collector: 'Collector',
      gallery: 'Gallery',
      curator: 'Curator',
      artist: 'Artist',
      other: 'Other',
    },
    fields: {
      name: 'Name',
      email: 'Email',
      phone: 'Phone',
      company: 'Company',
      type: 'Type',
      location: 'Location',
      notes: 'Notes',
    },
  },
  
  pipeline: {
    title: 'Artwork Pipeline',
    subtitle: 'Manage your artwork workflow.',
    addItem: 'Add Artwork',
    columns: {
      concept: 'Concept',
      wip: 'In Progress',
      finished: 'Finished',
      sold: 'Sold',
    },
    summary: 'Pipeline Summary',
    totalItems: 'Total Artworks',
    totalValue: 'Total Value',
    emptyColumn: 'No artworks yet',
  },
  
  reports: {
    title: 'Reports',
    subtitle: 'Generate and download your business reports.',
    generateReport: 'Generate Report',
    reportTypes: {
      inventory: 'Inventory Report',
      sales: 'Sales Report',
      contacts: 'Contacts Report',
      activity: 'Activity Report',
    },
    exportPDF: 'Export PDF',
    exportCSV: 'Export CSV',
    exportExcel: 'Export Excel',
    scheduledReports: 'Scheduled Reports',
    recentReports: 'Recent Reports',
  },
  
  settings: {
    title: 'Settings',
    subtitle: 'Manage your account and app preferences.',
    profile: {
      title: 'Profile',
      editProfile: 'Edit Profile',
      emailVerified: 'Email Verified',
      freePlan: 'Free Plan',
    },
    appearance: {
      title: 'Appearance & Language',
      darkMode: 'Dark Mode',
      darkModeDesc: 'Enable dark mode for eye comfort',
      language: 'Language',
    },
    notifications: {
      title: 'Notifications',
      emailNotifs: 'Email Notifications',
      emailNotifsDesc: 'Receive weekly updates about your portfolio',
    },
    security: {
      title: 'Security',
      changePassword: 'Change Password',
      changePasswordDesc: 'Update your password regularly',
    },
    help: {
      title: 'Help',
      helpCenter: 'Help Center',
      terms: 'Terms & Conditions',
      about: 'About App',
    },
    logout: 'Logout from App',
    logoutDesc: 'You will be redirected to the login page.',
  },
  
  auth: {
    login: {
      title: 'Welcome Back',
      subtitle: 'Sign in to your ArtConnect account',
      email: 'Email',
      password: 'Password',
      rememberMe: 'Remember Me',
      forgotPassword: 'Forgot Password?',
      loginButton: 'Sign In',
      noAccount: "Don't have an account?",
      registerLink: 'Register Now',
      orContinueWith: 'or continue with',
      googleButton: 'Continue with Google',
    },
    register: {
      title: 'Create Account',
      subtitle: 'Join ArtConnect today',
      fullName: 'Full Name',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      registerButton: 'Register',
      hasAccount: 'Already have an account?',
      loginLink: 'Sign In',
    },
    forgotPassword: {
      title: 'Forgot Password',
      subtitle: 'Enter your email to reset password',
      email: 'Email',
      sendButton: 'Send Reset Link',
      backToLogin: 'Back to Login',
    },
    resetPassword: {
      title: 'Reset Password',
      subtitle: 'Enter your new password',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      resetButton: 'Reset Password',
    },
  },
  
  dialogs: {
    changePassword: {
      title: 'Change Password',
      subtitle: 'Enter your new password. Minimum 6 characters.',
      newPassword: 'New Password',
      confirmPassword: 'Confirm Password',
      saveButton: 'Save Password',
      saving: 'Saving...',
    },
    selectLanguage: {
      title: 'Select Language',
      subtitle: 'Choose the app display language',
    },
  },
  
  messages: {
    success: {
      saved: 'Successfully saved',
      deleted: 'Successfully deleted',
      updated: 'Successfully updated',
      loggedOut: 'Successfully logged out',
      passwordChanged: 'Password changed successfully!',
      languageChanged: 'Language changed successfully',
      emailNotifOn: 'Email notifications enabled',
      emailNotifOff: 'Email notifications disabled',
    },
    error: {
      generic: 'An error occurred',
      saveFailed: 'Failed to save',
      deleteFailed: 'Failed to delete',
      loginFailed: 'Failed to login',
      logoutFailed: 'Failed to logout. Please try again.',
      passwordChangeFailed: 'Failed to change password',
      settingsUpdateFailed: 'Failed to update settings',
    },
  },
};

// Get translations by language code
export const getTranslations = (lang: Language): Translations => {
  switch (lang) {
    case 'en':
      return en;
    case 'id':
    default:
      return id;
  }
};

// Available languages
export const availableLanguages = [
  { code: 'id' as Language, name: 'Indonesia', flag: '🇮🇩' },
  { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
];
