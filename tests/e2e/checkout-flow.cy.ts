describe('متجر موسى - الرحلة الأساسية', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('يعرض الصفحة الرئيسية بالعناصر الرئيسية', () => {
    cy.contains('موسى').should('exist');
    cy.contains('تسوق حسب الفئة').should('exist');
    cy.get('header').should('exist');
    cy.get('footer').should('exist');
  });

  it('يتنقل إلى صفحة المنتجات', () => {
    cy.contains('المنتجات').first().click();
    cy.url().should('include', '/products');
    cy.contains('جميع المنتجات').should('exist');
  });

  it('يفتح صفحة فئة من الصفحة الرئيسية', () => {
    cy.contains('تسوق حسب الفئة').scrollIntoView();
    cy.contains('الجلابة').first().click();
    cy.url().should('include', '/categories/jellaba');
  });

  it('يفتح تفاصيل منتج', () => {
    cy.visit('/products/1');
    cy.contains('الجلابة الفاسية').should('exist');
    cy.contains('أضف للسلة').should('exist');
    cy.contains('اختر المقاس').should('exist');
  });

  it('يضيف منتجاً إلى السلة من صفحة المنتج', () => {
    cy.visit('/products/1');
    cy.contains('M').click();
    cy.contains('أضف للسلة').click();
    cy.visit('/cart');
    cy.contains('ملخص الطلب').should('exist');
    cy.contains('إتمام الطلب').should('exist');
  });

  it('يعمل نموذج الاتصال', () => {
    cy.visit('/contact');
    cy.contains('أرسل رسالة').should('exist');
    cy.contains('الهاتف / واتساب').should('exist');
  });
});
