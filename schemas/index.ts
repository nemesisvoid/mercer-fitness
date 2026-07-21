import { z } from 'zod';

// ---------------------------------------------------------------------------
// Enums — mirroring Prisma schema exactly
// ---------------------------------------------------------------------------

/** Prisma ClassType enum */
export const CLASS_TYPES = ['PILATES', 'YOGA', 'HIIT', 'CYCLING'] as const;
export type ClassType = (typeof CLASS_TYPES)[number];

/** Prisma ClassStatus enum */
export const CLASS_STATUSES = ['SCHEDULED', 'COMPLETED', 'CANCELLED'] as const;
export type ClassStatus = (typeof CLASS_STATUSES)[number];

// ---------------------------------------------------------------------------
// UI-only option lists (not stored as enums in DB)
// ---------------------------------------------------------------------------

/** Instructor is a plain String in DB — these are the available options */
export const INSTRUCTORS = ['Noah Brooks', 'Avery Kim', 'Jordan Lee', 'Mina Patel'] as const;

/** Difficulty is not a DB field — UI-only for the booking page display */
export const DIFFICULTIES = ['Beginner', 'All levels', 'Intermediate', 'Advanced'] as const;

// ---------------------------------------------------------------------------
// Class form schema
// Maps to the Prisma `Class` model
// ---------------------------------------------------------------------------

export const classSchema = z
  .object({
    /** Prisma: Class.name */
    name: z.string().min(1, 'Class name is required').max(100, 'Name must be 100 characters or less'),

    /** Prisma: Class.type (ClassType enum) */
    type: z.enum(CLASS_TYPES, { message: 'Class type is required' }),

    /** Prisma: Class.instructor (plain String) */
    instructor: z.string().min(1, 'Instructor is required'),


    image:z.string().optional().nullish(),
    /** Prisma: Class.description (optional String) */
    description: z.string().max(100, 'Description must be 100 characters or less').optional().nullable(),

    /** Prisma: Class.capacity */
    capacity: z.coerce.number().int('Capacity must be a whole number').min(1, 'Capacity must be at least 1').max(500, 'Capacity must be 500 or less'),

    /** Prisma: Class.status (ClassStatus enum) */
    status: z.enum(CLASS_STATUSES, { message: 'Status is required' }),

    /** Prisma: Class.locationId — ID of a Location record */
    locationId: z.string().min(1, 'Location is required'),

    /**
     * Prisma: Class.startsAt (DateTime)
     * Stored as an ISO datetime string in the form; converted before DB insert.
     */
    startsAt: z.string().min(1, 'Start date & time is required'),

    /**
     * Prisma: Class.endsAt (DateTime?)
     * Optional — same format as startsAt.
     */
    endsAt: z.string().optional().nullable(),

    // ── UI-only fields (not persisted directly to the Class table) ──────────



    /** UI-only: enable waitlist for this class */
    enableWaitlist: z.boolean(),

    /** UI-only: send reminder/confirmation emails to members */
    notifyMembers: z.boolean(),

    /** UI-only: show remaining spots on the schedule */
    showRemainingSpots: z.boolean(),

   
  })
  .refine(
    data => {
      if (!data.startsAt || !data.endsAt) return true;
      return new Date(data.endsAt) > new Date(data.startsAt);
    },
    { message: 'End date/time must be after start date/time', path: ['endsAt'] },
  );

export type ClassFormValues = z.infer<typeof classSchema>;

export const defaultClassValues: ClassFormValues = {
  name: '',
  type: 'PILATES',
  instructor: '',
  description: '',
  capacity: 12,
  status: 'SCHEDULED',
  image: null,
  locationId: '',
  startsAt: '',
  endsAt: '',
  enableWaitlist: true,
  notifyMembers: true,
  showRemainingSpots: true,
};
