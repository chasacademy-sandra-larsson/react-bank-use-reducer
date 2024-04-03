import { useReducer } from 'react';
import './App.css';
/*
Instruktioner 

1. Exempel med useReducer och ett enkelt bankkonto! Det är förenklat och vi använder inga kontonummer :-)

2. Använd en reducerfunktion för att modellera följande tillståndsövergångar: öppna konto, sätta in, ta ut, begära lån, betala lån, stäng konto. Använd initialState nedan för att komma igång.

3. Alla operationer (förutom att öppna konto) kan endast utföras om isActive är sant. Om inte, returnera bara det ursprungliga state-objektet. Du kan kontrollera detta direkt i början av reducer.

4. När kontot öppnas sätts isActive till sant. Det finns också ett minsta insättningsbelopp på 500 för att öppna ett konto (vilket betyder att saldot kommer att börja på 500).

5. Kunden kan endast begära ett lån om det inte finns något lån ännu. Om det villkoret är uppfyllt registreras det begärda beloppet i loan-staten, och det läggs till saldot. Om villkoret inte är uppfyllt, returnera bara det aktuella state.

6. När kunden betalar lånet händer motsatsen: pengarna tas från saldot och loan kommer tillbaka till 0. Detta kan leda till negativa saldon, men det är inget problem eftersom kunden inte kan stänga sitt konto nu (se nästa punkt).

7. Kunden kan bara stänga ett konto om det inte finns något lån OCH om saldot är noll. Om detta villkor inte är uppfyllt, returnera bara state. Om villkoret är uppfyllt avaktiveras kontot och alla pengar tas ut. Kontot går tillbaka till sitt initiala tillstånd.
*/

interface inititalBankState {
  balance: number;
  loan: number;
  isActive: boolean;
}

interface BankState {
  isActive: boolean;
  balance: number;
  loan: number;
}

type BankAction =
    | { type: 'openAccount' }
    | { type: 'deposit', payload: number }
    | { type: 'withdraw', payload: number }
    | { type: 'requestLoan', payload: number}
    | { type: 'payLoan' }
    | { type: 'closeAccount'}

const initialState: inititalBankState = {
  balance: 0,
  loan: 0,
  isActive: false,
};

function reducer(state: BankState, action: BankAction): BankState {
  if (!state.isActive && action.type !== 'openAccount') return state;

  switch (action.type) {
    case 'openAccount':
      return {
        ...state,
        balance: 500,
        isActive: true,
      };
    case 'deposit':
      return { ...state, balance: state.balance + action.payload! };
    case 'withdraw':
      return { ...state, balance: state.balance - action.payload! };
    case 'requestLoan':
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload!,
        balance: state.balance + action.payload!,
      };
    case 'payLoan':
      return { ...state, loan: 0, balance: state.balance - state.loan };
    case 'closeAccount':
      if (state.loan > 0 || state.balance !== 0) return state;
      return initialState;
    default:
      throw new Error('Unkown');
  }
}

export default function App() {
  const [{ balance, loan, isActive }, dispatch] = useReducer(
    reducer,
    initialState
  );

  return (
    <div className="App">
      <h1>useReducer Bank Account</h1>
      <p>Balance: {balance}</p>
      <p>Loan: {loan}</p>
      <p>
        <button
          onClick={() => dispatch({ type: 'openAccount' })}
          disabled={isActive}
        >
          Open account
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: 'deposit', payload: 150 })}
          disabled={!isActive}
        >
          Deposit 150
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: 'withdraw', payload: 50 })}
          disabled={!isActive}
        >
          Withdraw 50
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: 'requestLoan', payload: 5000 })}
          disabled={!isActive}
        >
          Request a loan of 5000
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: 'payLoan' })}
          disabled={!isActive}
        >
          Pay loan
        </button>
      </p>
      <p>
        <button
          onClick={() => dispatch({ type: 'closeAccount' })}
          disabled={!isActive}
        >
          Close account
        </button>
      </p>
    </div>
  );
}
