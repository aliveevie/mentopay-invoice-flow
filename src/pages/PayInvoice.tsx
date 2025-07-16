import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Receipt, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ArrowLeft,
  Plus
} from "lucide-react";
import { format } from "date-fns";

interface InvoiceData {
  id: string;
  description: string;
  amount: string;
  currency: string;
  dueDate: Date | undefined;
  createdAt: Date;
  status: "pending" | "paid" | "overdue";
  txHash?: string;
}

const CURRENCIES = [
  { value: "cUSD", label: "cUSD", description: "Celo Dollar" },
  { value: "cEUR", label: "cEUR", description: "Celo Euro" },
  { value: "cREAL", label: "cREAL", description: "Celo Real" },
];

// Mock invoice data - In real app, this would come from a database
const MOCK_INVOICES: Record<string, InvoiceData> = {
  "INV-001": {
    id: "INV-001",
    description: "Web development services for Q4 2024",
    amount: "1500.00",
    currency: "cUSD",
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
    status: "pending"
  }
};

const PayInvoice = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [invoice, setInvoice] = useState<InvoiceData | null>(null);
  const [paymentToken, setPaymentToken] = useState("");
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [txHash, setTxHash] = useState("");

  useEffect(() => {
    if (invoiceId && MOCK_INVOICES[invoiceId]) {
      const invoiceData = MOCK_INVOICES[invoiceId];
      setInvoice(invoiceData);
      setPaymentToken(invoiceData.currency);
    }
  }, [invoiceId]);

  const getStatusConfig = () => {
    if (!invoice) return { icon: Clock, color: "bg-primary", text: "Pending", variant: "secondary" as const };
    
    switch (invoice.status) {
      case "paid":
        return {
          icon: CheckCircle,
          color: "bg-web3-success",
          text: "Paid",
          variant: "default" as const
        };
      case "overdue":
        return {
          icon: AlertTriangle,
          color: "bg-web3-warning",
          text: "Overdue",
          variant: "destructive" as const
        };
      default:
        return {
          icon: Clock,
          color: "bg-primary",
          text: "Pending",
          variant: "secondary" as const
        };
    }
  };

  const handlePayment = async () => {
    setIsPaymentPending(true);
    
    // Simulate payment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockTxHash = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`;
    setTxHash(mockTxHash);
    
    if (invoice) {
      const updatedInvoice = { 
        ...invoice, 
        status: "paid" as const, 
        txHash: mockTxHash 
      };
      setInvoice(updatedInvoice);
      MOCK_INVOICES[invoice.id] = updatedInvoice;
    }
    
    setIsPaymentPending(false);
    setShowSuccessDialog(true);
  };

  const handleCreateNewInvoice = () => {
    navigate("/");
    setShowSuccessDialog(false);
  };

  if (!invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-12 text-center">
            <AlertTriangle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Invoice Not Found</h3>
            <p className="text-muted-foreground mb-4">
              The invoice you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/")} variant="outline">
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-primary/10 bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-3">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-primary rounded-lg">
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                  MentoPay
                </h1>
                <p className="text-sm text-muted-foreground">
                  Pay Invoice
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="w-full max-w-2xl mx-auto">
          <Card className="shadow-card border-primary/10">
            <CardHeader className="bg-gradient-card rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Receipt className="w-6 h-6 text-primary" />
                  <div>
                    <CardTitle className="text-xl font-bold">
                      Invoice {invoice.id}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Created {format(invoice.createdAt, "PPP")}
                    </p>
                  </div>
                </div>
                <Badge variant={statusConfig.variant} className="gap-1">
                  <StatusIcon className="w-3 h-3" />
                  {statusConfig.text}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-2">
                    Payment Description
                  </h3>
                  <p className="text-foreground">{invoice.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Amount
                    </h3>
                    <p className="text-2xl font-bold font-mono">
                      {invoice.amount} {invoice.currency}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-1">
                      Due Date
                    </h3>
                    <p className="text-foreground">
                      {invoice.dueDate ? format(invoice.dueDate, "PPP") : "No due date"}
                    </p>
                  </div>
                </div>

                {invoice.txHash && (
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">
                      Transaction Hash
                    </h3>
                    <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                      {invoice.txHash}
                    </code>
                  </div>
                )}
              </div>

              {invoice.status === "pending" && (
                <div className="space-y-4 pt-4 border-t">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">
                      Payment Token
                    </Label>
                    <Select value={paymentToken} onValueChange={setPaymentToken}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map((curr) => (
                          <SelectItem key={curr.value} value={curr.value}>
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{curr.label}</span>
                              <span className="text-xs text-muted-foreground">
                                {curr.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    onClick={handlePayment}
                    disabled={isPaymentPending}
                    variant="success"
                    className="w-full h-12 text-base font-semibold"
                  >
                    {isPaymentPending ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Processing Payment...
                      </div>
                    ) : (
                      `Pay ${invoice.amount} ${paymentToken}`
                    )}
                  </Button>
                </div>
              )}

              {invoice.status === "paid" && (
                <div className="p-4 bg-web3-success/10 rounded-lg border border-web3-success/20">
                  <div className="flex items-center gap-2 text-web3-success">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Payment Completed Successfully!</span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-web3-success/20 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-6 h-6 text-web3-success" />
            </div>
            <DialogTitle className="text-xl">Payment Successful!</DialogTitle>
            <DialogDescription className="text-center">
              Your payment has been processed successfully.
              <br />
              <span className="font-mono text-sm">Transaction: {txHash}</span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3 mt-6">
            <Button onClick={handleCreateNewInvoice} variant="web3" className="gap-2">
              <Plus className="w-4 h-4" />
              Create Another Invoice
            </Button>
            <Button 
              onClick={() => setShowSuccessDialog(false)} 
              variant="outline"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PayInvoice;