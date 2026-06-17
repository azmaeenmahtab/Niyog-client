"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";

const JOB_TYPES = ["Full-time", "Contract", "Freelance", "Internship"];
const LOCATIONS = ["Remote", "On-site"];



export default function Filter() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [jobType, setJobType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [salary, setSalary] = useState<number>(0);
  const [keyword, setKeyword] = useState<string>("");
  const [place, setPlace] = useState<string>("");

  const clear = () => {
    console.log("[Filter] clear() called — resetting state and navigating to /jobs");
    setJobType("");
    setLocation("");
    setSalary(0);
    setKeyword("");
    setPlace("");
    router.replace("/jobs");
  };

  const apply = useCallback(
    (next: {
      type?: string;
      location?: string;
      salary?: number;
      keyword?: string;
      place?: string;
    }) => {
      console.log("[Filter] apply() called with next:", next);
      console.log("[Filter] current state — jobType:", jobType, "location:", location, "salary:", salary, "keyword:", keyword, "place:", place);
      const params = new URLSearchParams(searchParams.toString());
      const typeVal = next.type ?? jobType;
      const loc = next.location ?? location;
      const sal = next.salary ?? salary;
      const keywordVal = next.keyword ?? keyword;
      const placeVal = next.place ?? place;

      console.log("[Filter] resolved values — type:", typeVal, "loc:", loc, "sal:", sal, "keyword:", keywordVal, "place:", placeVal);

      if (typeVal) params.set("type", typeVal);
      else params.delete("type");
      if (loc) params.set("location", loc);
      else params.delete("location");
      if (sal > 0) params.set("salary", String(sal));
      else params.delete("salary");
      if (keywordVal) params.set("keyword", keywordVal);
      else params.delete("keyword");
      if (placeVal) params.set("place", placeVal);
      else params.delete("place");

      const qs = params.toString();
      console.log("[Filter] navigating to /jobs?", qs);
      router.replace(`/jobs${qs ? `?${qs}` : ""}`);
    },
    [router, searchParams, jobType, location, salary, keyword, place],
  );

  const setType = (t: string) => {
    setJobType(t);
  };

  const setLoc = (l: string) => {
    setLocation(l);
  };



  const handleApplyFilter = () => {

  }

  return (
    <aside className="flex w-full flex-col gap-8">
      <div>
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/60">
          Search
        </h3>
        <form
          onSubmit={(e) => e.preventDefault()}
          className="flex flex-col gap-2.5"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => {
              const v = e.target.value;
              setKeyword(v);
             }}
            placeholder="Job title or keyword"
            className="w-full rounded-xl border border-[#1a1a1a]/10 bg-white/70 px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:ring-2 focus:ring-[#e2613a]/30"
          />
          <input
            type="text"
            value={place}
            onChange={(e) => {
              const v = e.target.value;
              setPlace(v);
             }}
            placeholder="Location"
            className="w-full rounded-xl border border-[#1a1a1a]/10 bg-white/70 px-4 py-2.5 text-[14px] text-[#1a1a1a] placeholder:text-[#1a1a1a]/40 focus:outline-none focus:ring-2 focus:ring-[#e2613a]/30"
          />
        </form>
      </div>

      <div>
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/60">
          Job Type
        </h3>
        <div className="flex flex-col gap-2.5">
          <label
            key="none-type"
            className="flex cursor-pointer items-center gap-3 text-[14px] text-[#1a1a1a]/80"
          >
            <input
              type="radio"
              name="jobType"
              checked={jobType === ""}
              onChange={() => setType("")}
              className="h-4 w-4 accent-[#e2613a]"
            />
            None
          </label>
          {JOB_TYPES.map((t) => (
            <label
              key={t}
              className="flex cursor-pointer items-center gap-3 text-[14px] text-[#1a1a1a]/80"
            >
              <input
                type="radio"
                name="jobType"
                checked={jobType === t}
                onChange={() => setType(t)}
                className="h-4 w-4 accent-[#e2613a]"
              />
              {t}
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/60">
          Minimum Salary
        </h3>
        <div className="flex items-center justify-between text-[12px] text-[#1a1a1a]/60">
          <span>$0</span>
          <span className="rounded-full border border-[#1a1a1a]/15 bg-white/60 px-2.5 py-0.5 font-semibold text-[#1a1a1a]/80">
            ${salary}+/hr
          </span>
          <span>$500/hr</span>
        </div>
        <input
          type="range"
          min={0}
          max={500}
          value={salary}
          onChange={(e) => {
            const v = Number(e.target.value);
            setSalary(v);
           }}
          className="mt-3 w-full accent-[#e2613a]"
        />
      </div>

      <div>
        <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#1a1a1a]/60">
          Location
        </h3>
        <div className="flex flex-col gap-2.5">
          <label
            key="none-location"
            className="flex cursor-pointer items-center gap-3 text-[14px] text-[#1a1a1a]/80"
          >
            <input
              type="radio"
              name="location"
              checked={location === ""}
              onChange={() => setLoc("")}
              className="h-4 w-4 accent-[#e2613a]"
            />
            None
          </label>
          {LOCATIONS.map((l) => (
            <label
              key={l}
              className="flex cursor-pointer items-center gap-3 text-[14px] text-[#1a1a1a]/80"
            >
              <input
                type="radio"
                name="location"
                checked={location === l}
                onChange={() => setLoc(l)}
                className="h-4 w-4 accent-[#e2613a]"
              />
              {l}
            </label>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={() => apply({})}
        className="w-full rounded-xl border border-[#1a1a1a]/15 bg-white/60 py-2 text-[13px] font-semibold text-[#1a1a1a]/60 transition hover:bg-white hover:text-[#1a1a1a]/80"
      >
        Apply Filters
      </button>
      <button
        type="button"
        onClick={clear}
        className="w-full rounded-xl border border-[#1a1a1a]/15 bg-white/60 py-2 text-[13px] font-semibold text-[#1a1a1a]/60 transition hover:bg-white hover:text-[#1a1a1a]/80"
      >
        Clear Filters
      </button>

      <div className="rounded-2xl border border-[#1a1a1a]/10 bg-[#e2613a] p-5 text-white">
        <p className="font-serif text-[22px] italic leading-tight">
          Hiring talented designers?
        </p>
        <button
          type="button"
          onClick={() => router.push("/dashboard/recruiter/jobs/new")}
          className="mt-4 rounded-lg bg-[#1a1a1a] px-4 py-2 text-[13px] font-semibold transition hover:bg-black"
        >
          Post a Job
        </button>
      </div>
    </aside>
  );
}
