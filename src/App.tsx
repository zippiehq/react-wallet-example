import { useState, useEffect } from 'react'
import { Button, Table, TableHead, TableBody, TableRow, TableCell, Container } from '@mui/material'
import { Box } from '@mui/system'

// @ts-ignore
import { Wallet } from '@zippie/nft-wallet'

function App() {
  const [walletLoaded, setWalletLoaded] = useState(false)

  let accounts: any, balance: any, transactions: any, paymentReceipt: any, paymentData: any

  useEffect(() => {
    if (!walletLoaded) {
      ;(async () => {
        const options = {
          environment: 'testing', // Zippie environment
          masterseed: 'Zippie', // Masterseed for account
        }
        await Wallet.ERC721.init(options)
        setWalletLoaded(true)
      })()
    }
  }, [walletLoaded])

  const getAccounts = async () => {
    try {
      accounts = await Wallet.ERC721.getAccounts()
      console.log('getAccounts', accounts)
    } catch (err) {
      console.error(err)
    }
  }

  const getAccountBalance = async () => {
    try {
      const options = {
        accountId: accounts[2].accountId, // Select account
      }
      balance = await Wallet.ERC721.getAccountBalance(options)
      console.log('getAccountBalance', balance)
    } catch (err) {
      console.error(err)
    }
  }

  const getAccountTransactions = async () => {
    try {
      const options = {
        accountId: accounts[2].accountId, // Select account
      }
      transactions = await Wallet.ERC721.getAccountTransactions(options)
      console.log('getAccountTransactions', transactions)
    } catch (err) {
      console.error(err)
    }
  }

  const createPayment = async () => {
    try {
      const options = {
        accountId: accounts[2].accountId, // Select account
        tokenId: balance.items[0].id, // First item
        message: 'test',
        metadata: { test: true },
      }
      paymentReceipt = await Wallet.ERC721.createPayment(options)
      console.log('createPayment', paymentReceipt)
    } catch (err) {
      console.error(err)
    }
  }

  const fetchPayment = async () => {
    try {
      const options = {
        cid: paymentReceipt.cid, // Content Identifier
        key: paymentReceipt.key, // Encryption key
      }
      paymentData = await Wallet.ERC721.fetchPayment(options)
      console.log('fetchPayment', paymentData)
    } catch (err) {
      console.error(err)
    }
  }

  const redeemPayment = async () => {
    try {
      const options = {
        payment: paymentData,
      }
      const response = await Wallet.ERC721.redeemPayment(options)
      console.log('redeemPayment', response)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Container className="App">
      <Table sx={{ maxWidth: 650, border: 0.2 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key="wallet" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              Wallet
            </TableCell>
            <TableCell align="right">{walletLoaded ? 'Loaded' : 'Not Loaded'}</TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Button
          variant="contained"
          sx={{ marginTop: '20px', width: '300px', textAlign: 'center' }}
          disabled={walletLoaded ? false : true}
          onClick={async () => await getAccounts()}
        >
          Get Accounts
        </Button>

        <Button
          variant="contained"
          sx={{ marginTop: '20px', width: '300px', textAlign: 'center' }}
          disabled={walletLoaded ? false : true}
          onClick={async () => await getAccountBalance()}
        >
          Get Account Balance
        </Button>

        <Button
          variant="contained"
          sx={{ marginTop: '20px', width: '300px', textAlign: 'center' }}
          disabled={walletLoaded ? false : true}
          onClick={async () => await getAccountTransactions()}
        >
          Get Account Transactions
        </Button>

        <Button
          variant="contained"
          sx={{ marginTop: '20px', width: '300px', textAlign: 'center' }}
          disabled={walletLoaded ? false : true}
          onClick={async () => await createPayment()}
        >
          Create Payment
        </Button>

        <Button
          variant="contained"
          sx={{ marginTop: '20px', width: '300px', textAlign: 'center' }}
          disabled={walletLoaded ? false : true}
          onClick={async () => await fetchPayment()}
        >
          Fetch Payment
        </Button>

        <Button
          variant="contained"
          sx={{ marginTop: '20px', width: '300px', textAlign: 'center' }}
          disabled={walletLoaded ? false : true}
          onClick={async () => await redeemPayment()}
        >
          Redeem Payment
        </Button>
      </Box>
    </Container>
  )
}

export default App
