export interface Badge {
  ar: string;
  fr: string;
  icon: string;
}

export const hero = {
  arTitle: 'فخامة من نسج المغرب',
  arSub: 'تجربة أزياء راقية تحتفي بالتراث المغربي من خلال تصاميم عصرية. أقمشة مختارة بعناية فائقة وخياطة متقنة لقطع تدوم طويلاً.',
  arCta: 'اكتشف المجموعة',
  arCta2: 'تعرّف على قصتنا',
  frTitle: 'Le luxe, tissé au Maroc',
  frSub: 'Une expérience de haute couture qui célèbre l’héritage marocain à travers des créations contemporaines. Des matières choisies avec soin et une confection minutieuse pour des pièces intemporelles.',
  frCta: 'Découvrir la collection',
  frCta2: 'Notre histoire',
} as const;

export const badges: Badge[] = [
  { ar: 'صنعة مغربية أصيلة', fr: 'Artisanat marocain authentique', icon: '✦' },
  { ar: 'أقمشة فاخرة مختارة', fr: 'Tissus luxueux sélectionnés', icon: '❖' },
  { ar: 'خياطة متقنة', fr: 'Confection minutieuse', icon: '✜' },
  { ar: 'توصيل في 24–48 ساعة', fr: 'Livraison en 24–48 h', icon: '⚑' },
];
