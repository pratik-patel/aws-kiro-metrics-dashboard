import * as React from "react";
import Layout from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DataDictionary() {
  return (
    <Layout>
      <div className="space-y-6 pb-20">
        <div>
          <h1 className="text-3xl font-display font-bold tracking-tight text-foreground">Data Dictionary</h1>
          <p className="text-muted-foreground mt-2">Definition of metrics, field mappings for migration, and data types.</p>
        </div>

        <Tabs defaultValue="public" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="public">Public Markets</TabsTrigger>
            <TabsTrigger value="private">Private Credit</TabsTrigger>
            <TabsTrigger value="migration">Migration Map</TabsTrigger>
          </TabsList>
          
          <TabsContent value="public" className="mt-6">
             <Card>
               <CardHeader><CardTitle>Public Markets Data Fields</CardTitle></CardHeader>
               <CardContent>
                 <Table>
                    <TableHeader>
                       <TableRow>
                          <TableHead>Field Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Source</TableHead>
                          <TableHead>Description</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       <TableRow>
                          <TableCell className="font-mono">ticker_symbol</TableCell>
                          <TableCell><Badge variant="outline">String</Badge></TableCell>
                          <TableCell>Exchange Feed</TableCell>
                          <TableCell>Standard exchange ticker (e.g. AAPL)</TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="font-mono">last_price</TableCell>
                          <TableCell><Badge variant="outline">Float</Badge></TableCell>
                          <TableCell>Exchange Feed</TableCell>
                          <TableCell>Real-time last traded price</TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="font-mono">yield_ytm</TableCell>
                          <TableCell><Badge variant="outline">Float</Badge></TableCell>
                          <TableCell>Bond Calculator</TableCell>
                          <TableCell>Yield to Maturity for Fixed Income assets</TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="private" className="mt-6">
            <Card>
               <CardHeader><CardTitle>Private Credit Metrics</CardTitle></CardHeader>
               <CardContent>
                 <Table>
                    <TableHeader>
                       <TableRow>
                          <TableHead>Field Name</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Calculation</TableHead>
                          <TableHead>Update Freq</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       <TableRow>
                          <TableCell className="font-mono">commitment_amt</TableCell>
                          <TableCell><Badge variant="outline">Currency</Badge></TableCell>
                          <TableCell>Static</TableCell>
                          <TableCell>Quarterly</TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="font-mono">nav_drawn</TableCell>
                          <TableCell><Badge variant="outline">Currency</Badge></TableCell>
                          <TableCell>Sum(Capital Calls)</TableCell>
                          <TableCell>Monthly</TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="font-mono">vintage_year</TableCell>
                          <TableCell><Badge variant="outline">Int</Badge></TableCell>
                          <TableCell>Fund Inception</TableCell>
                          <TableCell>Static</TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="font-mono">irr_net</TableCell>
                          <TableCell><Badge variant="outline">Percent</Badge></TableCell>
                          <TableCell>XIRR(CashFlows)</TableCell>
                          <TableCell>Quarterly</TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
               </CardContent>
             </Card>
          </TabsContent>

          <TabsContent value="migration" className="mt-6">
             <Card>
               <CardHeader><CardTitle>Migration Dataset Mapping</CardTitle></CardHeader>
               <CardContent>
                 <Table>
                    <TableHeader>
                       <TableRow>
                          <TableHead>Legacy Field (Mainframe)</TableHead>
                          <TableHead>New Field (Cloud)</TableHead>
                          <TableHead>Transformation Note</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       <TableRow>
                          <TableCell className="font-mono text-muted-foreground">TRD_ID_X</TableCell>
                          <TableCell className="font-mono text-primary">trade_uuid</TableCell>
                          <TableCell>Converted to UUID v4 standard</TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="font-mono text-muted-foreground">ASSET_CL_CODE</TableCell>
                          <TableCell className="font-mono text-primary">asset_class_enum</TableCell>
                          <TableCell>Mapped to normalized ENUM list</TableCell>
                       </TableRow>
                       <TableRow>
                          <TableCell className="font-mono text-muted-foreground">SETTLE_DT_STR</TableCell>
                          <TableCell className="font-mono text-primary">settlement_timestamp</TableCell>
                          <TableCell>Parsed to ISO 8601 UTC</TableCell>
                       </TableRow>
                    </TableBody>
                 </Table>
               </CardContent>
             </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
