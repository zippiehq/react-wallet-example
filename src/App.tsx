import { useState, useEffect } from 'react'
import { Button, Table, TableHead, TableBody, TableRow, TableCell, Container } from '@mui/material'
import { Box } from '@mui/system'
import { DidApi, environments, SignUpForm, SignInForm, RecoveryForm, IAppData } from '@zippie/did-api'
import Dialog from '@mui/material/Dialog'
// @ts-ignore
import { Wallet } from '@zippie/nft-wallet'
import { theme } from './theme'

const WalletComponent = ({ masterseed, userDetails }: { masterseed: string; userDetails: any }) => {
  const [walletLoaded, setWalletLoaded] = useState(false)
  const [walletAccountAddress, setWalletAccountAddress] = useState('')

  let accounts: any, balance: any, transactions: any, paymentReceipt: any, paymentData: any

  useEffect(() => {
    if (!walletLoaded) {
      ;(async () => {
        const options = {
          environment: 'testing', // Zippie environment
          masterseed, // Masterseed for account
        }
        await Wallet.ERC721.init(options)
        const accountAddress = await getAccountAddress()
        setWalletAccountAddress(accountAddress)
        setWalletLoaded(true)
      })()
    }
  }, [walletLoaded])

  const getAccountAddress = async (): Promise<string> => {
    try {
      const options = {}
      const accountAddress = await Wallet.ERC721.getAccountAddress(options)
      console.log('getAccountAddress', accountAddress)
      return accountAddress
    } catch (err) {
      console.error(err)
      return ''
    }
  }

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
            <TableCell>User</TableCell>
            <TableCell>Email</TableCell>

            <TableCell>Name</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Address</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow key="wallet" sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
            <TableCell component="th" scope="row">
              {userDetails.firstName}
            </TableCell>
            <TableCell component="th" scope="row">
              {userDetails.email}
            </TableCell>

            <TableCell component="th" scope="row">
              Wallet
            </TableCell>
            <TableCell>{walletLoaded ? 'Loaded' : 'Not Loaded'}</TableCell>
            <TableCell>{walletAccountAddress}</TableCell>
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

enum viewNames {
  signIn = 'signIn',
  signUp = 'signUp',
  recovery = 'recovery',
}

const CredentialsComponent = ({ setDidData, platform }: any) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [viewName, setViewName] = useState<viewNames>(viewNames.signUp)
  const onUserLoggedIn = (response: IAppData) => {
    setDidData(response)
    localStorage.setItem('didData', JSON.stringify(response))
  }

  const handleDialogOpenClick = (viewName: viewNames) => {
    setViewName(viewName)
    setIsDialogOpen(true)
  }

  const handleDialogCloseClick = () => {
    setIsDialogOpen(false)
  }

  const onForgotPasswordClick = () => {
    setViewName(viewNames.recovery)
  }
  const renderComponent = () => {
    switch (viewName) {
      case viewNames.signUp: {
        if (!platform) {
          return null
        }
        return (
          <SignUpForm
            onLoginButtonClick={() => setViewName(viewNames.signIn)}
            platform={platform}
            onSignUpComplete={onUserLoggedIn}
            onForgotPasswordClick={onForgotPasswordClick}
            theme={theme}
          />
        )
      }

      case viewNames.signIn:
        return (
          <SignInForm
            platform={platform}
            onSignInComplete={onUserLoggedIn}
            onForgotPasswordClick={onForgotPasswordClick}
            onSignUpClick={() => setViewName(viewNames.signUp)}
            theme={theme}
          />
        )

      case viewNames.recovery:
        return <RecoveryForm platform={platform} onRecoveryComplete={onUserLoggedIn} theme={theme} />

      default:
        return <></>
    }
  }
  return platform ? (
    <>
      <Box>
        <Button variant="contained" color="primary" onClick={() => handleDialogOpenClick(viewNames.signUp)}>
          Sign up
        </Button>

        <Button variant="contained" color="primary" onClick={() => handleDialogOpenClick(viewNames.signIn)}>
          Sign In
        </Button>
      </Box>
      <Dialog
        onClose={handleDialogCloseClick}
        open={true}
        maxWidth={'xl'}
        style={{ display: isDialogOpen ? 'block' : 'none' }}
      >
        <Box width="600px" height="700px" display="flex" justifyItems="center" p={3} pt={5} bgcolor="white">
          {renderComponent()}
        </Box>
      </Dialog>
    </>
  ) : null
}
function App() {
  const [didData, setDidData] = useState<IAppData>()
  const [platform, setPlatform] = useState<DidApi>()

  const onStart = async () => {
    const savedDid = localStorage.getItem('didData')
    if (savedDid) {
      setDidData(JSON.parse(savedDid))
      return
    }

    const p = new DidApi({
      iframeRoot: document.body,
      env: environments.dev,
      client: 'Lohko',
    })
    await p.setup()
    setPlatform(p)
  }
  useEffect(() => {
    onStart()
  }, [])

  return (
    <>
      {didData ? (
        <WalletComponent masterseed={didData.privateKey} userDetails={didData.userDetails} />
      ) : (
        <CredentialsComponent setDidData={setDidData} platform={platform} />
      )}
    </>
  )
}

export default App
