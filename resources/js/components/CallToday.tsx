import { router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { useEffect, useMemo, useState } from "react";
import { LeadViewDialog } from "./LeadViewDialog";

type Lead = {
    id: string | number;
    name: string;
    created_at?: string; // or follow_up_date
    profile?: {
        interest?: string;
    };
    notes?: {
        note: string;
    }[];
};

export default function CallToday({ leadsdata }: { leadsdata?: Lead[] }) {
    const [open, setOpen] = useState(false)
    const [selectedLead, setSelectedLead] = useState<any>(null)

    const data = leadsdata || [];

    // Inertia pagination
    const { props } = usePage<{
        leads?: { current_page: number; last_page: number };
    }>();

    const pagination = props.leads;
    const currentPage = pagination?.current_page ?? 1;
    const totalPages = pagination?.last_page ?? 1;

    // Filters
    const [search, setSearch] = useState("");
    const [selectedDate, setSelectedDate] = useState("");

    // Filter + sort (recent first)
    const filteredLeads = useMemo(() => {
        return data
            .filter((lead) => {
                const matchSearch = lead.name
                    .toLowerCase()
                    .includes(search.toLowerCase());

                const matchDate = selectedDate
                    ? lead.created_at?.startsWith(selectedDate)
                    : true;

                return matchSearch && matchDate;
            })
            .sort((a, b) => {
                const dateA = new Date(a.created_at || 0).getTime();
                const dateB = new Date(b.created_at || 0).getTime();
                return dateB - dateA; // recent first
            });
    }, [data, search, selectedDate]);

    // Pagination navigation
    const goToPage = (page: number) => {
        router.get(
            "/leads/call-center",
            {
                page,
                search,
                date: selectedDate,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    // Reset to page 1 when filters change
    useEffect(() => {
        goToPage(1);
    }, [search, selectedDate]);

    const formatDate = (date?: string) => {
        if (!date) return "—";
        return new Date(date).toLocaleString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
        });
    };

    return (
        <>
            <LeadViewDialog
                open={open}
                onOpenChange={setOpen}
                lead={selectedLead}
            />
            <Card className="h-[150vh] flex flex-col">
                <CardHeader>
                    <CardTitle>Follow-up scheduled today</CardTitle>

                    <div className="flex gap-2">
                        <Input
                            placeholder="Search leads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <Input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                        />
                    </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto space-y-3">
                    {filteredLeads.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No leads found
                        </p>
                    )}

                    {filteredLeads.map((lead) => (
                        <div key={lead.id} className="rounded-lg border p-3">
                            <div className="flex justify-between items-center">
                                <p className="font-medium">{lead.name}</p>
                                <Button
                                    onClick={() => {
                                        setSelectedLead(lead)
                                        setOpen(true)
                                    }}
                                >
                                    Edit
                                </Button>
                            </div>

                            <p className="text-sm">
                                Interest: {lead.profile?.interest ?? "—"}
                            </p>

                            <p className="text-xs text-muted-foreground">
                                {lead.notes?.[0]?.note ?? "No notes available"}
                            </p>

                            {lead.created_at && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Date:  {formatDate(lead.created_at)}
                                </p>
                            )}
                        </div>
                    ))}
                </CardContent>

                {/* Pagination */}
                <div className="flex justify-center gap-2 p-3 border-t">
                    <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === 1}
                        onClick={() => goToPage(currentPage - 1)}
                    >
                        Prev
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (page) => (
                            <Button
                                key={page}
                                size="sm"
                                variant={page === currentPage ? "default" : "outline"}
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </Button>
                        )
                    )}

                    <Button
                        size="sm"
                        variant="outline"
                        disabled={currentPage === totalPages}
                        onClick={() => goToPage(currentPage + 1)}
                    >
                        Next
                    </Button>
                </div>
            </Card>
        </>
    );
}