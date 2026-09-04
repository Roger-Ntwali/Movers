import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams } from "react-router-dom";
import {
  createLeadSchema,
  MOVE_TYPES,
  ROOM_OPTIONS,
  type CreateLeadInput,
} from "@movers-rwanda/shared";
import { Reveal } from "../ui/Reveal";
import { api, ApiError } from "../../lib/api";
import { useMagneticHover } from "../../hooks/useMagneticHover";
import { ClockIcon, PinIcon } from "../ui/icons";

const todayIso = new Date().toISOString().split("T")[0];

export function QuoteForm() {
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<CreateLeadInput>({ resolver: zodResolver(createLeadSchema) });

  // Arriving from "Check My Location" / a district pin on the service-area
  // map — prefill pickup (or just focus it for "somewhere not listed"). This
  // must react to searchParams (not just run on mount): clicking a district
  // while already on "/" doesn't remount QuoteForm, it just changes the
  // query string. Stripping the param after reading it prevents this effect
  // from firing again on its own re-run.
  useEffect(() => {
    const pickup = searchParams.get("pickup");
    if (pickup === null) return;
    if (pickup) setValue("pickup", pickup);
    setFocus("pickup");
    const next = new URLSearchParams(searchParams);
    next.delete("pickup");
    setSearchParams(next, { replace: true });
  }, [searchParams, setValue, setFocus, setSearchParams]);

  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const submitRef = useMagneticHover<HTMLButtonElement>(0.2);

  const onSubmit = async (data: CreateLeadInput) => {
    setServerError(null);
    try {
      await api.post("/api/leads", data);
      setSubmitted(true);
      reset();
    } catch (err) {
      setServerError(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="quote-wrap container" id="quote">
      <Reveal className="quote-card">
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="quote-card-head">
            <div>
              <h2>Get A Quote</h2>
              <p>Tell us where you&rsquo;re moving from and where you&rsquo;re going.</p>
            </div>
            <span className="quote-badge">
              <ClockIcon size={15} />
              Response within hours
            </span>
          </div>

          <div className="quote-form">
            {/* Honeypot: hidden from real visitors, only bots fill it in */}
            <div className="hp-field" aria-hidden="true">
              <label htmlFor="company">Company</label>
              <input id="company" type="text" tabIndex={-1} autoComplete="off" {...register("company")} />
            </div>

            <div className="field span-2">
              <label htmlFor="pickup">Pick-up Location</label>
              <div className="field-icon-wrap">
                <PinIcon />
                <input id="pickup" placeholder="e.g. Kimihurura, Kigali" {...register("pickup")} />
              </div>
              {errors.pickup && <span className="field-error">{errors.pickup.message}</span>}
            </div>
            <div className="field span-2">
              <label htmlFor="dropoff">Drop-off Location</label>
              <div className="field-icon-wrap">
                <PinIcon />
                <input id="dropoff" placeholder="e.g. Muhanga District" {...register("dropoff")} />
              </div>
              {errors.dropoff && <span className="field-error">{errors.dropoff.message}</span>}
            </div>

            <div className="field">
              <label htmlFor="moveType">Move Type</label>
              <select id="moveType" defaultValue="" {...register("moveType")}>
                <option value="" disabled>
                  Select type
                </option>
                {MOVE_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.moveType && <span className="field-error">{errors.moveType.message}</span>}
            </div>
            <div className="field">
              <label htmlFor="moveDate">Preferred Move Date</label>
              <input id="moveDate" type="date" min={todayIso} {...register("moveDate")} />
              {errors.moveDate && <span className="field-error">{errors.moveDate.message}</span>}
            </div>
            <div className="field">
              <label htmlFor="rooms">Number of Rooms</label>
              <select id="rooms" defaultValue="" {...register("rooms")}>
                <option value="" disabled>
                  Select rooms
                </option>
                {ROOM_OPTIONS.map((room) => (
                  <option key={room} value={room}>
                    {room}
                  </option>
                ))}
              </select>
              {errors.rooms && <span className="field-error">{errors.rooms.message}</span>}
            </div>
            <div className="field floating">
              <input id="name" placeholder=" " {...register("name")} />
              <label htmlFor="name">Name</label>
              {errors.name && <span className="field-error">{errors.name.message}</span>}
            </div>

            <div className="field floating">
              <input id="phone" placeholder=" " title="e.g. +250 7__ ___ ___" {...register("phone")} />
              <label htmlFor="phone">Phone Number</label>
              {errors.phone && <span className="field-error">{errors.phone.message}</span>}
            </div>
            <div className="field floating span-2">
              <input id="email" type="email" placeholder=" " {...register("email")} />
              <label htmlFor="email">Email</label>
              {errors.email && <span className="field-error">{errors.email.message}</span>}
            </div>

            <div className="field floating span-4">
              <textarea id="details" rows={3} placeholder=" " {...register("details")} />
              <label htmlFor="details">Additional Details Or Requests</label>
              {errors.details && <span className="field-error">{errors.details.message}</span>}
            </div>

            <div className="quote-submit-row">
              <p className="quote-fineprint">
                By requesting a quote, you agree to be contacted by our team about your move.
              </p>
              <button type="submit" className="btn btn-primary magnetic" ref={submitRef} disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Get A Quote"}
              </button>
            </div>
          </div>

          {submitted && (
            <div className="quote-confirm is-visible" role="status">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4}>
                <circle cx="12" cy="12" r="9" />
                <path d="M8 12l3 3 5-6" />
              </svg>
              <span>Thanks! Our Movers Rwanda team will contact you shortly.</span>
            </div>
          )}
          {serverError && (
            <div className="quote-error" role="alert">
              <span>{serverError}</span>
            </div>
          )}
        </form>
      </Reveal>
    </div>
  );
}
