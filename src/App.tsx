import { useState } from "react";

// Define the shape of a transaction using TypeScript
type Transaction = {
  id: number;
  description: string;
  amount: number;
  type: "Income" | "Expense";
};

export default function App() {
  // State for the list of transactions
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  // State for form inputs (controlled components)
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"Income" | "Expense">("Expense");

  // Add a new transaction
  const addTransaction = () => {
    // Basic validation: don't add empty values
    if (!description.trim() || !amount) return;

    const newTransaction: Transaction = {
      id: Date.now(), // simple unique id
      description,
      amount: Number(amount),
      type,
    };

    // Update state immutably
    setTransactions((prev) => [newTransaction, ...prev]);

    // Reset form fields
    setDescription("");
    setAmount("");
    setType("Expense");
  };

  // Delete a transaction by id
  const deleteTransaction = (id: number) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  // Calculate total balance, income and expenses
  const summary = transactions.reduce((acc, t) => {
  if (t.type === "Income") {
    return {
      income: acc.income + t.amount,
      expenses: acc.expenses,
      balance: acc.balance + t.amount,
    };
  } else {
    return {
      income: acc.income,
      expenses: acc.expenses + t.amount,
      balance: acc.balance - t.amount,
    };
  }
}, {
  income: 0,
  expenses: 0,
  balance: 0,
});

  return (
    <div style={styles.container}>
      <h1>Penny AI 💰</h1>

      {/* Balance display */}
      <div style={styles.balanceBox}>
        <h2>Balance: €{summary.balance.toFixed(2)}</h2>
        <h3 style={styles.income}>
          Income: €{summary.income.toFixed(2)}
        </h3>
        <h3 style={styles.expenses}>
          Expenses: €{summary.expenses.toFixed(2)}
        </h3>
      </div>

      {/* Form */}
      <div style={styles.form}>
        <input
          style={styles.input}
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <select
          style={styles.input}
          value={type}
          onChange={(e) => setType(e.target.value as "Income" | "Expense")}
        >
          <option value="Income">Income</option>
          <option value="Expense">Expense</option>
        </select>

        <button style={styles.button} onClick={addTransaction}>
          Add Transaction
        </button>
      </div>

      {/* Transaction list */}
      <div style={styles.list}>
        {transactions.length === 0 && <p>No transactions yet.</p>}

        {transactions.map((t) => (
          <div key={t.id} style={styles.item}>
            <div>
              <strong>{t.description}</strong>
              <p style={{ margin: 0 }}>
                {t.type} • €{t.amount.toFixed(2)}
              </p>
            </div>

            <button
              style={styles.deleteButton}
              onClick={() => deleteTransaction(t.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Simple inline styling (keeps everything in one file)
const styles: Record<string, React.CSSProperties> = {
  container: {
    fontFamily: "Arial, sans-serif",
    maxWidth: 500,
    margin: "40px auto",
    padding: 20,
  },

  balanceBox: {
    padding: 10,
    background: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 20,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    marginBottom: 20,
  },

  input: {
    padding: 10,
    fontSize: 14,
  },

  button: {
    padding: 10,
    background: "#2e7d32",
    color: "white",
    border: "none",
    cursor: "pointer",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    border: "1px solid #ddd",
    borderRadius: 6,
  },

  deleteButton: {
    background: "#c62828",
    color: "white",
    border: "none",
    padding: "6px 10px",
    cursor: "pointer",
  },

  // 👇 NEW STYLES FOR SUMMARY
  income: {
    color: "#2e7d32",
    margin: "4px 0",
  },

  expenses: {
    color: "#c62828",
    margin: "4px 0",
  },
};