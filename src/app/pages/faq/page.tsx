"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Faq() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">

      {/* First Section */}
      <section id="first-section" className="relative flex w-full items-center justify-center py-8">
        <div className="w-full max-w-4xl p-4">
          <div className="h-[44rem] rounded-lg border border-stone-300 bg-white p-8 shadow-lg">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>Ano-ano ang mga kailangan sa pagkuha ng Barangay I.D.?</AccordionTrigger>
                <AccordionContent>
                2 Valid ID&apos;s, at iyong mga personal na impormasyon
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>Ano-ano ang mga requirements para sa Solo Parent I.D.?</AccordionTrigger>
                <AccordionContent>
              2 Valid ID&apos;s, at iyong mga personal na impormasyon
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Ano ang kailangan sa pagkuha ng Barangay Clearance?</AccordionTrigger>
                <AccordionContent>
              2 Valid ID&apos;s, at iyong mga personal na impormasyon
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>Paano gumawa ng account?</AccordionTrigger>
                <AccordionContent>
                Magpunta sa register account.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Paano malaman kung ano ang status ng Certificate Request?</AccordionTrigger>
                <AccordionContent>
                Maaring mag provide ng Reference Number ng iyong request para malaman.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger>Ano ang kailangan sa pagkuha ng Cohabitation Certificate?</AccordionTrigger>
                <AccordionContent>
              2 Valid ID&apos;s, at iyong mga personal na impormasyon
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-7">
                <AccordionTrigger>Paano mag palipat ng Residency?</AccordionTrigger>
                <AccordionContent>
                Mag file lamang ng Transfer or Residency Certification.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-8">
                <AccordionTrigger>May bayad ba ang pagkuha ng mga requirements sa ating barangay?</AccordionTrigger>
                <AccordionContent>
                Meron, depende kung anong uri ng Certificate and kailangan.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-9">
                <AccordionTrigger>Ano-ano ang mga open hours ng barangay?</AccordionTrigger>
                <AccordionContent>
                Monday - Friday, 8AM - 5PM
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

    </main>
  );
}
