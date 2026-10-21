import type en from './en';
const ar: Record<keyof typeof en, string> = {
  home: 'الرئيسية', explore: 'استكشاف', favorites: 'المفضلة', calendar: 'التقويم', settings: 'الإعدادات',
  searchPlaceholder: 'ابحث عن خلفيات', clear: 'مسح', retry: 'إعادة المحاولة', loading: 'جارٍ التحميل…',
  emptyResults: 'لم يتم العثور على خلفيات', emptyFavorites: 'لا توجد مفضلات بعد. اضغط على القلب في أي خلفية.',
  errorGeneric: 'حدث خطأ ما. تحقق من اتصالك بالإنترنت.', offlineCached: 'غير متصل — عرض النتائج المحفوظة',
  cat_all: 'الكل', cat_nature: 'مناظر طبيعية', cat_gradients: 'تدرجات', cat_ocean: 'محيط', cat_animals: 'حيوانات',
  cat_technology: 'تقنية', cat_cars: 'سيارات', cat_space: 'فضاء', cat_architecture: 'عمارة', cat_art: 'فنون', cat_abstract: 'تجريدي',
  download: 'تنزيل', downloading: 'جارٍ التنزيل…', saving: 'جارٍ الحفظ في المعرض…', saved: 'تم الحفظ في معرض الصور',
  downloadFailed: 'فشل التنزيل', permissionDenied: 'تم رفض إذن الصور. فعّله من الإعدادات.', openSettings: 'فتح الإعدادات',
  favorite: 'إضافة إلى المفضلة', unfavorite: 'إزالة من المفضلة', back: 'رجوع',
  creator: 'المصوّر', license: 'الترخيص', source: 'عرض في ويكيميديا كومنز', unknown: 'غير معروف', dimensions: 'الأبعاد',
  language: 'اللغة', arabic: 'العربية', english: 'English', clearCache: 'مسح ذاكرة التخزين المؤقت',
  clearCacheConfirm: 'هل تريد مسح الصور المصغّرة والبيانات المؤقتة؟ لن تُحذف المفضلة والإعدادات والصور المحفوظة.',
  cancel: 'إلغاء', confirm: 'تأكيد', cacheCleared: 'تم مسح الذاكرة المؤقتة', cacheFailed: 'تعذّر مسح الذاكرة المؤقتة',
  restartNote: 'يتغيّر اتجاه الواجهة بعد إعادة تحميل سريعة.',
  dailyWallpaper: 'خلفية اليوم', previousDay: 'اليوم السابق', nextDay: 'اليوم التالي', dailyNote: 'تُختار بشكل ثابت لهذا التاريخ من نتائج كومنز.',
  imageUnavailable: 'الصورة غير متاحة', remove: 'إزالة',
};
export default ar;
