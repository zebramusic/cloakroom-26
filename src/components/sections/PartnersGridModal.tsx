"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PartnerItem {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
  order?: number;
}

interface PartnersGridModalProps {
  partners: PartnerItem[];
  locale: string;
}

export function PartnersGridModal({
  partners,
  locale,
}: PartnersGridModalProps) {
  const [selectedPartner, setSelectedPartner] = useState<PartnerItem | null>(
    null,
  );

  const openPartner = (partner: PartnerItem) => {
    if (!partner.website) return;
    setSelectedPartner(partner);
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
        {partners.length === 0 ? (
          <div className="col-span-full py-12 text-center">
            <p className="text-muted-foreground">
              {locale === "ro"
                ? "Nu există parteneri momentan."
                : "No partners available at the moment."}
            </p>
          </div>
        ) : (
          partners.map((partner) => {
            const hasWebsite = !!partner.website;

            return (
              <Card
                key={partner._id}
                className={`h-full p-6 transition-shadow hover:shadow-lg ${
                  hasWebsite ? "cursor-pointer" : "cursor-default"
                }`}
                onClick={() => openPartner(partner)}
              >
                <div className="flex h-full w-full flex-col text-center">
                  {partner.logo ? (
                    <>
                      <div className="mb-4 flex h-24 items-center justify-center">
                        <div className="relative h-16 w-full max-w-[180px]">
                          <Image
                            src={partner.logo}
                            alt={partner.name}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>
                      <p className="mb-2 text-base font-semibold">
                        {partner.name}
                      </p>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {partner.description ||
                          (locale === "ro"
                            ? "Partener strategic Cloakroom Pro"
                            : "Strategic Cloakroom Pro partner")}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="mb-4 flex h-24 items-center justify-center">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                          <span className="text-2xl font-bold">
                            {partner.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <p className="mb-2 text-base font-semibold">
                        {partner.name}
                      </p>
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {partner.description ||
                          (locale === "ro"
                            ? "Partener strategic Cloakroom Pro"
                            : "Strategic Cloakroom Pro partner")}
                      </p>
                    </>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      <Dialog
        open={!!selectedPartner}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedPartner(null);
          }
        }}
      >
        <DialogContent className="h-[85vh] w-[95vw] max-w-6xl overflow-hidden p-0">
          <DialogHeader className="border-b px-6 py-4">
            <DialogTitle>{selectedPartner?.name}</DialogTitle>
          </DialogHeader>

          {selectedPartner?.website && (
            <iframe
              src={selectedPartner.website}
              title={selectedPartner.name}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
