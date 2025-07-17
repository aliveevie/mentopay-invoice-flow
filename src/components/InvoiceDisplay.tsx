import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  Receipt, 
  Copy, 
  QrCode, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  ExternalLink,
  Share2
} from "lucide-react";
import { format } from "date-fns";
import QRCode from "qrcode";

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

interface InvoiceDisplayProps {
  invoice: InvoiceData;
  onPayment: (txHash: string) => void;
}

const CURRENCIES = [
  { value: "cUSD", label: "cUSD", description: "Celo Dollar" },
  { value: "cEUR", label: "cEUR", description: "Celo Euro" },
  { value: "cREAL", label: "cREAL", description: "Celo Real" },
];

const InvoiceDisplay = ({ invoice, onPayment }: InvoiceDisplayProps) => {
  const [paymentToken, setPaymentToken] = useState(invoice.currency);
  const [isPaymentPending, setIsPaymentPending] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const { toast } = useToast();
  const qrRef = useRef<HTMLCanvasElement>(null);

  const generateQRCode = async () => {
    const invoiceUrl = `${window.location.origin}/invoice/${invoice.id}`;
    try {
      const qrDataUrl = await QRCode.toDataURL(invoiceUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#262626',
          light: '#FFFFFF'
        }
      });
      setQrCodeUrl(qrDataUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  };

  const getStatusConfig = () => {
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

  const copyInvoiceLink = () => {
    const invoiceUrl = `${window.location.origin}/invoice/${invoice.id}`;
    navigator.clipboard.writeText(invoiceUrl);
    toast({
      title: "Link Copied!",
      description: "Invoice link has been copied to clipboard.",
    });
  };

  const shareInvoice = async () => {
    const invoiceUrl = `${window.location.origin}/invoice/${invoice.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Invoice ${invoice.id}`,
          text: `Payment request for ${invoice.totalAmount} ${invoice.currency}`,
          url: invoiceUrl,
        });
      } catch (error) {
        copyInvoiceLink();
      }
    } else {
      copyInvoiceLink();
    }
  };

  const handlePayment = async () => {
    setIsPaymentPending(true);
    
    // Simulate payment process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockTxHash = "0xabcd1234...efgh5678";
    onPayment(mockTxHash);
    setIsPaymentPending(false);
    
    toast({
      title: "Payment Successful!",
      description: `Transaction hash: ${mockTxHash}`,
    });
  };

  const statusConfig = getStatusConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
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
              <h3 className="text-sm font-medium text-muted-foreground mb-4">
                Invoice Items
              </h3>
              <div className="space-y-3">
                {invoice.items.map((item, index) => (
                  <div key={item.id} className="flex justify-between items-start p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                          #{index + 1}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{item.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-mono font-semibold">
                        {parseFloat(item.amount).toFixed(2)} {invoice.currency}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-1">
                Total Amount
              </h3>
              <p className="text-2xl font-bold font-mono">
                {invoice.totalAmount} {invoice.currency}
              </p>
            </div>

            {invoice.txHash && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Transaction Hash
                </h3>
                <div className="flex items-center gap-2">
                  <code className="px-2 py-1 bg-muted rounded text-sm font-mono">
                    {invoice.txHash}
                  </code>
                  <Button size="sm" variant="ghost">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

        </CardContent>
      </Card>

      {/* Sharing Options */}
      <Card className="shadow-card border-primary/10">
        <CardHeader>
          <CardTitle className="text-lg">Share Invoice</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Button onClick={copyInvoiceLink} variant="outline" className="flex-1">
              <Copy className="w-4 h-4" />
              Copy Link
            </Button>
            <Button onClick={shareInvoice} variant="outline" className="flex-1">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
            <Button onClick={generateQRCode} variant="outline" className="flex-1">
              <QrCode className="w-4 h-4" />
              QR Code
            </Button>
          </div>

          {qrCodeUrl && (
            <div className="flex justify-center p-4 bg-muted rounded-lg">
              <img src={qrCodeUrl} alt="Invoice QR Code" className="w-32 h-32" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InvoiceDisplay;