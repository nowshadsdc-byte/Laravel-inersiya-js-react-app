import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";

export function CallCenterOne({ leadList }: { leadList: any[] }) {

         

    return (
        <div className="">
            {/* Column 1: New Leads */}
            <Card className="flex flex-col">
                {/* Header */}
                <CardHeader className="">
                    <div className="flex items-center justify-between">
                        <CardTitle>New Leads</CardTitle>
                        <span className="text-sm text-muted-foreground">
                            Total: 1248
                        </span>
                    </div>
                    <Input placeholder="Search new leads..." />
                </CardHeader>
                {/* Lead List */}
                <CardContent className="flex-1 overflow-y-auto space-y-1">
                    {leadList.map(lead => (
                        <div
                            key={lead.id}
                            className="flex items-center justify-between rounded-md border px-3 py-2"
                        >
                            <span className="text-sm">{lead.name}</span>
                            <Button size="sm" variant="outline">
                                View
                            </Button>
                        </div>
                    ))}
                </CardContent>

                {/* Pagination */}
                <div className="border-t px-6 py-3 flex items-center justify-between">
                    <Button size="sm" variant="outline">Previous</Button>
                    <span className="text-sm text-muted-foreground">
                        Page 1 of 25
                    </span>
                    <Button size="sm" variant="outline">Next</Button>
                </div>
            </Card>

        </div>
    )
}
