import { Activity, Bike, Dumbbell, Flame, Leaf, MapPin, Timer, Users } from "lucide-react";

export const stats = [
  { label: "Active members", value: "4,800+", detail: "across Mercer studios" },
  { label: "Weekly classes", value: "180+", detail: "from recovery to HIIT" },
  { label: "Studio locations", value: "6", detail: "with live capacity" }
];

export const benefits = [
  {
    icon: Timer,
    title: "Book in seconds",
    description: "Reserve classes, join waitlists, and manage changes from a responsive booking flow."
  },
  {
    icon: Activity,
    title: "Wellness-first programming",
    description: "Balanced class formats across strength, mobility, cardio, and recovery."
  },
  {
    icon: Users,
    title: "Community energy",
    description: "Friendly coaches and welcoming class sizes keep every session personal."
  }
];

export const classes = [
  {
    icon: Leaf,
    title: "Morning Flow Yoga",
    type: "Yoga",
    instructor: "Avery Kim",
    time: "Mon 7:00 AM",
    duration: "50 min",
    location: "Mercer SoHo",
    remaining: 8,
    capacity: 24,
    gradient: "from-emerald-500 to-sky-500"
  },
  {
    icon: Flame,
    title: "HIIT Circuit",
    type: "HIIT",
    instructor: "Jordan Lee",
    time: "Tue 6:15 PM",
    duration: "45 min",
    location: "Mercer West",
    remaining: 3,
    capacity: 20,
    gradient: "from-amber-400 to-rose-500"
  },
  {
    icon: Bike,
    title: "Rhythm Ride",
    type: "Cycling",
    instructor: "Mina Patel",
    time: "Wed 12:30 PM",
    duration: "40 min",
    location: "Mercer East",
    remaining: 14,
    capacity: 32,
    gradient: "from-sky-500 to-indigo-500"
  },
  {
    icon: Dumbbell,
    title: "Pilates Strength",
    type: "Pilates",
    instructor: "Noah Brooks",
    time: "Thu 5:30 PM",
    duration: "55 min",
    location: "Mercer North",
    remaining: 0,
    capacity: 18,
    gradient: "from-emerald-600 to-amber-400"
  }
];

export const locations = [
  { name: "Mercer SoHo", address: "132 Mercer St", classes: "42 weekly", icon: MapPin },
  { name: "Mercer West", address: "88 Hudson Ave", classes: "36 weekly", icon: MapPin },
  { name: "Mercer East", address: "24 Orchard Lane", classes: "31 weekly", icon: MapPin }
];

export const testimonials = [
  {
    quote: "Mercer makes it effortless to find the right class after work. The waitlist updates are the best part.",
    name: "Sam Rivera",
    role: "Member since 2024"
  },
  {
    quote: "The studios feel polished without being intimidating. I always know exactly what I am booking.",
    name: "Priya N.",
    role: "Pilates and Flow member"
  },
  {
    quote: "As an instructor, the class roster and capacity tools keep everything calm before doors open.",
    name: "Marcus Chen",
    role: "Strength coach"
  }
];

export const faqs = [
  {
    question: "Can I change a booking?",
    answer: "Yes. Members can cancel or rebook before the studio cancellation window from the schedule or confirmation email."
  },
  {
    question: "How does the waitlist work?",
    answer: "When a seat opens, the next member receives a 30-minute booking window before the spot is offered forward."
  },
  {
    question: "Are classes beginner-friendly?",
    answer: "Every class includes clear difficulty labels and instructor notes, with many formats designed for all levels."
  }
];

export const bookings = [
  { customer: "Maya Johnson", email: "maya@example.com", className: "Morning Flow Yoga", status: "Confirmed" },
  { customer: "Theo Grant", email: "theo@example.com", className: "HIIT Circuit", status: "Waitlist" },
  { customer: "Nina Blake", email: "nina@example.com", className: "Rhythm Ride", status: "Confirmed" },
  { customer: "Owen Park", email: "owen@example.com", className: "Pilates Strength", status: "Cancelled" }
];
