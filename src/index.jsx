import React from "react";
import ReactDOM from "react-dom";
import reportWebVitals from "./reportWebVitals";
import "./index.css";
import { ChakraProvider } from "@chakra-ui/react";
import {
  injectedWallet,
  braveWallet,
  rainbowWallet,
  walletConnectWallet,
  metaMaskWallet,
  trustWallet,
} from "@rainbow-me/rainbowkit/wallets";
import "@rainbow-me/rainbowkit/styles.css";
import {
  connectorsForWallets,
  darkTheme,
  lightTheme,
  midnightTheme,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import theme from './theme';
import {MdOutlineAccountBalanceWallet} from 'react-icons/md'
import { configureChains, createConfig, WagmiConfig } from "wagmi";
//import { telos, telosTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import App from "./App";
import 'tachyons'


const projectId = "f95a49f83bc1ded0c992842132cbb0a3";

const dappName = "Buny Cloud";

const telosTestnet = {
  id: 41,
  name: "Telos Testnet",
  network: "telosTestnet",
  iconUrl: '/telos-logo.jpg',
  iconBackground: '#fff',
  nativeCurrency: {
    decimals: 18,
    name: "Telos",
    symbol: "TLOS",
  },
  rpcUrls: {
    default: { http: ["https://testnet.telos.net/evm"] },
    public: { http: ["https://testnet.telos.net/evm"] },
  },
  blockExplorers: {
    default: {
      name: "Teloscan (testnet)",
      url: "https://testnet.teloscan.io/",
    },
  },

  testnet: true,
};



const CustomAvatar = ({ address, ensImage, size }) => {
  // Define the generateColorFromAddress function here
  return ensImage ? (
    <img
      src={ensImage} // Use the provided ensImage if available
      alt={`Avatar for ${address}`}
      width={size}
      height={size}
      style={{ borderRadius: "50%" }} // Use '50%' to make the image round
    />
  ) : (
   <MdOutlineAccountBalanceWallet color="black"/>
  );
};

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    //telosMainnet,
    telosTestnet,
    
    ...(process.env.REACT_APP_ENABLE_TESTNETS === "true" ? [telosTestnet] : []),
  ],
  [publicProvider()],
);

const connectors = connectorsForWallets([
  {
    groupName: "Popular",
    wallets: [
      injectedWallet({ chains }),
      rainbowWallet({ projectId, chains }),
      walletConnectWallet({ projectId, chains }),
      braveWallet({ chains }),
      metaMaskWallet({ projectId, chains }),
      trustWallet({ projectId, chains }),
      
      
    ],
  },
]);

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

// Use ReactDOM.render if you're not on React 18+
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        coolMode
        avatar={CustomAvatar}
        showRecentTransactions={true}
        chains={chains}
        theme={lightTheme({
      accentColor: '#141f74',
      accentColorForeground: 'white',
      //borderRadius: '8px',
      fontStack: 'system',
      overlayBlur: 'small',
    })}
      >
        <ChakraProvider theme={theme}>
          <App />
        </ChakraProvider>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>,
);

reportWebVitals();
