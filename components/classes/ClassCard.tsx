"use client";

import { Calendar, Clock, MapPin, User } from "lucide-react";
import { motion } from "framer-motion";
import type { classes } from "@/lib/data";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CapacityBadge } from "@/components/ui/CapacityBadge";

type ClassItem = (typeof classes)[number];

export function ClassCard({ item }: { item: ClassItem }) {
  const Icon = item.icon;

  return (
    <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.25 }}>
      <Card className="h-full overflow-hidden">
        <div className={`relative h-40 bg-gradient-to-br ${item.gradient}`}>
          <div className="absolute inset-0 bg-white/10" />
          <div className="absolute left-5 top-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 text-slate-900 shadow-sm">
            <Icon className="h-6 w-6" />
          </div>
          <div className="absolute bottom-5 left-5">
            <Badge variant="slate">{item.type}</Badge>
          </div>
        </div>
        <div className="space-y-5 p-5">
          <div>
            <h3 className="font-heading text-xl font-semibold text-slate-950">{item.title}</h3>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              <span className="flex items-center gap-2"><User className="h-4 w-4 text-emerald-600" /> {item.instructor}</span>
              <span className="flex items-center gap-2"><Calendar className="h-4 w-4 text-emerald-600" /> {item.time}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-emerald-600" /> {item.duration}</span>
              <span className="flex items-center gap-2"><MapPin className="h-4 w-4 text-emerald-600" /> {item.location}</span>
            </div>
          </div>
          <CapacityBadge remaining={item.remaining} capacity={item.capacity} />
          <Button className="w-full" variant={item.remaining === 0 ? "secondary" : "primary"}>
            {item.remaining === 0 ? "Join Waitlist" : "Book Class"}
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
