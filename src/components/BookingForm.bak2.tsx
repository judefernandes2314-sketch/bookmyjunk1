import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, User, Package, Hash } from "lucide-react";
import { toast } from "sonner";

const ewasteItems = [
  "Old Laptops", "Desktop Computers", "Mobile Phones", "Televisions (TV)",
  "Printers & Scanners", "Keyboards & Mouse", "Cables & Chargers", "Batteries",
  "Monitors", "Servers & Networking Equipment", "Air Conditioners", "Refrigerators",
  "Washing Machines", "Other Electronics",
];

const inputCls = "w-full rounded-xl border border-input bg-background px-4 py-3.5 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-primary transition-all duration-200";

const BookingForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    inquiry_type: "",
    inquiry_other: "",
    location: "",
    pincode: "",
    items: [] as string[],
    otherText: "",
    quantity: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name.trim() || !form.phone.trim() || !form.inquiry_type.trim() || !form.location.trim() || !form.pincode.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (!/^\d{10}$/.test(form.phone.trim())) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    if (!/^\d{6}$/.test(form.pincode.trim())) {
      toast.error("Please enter a valid 6-digit pincode");
      return;
    }

    try {
      const res = await fetch("https://api.jambologos.com/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.trim(),
          inquiry_type: form.inquiry_type.trim(),
          inquiry_other: form.inquiry_other.trim(),
          location: form.location.trim(),
          pincode: form.pincode.trim(),
          items: form.items,
          otherElectronics: form.otherText.trim(),
          quantity: form.quantity.trim(),
          notes: form.notes.trim(),
        }),
      });

      if (!res.ok) throw new Error("Server error");

      toast.success("Thank you! We'll contact you shortly.");
      setForm({
        name: "",
        phone: "",
        inquiry_type: "",
        inquiry_other: "",
        location: "",
        pincode: "",
        items: [],
        otherText: "",
        quantity: "",
        notes: "",
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
    }
  };

  const toggleItem = (item: string) => {
    setForm((prev) => ({
      ...prev,
      items: prev.items.includes(item) ? prev.items.filter((i) => i !== item) : [...prev.items, item],
    }));
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
            Fill in your details and select the electronics you want to dispose. Our team will pick them up for free!
          </p>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto bg-card rounded-2xl p-8 md:p-10 card-elevated border border-border premium-glow"
        >
          <div className="grid sm:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
                <User className="h-4 w-4 text-muted-foreground" /> Full Name *
              </label>
              <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" maxLength={100} className={inputCls} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">📱 Phone Number *</label>
              <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "").slice(0, 10) })} placeholder="10-digit number" className={inputCls} />
            </div>
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
               Inquiry Type *
            </label>
            <select
              value={form.inquiry_type}
              onChange={(e) => setForm({ ...form, inquiry_type: e.target.value, inquiry_other: "" })}
              className={inputCls}
            >
              <option value="">Select inquiry type</option>
              <option value="Individual">Individual</option>
              <option value="Corporate">Corporate</option>
              <option value="Residential">Residential</option>
              <option value="Other">Other</option>
            </select>
            {form.inquiry_type === "Other" && (
              <input
                type="text"
                value={form.inquiry_other}
                onChange={(e) => setForm({ ...form, inquiry_other: e.target.value })}
                placeholder="Please specify your inquiry type..."
                maxLength={100}
                className={`${inputCls} mt-3`}
              />
            )}
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-muted-foreground" /> City / Location *
            </label>
            <input type="text" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="e.g., Mumbai, Delhi, Bangalore" maxLength={200} className={inputCls} />
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              Pincode *
            </label>
            <input
              type="tel"
              value={form.pincode}
              onChange={(e) =>
                setForm({
                  ...form,
                  pincode: e.target.value.replace(/\D/g, "").slice(0, 6),
                })
              }
              placeholder="6-digit pincode"
              className={inputCls}
            />
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <Package className="h-4 w-4 text-muted-foreground" /> Select E-waste Items
              <span className="text-xs text-muted-foreground font-normal ml-1">(select multiple)</span>
            </label>
            <select
              multiple
              value={form.items}
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions).map((o) => o.value);
                setForm({ ...form, items: selected, otherText: selected.includes("Other Electronics") ? form.otherText : "" });
              }}
              className={`${inputCls} min-h-[140px]`}
            >
              {ewasteItems.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground mt-1.5">Hold Ctrl (Windows) or Cmd (Mac) to select multiple items</p>
            {form.items.includes("Other Electronics") && (
              <input
                type="text"
                value={form.otherText}
                onChange={(e) => setForm({ ...form, otherText: e.target.value })}
                placeholder="Please specify your electronics..."
                maxLength={200}
                className={`${inputCls} mt-3`}
              />
            )}
          </div>

          <div className="mb-5">
            <label className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
              <Hash className="h-4 w-4 text-muted-foreground" /> Approximate Quantity
            </label>
            <input
              type="text"
              value={form.quantity}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
              placeholder="e.g., 5 items, 10 kg (optional)"
              maxLength={50}
              className={inputCls}
            />
          </div>

          <div className="mb-8">
            <label className="text-sm font-medium text-foreground mb-2 block">Additional Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Any special instructions..." maxLength={500} rows={3} className={`${inputCls} resize-none`} />
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02, y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg shadow-primary/20 flex items-center justify-center gap-2 transition-colors"
          >
            <Send className="h-5 w-5" /> Submit Pickup Request
          </motion.button>
        </motion.form>
      </div>
    </section>
  );
};

export default BookingForm;
