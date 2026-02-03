import { useMemo, useState } from "react";
import { router, usePage } from "@inertiajs/react"
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

export function CallCenterOne({ leadList, sources, paginateData, total }: { leadList: any[], sources: any[], paginateData?: any, total?: number }) {
    const data = leadList;

    //page links
    const { props } = usePage()

    const pageLinks = props.leads?.current_page || 1;

    const [search, setSearch] = useState("")
    const [selectedSource, setSelectedSource] = useState("all");

    const filteredLeads = useMemo(() => {
        if (!search && selectedSource === "all") {
            return data;
        }
        return data.filter(lead =>
            lead.name.toLowerCase().includes(search.toLowerCase())
            && (selectedSource === "all" || lead.source.name === selectedSource)
        );
    }, [data, search, selectedSource]);

    const goToPage = (page: number) => {
        router.get(
            "/leads/call-center",
            { page },
            {
                preserveState: true,
                preserveScroll: true,
            }
        )
    }


    return (
        <div className="">
            {/* Column 1: New Leads */}
            <Card className="flex flex-col">
                {/* Header */}
                <CardHeader className="">
                    <div className="flex items-center justify-between">
                        <CardTitle>New Leads</CardTitle>
                        <span className="text-sm text-muted-foreground">
                            Total: {total}
                        </span>
                    </div>
                    <div>
                        <Input placeholder="Search new leads..." value={search} onChange={(e) => setSearch(e.target.value)} />

                        <select className="mt-2 w-full border rounded-md p-2" onChange={(e) => {
                            const value = e.target.value;
                            if (value === "all") {
                                setSelectedSource("all");
                                setSearch("");
                            } else {
                                setSelectedSource(value);
                            }
                        }}>
                            <option value="all">All Leads</option>
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
                    {filteredLeads.map(lead => (
                        <div
                            key={lead.id}
                            className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                            <div className="flex flex-col">
                                <span className="text-sm">{lead.name}</span>
                                <span className="text-sm">{lead.phone}</span>
                            </div>
                            <Button size="sm" variant="outline">
                                View
                            </Button>
                        </div>
                    ))}
                </CardContent>

                {/* Pagination */}
                <div className="border-t px-6 py-3 flex items-center justify-between">
                    <Button onClick={() => goToPage(1)}>1</Button>
                    <span className="text-sm text-muted-foreground">
                        Page 1 of 20
                    </span>
                   <Button onClick={() => goToPage(2)}>2</Button>
                </div>
            </Card>

        </div>
    )
}
