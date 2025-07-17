import { useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import InvoiceGenerator from "@/components/InvoiceGenerator";
import InvoiceDisplay from "@/components/InvoiceDisplay";
import { MOCK_INVOICES } from "@/pages/PayInvoice";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Receipt, TrendingUp, Clock, CheckCircle } from "lucide-react";

interface InvoiceItem {
  id: string;
  description: string;
  amount: string;
}

interface InvoiceData {
  id: string;
  items: InvoiceItem[];
  currency: string;
  totalAmount: string;
  createdAt: Date;
  status: "pending" | "paid" | "overdue";
  txHash?: string;
}

const Index = () => {
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData | null>(null);
  const [invoiceHistory, setInvoiceHistory] = useState<InvoiceData[]>([]);

  const handleInvoiceGenerated = (invoice: InvoiceData) => {
    // Store invoice in shared mock data so share links work
    MOCK_INVOICES[invoice.id] = invoice;
    setCurrentInvoice(invoice);
    setInvoiceHistory(prev => [invoice, ...prev]);
    // Auto-switch to invoice tab to show sharing options
    const tabsTrigger = document.querySelector('[value="invoice"]') as HTMLButtonElement;
    if (tabsTrigger) {
      tabsTrigger.click();
    }
  };

  const handlePayment = (txHash: string) => {
    if (currentInvoice) {
      const updatedInvoice = { ...currentInvoice, status: "paid" as const, txHash };
      setCurrentInvoice(updatedInvoice);
      setInvoiceHistory(prev => 
        prev.map(inv => inv.id === currentInvoice.id ? updatedInvoice : inv)
      );
    }
  };

  const stats = {
    total: invoiceHistory.length,
    paid: invoiceHistory.filter(inv => inv.status === "paid").length,
    pending: invoiceHistory.filter(inv => inv.status === "pending").length,
    totalAmount: invoiceHistory
      .filter(inv => inv.status === "paid")
      .reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0)
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  MentoPay
                </h1>
                <p className="text-sm text-muted-foreground">
                  Decentralized Invoice Management
                </p>
              </div>
            </div>
            <WalletConnect />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <Tabs defaultValue="generate" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px] mx-auto">
            <TabsTrigger value="generate">Generate</TabsTrigger>
            <TabsTrigger value="invoice">Invoice</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="generate" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Create New Invoice</h2>
              <p className="text-muted-foreground">
                Generate a professional invoice with Mento stablecoins
              </p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <Card className="shadow-card border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Invoices</p>
                      <p className="text-2xl font-bold">{stats.total}</p>
                    </div>
                    <Receipt className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="shadow-card border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Paid</p>
                      <p className="text-2xl font-bold text-web3-success">{stats.paid}</p>
                    </div>
                    <CheckCircle className="w-8 h-8 text-web3-success" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Pending</p>
                      <p className="text-2xl font-bold text-web3-warning">{stats.pending}</p>
                    </div>
                    <Clock className="w-8 h-8 text-web3-warning" />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-card border-primary/10">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Earned</p>
                      <p className="text-2xl font-bold">{stats.totalAmount.toFixed(2)}</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <InvoiceGenerator onInvoiceGenerated={handleInvoiceGenerated} />
          </TabsContent>

          <TabsContent value="invoice" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Current Invoice</h2>
              <p className="text-muted-foreground">
                View and manage your generated invoice
              </p>
            </div>

            {currentInvoice ? (
              <InvoiceDisplay 
                invoice={currentInvoice} 
                onPayment={handlePayment} 
              />
            ) : (
              <Card className="shadow-card border-primary/10">
                <CardContent className="p-12 text-center">
                  <Receipt className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Invoice Generated</h3>
                  <p className="text-muted-foreground">
                    Create your first invoice to get started
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold">Invoice History</h2>
              <p className="text-muted-foreground">
                Track all your invoice payments and requests
              </p>
            </div>

            {invoiceHistory.length > 0 ? (
              <div className="space-y-4">
                {invoiceHistory.map((invoice) => (
                  <Card key={invoice.id} className="shadow-card border-primary/10">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Receipt className="w-8 h-8 text-primary" />
                          <div>
                            <h3 className="font-semibold">{invoice.id}</h3>
                            <p className="text-sm text-muted-foreground">
                              {invoice.items.length} item{invoice.items.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold font-mono">
                            {invoice.totalAmount} {invoice.currency}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            {invoice.status === "paid" && (
                              <CheckCircle className="w-4 h-4 text-web3-success" />
                            )}
                            {invoice.status === "pending" && (
                              <Clock className="w-4 h-4 text-web3-warning" />
                            )}
                            <span className="text-sm capitalize">{invoice.status}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="shadow-card border-primary/10">
                <CardContent className="p-12 text-center">
                  <Clock className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Invoice History</h3>
                  <p className="text-muted-foreground">
                    Your invoice history will appear here once you start creating invoices
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Index;
