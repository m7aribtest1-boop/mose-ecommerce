

"use client";


import { useState } from "react";
import {
  ChevronDown,
  Ruler,
  Sparkles,
  Truck,
} from "lucide-react";


interface ProductAccordionProps {
  product: {
    name: string;
    description?: string | null;
    material?: string | null;
    sizes?: string[] | string | null;
  };
}


interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon: React.ElementType;
}


function normalizeSizes(
  sizes: ProductAccordionProps["product"]["sizes"],
): string[] {
  if (Array.isArray(sizes)) {
    return sizes.filter(Boolean);
  }


  if (typeof sizes === "string") {
    return sizes
      .split(",")
      .map((size) => size.trim())
      .filter(Boolean);
  }


  return [];
}


export default function ProductAccordion({
  product,
}: ProductAccordionProps) {
  const [openId, setOpenId] = useState<string>("description");


  const sizes = normalizeSizes(product.sizes);


  const items: AccordionItem[] = [
    {
      id: "description",
      title: "الوصف",
      icon: Sparkles,
      content: (
        <p className="leading-8 text-primary-900/75">
          {product.description ||
            `اكتشفي تفاصيل ${product.name} بتصميم مستوحى من الأناقة المغربية الأصيلة، مع لمسات راقية تناسب إطلالاتك ومناسباتك الخاصة.`}
        </p>
      ),
    },
    {
      id: "sizes",
      title: "المقاسات والقياسات",
      icon: Ruler,
      content: (
        <div className="space-y-4 leading-8 text-primary-900/75">
          <p>
            نحرص على اختيار المقاس المناسب لك. يرجى مراجعة المقاسات المتاحة
            قبل إتمام الطلب.
          </p>


          {sizes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {sizes.map((size) => (
                <span
                  key={size}
                  className="rounded-full border border-accent-300 bg-accent-50 px-4 py-1.5 text-sm font-medium text-primary-800"
                >
                  {size}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-primary-900/60">
              تتوفر تفاصيل المقاسات عند اختيار المنتج. يمكنك التواصل معنا عبر
              واتساب للمساعدة في اختيار المقاس المناسب.
            </p>
          )}
        </div>
      ),
    },
    {
      id: "material",
      title: "الخامة والعناية",
      icon: Sparkles,
      content: (
        <div className="space-y-3 leading-8 text-primary-900/75">
          <p>
            <span className="font-semibold text-primary-900">الخامة:</span>{" "}
            {product.material || "خامة مختارة بعناية لتجمع بين الأناقة والراحة."}
          </p>
          <p>
            للحفاظ على جمال القطعة، يُنصح باتباع تعليمات العناية المناسبة
            للخامة وتجنب التعرض المباشر للحرارة العالية.
          </p>
        </div>
      ),
    },
    {
      id: "delivery",
      title: "التوصيل والإرجاع",
      icon: Truck,
      content: (
        <div className="space-y-3 leading-8 text-primary-900/75">
          <p>
            نوفر التوصيل إلى مختلف المدن المغربية، مع إمكانية الدفع عند
            الاستلام حسب شروط الطلب.
          </p>
          <p>
            للإرجاع أو الاستبدال، يرجى التواصل مع خدمة العملاء لمعرفة الشروط
            والإجراءات الخاصة بالطلب.
          </p>
        </div>
      ),
    },
  ];


  return (
    <section
      aria-label={`معلومات ${product.name}`}
      className="mt-10 overflow-hidden rounded-2xl border border-accent-200 bg-ivory shadow-[0_12px_40px_rgba(2,44,34,0.06)]"
      dir="rtl"
    >
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const Icon = item.icon;


        return (
          <div
            key={item.id}
            className={index !== 0 ? "border-t border-accent-200/80" : ""}
          >
            <button
              type="button"
              id={`${item.id}-trigger`}
              aria-expanded={isOpen}
              aria-controls={`${item.id}-panel`}
              onClick={() =>
                setOpenId((current) =>
                  current === item.id ? "" : item.id,
                )
              }
              className="group flex w-full items-center gap-4 px-5 py-5 text-right transition-colors duration-200 hover:bg-accent-50/40 sm:px-6"
            >
              <span
                aria-hidden="true"
                className={[
                  "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
                  isOpen
                    ? "border-accent-500 bg-primary-900 text-accent-300"
                    : "border-accent-200 bg-primary-900/5 text-primary-700 group-hover:border-accent-400",
                ].join(" ")}
              >
                <Icon className="h-5 w-5" strokeWidth={1.6} />


                {isOpen && (
                  <span className="absolute -right-1 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-accent-400" />
                )}
              </span>


              <span
                className={[
                  "flex-1 font-arabic text-lg font-semibold transition-colors",
                  isOpen
                    ? "text-primary-800"
                    : "text-primary-900 group-hover:text-primary-700",
                ].join(" ")}
              >
                {item.title}
              </span>


              <ChevronDown
                aria-hidden="true"
                className={[
                  "h-5 w-5 shrink-0 text-accent-600 transition-transform duration-300",
                  isOpen ? "rotate-180" : "",
                ].join(" ")}
                strokeWidth={1.6}
              />
            </button>


            <div
              id={`${item.id}-panel`}
              role="region"
              aria-labelledby={`${item.id}-trigger`}
              hidden={!isOpen}
            >
              {isOpen && (
                <div className="border-t border-accent-100 bg-white/30 px-5 pb-6 pt-5 sm:px-6 sm:pr-20">
                  {item.content}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}
