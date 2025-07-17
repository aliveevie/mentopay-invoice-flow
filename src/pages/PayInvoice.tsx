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
import { getInvoiceFromStorage, saveInvoiceToStorage } from "@/lib/utils";
import WalletConnect from "@/components/WalletConnect";
import { useAccount } from "wagmi";
import { createPublicClient, http, formatUnits } from "viem";

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
  network?: "mainnet" | "alfajores";
}

const CURRENCIES = [
  { value: "cUSD", label: "cUSD", description: "Celo Dollar" },
  { value: "cEUR", label: "cEUR", description: "Celo Euro" },
  { value: "cREAL", label: "cREAL", description: "Celo Real" },
];

const TOKEN_ADDRESSES: Record<string, { mainnet: string; alfajores: string }> = {
  cUSD: {
    mainnet: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
    alfajores: "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1",
  },
  cEUR: {
    mainnet: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
    alfajores: "0x10c892A6EC43a53E45D0B916B4b7D383B1b78C0F",
  },
  cREAL: {
    mainnet: "0xE4D517785D091D3c54818832dB6094bcc2744545",
    alfajores: "0xE4D517785D091D3c54818832dB6094bcc2744545", // same as mainnet
  },
  cNGN: {
    mainnet: "0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3", // placeholder
    alfajores: "0x4a5b03B8b16122D330306c65e4CA4BC5Dd6511d0", // placeholder
  },
  cGHS: {
    mainnet: "0x3A0c0B9aB6bC4b6bA2e6eB1e6eB1e6eB1e6eB1e6", // placeholder
    alfajores: "0x3A0c0B9aB6bC4b6bA2e6eB1e6eB1e6eB1e6eB1e6", // placeholder
  },
};

const CHAIN_IDS = { mainnet: 42220, alfajores: 44787 };

const RPC_URLS = {
  mainnet: "https://forno.celo.org",
  alfajores: "https://alfajores-forno.celo-testnet.org",
};

const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
  {
    constant: true,
    inputs: [],
    name: "decimals",
    outputs: [{ name: "", type: "uint8" }],
    type: "function",
  },
];

const BLOCKSCOUT_API = {
  mainnet: "https://explorer.celo.org/api",
  alfajores: "https://alfajores-blockscout.celo-testnet.org/api",
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

  const { address, isConnected } = useAccount();
  const network = invoice?.network || "mainnet";
  const tokenAddress = invoice ? TOKEN_ADDRESSES[invoice.currency]?.[network] : undefined;
  const chainId = CHAIN_IDS[network];
  const [allTokenBalances, setAllTokenBalances] = useState([]);

  useEffect(() => {
    if (invoiceId) {
      const invoiceData = getInvoiceFromStorage(invoiceId);
      if (invoiceData) {
        setInvoice(invoiceData);
        setPaymentToken(invoiceData.currency);
      }
    }
  }, [invoiceId]);

  useEffect(() => {
    const fetchAllTokenBalances = async () => {
      if (!address) {
        setAllTokenBalances([]);
        return;
      }
      try {
        const apiUrl = `${BLOCKSCOUT_API[network]}`;
        const url = `${apiUrl}?module=account&action=tokenlist&address=${address}`;
        const resp = await fetch(url);
        const data = await resp.json();
        if (data.status === "1" && Array.isArray(data.result)) {
          setAllTokenBalances(data.result);
        } else {
          setAllTokenBalances([]);
        }
      } catch (e) {
        setAllTokenBalances([]);
      }
    };
    fetchAllTokenBalances();
  }, [address, network]);

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
      // Save updated invoice to storage
      saveInvoiceToStorage(updatedInvoice);
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
      {/* Header (match Index.tsx) */}
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
                  Pay Invoice
                </p>
              </div>
            </div>
            <WalletConnect />
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
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">
                    Total Amount
                  </h3>
                  <div className="flex items-center gap-4">
                    <p className="text-2xl font-bold font-mono">
                      {invoice.totalAmount} {invoice.currency}
                    </p>
                    <span className="text-sm text-muted-foreground">
                      Balance: {allTokenBalances.find(token => token.contractAddress === tokenAddress)?.balance || "0"} {invoice.currency}
                    </span>
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
                  {!isConnected && (
                    <div className="p-3 bg-muted rounded text-center text-sm text-muted-foreground">
                      Please connect your wallet to pay this invoice.
                    </div>
                  )}
                  {isConnected && (
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
                        `Pay ${invoice.totalAmount} ${invoice.currency}`
                      )}
                    </Button>
                  )}
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
              <div className="flex flex-col gap-2 mt-4">
                <h4 className="text-sm font-semibold">Your Tokens on {network === "mainnet" ? "Celo Mainnet" : "Alfajores"}:</h4>
                {allTokenBalances.length === 0 && <span className="text-xs text-muted-foreground">No tokens found or not connected.</span>}
                {allTokenBalances.map(token => (
                  <div key={token.contractAddress} className="flex items-center gap-2 text-xs">
                    <span className="font-mono">{token.tokenSymbol}</span>
                    <span>{parseFloat(token.balance) / 10 ** Number(token.tokenDecimal)}</span>
                    <span className="text-muted-foreground">({token.contractAddress})</span>
                  </div>
                ))}
              </div>
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