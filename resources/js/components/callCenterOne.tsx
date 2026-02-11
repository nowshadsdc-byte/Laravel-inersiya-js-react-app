import { useMemo, useState, useEffect } from "react";
import { router, usePage } from "@inertiajs/react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { LeadViewDialog } from "./LeadViewDialog";
import { CallNow } from "./CallNow";

type Source = {
    id: number | string;
    name: string;
};

type Lead = {
    id: number | string;
    name: string;
    phone?: string;
    source: Source;
};

interface CallCenterOneProps {
    leadList: Lead[];
    sources: Source[];
    total: number;
}

export function CallCenterOne({ leadList, sources, total }: CallCenterOneProps) {
    const data = leadList;

    //dailog 

    const [open, setOpen] = useState(false)
    const [selectedLead, setSelectedLead] = useState<any>(null)

    //callNow
    const [callOpen,setCallOpen] =useState(false)
    const [selectCall , setCallNow] =useState<Lead | null>(null)


    // Inertia pagination data
    const { props } = usePage<{ leads?: { current_page?: number; last_page?: number } }>();

    const pagination = props.leads as { current_page?: number; last_page?: number } | undefined;

    const currentPage = pagination?.current_page || 1;
    const totalPages = pagination?.last_page || 1;

    // Filters
    const [search, setSearch] = useState("");
    const [selectedSource, setSelectedSource] = useState("all");

    // Filtered data (frontend)
    const filteredLeads = useMemo(() => {
        return data.filter((lead) => {
            const matchSearch = lead.name
                .toLowerCase()
                .includes(search.toLowerCase());

            const matchSource =
                selectedSource === "all" ||
                lead.source.name === selectedSource;

            return matchSearch && matchSource;
        });
    }, [data, search, selectedSource]);

    // Pagination navigation
    const goToPage = (page: number) => {
        router.get(
            "/leads/call-center",
            {
                page,
                search,
                source: selectedSource !== "all" ? selectedSource : null,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };
    useEffect(() => {
        goToPage(1);
    }, [search, selectedSource]);

    // Page numbers
    const pages = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }, [totalPages]);

    return (
        <div className="h-[150vh] ">
            <LeadViewDialog
                open={open}
                onOpenChange={setOpen}
                lead={selectedLead}
            />

            <CallNow open={callOpen} onOpenChange={setCallOpen} lead={selectCall}/>
            <Card className="h-[150vh] flex flex-col">
                {/* Header */}
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>New Leads</CardTitle>
                        <span className="text-sm text-muted-foreground">
                            Total: {total}
                        </span>
                    </div>

                    <div className="space-y-2">
                        <Input
                            placeholder="Search new leads..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />

                        <select
                            className="w-full border rounded-md p-2"
                            value={selectedSource}
                            onChange={(e) => setSelectedSource(e.target.value)}
                        >
                            <option value="all">Lead Source</option>
                            {sources.map((source) => (
                                <option key={source.id} value={source.name}>
                                    {source.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardHeader>

                {/* Lead List */}
                <CardContent className="flex-1 overflow-y-auto space-y-1">
                    {filteredLeads.map((lead) => (
                        <div
                            key={lead.id}
                            className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm">{lead.name}</span>
                                <span className="text-sm">{lead.phone}</span>
                            </div>
                           <div className="">
                             <Button className="mx-2" size="sm" variant="outline" onClick={() => {
                                setSelectedLead(lead)
                                setOpen(true)
                            }}>
                                View
                            </Button>
                             <Button size="sm" variant="outline" onClick={() => {
                                setCallNow(lead)
                                setCallOpen(true)
                            }}>
                                Call Now
                            </Button>
                           </div>
                        </div>
                    ))}
                </CardContent>

                {/* Pagination */}
                <div className="border-t px-6 py-3 flex items-center justify-between">
                    <div className="flex gap-2 flex-wrap">
                        {pages.map((page) => (
                            <Button
                                key={page}
                                size="sm"
                                variant={
                                    page === currentPage
                                        ? "default"
                                        : "outline"
                                }
                                onClick={() => goToPage(page)}
                            >
                                {page}
                            </Button>
                        ))}
                    </div>

                    <span className="text-sm text-muted-foreground">
                        Page {currentPage} of {totalPages}
                    </span>
                </div>
            </Card>
        </div>
    );
}
