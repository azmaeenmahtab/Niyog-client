"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { InputCustom, Textarea, Toggle } from "@/components/RecruiterDashboard/FormField";
import { usePostJobForm } from "./usePostJobForm";
import { Label, ListBox, Select } from "@heroui/react";
import { Calendar, DateField, DatePicker } from "@heroui/react";
import { useState } from "react";


export default function PostJobPage() {
    const { data: session } = useSession();
    const router = useRouter();

    const JOB_CATEGORIES = [
        { id: "engineering", name: "Engineering" },
        { id: "design", name: "Design" },
        { id: "marketing", name: "Marketing" },
        { id: "sales", name: "Sales" },
        { id: "finance", name: "Finance" },
        { id: "hr", name: "HR" },
        { id: "operations", name: "Operations" },
        { id: "product", name: "Product" },
        { id: "data", name: "Data" },
        { id: "legal", name: "Legal" },
        { id: "other", name: "Other" },
    ];
    // Sets "engineering" as the default selected category
    const [jobCategory, setJobCategory] = useState("");
    // Finds the full object of the currently selected category
    const selectedJobCategory = JOB_CATEGORIES.find((c) => c.id === jobCategory);
    // console.log("Selected category object:", selectedJobCategory);



    const JOB_TYPES = [
        { id: "full-time", name: "Full-time" },
        { id: "part-time", name: "Part-time" },
        { id: "remote", name: "Remote" },
        { id: "contract", name: "Contract" },
        { id: "internship", name: "Internship" },
    ];// Sets "full-time" as the default selected job type
    const [jobType, setJobType] = useState("");

    // Finds the full object of the currently selected job type
    const selectedJobType = JOB_TYPES.find((t) => t.id === jobType);
    // console.log("Selected job type object:", selectedJobType);




    const CURRENCIES = [
        { id: "usd", name: "USD" },
        { id: "bdt", name: "BDT" },
        { id: "eur", name: "EUR" },
        { id: "gbp", name: "GBP" },
        { id: "cad", name: "CAD" },
        { id: "aud", name: "AUD" },
    ];
    // Sets "usd" as the default selected currency
    const [currency, setCurrency] = useState("");

    // Finds the full object of the currently selected currency
    const selectedCurrency = CURRENCIES.find((c) => c.id === currency);






    //  fetch real company from your API
    const company = { id: "abc123", name: "Niyog Inc.", industry: "Technology" };

    const {
        fields, errors, isRemote, setIsRemote,
        handleChange, handleSubmit, isSubmitting, setField
    } = usePostJobForm({ company, recruiter: session?.user });

    return (
        <div className="min-h-screen w-full bg-[#121212]">
            <div className="mx-auto max-w-3xl">

                {/* Page header */}
                <div className="mb-8">
                    <h1 className="text-[22px] font-semibold text-white">Post a New Job</h1>
                    <p className="mt-1 text-[13px] text-white/40">
                        Fill in the details to publish your listing on HireLoop.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">

                    {/* ── Job Info ── */}
                    <Section label="Job Info">
                        <div className="grid grid-cols-2 gap-4">
                            <InputCustom
                                label="Job Title"
                                placeholder="e.g. Senior Frontend Developer"
                                value={fields.title}
                                onChange={handleChange("title")}
                                error={errors.title}
                            />
                            {/* --category */}
                            <Select
                                className="w-full"
                                placeholder="Select Category"
                                value={jobCategory}
                                onChange={(value) => { setJobCategory(value); setField("category", value); }}
                            >
                                <Label className="text-white/40">Job Category</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox
                                        selectionMode="single"
                                    >
                                        {JOB_CATEGORIES.map((state) =>
                                            <ListBox.Item key={state.id} id={state.id} textValue={state.name}>
                                                {state.name}
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>
                                        )}
                                    </ListBox>

                                </Select.Popover>
                                {errors.category && <span className="text-[12px] text-red-400">{errors.category}</span>}
                            </Select>

                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            <Select
                                className="w-full"
                                placeholder="Select Job Type"
                                selectionMode="single"
                                value={jobType}
                                onChange={(value) => {
                                    setJobType(value)
                                    setField("type", value);
                                }}
                            >
                                <Label className="text-white/40">Job Type</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox selectionMode="single">
                                        {JOB_TYPES.map((state) =>
                                            <ListBox.Item key={state.id} id={state.id} textValue={state.name}>
                                                {state.name}
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>
                                        )}
                                    </ListBox>
                                </Select.Popover>
                                {errors.type && <span className="text-[12px] text-red-400">{errors.type}</span>}
                            </Select>

                            <DatePicker
                                className="w-full"
                                name="date"
                                onChange={(dateValue) => {
                                    if (!dateValue) return;
                                    const iso = `${dateValue.year}-${String(dateValue.month).padStart(2, "0")}-${String(dateValue.day).padStart(2, "0")}`;
                                    setField("deadline", iso);
                                }}

                            >
                                <Label className="text-white/40">Application Deadline</Label>
                                <DateField.Group fullWidth>
                                    <DateField.Input>{(segment) => <DateField.Segment segment={segment} />}</DateField.Input>
                                    <DateField.Suffix>
                                        <DatePicker.Trigger>
                                            <DatePicker.TriggerIndicator />
                                        </DatePicker.Trigger>
                                    </DateField.Suffix>
                                </DateField.Group>
                                <DatePicker.Popover>
                                    <Calendar aria-label="Application Deadline" >
                                        <Calendar.Header>
                                            <Calendar.YearPickerTrigger>
                                                <Calendar.YearPickerTriggerHeading />
                                                <Calendar.YearPickerTriggerIndicator />
                                            </Calendar.YearPickerTrigger>
                                            <Calendar.NavButton slot="previous" />
                                            <Calendar.NavButton slot="next" />
                                        </Calendar.Header>
                                        <Calendar.Grid>
                                            <Calendar.GridHeader>
                                                {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                                            </Calendar.GridHeader>
                                            <Calendar.GridBody>{(date) => <Calendar.Cell date={date} />}</Calendar.GridBody>
                                        </Calendar.Grid>
                                        <Calendar.YearPickerGrid>
                                            <Calendar.YearPickerGridBody>
                                                {({ year }) => <Calendar.YearPickerCell year={year} />}
                                            </Calendar.YearPickerGridBody>
                                        </Calendar.YearPickerGrid>
                                    </Calendar>
                                </DatePicker.Popover>
                                {errors.deadline && <span className="text-[12px] text-red-400">{errors.deadline}</span>}
                            </DatePicker>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <InputCustom
                                label="Min Salary"
                                type="number"
                                placeholder="e.g. 50000"
                                value={fields.salaryMin}
                                onChange={handleChange("salaryMin")}
                                error={errors.salaryMin}
                            />
                            <InputCustom
                                label="Max Salary"
                                type="number"
                                placeholder="e.g. 80000"
                                value={fields.salaryMax}
                                onChange={handleChange("salaryMax")}
                                error={errors.salaryMax}
                            />
                            <Select
                                className="w-full"
                                placeholder="Select Currency"
                                value={currency}
                                onChange={(value) => { setCurrency(value); setField("currency", value); }}
                            >

                                <Label className="text-white/40">Currency</Label>
                                <Select.Trigger>
                                    <Select.Value />
                                    <Select.Indicator />
                                </Select.Trigger>
                                <Select.Popover>
                                    <ListBox selectionMode="single">
                                        {CURRENCIES.map((c) =>
                                            <ListBox.Item key={c.id} id={c.id} textValue={c.name}>
                                                {c.name}
                                                <ListBox.ItemIndicator />
                                            </ListBox.Item>
                                        )}
                                    </ListBox>
                                </Select.Popover>
                                {errors.currency && <span className="text-[12px] text-red-400">{errors.currency}</span>}
                            </Select>

                        </div>

                        {/* Location */}
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center justify-between">
                                <span className="text-[12px] font-medium uppercase tracking-wider text-white/40">
                                    Location
                                </span>
                                <Toggle
                                    label="Remote position"
                                    checked={isRemote}
                                    onChange={setIsRemote}
                                />
                            </div>
                            {!isRemote && (
                                <div className="grid grid-cols-2 gap-4">
                                    <InputCustom
                                        placeholder="City"
                                        value={fields.city}
                                        onChange={handleChange("city")}
                                        error={errors.city}
                                    />
                                    <InputCustom
                                        placeholder="Country"
                                        value={fields.country}
                                        onChange={handleChange("country")}
                                        error={errors.country}
                                    />
                                </div>
                            )}
                        </div>
                    </Section>

                    {/* ── Job Description ── */}
                    <Section label="Job Description">
                        <Textarea
                            label="Responsibilities"
                            placeholder="List the key responsibilities for this role…"
                            rows={5}
                            value={fields.responsibilities}
                            onChange={handleChange("responsibilities")}
                            error={errors.responsibilities}
                        />
                        <Textarea
                            label="Requirements"
                            placeholder="Required skills, experience, qualifications…"
                            rows={5}
                            value={fields.requirements}
                            onChange={handleChange("requirements")}
                            error={errors.requirements}
                        />
                        <Textarea
                            label="Benefits (optional)"
                            placeholder="Health insurance, flexible hours, equity…"
                            rows={3}
                            value={fields.benefits}
                            onChange={handleChange("benefits")}
                        />
                    </Section>

                    {/* ── Company ── */}
                    <Section label="Company">
                        {company ? (
                            <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/4 px-4 py-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/8 text-[13px] font-bold text-white/60">
                                    {company.name?.charAt(0).toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[14px] font-medium text-white">{company.name}</p>
                                    <p className="text-[12px] text-white/40">{company.industry} · Auto-linked to this post</p>
                                </div>
                                <span className="ml-auto shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] text-emerald-400">
                                    Approved
                                </span>
                            </div>
                        ) : (
                            <div className="rounded-xl border border-amber-500/20 bg-amber-500/8 px-4 py-3 text-[13px] text-amber-400">
                                You need an approved company profile before posting a job.
                            </div>
                        )}
                    </Section>

                    {/* ── Actions ── */}
                    <div className="flex justify-end gap-3 pb-8">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="rounded-xl border border-white/10 bg-white/5 px-5 py-2.5 text-[14px] text-white/70 transition hover:bg-white/10 hover:text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={!company || isSubmitting}
                            className="rounded-xl bg-linear-to-r from-[#6f62ff] to-[#7a5cff] px-6 py-2.5 text-[14px] font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {isSubmitting ? "Posting…" : "Post Job"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

function Section({ label, children }) {
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#1a1a1a] p-6">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
                {label}
            </p>
            {children}
        </div>
    );
}