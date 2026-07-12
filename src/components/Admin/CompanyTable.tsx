"use client";

import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import {
    getAllCompanies,
    updateCompanyStatus,
    deleteCompany,
    type Company,
} from "@/lib/api/company";

export function CompanyTable() {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
    const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

    async function loadCompanies() {
        setIsLoading(true);
        setError("");
        const result = await getAllCompanies();
        if (result.success && result.data) {
            setCompanies(result.data);
        } else {
            setError(result.message);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        loadCompanies();
    }, []);



    async function handleStatusChange(companyId: string, status: "approved" | "declined") {
        setActionLoadingId(companyId);
        const result = await updateCompanyStatus(companyId, status);
        if (result.success) {
            setCompanies((prev) =>
                prev.map((c) => (c._id === companyId ? { ...c, status } : c))
            );
        } else {
            setError(result.message);
        }
        setActionLoadingId(null);
    }

    async function handleDelete(companyId: string,) {
        const confirmed = window.confirm("Delete this company? This cannot be undone.");
        if (!confirmed) return;

        setActionLoadingId(companyId);
        const result = await deleteCompany(companyId);
        if (result.success) {
            setCompanies((prev) => prev.filter((c) => c._id !== companyId));
        } else {
            setError(result.message);
        }
        setActionLoadingId(null);
    }

    if (isLoading) {
        return <p className="text-white/60 text-sm">Loading companies...</p>;
    }

    if (error) {
        return (
            <div className="rounded-md border border-[#ff7b8d]/25 bg-[#ff7b8d]/10 px-4 py-3 text-sm text-[#ff9aaa]">
                {error}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto rounded-lg border border-white/10">
            <table className="w-full text-left text-sm text-white">
                <thead className="bg-white/5 text-white/60 uppercase text-xs">
                    <tr>
                        <th className="px-4 py-3">Company</th>
                        <th className="px-4 py-3">Industry</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {companies.length === 0 ? (
                        <tr>
                            <td colSpan={5} className="px-4 py-6 text-center text-white/40">
                                No companies found.
                            </td>
                        </tr>
                    ) : (
                        companies.map((company) => (
                            <tr key={company._id} className="border-t border-white/10">
                                <td className="px-4 py-3 font-medium">{company.name}</td>
                                <td className="px-4 py-3 text-white/70">{company.industry}</td>
                                <td className="px-4 py-3 text-white/70">{company.location}</td>
                                <td className="px-4 py-3">
                                    <span
                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${company.status === "approved"
                                                ? "bg-[#66e0a3]/15 text-[#8ff0bd]"
                                                : company.status === "declined"
                                                    ? "bg-[#ff7b8d]/15 text-[#ff9aaa]"
                                                    : "bg-white/10 text-white/60"
                                            }`}
                                    >
                                        {company.status ?? "pending"}
                                    </span>
                                </td>
                                <td className="px-4 py-3">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="secondary"
                                            onClick={() => setSelectedCompany(company)}
                                        >
                                            Details
                                        </Button>
                                        <Button
                                            variant="primary"
                                            isDisabled={actionLoadingId === company._id || company.status === "approved"}
                                            onClick={() => handleStatusChange(company._id, "approved")}
                                        >
                                            Approve
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            isDisabled={actionLoadingId === company._id || company.status === "declined"}
                                            onClick={() => handleStatusChange(company._id, "declined")}
                                        >
                                            Decline
                                        </Button>
                                        <Button
                                            variant="danger"
                                            isDisabled={actionLoadingId === company._id}
                                            onClick={() => handleDelete(company._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>

            {selectedCompany && (
                <CompanyDetailsModal
                    company={selectedCompany}
                    onClose={() => setSelectedCompany(null)}
                />
            )}
        </div>
    );
}

function CompanyDetailsModal({
    company,
    onClose,
}: {
    company: Company;
    onClose: () => void;
}) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
            <div className="w-full max-w-lg rounded-lg border border-white/10 bg-[#111111] p-6 text-white">
                <h2 className="text-xl font-semibold">{company.name}</h2>
                <p className="mt-1 text-sm text-white/50">{company.industry}</p>

                <dl className="mt-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                        <dt className="text-white/50">Website</dt>
                        <dd>{company.website}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-white/50">Location</dt>
                        <dd>{company.location}</dd>
                    </div>
                    <div className="flex justify-between">
                        <dt className="text-white/50">Employees</dt>
                        <dd>{company.employeeRange}</dd>
                    </div>
                </dl>

                <p className="mt-4 text-sm leading-6 text-white/70">{company.description}</p>

                <Button variant="secondary" className="mt-6 w-full" onClick={onClose}>
                    Close
                </Button>
            </div>
        </div>
    );
}