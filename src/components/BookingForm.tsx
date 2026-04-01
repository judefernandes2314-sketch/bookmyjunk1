import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MapPin, User, ChevronRight, ChevronLeft } from "lucide-react";
import { toast } from "sonner";

const wasteCategories = [
  {
    id: "ewaste",
    label: "E-waste",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="2" y="8" width="28" height="20" rx="2" fill="#2E86C1"/>
        <rect x="4" y="10" width="24" height="16" rx="1" fill="#D6EAF8"/>
        <rect x="6" y="13" width="12" height="2" rx="1" fill="#2E86C1" opacity="0.4"/>
        <rect x="6" y="16.5" width="8" height="1.5" rx="0.75" fill="#2E86C1" opacity="0.3"/>
        <rect x="6" y="20" width="14" height="1.5" rx="0.75" fill="#2E86C1" opacity="0.3"/>
        <path d="M8 28h12l1.5 3.5H6.5L8 28z" fill="#1A6FA0"/>
        <rect x="6" y="31" width="16" height="1.5" rx="0.75" fill="#4A90D9"/>
        <rect x="33" y="12" width="13" height="23" rx="3" fill="#E67E22"/>
        <rect x="35" y="15" width="9" height="14" rx="1" fill="#FAD7A0"/>
        <rect x="36.5" y="17" width="6" height="1.5" rx="0.75" fill="#E67E22" opacity="0.5"/>
        <rect x="36.5" y="20" width="4" height="1.5" rx="0.75" fill="#E67E22" opacity="0.4"/>
        <circle cx="39.5" cy="23.5" r="2" fill="#E67E22" opacity="0.3"/>
        <circle cx="39.5" cy="32" r="1.5" fill="#CF6D17"/>
        <circle cx="39.5" cy="13.5" r="1" fill="#CF6D17"/>
      </svg>
    ),
  },
  {
    id: "paper",
    label: "Paper / Cardboard",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="6" y="22" width="36" height="20" rx="2" fill="#CA8A3E"/>
        <path d="M6 26h36" stroke="#B07030" strokeWidth="1"/>
        <path d="M6 22l8-12h24l8 12H6z" fill="#E8A850"/>
        <path d="M24 10v12" stroke="#CA8A3E" strokeWidth="1" opacity="0.6"/>
        <rect x="13" y="8" width="8" height="14" rx="1" fill="white"/>
        <rect x="14" y="10" width="6" height="1" rx="0.5" fill="#AAB7C4" opacity="0.7"/>
        <rect x="14" y="12.5" width="4" height="1" rx="0.5" fill="#AAB7C4" opacity="0.5"/>
        <rect x="14" y="15" width="5" height="1" rx="0.5" fill="#AAB7C4" opacity="0.5"/>
        <rect x="27" y="7" width="8" height="15" rx="1" fill="#FEF9E7"/>
        <rect x="28" y="9" width="6" height="1" rx="0.5" fill="#AAB7C4" opacity="0.7"/>
        <rect x="28" y="11.5" width="4" height="1" rx="0.5" fill="#AAB7C4" opacity="0.5"/>
        <rect x="10" y="29" width="12" height="2" rx="1" fill="white" opacity="0.4"/>
        <rect x="10" y="33" width="16" height="2" rx="1" fill="white" opacity="0.3"/>
        <rect x="10" y="37" width="10" height="2" rx="1" fill="white" opacity="0.25"/>
      </svg>
    ),
  },
  {
    id: "plastic",
    label: "Plastic Waste",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M5 22 Q4 17 8 15 Q12 13 15 15 Q18 17 17 22 L16 38 Q16 40 12.5 40 Q9 40 7.5 40 Q6 40 5.5 38 Z" fill="#AED6F1"/>
        <path d="M9 15 Q9 11 12 10 Q15 9 15 15" stroke="#7FB3D3" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
        <path d="M7 23 Q11 25 15 23" stroke="white" strokeWidth="0.9" opacity="0.7" fill="none"/>
        <path d="M7.5 28 Q11 30 15 28" stroke="white" strokeWidth="0.8" opacity="0.5" fill="none"/>
        <path d="M8 33 Q11 34.5 15 33" stroke="white" strokeWidth="0.7" opacity="0.4" fill="none"/>
        <rect x="20" y="16" width="10" height="26" rx="4" fill="#74C7E8"/>
        <rect x="20" y="16" width="10" height="7" rx="3" fill="#5BB8DC"/>
        <rect x="22" y="14" width="6" height="4" rx="1.5" fill="#4AADC8"/>
        <rect x="23" y="12" width="4" height="3" rx="1" fill="#5BB8DC"/>
        <rect x="21" y="26" width="8" height="8" rx="1.5" fill="white" opacity="0.35"/>
        <rect x="22.5" y="28" width="5" height="1" rx="0.5" fill="#4AADC8" opacity="0.6"/>
        <rect x="22.5" y="30.5" width="3" height="1" rx="0.5" fill="#4AADC8" opacity="0.5"/>
        <rect x="22" y="17" width="2" height="10" rx="1" fill="white" opacity="0.25"/>
        <rect x="33" y="20" width="11" height="20" rx="3" fill="#A9D18E"/>
        <rect x="33" y="20" width="11" height="6" rx="3" fill="#82C465"/>
        <rect x="25" y="22" width="10" height="4" rx="2" fill="#82C465"/>
        <path d="M25 24l-3-1.5" stroke="#82C465" strokeWidth="2" strokeLinecap="round"/>
        <path d="M33 27 Q30 29 31 33" stroke="#82C465" strokeWidth="1.8" strokeLinecap="round" fill="none"/>
        <rect x="34.5" y="29" width="8" height="6" rx="1" fill="white" opacity="0.3"/>
      </svg>
    ),
  },
  {
    id: "metals",
    label: "Metals",
    icon: (
      <svg viewBox="0 0 56 56" fill="none" className="w-full h-full">
        <rect x="4" y="42" width="48" height="8" rx="2" fill="#BDC3C7"/>
        <rect x="4" y="42" width="48" height="3" rx="2" fill="#D5D8DC"/>
        <rect x="52" y="42" width="2" height="8" rx="1" fill="#ECF0F1"/>
        <circle cx="9" cy="46" r="2" fill="#95A5A6"/>
        <circle cx="9" cy="46" r="1" fill="#7F8C8D"/>
        <circle cx="47" cy="46" r="2" fill="#95A5A6"/>
        <circle cx="47" cy="46" r="1" fill="#7F8C8D"/>
        <circle cx="28" cy="46" r="2" fill="#95A5A6"/>
        <circle cx="28" cy="46" r="1" fill="#7F8C8D"/>
        <line x1="6" y1="45" x2="50" y2="45" stroke="#AAB7C4" strokeWidth="0.5" opacity="0.5"/>
        <rect x="14" y="8" width="12" height="34" rx="5" fill="#E8A040"/>
        <rect x="14" y="8" width="12" height="12" rx="5" fill="#F0B860"/>
        <rect x="15.5" y="10" width="3.5" height="28" rx="1.75" fill="white" opacity="0.18"/>
        <ellipse cx="20" cy="8" rx="6" ry="3" fill="#F5C842"/>
        <ellipse cx="20" cy="8" rx="3.5" ry="1.5" fill="#D4890A"/>
        <ellipse cx="20" cy="8" rx="1.5" ry="0.8" fill="#7D5000"/>
        <rect x="14" y="30" width="30" height="12" rx="5" fill="#D4890A"/>
        <rect x="14" y="30" width="30" height="5" rx="4" fill="#E8A040"/>
        <rect x="16" y="31.5" width="26" height="3" rx="1.5" fill="white" opacity="0.18"/>
        <ellipse cx="44" cy="36" rx="3" ry="6" fill="#B7770D"/>
        <ellipse cx="44" cy="36" rx="1.8" ry="3.5" fill="#9A6010"/>
        <ellipse cx="44" cy="36" rx="0.8" ry="1.5" fill="#7D5000"/>
        <rect x="14" y="30" width="12" height="12" rx="3" fill="#C47A0A"/>
        <circle cx="20" cy="36" r="3" fill="#D4890A"/>
        <circle cx="20" cy="36" r="1.5" fill="#B7770D"/>
        <circle cx="20" cy="42" r="3" fill="#E67E22"/>
        <circle cx="20" cy="42" r="1.5" fill="#CA6F1E"/>
        <path d="M18.5 42h3M20 40.5v3" stroke="#FAD7A0" strokeWidth="0.8" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    id: "clothes",
    label: "Clothes",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <path d="M10 20h28v22H10z" fill="#2980B9"/>
        <path d="M10 20h28v4H10z" fill="#3498DB"/>
        <path d="M24 24v18" stroke="#2471A3" strokeWidth="1.5"/>
        <path d="M10 20h14v18H10z" fill="#2980B9"/>
        <path d="M24 20h14v18H24z" fill="#2471A3"/>
        <path d="M12 25h8M26 25h8" stroke="#1A5276" strokeWidth="0.8" opacity="0.5"/>
        <path d="M9 8l7-4h6c0 3 2 4.5 2 4.5s2-1.5 2-4.5h6l7 4-5 6-4-2.5V22H14v-10.5L10 14 9 8z" fill="#E74C3C"/>
        <path d="M9 8l7-4h6c0 3 2 4.5 2 4.5s2-1.5 2-4.5h6l7 4-5 6-4-2.5V13H14v-3.5L10 14 9 8z" fill="#C0392B"/>
        <path d="M14 16h20" stroke="white" strokeWidth="0.8" opacity="0.4"/>
        <path d="M14 19h16" stroke="white" strokeWidth="0.8" opacity="0.3"/>
        <rect x="10" y="20" width="28" height="3" rx="1" fill="#1A5276"/>
        <rect x="21" y="20.5" width="6" height="2" rx="1" fill="#F39C12"/>
      </svg>
    ),
  },
  {
    id: "battery",
    label: "Battery",
    icon: (
      <svg viewBox="0 0 48 48" fill="none" className="w-full h-full">
        <rect x="8" y="16" width="26" height="16" rx="4" fill="#27AE60" opacity="0.7"/>
        <rect x="34" y="21" width="4" height="6" rx="2" fill="#27AE60" opacity="0.7"/>
        <rect x="4" y="21" width="4" height="6" rx="2" fill="#888" opacity="0.7"/>
        <rect x="6" y="20" width="28" height="16" rx="4" fill="#2ECC71"/>
        <rect x="34" y="25" width="4" height="6" rx="2" fill="#27AE60"/>
        <rect x="2" y="25" width="4" height="6" rx="2" fill="#7F8C8D"/>
        <rect x="6" y="20" width="28" height="4" rx="3" fill="white" opacity="0.2"/>
        <rect x="8" y="22" width="8" height="12" rx="2" fill="#27AE60"/>
        <rect x="18" y="22" width="14" height="12" rx="2" fill="#1E8449"/>
        <path d="M23 24l-5 7h6l-5 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 27h4M12 25v4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10 31h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
];

const inputCls = "w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary transition-all duration-200";

const BookingForm = () => {
  const [page, setPage] = useState(1);
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    location: "",
    pincode: "",
    inquiry_type: "",
    inquiry_other: "",
    categories: [] as string[],
    remarks: "",
  });

  const toggleCategory = (id: string) => {
    setForm((prev) => ({
      ...prev,
      categories: prev.categories.includes(id)
        ? prev.categories.filter((c) => c !== id)
        : [...prev.categories, id],
    }));
  };

  const handleNext = () => {
    if (honeypot) return; // bot detected — silently ignore
    if (!(form.name || "").trim() || !(form.phone || "").trim() || !(form.location || "").trim() || !(form.pincode || "").trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (!/^\d{10}$/.test((form.phone || "").trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }
    if (!/^\d{6}$/.test((form.pincode || "").trim())) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }
    setPage(2);
    window.scrollTo({ top: document.getElementById("book")?.offsetTop ?? 0, behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bot detected — silently ignore
    if (!(form.inquiry_type || "").trim()) {
      toast.error("Please select an inquiry type");
      return;
    }
    try {
      const categoryLabels = form.categories.map(
        (id) => wasteCategories.find((c) => c.id === id)?.label ?? id
      );
      const res = await fetch("https://api.jambologos.com/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: (form.name || "").trim(),
          phone: (form.phone || "").trim(),
          website: honeypot,
          inquiry_type: (form.inquiry_type || "").trim(),
          inquiry_other: (form.inquiry_other || "").trim(),
          location: (form.location || "").trim(),
          pincode: (form.pincode || "").trim(),
          items: categoryLabels,
          notes: (form.remarks || "").trim(),
        }),
      });
      if (!res.ok) throw new Error("Server error");
      toast.success("Thank you! We'll contact you shortly.");
      setForm({ name: "", phone: "", location: "", pincode: "", inquiry_type: "", inquiry_other: "", categories: [], remarks: "" });
      setPage(1);
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
  };

  return (
    <section id="book" className="py-20 bg-accent/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-primary font-semibold text-xs tracking-[0.2em] uppercase">Book Free Pickup</span>
          <h2 className="mt-4 text-3xl md:text-5xl font-display font-bold text-foreground tracking-tight">
            Schedule Your Doorstep E-waste Collection
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Fill in your details and our team will pick up your waste for free!
          </p>
        </motion.div>

        <div className="max-w-2xl mx-auto">
          {/* Step indicator */}
          <div className="flex items-center mb-8 px-2">
            <div className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${page >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"}`}>
                {page > 1 ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                ) : "1"}
              </div>
              <span className={`text-sm font-medium transition-colors ${page === 1 ? "text-foreground" : "text-muted-foreground"}`}>Your Details</span>
            </div>
            <div className={`flex-1 h-px mx-3 transition-colors ${page > 1 ? "bg-primary" : "bg-border"}`}/>
            <div className="flex items-center gap-2 flex-1 justify-end">
              <span className={`text-sm font-medium transition-colors ${page === 2 ? "text-foreground" : "text-muted-foreground"}`}>Waste Info</span>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${page === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground border border-border"}`}>2</div>
            </div>
          </div>

          <div className="overflow-hidden">
            <AnimatePresence mode="wait" custom={page === 1 ? -1 : 1}>
              {page === 1 ? (
                <motion.div
                  key="page1"
                  custom={-1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="bg-card rounded-2xl p-8 md:p-10 card-elevated border border-border premium-glow"
                >
                  <p className="text-sm font-semibold text-foreground mb-1">Tell us about yourself</p>
                  <p className="text-xs text-muted-foreground mb-6">Step 1 of 2 — Basic contact details</p>

                  <div className="grid sm:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                        <User className="h-4 w-4 text-muted-foreground"/> Full Name <span className="text-primary">*</span>
                      </label>
                      <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" maxLength={100} className={inputCls}/>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                        <span style={{fontSize:"16px"}}>📱</span> Phone Number <span className="text-primary">*</span>
                      </label>
                      <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit number" className={inputCls}/>
                    </div>
                  </div>

                  <div className="mb-5">
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                      <MapPin className="h-4 w-4 text-muted-foreground"/> City / Location <span className="text-primary">*</span>
                    </label>
                    <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g., Mumbai, Delhi, Bangalore" maxLength={200} className={inputCls}/>
                  </div>

                  <div className="mb-8">
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h6"/></svg>
                      Pincode <span className="text-primary">*</span>
                    </label>
                    <input type="tel" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value.replace(/\D/g, "").slice(0, 6) })} placeholder="6-digit pincode" className={inputCls}/>
                  </div>

                  {/* Honeypot — hidden from humans, bots will fill this */}
                  <div style={{ opacity: 0, position: "absolute", top: 0, left: 0, height: 0, width: 0, zIndex: -1, overflow: "hidden" }} aria-hidden="true" tabIndex={-1}>
                    <input
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  {/* Honeypot trap — invisible to humans, bots will fill it */}
                  <div style={{position:"absolute",left:"-9999px",top:"-9999px",opacity:0,height:0,overflow:"hidden"}} aria-hidden="true">
                    <label htmlFor="website">Leave this empty</label>
                    <input
                      id="website"
                      type="text"
                      name="website"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                      tabIndex={-1}
                      autoComplete="off"
                    />
                  </div>

                  <motion.button
                    type="button"
                    onClick={handleNext}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors"
                  >
                    Next — Waste Details <ChevronRight className="h-5 w-5"/>
                  </motion.button>
                </motion.div>
              ) : (
                <motion.form
                  key="page2"
                  custom={1}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                  onSubmit={handleSubmit}
                  className="bg-card rounded-2xl p-8 md:p-10 card-elevated border border-border premium-glow"
                >
                  <p className="text-sm font-semibold text-foreground mb-1">What are you disposing?</p>
                  <p className="text-xs text-muted-foreground mb-6">Step 2 of 2 — Waste category &amp; inquiry type</p>

                  <div className="mb-5">
                    <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                      Inquiry Type <span className="text-primary">*</span>
                    </label>
                    <select value={form.inquiry_type} onChange={(e) => setForm({ ...form, inquiry_type: e.target.value, inquiry_other: "" })} className={inputCls}>
                      <option value="">Select inquiry type</option>
                      <option value="Individual">Individual</option>
                      <option value="Corporate">Corporate-Bulk</option>
                      <option value="Residential">Residential</option>
                      <option value="Other">Other</option>
                    </select>
                    {form.inquiry_type === "Other" && (
                      <input type="text" value={form.inquiry_other} onChange={(e) => setForm({ ...form, inquiry_other: e.target.value })} placeholder="Please specify..." maxLength={100} className={`${inputCls} mt-3`}/>
                    )}
                  </div>

                  <div className="mb-5">
                    <label className="text-sm font-medium text-foreground mb-1 flex items-center gap-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-muted-foreground"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/></svg>
                      Category of Waste
                    </label>
                    <p className="text-xs text-muted-foreground mb-3">Select all that apply</p>
                    <div className="grid grid-cols-3 gap-3">
                      {wasteCategories.map((cat) => {
                        const selected = form.categories.includes(cat.id);
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => toggleCategory(cat.id)}
                            className={`flex flex-col items-center text-center p-3 rounded-xl border transition-all duration-200 ${selected ? "border-primary border-2 bg-primary/5" : "border-border hover:border-primary/40"}`}
                          >
                            <div className="w-11 h-11 mb-2">{cat.icon}</div>
                            <span className={`text-xs font-medium leading-tight ${selected ? "text-primary" : "text-foreground"}`}>{cat.label}</span>
                            {selected && <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary block mx-auto"/>}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="text-sm font-medium text-foreground mb-2 block">Remarks</label>
                    <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} placeholder="Any special instructions or additional details..." maxLength={500} rows={3} className={`${inputCls} resize-none`}/>
                  </div>

                  <div className="flex gap-3">
                    <motion.button
                      type="button"
                      onClick={() => setPage(1)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 bg-muted text-foreground py-4 rounded-xl font-semibold text-base border border-border flex items-center justify-center gap-2 transition-colors hover:bg-muted/80"
                    >
                      <ChevronLeft className="h-5 w-5"/> Back
                    </motion.button>
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-[2] bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-base shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors"
                    >
                      <Send className="h-5 w-5"/> Submit Request
                    </motion.button>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingForm;
