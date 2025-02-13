"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { HelpWidget } from "@/components/HelpWidget";

export default function Faq() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-0">

      {/* First Section */}
      <section id="first-section" className="relative flex justify-center items-center w-full py-8">
        <div className="w-full max-w-4xl p-4">
          <div className="bg-white rounded-lg shadow-lg border border-stone-300 p-8 h-[44rem]">
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Ano-ano ang mga kailangan sa pagkuha ng Barangay I.D.?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum quibusdam, nesciunt accusamus corporis vel dignissimos minima, doloremque provident adipisci sint quas voluptates et animi! Ut perferendis ad ratione quidem praesentium.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Ano-ano ang mga requirements para sa Solo Parent I.D.?</AccordionTrigger>
              <AccordionContent>
                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Odit reprehenderit asperiores aperiam animi dolores delectus debitis atque tempore nesciunt tenetur! Tenetur asperiores ipsa aut nulla magnam commodi dolores minima ut.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>Ano ang kailangan sa pagkuha ng Barangay Clearance?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eius ad, nulla nemo beatae nam! Assumenda magnam incidunt quos ea voluptas omnis expedita sed non, culpa natus iusto, minus eveniet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>Kailan ang check-up ng mga buntis sa Health Center?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eius ad, nulla nemo beatae nam! Assumenda magnam incidunt quos ea voluptas omnis expedita sed non, culpa natus iusto, minus eveniet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>Paano gumawa ng account?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eius ad, nulla nemo beatae nam! Assumenda magnam incidunt quos ea voluptas omnis expedita sed non, culpa natus iusto, minus eveniet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>Sino-sino ang kwalipikado sa pagkuha ng Solo Parent I.D.?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eius ad, nulla nemo beatae nam! Assumenda magnam incidunt quos ea voluptas omnis expedita sed non, culpa natus iusto, minus eveniet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-7">
              <AccordionTrigger>Ano ang kailangan sa pagkuha ng Cohabitation Certificate?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eius ad, nulla nemo beatae nam! Assumenda magnam incidunt quos ea voluptas omnis expedita sed non, culpa natus iusto, minus eveniet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-8">
              <AccordionTrigger>Paano mag palipat ng Residency?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eius ad, nulla nemo beatae nam! Assumenda magnam incidunt quos ea voluptas omnis expedita sed non, culpa natus iusto, minus eveniet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-9">
              <AccordionTrigger>May bayad ba ang pagkuha ng mga requirements sa ating barangay?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eius ad, nulla nemo beatae nam! Assumenda magnam incidunt quos ea voluptas omnis expedita sed non, culpa natus iusto, minus eveniet.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-10">
              <AccordionTrigger>Ano-ano ang mga open hours ng barangay?</AccordionTrigger>
              <AccordionContent>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam eius ad, nulla nemo beatae nam! Assumenda magnam incidunt quos ea voluptas omnis expedita sed non, culpa natus iusto, minus eveniet.
              </AccordionContent>
            </AccordionItem>

          </Accordion>

          <HelpWidget />

          </div>
      </div>
    </section>

    </main>
  )
}
