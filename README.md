# PayMe - Decentralized Invoice Management

A modern web application for creating and managing invoices using Mento stablecoins on the Celo blockchain. Built with React, TypeScript, and Web3 technologies.

## 🌟 Features

- **Invoice Generation**: Create professional invoices with multiple line items
- **Mento Stablecoin Support**: Accept payments in cUSD, cEUR, cREAL, cNGN, and cGHS
- **Wallet Integration**: Connect with MetaMask and other Web3 wallets via RainbowKit
- **Multi-Network Support**: Works on both Celo Mainnet and Alfajores Testnet
- **Payment Tracking**: Real-time payment status and transaction history
- **QR Code Sharing**: Share invoices easily with QR codes
- **Responsive Design**: Beautiful UI that works on desktop and mobile
- **Local Storage**: Persistent invoice data stored locally

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Tailwind CSS, Radix UI
- **Web3**: Wagmi, Viem, RainbowKit
- **Blockchain**: Celo Network (Mainnet & Testnet)
- **Stablecoins**: Mento Protocol (cUSD, cEUR, cREAL, cNGN, cGHS)
- **Routing**: React Router DOM
- **State Management**: React Query (TanStack Query)
- **Forms**: React Hook Form with Zod validation

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- MetaMask or another Web3 wallet
- Celo testnet tokens (for testing)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd mentopay-invoice-flow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_WC_PROJECT_ID=your_walletconnect_project_id
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📱 How to Use

### Creating an Invoice

1. **Connect your wallet** using the WalletConnect button
2. **Navigate to the "Generate" tab**
3. **Add invoice items** with descriptions and amounts
4. **Select a stablecoin** (cUSD, cEUR, cREAL, cNGN, or cGHS)
5. **Choose network** (Mainnet or Testnet)
6. **Enter recipient address** (your wallet address)
7. **Generate the invoice**

### Paying an Invoice

1. **Open the invoice link** (shared via QR code or URL)
2. **Connect your wallet** if not already connected
3. **Select payment token** (must match invoice currency)
4. **Review payment details** and confirm transaction
5. **Wait for confirmation** and view transaction on Celo Explorer

### Managing Invoices

- **View current invoice** in the "Invoice" tab
- **Track payment history** in the "History" tab
- **Monitor statistics** including total invoices, paid amounts, and pending payments

## 🔧 Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run build:dev    # Build for development
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── InvoiceGenerator.tsx
│   ├── InvoiceDisplay.tsx
│   └── WalletConnect.tsx
├── pages/              # Page components
│   ├── Index.tsx       # Main dashboard
│   ├── PayInvoice.tsx  # Payment page
│   └── NotFound.tsx    # 404 page
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
└── main.tsx           # Application entry point
```

### Key Components

- **InvoiceGenerator**: Form for creating new invoices
- **InvoiceDisplay**: Shows invoice details and payment options
- **WalletConnect**: Web3 wallet connection component
- **PayInvoice**: Dedicated payment page for invoice links

## 🌐 Supported Networks

### Celo Mainnet
- **Chain ID**: 42220
- **RPC URL**: https://forno.celo.org
- **Explorer**: https://explorer.celo.org

### Celo Alfajores Testnet
- **Chain ID**: 44787
- **RPC URL**: https://alfajores-forno.celo-testnet.org
- **Explorer**: https://alfajores-blockscout.celo-testnet.org

## 💰 Supported Stablecoins

| Token | Symbol | Description |
|-------|--------|-------------|
| Celo Dollar | cUSD | US Dollar stablecoin |
| Celo Euro | cEUR | Euro stablecoin |
| Celo Real | cREAL | Brazilian Real stablecoin |
| Celo Naira | cNGN | Nigerian Naira stablecoin |
| Celo Ghanaian Cedi | cGHS | Ghanaian Cedi stablecoin |

## 🔒 Security Features

- **Client-side validation** for all form inputs
- **Transaction confirmation** before processing payments
- **Network verification** to ensure correct blockchain
- **Balance checking** before allowing payments
- **Error handling** for failed transactions

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy automatically** on push to main branch

### Other Platforms

The app can be deployed to any static hosting platform:
- Netlify
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the code comments and component documentation
- **Issues**: Report bugs and feature requests via GitHub Issues
- **Community**: Join the Celo community for blockchain-related questions

## 🙏 Acknowledgments

- [Celo Foundation](https://celo.org/) for the blockchain infrastructure
- [Mento Protocol](https://mento.org/) for stablecoin technology
- [RainbowKit](https://rainbowkit.com/) for wallet connection
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
