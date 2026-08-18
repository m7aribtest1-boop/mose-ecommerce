// السياسات التجارية الموصى بها من بحث الدماغ الجماعي (13/08/2026)
export const storeConfig = {
  name: 'متجر موسى',
  currency: 'MAD',
  shipping: {
    standardFee: 29, // درهم — داخل المغرب
    freeShippingThreshold: 500, // شحن مجاني من هذا المبلغ
  },
  returns: {
    windowDays: 7, // قانون 31-08
    refundShipping: false,
    conditions: ['غير ملبوس', 'غير مغسول', 'بالحالة الأصلية', 'الإكرليكات محفوظة'],
  },
  whatsapp: {
    number: '212600000000', // ← رقم واتساب التجاري
    message: 'سلام، عندي سؤال حول طلب في متجر موسى',
  },
  couponWelcome: 'MARHABA10',
  prepaid: {
    enabled: true,
    discountPercent: 5,
    methods: ['بطاقة بنكية', 'ويبلي', 'تحويل بنكي'],
    note: 'خصم 5% عند الدفع المسبق (بطاقة / ويبلي / تحويل)',
  },
  delivery: {
    casablanca: '24-48 ساعة',
    majorCities: '48-72 ساعة',
  },
  trust: {
    rc: 'RC المتجر المسجّل',
    ompic: 'علامة موسى المسجّلة',
    cgi: 'عضو CGEM',
  },
};