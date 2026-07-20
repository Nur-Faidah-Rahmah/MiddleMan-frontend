import { Category } from '../types';

export interface Review {
  id: string;
  reviewer: string;
  avatarUrl: string;
  rating: number;
  comment: string;
  date: string;
}

export interface WorkerProfileDetails {
  id: string;
  username: string;
  fullName: string;
  avatarUrl: string;
  level: number;
  rating: number;
  completedJobsCount: number;
  category: Category;
  title: string;
  description: string; // bio
  price: number;
  priceUnit: string;
  skills: string[];
  isOnline: boolean;
  reviews: Review[];
}

// Map short names to full details from WORKER_SERVICES or mockData
const KNOWN_PROFILES: Record<string, Partial<WorkerProfileDetails>> = {
  'reza k.': {
    fullName: 'Reza Kurniawan',
    category: 'Design',
    title: 'Senior UI/UX & Brand Designer',
    description: 'Menawarkan jasa desain visual, UI/UX landing page, mobile app, dan pembuatan logo brand premium dengan revisi tanpa batas. Berpengalaman lebih dari 5 tahun bekerja dengan startup teknologi dan korporasi lokal untuk mendesain produk digital yang intuitif dan menarik.',
    price: 150000,
    priceUnit: 'proyek',
    skills: ['Figma', 'UI/UX', 'Branding', 'Adobe Illustrator', 'Wireframing', 'Prototyping'],
    completedJobsCount: 48,
    level: 12,
    rating: 4.9,
    reviews: [
      { id: 'rev-1', reviewer: 'Adit F.', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', rating: 5, comment: 'Hasil kerjanya sangat premium! Desain UI landing page kami sangat rapi dan pengerjaannya cepat.', date: '1 minggu lalu' },
      { id: 'rev-2', reviewer: 'Sari W.', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', rating: 4.8, comment: 'Desain logo dan brand guideline dibuat dengan sangat matang. Komunikasi responsif.', date: '3 minggu lalu' }
    ]
  },
  'reza kurniawan': {
    fullName: 'Reza Kurniawan',
    category: 'Design',
    title: 'Senior UI/UX & Brand Designer',
    description: 'Menawarkan jasa desain visual, UI/UX landing page, mobile app, dan pembuatan logo brand premium dengan revisi tanpa batas. Berpengalaman lebih dari 5 tahun bekerja dengan startup teknologi dan korporasi lokal untuk mendesain produk digital yang intuitif dan menarik.',
    price: 150000,
    priceUnit: 'proyek',
    skills: ['Figma', 'UI/UX', 'Branding', 'Adobe Illustrator', 'Wireframing', 'Prototyping'],
    completedJobsCount: 48,
    level: 12,
    rating: 4.9,
    reviews: [
      { id: 'rev-1', reviewer: 'Adit F.', avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', rating: 5, comment: 'Hasil kerjanya sangat premium! Desain UI landing page kami sangat rapi dan pengerjaannya cepat.', date: '1 minggu lalu' },
      { id: 'rev-2', reviewer: 'Sari W.', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', rating: 4.8, comment: 'Desain logo dan brand guideline dibuat dengan sangat matang. Komunikasi responsif.', date: '3 minggu lalu' }
    ]
  },
  'lita m.': {
    fullName: 'Lita Melia',
    category: 'Writing',
    title: 'SEO Copywriter & Content Writer',
    description: 'Jasa menulis artikel SEO blog, copywriting media sosial, naskah iklan persuasif, dan penulisan konten web berkualitas tinggi. Saya membantu meningkatkan visibilitas brand Anda di mesin pencari melalui konten yang relevan, informatif, dan teroptimasi.',
    price: 50000,
    priceUnit: 'halaman',
    skills: ['SEO', 'Copywriting', 'Blog', 'Content Strategy', 'Editing', 'Creative Writing'],
    completedJobsCount: 34,
    level: 10,
    rating: 4.8,
    reviews: [
      { id: 'rev-3', reviewer: 'Citra L.', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80', rating: 5, comment: 'Artikel ditulis dengan sangat mengalir, keyword SEO terintegrasi secara natural. Highly recommended!', date: '2 hari lalu' },
      { id: 'rev-4', reviewer: 'Reza K.', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', rating: 4.6, comment: 'Membantu membuat caption Instagram ads yang interaktif dan menghasilkan CTR tinggi.', date: '2 minggu lalu' }
    ]
  },
  'lita melia': {
    fullName: 'Lita Melia',
    category: 'Writing',
    title: 'SEO Copywriter & Content Writer',
    description: 'Jasa menulis artikel SEO blog, copywriting media sosial, naskah iklan persuasif, dan penulisan konten web berkualitas tinggi. Saya membantu meningkatkan visibilitas brand Anda di mesin pencari melalui konten yang relevan, informatif, dan teroptimasi.',
    price: 50000,
    priceUnit: 'halaman',
    skills: ['SEO', 'Copywriting', 'Blog', 'Content Strategy', 'Editing', 'Creative Writing'],
    completedJobsCount: 34,
    level: 10,
    rating: 4.8,
    reviews: [
      { id: 'rev-3', reviewer: 'Citra L.', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80', rating: 5, comment: 'Artikel ditulis dengan sangat mengalir, keyword SEO terintegrasi secara natural. Highly recommended!', date: '2 hari lalu' },
      { id: 'rev-4', reviewer: 'Reza K.', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', rating: 4.6, comment: 'Membantu membuat caption Instagram ads yang interaktif dan menghasilkan CTR tinggi.', date: '2 minggu lalu' }
    ]
  },
  'deni p.': {
    fullName: 'Deni Pratama',
    category: 'Dev',
    title: 'Frontend React Developer Specialist',
    description: 'Membangun aplikasi web frontend modular yang interaktif menggunakan React, Next.js, TypeScript, dan Tailwind CSS. Berfokus pada kebersihan kode, performa loading secepat kilat, dan integrasi API backend yang aman.',
    price: 450000,
    priceUnit: 'proyek',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Redux', 'API Integration'],
    completedJobsCount: 61,
    level: 15,
    rating: 4.9,
    reviews: [
      { id: 'rev-5', reviewer: 'Surya A.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', rating: 5, comment: 'Sangat menguasai React! Komponen yang dibuat modular, bersih, dan gampang di-maintenance.', date: '5 hari lalu' }
    ]
  },
  'deni pratama': {
    fullName: 'Deni Pratama',
    category: 'Dev',
    title: 'Frontend React Developer Specialist',
    description: 'Membangun aplikasi web frontend modular yang interaktif menggunakan React, Next.js, TypeScript, dan Tailwind CSS. Berfokus pada kebersihan kode, performa loading secepat kilat, dan integrasi API backend yang aman.',
    price: 450000,
    priceUnit: 'proyek',
    skills: ['React', 'TypeScript', 'Tailwind', 'Next.js', 'Redux', 'API Integration'],
    completedJobsCount: 61,
    level: 15,
    rating: 4.9,
    reviews: [
      { id: 'rev-5', reviewer: 'Surya A.', avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', rating: 5, comment: 'Sangat menguasai React! Komponen yang dibuat modular, bersih, dan gampang di-maintenance.', date: '5 hari lalu' }
    ]
  },
  'nina r.': {
    fullName: 'Nina Rahmawati',
    category: 'Fotografi',
    title: 'Professional Product & Event Photographer',
    description: 'Foto produk katalog, e-commerce, makanan, fashion, serta foto dokumentasi event dengan editing color grading sinematik. Memiliki studio sendiri lengkap dengan lighting setup profesional.',
    price: 250000,
    priceUnit: 'sesi',
    skills: ['Lightroom', 'Studio', 'Katalog', 'Product Photo', 'Adobe Photoshop', 'Color Grading'],
    completedJobsCount: 29,
    level: 8,
    rating: 4.8,
    reviews: [
      { id: 'rev-6', reviewer: 'Fajar T.', avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80', rating: 4.8, comment: 'Foto katalog hijab kami hasilnya sangat jernih dan aesthetic. Editing cahayanya mantap.', date: '2 minggu lalu' }
    ]
  },
  'nina rahmawati': {
    fullName: 'Nina Rahmawati',
    category: 'Fotografi',
    title: 'Professional Product & Event Photographer',
    description: 'Foto produk katalog, e-commerce, makanan, fashion, serta foto dokumentasi event dengan editing color grading sinematik. Memiliki studio sendiri lengkap dengan lighting setup profesional.',
    price: 250000,
    priceUnit: 'sesi',
    skills: ['Lightroom', 'Studio', 'Katalog', 'Product Photo', 'Adobe Photoshop', 'Color Grading'],
    completedJobsCount: 29,
    level: 8,
    rating: 4.8,
    reviews: [
      { id: 'rev-6', reviewer: 'Fajar T.', avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&w=150&q=80', rating: 4.8, comment: 'Foto katalog hijab kami hasilnya sangat jernih dan aesthetic. Editing cahayanya mantap.', date: '2 minggu lalu' }
    ]
  },
  'budi s.': {
    fullName: 'Budi Santoso',
    category: 'Kurir',
    title: 'Kurir Motor Kilat Regional Bandung',
    description: 'Layanan antar jemput barang belanjaan, dokumen rahasia, paket e-commerce, atau makanan di area metropolitan Bandung cepat & aman. Diutamakan rute cepat dan pelaporan real-time posisi kurir.',
    price: 30000,
    priceUnit: 'trip',
    skills: ['Motor', 'Sameday', 'Bandung Kota', 'Cepat', 'Navigasi', 'Kargo Kecil'],
    completedJobsCount: 18,
    level: 7,
    rating: 4.7,
    reviews: [
      { id: 'rev-7', reviewer: 'Sari W.', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', rating: 4.7, comment: 'Sangat cepat! Paket rahasia dikirimkan dalam kurun waktu kurang dari 1 jam di dalam kota.', date: '4 hari lalu' }
    ]
  },
  'budi santoso': {
    fullName: 'Budi Santoso',
    category: 'Kurir',
    title: 'Kurir Motor Kilat Regional Bandung',
    description: 'Layanan antar jemput barang belanjaan, dokumen rahasia, paket e-commerce, atau makanan di area metropolitan Bandung cepat & aman. Diutamakan rute cepat dan pelaporan real-time posisi kurir.',
    price: 30000,
    priceUnit: 'trip',
    skills: ['Motor', 'Sameday', 'Bandung Kota', 'Cepat', 'Navigasi', 'Kargo Kecil'],
    completedJobsCount: 18,
    level: 7,
    rating: 4.7,
    reviews: [
      { id: 'rev-7', reviewer: 'Sari W.', avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80', rating: 4.7, comment: 'Sangat cepat! Paket rahasia dikirimkan dalam kurun waktu kurang dari 1 jam di dalam kota.', date: '4 hari lalu' }
    ]
  },
  'riana s.': {
    fullName: 'Riana Safitri',
    category: 'Social Media',
    title: 'Social Media Admin & Content Creator',
    description: 'Membantu pengelolaan akun Instagram/TikTok bisnis, mulai dari desain feed, balas DM, upload reels harian, hingga riset hashtag potensial untuk menaikkan engagement organik.',
    price: 120000,
    priceUnit: 'video',
    skills: ['Instagram', 'CapCut', 'TikTok Ads', 'Canva', 'Copywriting', 'Admin'],
    completedJobsCount: 22,
    level: 9,
    rating: 4.6,
    reviews: [
      { id: 'rev-8', reviewer: 'Wati B.', avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80', rating: 4.5, comment: 'Responsif membalas pesan pelanggan di IG. Hasil video capcut kreatif.', date: '1 bulan lalu' }
    ]
  },
  'riana safitri': {
    fullName: 'Riana Safitri',
    category: 'Social Media',
    title: 'Social Media Admin & Content Creator',
    description: 'Membantu pengelolaan akun Instagram/TikTok bisnis, mulai dari desain feed, balas DM, upload reels harian, hingga riset hashtag potensial untuk menaikkan engagement organik.',
    price: 120000,
    priceUnit: 'video',
    skills: ['Instagram', 'CapCut', 'TikTok Ads', 'Canva', 'Copywriting', 'Admin'],
    completedJobsCount: 22,
    level: 9,
    rating: 4.6,
    reviews: [
      { id: 'rev-8', reviewer: 'Wati B.', avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80', rating: 4.5, comment: 'Responsif membalas pesan pelanggan di IG. Hasil video capcut kreatif.', date: '1 bulan lalu' }
    ]
  },
  'sari w.': {
    fullName: 'Sari Wijayanti',
    category: 'Writing',
    title: 'Remote Administrative & Operations Assistant',
    description: 'Membantu pengusaha lokal maupun digital dalam merapikan laporan operasional, administrasi data entri, penjadwalan meeting, serta layanan customer support online profesional.',
    price: 45000,
    priceUnit: 'jam',
    skills: ['Excel', 'Data Entry', 'Scheduling', 'Customer Support', 'Google Docs', 'Organizer'],
    completedJobsCount: 15,
    level: 6,
    rating: 4.7,
    reviews: [
      { id: 'rev-9', reviewer: 'Budi S.', avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', rating: 4.8, comment: 'Input data inventaris toko sangat rapi, dikerjakan sebelum batas waktu.', date: '2 minggu lalu' }
    ]
  },
  'adit f.': {
    fullName: 'Adit Fitriadi',
    category: 'Design',
    title: 'Branding Specialist & Vector Artist',
    description: 'Membantu merancang identitas visual merek secara utuh, mulai dari logo modern, tipografi khusus, aset ilustrasi vektor, hingga materi promosi visual cetak maupun digital.',
    price: 200000,
    priceUnit: 'proyek',
    skills: ['Branding', 'Vector Illustration', 'Logo Design', 'Adobe Photoshop', 'Aesthetics'],
    completedJobsCount: 42,
    level: 11,
    rating: 5.0,
    reviews: [
      { id: 'rev-10', reviewer: 'Reza K.', avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80', rating: 5, comment: 'Salah satu desainer paling kreatif dan perfeksionis yang pernah saya temui.', date: '3 minggu lalu' }
    ]
  },
  'hendra s.': {
    fullName: 'Hendra Saputra',
    category: 'Belanja',
    title: 'Personal Shopper & Local Runner',
    description: 'Butuh bantuan belanja di supermarket, pasar lokal, atau butuh seseorang untuk mengurus pengiriman fisik barang Anda? Saya siap melayani dengan cepat, teliti, disertai nota pembelian asli.',
    price: 35000,
    priceUnit: 'trip',
    skills: ['Belanja', 'Lokal', 'Pengecekan Harga', 'Bandung Timur', 'Keamanan Bahan'],
    completedJobsCount: 20,
    level: 8,
    rating: 4.6,
    reviews: [
      { id: 'rev-11', reviewer: 'Wati B.', avatarUrl: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?auto=format&fit=crop&w=150&q=80', rating: 4.5, comment: 'Sangat jujur, semua uang kembalian dan struk pasar tradisional diserahkan dengan detail.', date: '5 hari lalu' }
    ]
  },
  'wati b.': {
    fullName: 'Wati Burhan',
    category: 'Cleaning',
    title: 'Pembersih Rumah & Kamar Apartemen Profesional',
    description: 'Layanan jasa bersih-bersih mendalam (deep cleaning) untuk hunian pribadi, kost, kontrakan, maupun apartemen di area perkotaan. Menggunakan peralatan sanitasi higienis dan pewangi aman.',
    price: 80000,
    priceUnit: 'hari',
    skills: ['Cleaning', 'Deep Clean', 'Apartemen', 'Peralatan Sanitasi', 'Tata Ruang'],
    completedJobsCount: 12,
    level: 6,
    rating: 4.7,
    reviews: [
      { id: 'rev-12', reviewer: 'Hendra S.', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', rating: 4.8, comment: 'Apartemen saya berkilau kembali setelah diserahkan ke Ibu Wati. Sangat direkomendasikan!', date: '1 minggu lalu' }
    ]
  }
};

const CATEGORIES: Category[] = [
  'Design', 'Writing', 'Dev', 'Social Media', 
  'Kurir', 'Belanja', 'Cleaning', 'Ojek', 'Fotografi'
];

export function getWorkerProfile(username: string): WorkerProfileDetails {
  const norm = username.toLowerCase().trim();

  // 1. Check dynamic simulated database first
  const usersStr = localStorage.getItem('sq_users_list_simulated');
  if (usersStr) {
    try {
      const usersList = JSON.parse(usersStr);
      const matchedUser = usersList.find(
        (u: any) => u.username.toLowerCase().trim() === norm || u.fullName?.toLowerCase().trim() === norm
      );
      if (matchedUser && matchedUser.hasService) {
        return {
          id: matchedUser.id,
          username: matchedUser.username,
          fullName: matchedUser.fullName || matchedUser.username,
          avatarUrl: matchedUser.avatarUrl,
          level: matchedUser.level || 5,
          rating: matchedUser.rating || 5.0,
          completedJobsCount: matchedUser.completedJobsCount || 0,
          category: matchedUser.serviceCategory || 'Dev',
          title: matchedUser.serviceTitle || 'Freelancer',
          description: matchedUser.serviceDescription || matchedUser.bio || 'Menawarkan jasa profesional berkualitas tinggi.',
          price: matchedUser.servicePrice || 150000,
          priceUnit: matchedUser.servicePriceUnit || 'proyek',
          skills: matchedUser.serviceSkills || [],
          isOnline: true,
          reviews: [
            {
              id: `rev-gen-1`,
              reviewer: 'Andi Pratama',
              avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
              rating: 5,
              comment: 'Sangat responsif dan hasil kerjanya memuaskan sesuai kesepakatan awal.',
              date: '1 minggu lalu'
            }
          ]
        };
      }
    } catch (e) {
      console.error("Failed to lookup dynamic user profile", e);
    }
  }

  const found = KNOWN_PROFILES[norm];

  // Common random generators based on names to provide visual consistency
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  const positiveHash = Math.abs(hash);

  const level = found?.level || (positiveHash % 10) + 5;
  const rating = found?.rating || 4.5 + ((positiveHash % 5) / 10);
  const completedJobsCount = found?.completedJobsCount || (positiveHash % 40) + 8;
  const category = found?.category || CATEGORIES[positiveHash % CATEGORIES.length];
  const price = found?.price || ((positiveHash % 15) + 5) * 10000;
  const priceUnit = found?.priceUnit || 'proyek';
  const skills = found?.skills || [category, 'Lokal', 'Profesional', 'On-Time'];
  const title = found?.title || `Penyedia Jasa Specialist ${category}`;
  const description = found?.description || `Selamat datang di profil saya! Saya adalah penyedia jasa terverifikasi di SideQuest yang berfokus pada bidang ${category}. Berpengalaman menyelesaikan berbagai pekerjaan dengan kepuasan pelanggan di atas rata-rata. Hubungi saya untuk berkonsultasi mengenai kebutuhan proyek Anda.`;
  const isOnline = found?.isOnline !== undefined ? found.isOnline : (positiveHash % 2 === 0);
  const fullName = found?.fullName || username;

  const defaultReviews: Review[] = [
    {
      id: `rev-gen-1`,
      reviewer: 'Andi Pratama',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
      rating: 5,
      comment: 'Sangat responsif dan hasil kerjanya memuaskan sesuai kesepakatan awal.',
      date: '1 minggu lalu'
    },
    {
      id: `rev-gen-2`,
      reviewer: 'Sinta Dewi',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
      rating: 4.5,
      comment: 'Kerja bagus, ramah, dan bersedia melakukan revisi minor tanpa tambahan biaya.',
      date: '2 minggu lalu'
    }
  ];

  return {
    id: `w-${positiveHash}`,
    username,
    fullName,
    avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(username)}`,
    level,
    rating,
    completedJobsCount,
    category,
    title,
    description,
    price,
    priceUnit,
    skills,
    isOnline,
    reviews: found?.reviews || defaultReviews
  };
}
