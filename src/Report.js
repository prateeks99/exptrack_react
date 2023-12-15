import React, { useState, useEffect } from "react";
import moment from 'moment';
import DeleteIcon from './icons/deleteIcon.svg'
import EditIcon from './icons/editIcon.svg'
import CancelIcon from './icons/cancelIcon.svg'
import SaveIcon from './icons/saveIcon.svg'

function Report({username}) {
    const [expenses, setExpenses] = useState([]);
    const [name, setName] = useState('');
    const [type, setType] = useState('expense');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('misc');
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [editingAmount, setEditingAmount] = useState('');
    const [editingCategory, setEditingCategory] = useState('');
    
    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = () => {
        // GET request
        fetch(`http://localhost:8080/api/expenses/${username}`)
            .then((response) => response.json())
            .then((data) => setExpenses(data))
            .catch((error) => console.error('Error fetching expenses:', error));
    };

    const addExpense = () => {
        if (name && amount) {
            // POST Request
            fetch(`http://localhost:8080/api/expenses/${username}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  id: username,
                  name: name,
                  amount: amount,
                  category: category,
                  type: type,
              }),
            })
            .then((response) => response.json())
            .then((addedExpense) => {
                setExpenses([...expenses, addedExpense]);
                setName('');
                setAmount('');
                setCategory('');
                setType('expense');
            })
            .catch((error) => console.error('Error adding expense:', error));
        }
    };

    const deleteExpense = (expenseid) => {
        // DELETE Request
        fetch(`http://localhost:8080/api/expenses/${username}/${expenseid}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (response.status === 204) {
                fetchExpenses();
            } else {
                console.error('Failed to delete expense:', response.status);
            }
        })
        .catch((error) => console.error('Error deleting expense:', error));
    };

    const toggleEdit = (expenseid) => {
        setEditingId(expenseid === editingId ? null : expenseid);
    };

    const updateExpense = (expenseid) => {
        const originalExpense = expenses.find((expense) => expense.expense === expenseid);
        fetch(`http://localhost:8080/api/expenses/${username}/${expenseid}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: username,
              expense: expenseid,
              name: editingName || originalExpense.name,
              amount: editingAmount || originalExpense.amount,
              category: editingCategory || originalExpense.category,
              type: originalExpense.type
            }),
        })
            .then((response) => {
                if (response.ok) {
                    fetchExpenses();
                    setEditingId(null);
                    setEditingName('');
                    setEditingAmount('');
                    setEditingCategory('misc');
                } else {
                    console.error('Failed to update expense:', response.status);
                }
            })
            .catch((error) => console.error('Error updating expense:', error));
    };

    const sortBy = 'time';
    const sortOrder = 'asc';

    const sortedExpenses = expenses.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);

        if (sortBy === 'time') {
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }

        return 0;
    });

    const totalIncome = expenses
        .filter((expense) => expense.type === 'income')
        .reduce((total, income) => total + parseFloat(income.amount), 0);

    const totalExpense = expenses
        .filter((expense) => expense.type === 'expense')
        .reduce((total, expense) => total + parseFloat(expense.amount), 0);

    const balance = totalIncome - totalExpense;

    const titleCase = (string) => {
      return string.charAt(0).toUpperCase() + string.slice(1);
    };

    const isButtonDisabled = !name || !amount || !category || !type;

  return (
    <div className="mx-auto bg-gray">
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
        <div className="bg-white p-8 rounded-lg flex justify-between">
          <h2 className="text-xl font-semibold mb-2">Balance: ₹{balance.toFixed(2)}</h2>
          <h2 className="text-xl font-semibold mb-2 text-green-500">Income: ₹{totalIncome.toFixed(2)}</h2>
          <h2 className="text-xl font-semibold mb-2 text-red-500">Expense: ₹{totalExpense.toFixed(2)}</h2>
        </div>
      <div className="mt-4 bg-white p-8 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">History</h2>
        <table className="w-full border mb-2">
          <thead>
            <tr>
              <th className="p-2">Name</th>
              <th className="p-2">Amount</th>
              <th className="p-2">Category</th>
              <th className="p-2">Time</th>
            </tr>
          </thead>
          <tbody>
            {sortedExpenses.map((expense, index) => (
              <tr key={index} className="odd:bg-gray-100">
                <td className="w-40 text-center">
                    {editingId === expense.expense ? (
                        <input
                            type="text"
                            className="border w-36 rounded text-center"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            placeholder={expense.name}
                        />
                        ) : (
                            expense.name
                    )}
                </td>
                <td className={`w-40 text-center font-bold ${expense.type === 'income' ? 'text-green-500' : 'text-red-500'}`}>
                    {editingId === expense.expense ? (
                        <input
                            type="text"
                            className="border w-36 rounded text-center"
                            value={editingAmount}
                            onChange={(e) => setEditingAmount(e.target.value)}
                            placeholder={expense.amount}
                        />
                        ) : (
                          <div>
                            {expense.type === 'income' ? '+' : '-'}₹{expense.amount}
                          </div>   
                    )}
                </td>
                <td className="w-40 text-center">
                    {editingId === expense.expense ? (
                        <input
                            type="text"
                            className="border w-36 rounded text-center"
                            value={editingCategory}
                            onChange={(e) => setEditingCategory(e.target.value)}
                            placeholder={titleCase(expense.category)}
                        />
                        ) : (
                            titleCase(expense.category)
                    )}
                </td>
                <td className="w-48 text-center">{moment(expense.time).format('MMM D, hh:mm A ')}</td>
                <td className="p-2 w-24 text-center">
                    {editingId === expense.expense ? (
                        <div className="px-2">
                            <button onClick={() => updateExpense(expense.expense)}>
                                <img width="20px" style={{color: "red"}} src={SaveIcon} alt="SaveIcon" />
                            </button>
                            <button onClick={() => setEditingId(null)}>
                                <img width="20px" style={{color: "red"}} src={CancelIcon} alt="CancelIcon" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => toggleEdit(expense.expense)}>
                            <img width="20px" style={{color: "red"}} src={EditIcon} alt="EditIcon" />
                        </button>
                    )}
                </td>
                <td className="w-24 p-2 text-center">
                  <button onClick={() => deleteExpense(expense.expense)}>
                    <img width="20px" style={{color: "red"}} src={DeleteIcon} alt="DeleteIcon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
      <div className="h-max bg-white p-8 rounded-lg">
      <div className="mb-4">
      <label className="block text-sm mb-2 font-medium text-gray-700">Name:</label>
        <input
          type="text"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
      <label className="block text-sm mb-2 font-medium text-gray-700">Amount:</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      
      {type === 'expense' && (
        <div className="mb-4">
          <label className="block text-sm mb-2 font-medium text-gray-700">Category:</label>
          <select
            className="w-full p-2 border rounded"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
           >
            <option value="rent">Rent</option>
            <option value="utility">Utility</option>
            <option value="health">Health</option>
            <option value="grocery">Grocery</option>
            <option value="leisure">Leisure</option>
            <option value="travel">Travel</option>
            <option value="misc">Misc</option>
          </select>
        </div>
      )}

      {type === 'income' && (
        <div className="mb-4">
          <label className="block text-sm mb-2 font-medium text-gray-700">Category:</label>
            <select
              className="w-full p-2 border rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="salary">Salary</option>
              <option value="gift">Gift</option>
              <option value="freelance">Freelance</option>
              <option value="misc">Misc</option>
            </select>
        </div>
      )}

      <div className="mb-8">
        <label className="block text-sm mb-2 font-medium text-gray-700">Type:</label>
          <select
            className="w-full p-2 border rounded"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
      </div>

      <button
        onClick={addExpense}
        className={` w-full text-white px-3 py-2 font-semibold rounded  ${isButtonDisabled ? 'opacity-50 cursor-not-allowed bg-slate-500' : 'bg-teal-500 hover:bg-teal-600'}`}
        disabled={isButtonDisabled}
      >
        {type === 'expense' ? 'Add Expense' : 'Add Income'}
      </button>
      </div>
      </div>
    </div>
  );
}

export default Report;