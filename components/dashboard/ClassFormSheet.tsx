'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, Clock, Dumbbell, ImagePlus, MapPin, Save, Timer, User, X } from 'lucide-react';
import { type ReactNode, useState, useRef } from 'react';
import { Controller, type SubmitHandler, useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CapacityBadge } from '@/components/ui/CapacityBadge';
import { Card } from '@/components/ui/Card';
import { Field, FieldDescription, FieldError, FieldLabel, fieldInputClass } from '@/components/ui/Field';
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { CLASS_STATUSES, CLASS_TYPES, DIFFICULTIES, INSTRUCTORS, type ClassFormValues, classSchema, defaultClassValues } from '@/schemas/index';
import { useUploadThing } from '@/utils/uploadthing';
import toast from 'react-hot-toast';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ClassFormSheetProps = {
  /** Whether the sheet is open. */
  open: boolean;
  /** Called when the sheet open state should change. */
  onOpenChange: (open: boolean) => void;
  /**
   * Pre-fill the form for edit mode. When provided the sheet title becomes
   * "Edit class" and the primary action becomes "Save changes".
   */
  defaultValues?: Partial<ClassFormValues>;
  /** Called with validated data when the user submits the form. */
  onSubmit: (values: ClassFormValues) => any;
  /** Override the primary submit button label. */
  submitLabel?: string;
  /** Location records fetched from the database for the location picker. */
  locations?: { id: string; name: string }[];
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Format an ISO datetime string or datetime-local value to "Wed, Jul 15 · 5:30 PM" */
function formatDatetime(dt: string) {
  if (!dt) return '—';
  const d = new Date(dt);
  if (isNaN(d.getTime())) return '—';
  return d.toLocaleString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

/** Duration in minutes between two ISO/datetime-local strings. */
function durationMinutes(start: string, end: string) {
  if (!start || !end) return null;
  const diff = (new Date(end).getTime() - new Date(start).getTime()) / 60000;
  return diff > 0 ? Math.round(diff) : null;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ClassFormSheet({ open, onOpenChange, defaultValues, onSubmit, submitLabel, locations }: ClassFormSheetProps) {
  const isEditMode = Boolean(defaultValues);
  const resolvedSubmitLabel = submitLabel ?? (isEditMode ? 'Save changes' : 'Publish class');

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { startUpload, isUploading: isUploadingImage } = useUploadThing("imageUploader");

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { isSubmitting, isDirty },
  } = useForm<ClassFormValues>({
    resolver: zodResolver(classSchema) as any,
    defaultValues: { ...defaultClassValues, ...defaultValues },
  });

  // Live preview values
  const name = watch('name');
  const instructor = watch('instructor');
  const startsAt = watch('startsAt');
  const type = watch('type');
  const locationId = watch('locationId');
  const capacity = watch('capacity');

  // const duration = durationMinutes(startsAt, endsAt);

  const onValidSubmit: SubmitHandler<ClassFormValues> = async values => {

    try{

    
    let finalValues = { ...values };

    console.log('this is values', values)

    const selectedDate = new Date(finalValues.startsAt)

    console.log('this is selected date', selectedDate)

    if (imageFile) {
      try {
        const uploadResult = await startUpload([imageFile]);
        if (uploadResult && uploadResult[0]) {
          finalValues.image = uploadResult[0].ufsUrl;
        }
      } catch (err) {
        alert("Image upload failed");
        return;
      } 
    }

    const res = await onSubmit({ 
      ...finalValues, 
      startsAt: selectedDate.toISOString(),
      endsAt: finalValues.endsAt ? new Date(finalValues.endsAt).toISOString() : undefined
    });

    if (res && res.success === false) {
      toast.error(res.error || res.message || 'Failed to save class')
    } else {
      toast.success(res?.message || 'Class saved successfully')
    }
    onOpenChange(false)}catch(err){
      console.log('error in class creation',err)
    toast.error('An error occurred while creating the class')
    }
  };

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      reset({ ...defaultClassValues, ...defaultValues });
      setImageFile(null);
      setImagePreview(null);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={handleOpenChange}>
      <SheetContent
        side='right'
        className='flex h-full flex-col'>
        {/* ── Header ── */}
        <SheetHeader>
          <div className='flex items-start justify-between gap-4'>
            <div className='flex items-center gap-3'>
              <span className='flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-600 text-white'>
                <Dumbbell className='h-5 w-5' />
              </span>
              <div>
                <SheetTitle>{isEditMode ? 'Edit class' : 'Create class'}</SheetTitle>
                <SheetDescription>
                  {isEditMode
                    ? 'Update the class details and save your changes.'
                    : 'Design the class, set capacity, and publish it to the member schedule.'}
                </SheetDescription>
              </div>
            </div>
            <SheetClose
              aria-label='Close'
              className='flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-slate-300 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500'>
              <X className='h-5 w-5' />
            </SheetClose>
          </div>
        </SheetHeader>

        {/* ── Body ── */}
        <form
          id='class-form'
          onSubmit={handleSubmit(onValidSubmit)}
          className='min-h-0 flex-1 overflow-y-auto'>
          <div className='grid gap-6 p-5 sm:p-8 xl:grid-cols-[1fr_340px]'>
            {/* Left column — form sections */}
            <div className='space-y-6'>
              {/* ── Class details ── */}
              <FormSection
                title='Class details'
                description='The public-facing name, format, and instructor notes members see before booking.'>
                <div className='grid gap-4 md:grid-cols-2'>
                  {/* Name */}
                  <Controller
                    name='name'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Class name</FieldLabel>
                        <input
                          {...field}
                          id={field.name}
                          className={fieldInputClass}
                          placeholder='e.g. Pilates Strength'
                          aria-invalid={fieldState.invalid}
                          autoComplete='off'
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Type */}
                  <Controller
                    name='type'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Class type</FieldLabel>
                        <select
                          {...field}
                          id={field.name}
                          className={fieldInputClass}
                          aria-invalid={fieldState.invalid}>
                          {CLASS_TYPES.map(t => (
                            <option
                              key={t}
                              value={t}>
                              {t.charAt(0) + t.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Instructor */}
                  <Controller
                    name='instructor'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Instructor</FieldLabel>
                        <select
                          {...field}
                          id={field.name}
                          className={fieldInputClass}
                          aria-invalid={fieldState.invalid}>
                          {INSTRUCTORS.map(i => (
                            <option key={i}>{i}</option>
                          ))}
                        </select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* iMAGE */}
                  <Controller
                    name='image'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid} className="md:col-span-2">
                        <FieldLabel htmlFor={field.name}>Image</FieldLabel>
                        
                        <div 
                           className="group relative flex flex-col items-center justify-center border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl p-8 cursor-pointer overflow-hidden min-h-[200px]"
                           onClick={() => fileInputRef.current?.click()}
                           onDragOver={(e) => e.preventDefault()}
                           onDrop={(e) => {
                             e.preventDefault();
                             const file = e.dataTransfer.files?.[0];
                             if (file && file.type.startsWith('image/')) {
                               setImageFile(file);
                               setImagePreview(URL.createObjectURL(file));
                             }
                           }}
                        >
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef} 
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setImageFile(file);
                                setImagePreview(URL.createObjectURL(file));
                              }
                            }} 
                          />
                          
                          {imagePreview || field.value ? (
                            <div className="absolute inset-0 w-full h-full">
                              <img 
                                src={imagePreview || field.value} 
                                alt="Class preview" 
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                                <ImagePlus className="w-8 h-8 mb-2" />
                                <span className="font-medium">Change image</span>
                              </div>
                            </div>
                          ) : (
                            <>
                              <ImagePlus className="w-10 h-10 text-gray-400 mb-2 group-hover:text-blue-500 transition-colors" />
                              <span className="text-gray-600 font-medium">Choose a file or drag & drop</span>
                              <span className="text-gray-400 text-sm mt-1">Image (max 4MB)</span>
                            </>
                          )}
                        </div>

                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Difficulty
                  <Controller
                    name='difficulty'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Difficulty</FieldLabel>
                        <select
                          {...field}
                          id={field.name}
                          className={fieldInputClass}
                          aria-invalid={fieldState.invalid}>
                          {DIFFICULTIES.map(d => (
                            <option key={d}>{d}</option>
                          ))}
                        </select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  /> */}
                </div>

                {/* Description */}
                <Controller
                  name='description'
                  control={control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                      <textarea
                        {...field}
                        id={field.name}
                        className={`${fieldInputClass} min-h-32 py-3`}
                        placeholder='A short description members see before booking…'
                        aria-invalid={fieldState.invalid}
                      />
                      <FieldDescription>Required. Shown to members on the class booking page.</FieldDescription>
                      {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                    </Field>
                  )}
                />
              </FormSection>

              {/* ── Schedule & capacity ── */}
              <FormSection
                title='Schedule and capacity'
                description='Set when this class appears, where it runs, and how many members can reserve a spot.'>
                <div className='grid items-start gap-4 md:grid-cols-2'>
                  {/* locationId — select picker populated from Location records */}
                  <Controller
                    name='locationId'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Location</FieldLabel>
                        <select
                          {...field}
                          id={field.name}
                          className={fieldInputClass}
                          aria-invalid={fieldState.invalid}>
                          <option value=''>Select a location…</option>
                          {(locations ?? []).map(loc => (
                            <option key={loc.id} value={loc.id}>
                              {loc.name}
                            </option>
                          ))}
                        </select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Studio room (UI-only)
                  <Controller
                    name='studioRoom'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Studio room</FieldLabel>
                        <input
                          {...field}
                          id={field.name}
                          className={fieldInputClass}
                          placeholder='e.g. Studio A'
                          aria-invalid={fieldState.invalid}
                          autoComplete='off'
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  /> */}

                  {/* startsAt — Prisma Class.startsAt (DateTime) */}
                  <Controller
                    name='startsAt'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Start Date</FieldLabel>
                        <input
                          {...field}
                          id={field.name}
                          type='datetime-local'
                          className={fieldInputClass}
                          aria-invalid={fieldState.invalid}
                        />
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* endsAt — Prisma Class.endsAt (DateTime?) */}
                  <Controller
                    name='endsAt'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>End Date</FieldLabel>
                        <input
                          {...field}
                          id={field.name}
                          type='datetime-local'
                          className={fieldInputClass}
                          aria-invalid={fieldState.invalid}
                        />
                        <FieldDescription>Optional. Leave blank for open-ended sessions.</FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Capacity — Prisma Class.capacity (max 12) */}
                  <Controller
                    name='capacity'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Capacity</FieldLabel>
                        <select
                          {...field}
                          id={field.name}
                          className={fieldInputClass}
                          aria-invalid={fieldState.invalid}
                          value={field.value ?? ''}
                          onChange={e => field.onChange(Number(e.target.value))}>
                          <option value=''>Select capacity…</option>
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(n => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'member' : 'members'}
                            </option>
                          ))}
                        </select>
                        <FieldDescription>Max 12 members per class.</FieldDescription>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />

                  {/* Status — Prisma ClassStatus enum */}
                  <Controller
                    name='status'
                    control={control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>Status</FieldLabel>
                        <select
                          {...field}
                          id={field.name}
                          className={fieldInputClass}
                          aria-invalid={fieldState.invalid}>
                          {CLASS_STATUSES.map(s => (
                            <option
                              key={s}
                              value={s}>
                              {s.charAt(0) + s.slice(1).toLowerCase()}
                            </option>
                          ))}
                        </select>
                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                      </Field>
                    )}
                  />
                </div>
              </FormSection>

              {/* ── Booking rules ── */}
              <FormSection
                title='Booking rules'
                description='Controls for waitlists, notifications, cancellation visibility, and member expectations.'>
                <div className='grid gap-3 md:grid-cols-2'>
                  <Controller
                    name='enableWaitlist'
                    control={control}
                    render={({ field }) => (
                      <BookingRule
                        label='Enable waitlist'
                        description='Offer open seats in order with a 30-minute confirmation window.'
                        checked={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  />
                  <Controller
                    name='notifyMembers'
                    control={control}
                    render={({ field }) => (
                      <BookingRule
                        label='Notify members'
                        description='Send confirmation and class reminder emails.'
                        checked={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  />
                  <Controller
                    name='showRemainingSpots'
                    control={control}
                    render={({ field }) => (
                      <BookingRule
                        label='Show remaining spots'
                        description='Display scarcity and capacity progress on the schedule.'
                        checked={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  />
                  
                  {/* <Controller
                    name='allowCancellation'
                    control={control}
                    render={({ field }) => (
                      <BookingRule
                        label='Allow cancellation'
                        description='Members can cancel before the studio policy window.'
                        checked={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                      />
                    )}
                  /> */}
                </div>
              </FormSection>
            </div>

            {/* Right column — live preview + readiness */}
            <aside className='space-y-5'>
              {/* Live preview card */}
              <Card className='overflow-hidden'>
                <div className='flex h-44 items-center justify-center bg-gradient-to-br from-emerald-500 via-sky-500 to-amber-400 text-white'>
                  <div className='text-center'>
                    <ImagePlus className='mx-auto h-8 w-8' />
                    <p className='mt-3 font-heading text-sm font-semibold'>Add class image</p>
                  </div>
                </div>
                <div className='p-5'>
                  <Badge variant='emerald'>Live preview</Badge>
                  <h3 className='mt-4 font-heading text-xl font-semibold text-slate-950'>
                    {name || <span className='text-slate-400'>Class name</span>}
                  </h3>
                  <div className='mt-4 grid gap-3 text-sm text-slate-600'>
                    <span className='flex items-center gap-2'>
                      <User className='h-4 w-4 text-emerald-600' />
                      {instructor || '—'}
                    </span>
                    <span className='flex items-center gap-2'>
                      <Timer className='h-4 w-4 text-emerald-600' />
                      {startsAt ? formatDatetime(startsAt) : '—'}
                    </span>
                    {/* <span className='flex items-center gap-2'>
                      <Timer className='h-4 w-4 text-emerald-600' />
                      {type ? type : '-'}
                    </span> */}
                    <span className='flex items-center gap-2'>
                      <MapPin className='h-4 w-4 text-emerald-600' />
                      {locationId || '—'}{' '}
                    </span>
                  </div>
                  <div className='mt-5 rounded-2xl bg-slate-50 p-4'>
                    <CapacityBadge
                      remaining={capacity || 0}
                      capacity={capacity || 0}
                    />
                  </div>
                </div>
              </Card>

              {/* Publish readiness */}
              <Card className='p-5'>
                <h3 className='font-heading text-lg font-semibold text-slate-950'>Publish readiness</h3>
                <div className='mt-4 space-y-3'>
                  {[
                    {
                      label: 'Required fields complete',
                      done: Boolean(name && locationId && startsAt),
                    },
                    { label: 'Capacity rules active', done: Boolean(capacity && capacity > 0) },
                    { label: 'Schedule conflict check', done: true },
                    { label: 'Reminder email queued', done: false },
                  ].map(({ label, done }) => (
                    <div
                      key={label}
                      className='flex items-center gap-3 text-sm text-slate-600'>
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full ${done ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {done ? <CheckCircle2 className='h-4 w-4' /> : <Clock className='h-4 w-4' />}
                      </span>
                      {label}
                    </div>
                  ))}
                </div>
              </Card>

              {/* Unsaved changes indicator */}
              {isDirty && (
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className='rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800'>
                  <p className='font-heading font-semibold'>Unsaved changes</p>
                  <p className='mt-1 leading-6'>You have unsaved changes. Submit the form to persist them.</p>
                </motion.div>
              )}
            </aside>
          </div>
        </form>

        {/* ── Footer ── */}
        <SheetFooter>
          <div className='flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between'>
            <p className='text-sm text-slate-500'>
              {isEditMode ? 'Changes will be applied immediately after saving.' : 'Changes are previewed immediately in the sidebar.'}
            </p>
            <div className='flex flex-wrap gap-3'>
              <Button
                type='button'
                variant='secondary'
                onClick={() => handleOpenChange(false)}>
                Cancel
              </Button>
              {!isEditMode && (
                <Button
                  type='button'
                  variant='secondary'
                  form='class-form'>
                  <Save className='h-4 w-4' /> Save draft
                </Button>
              )}
              <Button
                type='submit'
                form='class-form'
                disabled={isSubmitting || isUploadingImage}
                className='flex-1 sm:flex-none'>
                {isSubmitting || isUploadingImage ? 'Saving...' : resolvedSubmitLabel}
                {!isSubmitting && <ChevronRight className='h-4 w-4' />}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

type BookingRuleProps = {
  label: string;
  description: string;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  name?: string;
};

function BookingRule({ label, description, checked, onChange, onBlur, name }: BookingRuleProps) {
  return (
    <label className='flex cursor-pointer gap-3 rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-emerald-200 hover:bg-emerald-50/40'>
      <input
        type='checkbox'
        name={name}
        checked={checked}
        onChange={onChange}
        onBlur={onBlur}
        className='mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500'
      />
      <span>
        <span className='block font-heading text-sm font-semibold text-slate-950'>{label}</span>
        <span className='mt-1 block text-sm leading-6 text-slate-500'>{description}</span>
      </span>
    </label>
  );
}

function FormSection({ children, description, title }: { children: ReactNode; description: string; title: string }) {
  return (
    <Card className='p-5 sm:p-6'>
      <div className='mb-5 border-b border-slate-200 pb-5'>
        <h3 className='font-heading text-xl font-semibold text-slate-950'>{title}</h3>
        <p className='mt-2 text-sm leading-6 text-slate-500'>{description}</p>
      </div>
      <div className='grid gap-5'>{children}</div>
    </Card>
  );
}
