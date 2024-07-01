import { AppContext } from './AppContext';
//import useIpfsFactory from './hooks/use-ipfs-factory.js'
//import useIpfs from './hooks/use-ipfs.js'
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { Box, Center, Flex } from '@chakra-ui/react';
import './App.css';
// contracts
import CalendarDailyTelos from './contracts/CalendarDailyTelos.json';
import CalendarFactory from './contracts/CalendarFactory.json';

// components
import NavBar from './components/Menu/NavBar.jsx';
import FooterMain from './components/FooterMain';
import CommunityPage from './components/Calendar/CommunityPage';
import WhatAllEvents from './hooks/WhatAllEvents.jsx';
import SidebarLayout from './components/SidebarLayout';

function App() {
  // account
  const { address, isConnected } = useAccount();

  // RPC Connections

  const [rpc41] = useState('https://testnet.telos.net/evm');
  const [rpcUrl, setRpcUrl] = useState(rpc41);

  // Loading / Boolean
  const [isLoading, setIsLoading] = useState(false);

  //
  const [isGuest, setGuestRole] = useState(false);
  const [isMember, setMemberRole] = useState(false);
  const [events, setEvents] = useState([]);
  const [isAdmin, setAdminRole] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [displayCalendar, setDisplayCalendar] = useState(null);
  const [chainId, setChainId] = useState(41);
  const [allCalendars, setAllCalendars] = useState([]);
  const [calendarName, setCalendarName] = useState('');
  const [account, setAccount] = useState('');
  const [fetchTrigger, setFetchTrigger] = useState(false);
  const [calendarFactoryAddress, setCalendarFactoryAddress] = useState('');

  const handleFetch = () => {
    setFetchTrigger(!fetchTrigger);
    console.log('updating events...');
  };
  // RPC Connections

  // Contract Addresses

  const factoryABI = CalendarFactory.abi;
  const calendarABI = CalendarDailyTelos.abi;

  // TBA details
  const [accountBalance, setAccountBalance] = useState('');

  // Fetch Connection Details
  async function getConnection() {
    if (address) {
      setIsLoading(true);
      console.log('Checking Connection Details...');
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const network = await provider.getNetwork();
      setChainId(network.chainId);
      setAccount(address);
      console.log(`Connected to chain Id: ${network.chainId}`);
    } else {
      console.log('Account not connected');
    }
    setIsLoading(false);
  }

  // Save connected address to context
  useEffect(() => {
    if (address) {
      getConnection();
      if (chainId === 40) {
        //setRpcUrl(rpc40);
        console.log(`Telos Mainnet RPC Not Available: `);
      } else if (chainId === 41) {
        setRpcUrl(rpc41);
        console.log(`Telos Testnet RPC Ready: ${rpc41}`);
      }
    }
  }, [chainId]);

  // Set Contract Addresses to Context
  useEffect(() => {
    if (account || chainId === 40) {
      setIsLoading(true);

      console.log(`SWITCH TO TESTNET`);
    } else if (account || chainId === 41) {
      setRpcUrl(rpc41);
      setCalendarFactoryAddress(CalendarFactory.address);
      console.log(`RPC loaded...${rpc41}`);
      console.log(`Testnet Factory Contract Ready ${calendarFactoryAddress}`);
    }
    setIsLoading(false);
  }, [chainId]);

  // Handle network switch
  useEffect(() => {
    const handleChainChanged = _chainId => {
      const newChainId = parseInt(_chainId, 16);
      setChainId(newChainId);
    };
    if (window.ethereum) {
      window.ethereum.on('chainChanged', handleChainChanged);
    }
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chainId, rpc41]);

  useEffect(() => {
    if (address) {
      setAccount(address);
      console.log(`Wallet address saved to context ${account}`);
    }
  }, [account, address]);

  useEffect(() => {
    async function fetchCalendarName() {
      const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
      const contract = new ethers.Contract(
        displayCalendar,
        calendarABI,
        provider
      );
      const name = await contract.calendarName();
      console.log(`Connecting to calendar ${name}`);
      setCalendarName(name);
    }
    fetchCalendarName();
  }, [displayCalendar]);

  //// Calendar Functions

  // Fetch Events

  useEffect(() => {
    if (displayCalendar) {
      handleFetch();
      console.log('Updating Events...');
    }
  }, [displayCalendar]);

  return (
    <AppContext.Provider
      value={{
        account,
        setAccount,
        chainId,
        setChainId,
        accountBalance,
        setAccountBalance,
        calendarFactoryAddress,
        factoryABI,
        calendarABI,
        userRole,
        setUserRole,
        isAdmin,
        setAdminRole,
        isMember,
        setMemberRole,
        isGuest,
        setGuestRole,
        allCalendars,
        setAllCalendars,
        events,
        setEvents,
        displayCalendar,
        setDisplayCalendar,
        calendarName,
        setCalendarName,
        rpcUrl,
        rpc41,
      }}
    >
      <Router>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflowX: 'hidden',
          }}
        >
           <Flex direction="column" minHeight="100vh">
            <NavBar loading={isLoading} />
          

          <Box flex="1" backgroundColor="gray.100"> {/* Content container that expands */}

          <Routes>
            <Route
              path="/"
              element={
                <Box height="fit-content">
                  <Flex direction="column" minHeight="calc(100vh - 100px)">
                    
                    <SidebarLayout
                      account={account}
                      events={events}
                      handleFetch={handleFetch}
                      displayCalendar={displayCalendar}
                    />
                  </Flex>
                </Box>
              }
            />

            <Route path="/:calendarAddress" element={<CommunityPage />} />
          </Routes>
            </Box>
          <FooterMain style={{ flexShrink: 0, position: 'sticky', bottom: 0 }} />
          </Flex>

          <WhatAllEvents triggerFetch={fetchTrigger} />
        </div>
      </Router>
    </AppContext.Provider>
  );
}

export default App;
