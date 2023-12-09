import React, { useState, useEffect } from "react";
import moment from 'moment';
import DeleteIcon from './icons/deleteIcon.svg'
import EditIcon from './icons/editIcon.svg'
import CancelIcon from './icons/cancelIcon.svg'
import SaveIcon from './icons/saveIcon.svg'

function Report() {
    const [expenses, setExpenses] = useState([]);
    const [name, setName] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [sortBy, setSortBy] = useState('time'); 
    const [sortOrder, setSortOrder] = useState('asc'); 
    const [editingId, setEditingId] = useState(null);
    const [editingName, setEditingName] = useState('');
    const [editingAmount, setEditingAmount] = useState('');
    const [editingCategory, setEditingCategory] = useState('');


    useEffect(() => {
        fetchExpenses();
    }, []);

    const fetchExpenses = () => {
        // GET request
        fetch('http://localhost:8080/api/expenses')
            .then((response) => response.json())
            .then((data) => setExpenses(data))
            .catch((error) => console.error('Error fetching expenses:', error));
    };

    const addExpense = () => {
        if (name && amount) {
            // POST Request
            fetch('http://localhost:8080/api/expenses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, amount, category }),
            })
            .then((response) => response.json())
            .then((addedExpense) => {
                setExpenses([...expenses, addedExpense]);
                setName('');
                setAmount('');
                setCategory('');
            })
            .catch((error) => console.error('Error adding expense:', error));
        }
    };

    const deleteExpense = (id) => {
        // DELETE Request
        fetch(`http://localhost:8080/api/expenses/${id}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (response.status === 204) {
                fetchExpenses(); // Refresh the expense list
            } else {
                console.error('Failed to delete expense:', response.status);
            }
        })
        .catch((error) => console.error('Error deleting expense:', error));
    };

    const toggleEdit = (id) => {
        setEditingId(id === editingId ? null : id);
    };

    const updateExpense = (id) => {
        const originalExpense = expenses.find((expense) => expense.id === id);
        fetch(`http://localhost:8080/api/expenses/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: id,
              name: editingName || originalExpense.name,
              amount: editingAmount || originalExpense.amount,
              category: editingCategory || originalExpense.category
            }),
        })
            .then((response) => {
                if (response.ok) {
                    fetchExpenses();
                    setEditingId(null);
                    setEditingName('');
                    setEditingAmount('');
                    setEditingCategory('');
                } else {
                    console.error('Failed to update expense:', response.status);
                }
            })
            .catch((error) => console.error('Error updating expense:', error));
    };

    const sortedExpenses = expenses.sort((a, b) => {
        const dateA = new Date(a.time);
        const dateB = new Date(b.time);

        if (sortBy === 'time') {
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }

        return 0;
    });

    const totalExpenses = expenses.reduce((total, expense) => total + parseFloat(expense.amount), 0);


  return (
    <div className="mx-auto bg-gray">
      <h1 className="text-3xl bg-teal-500 text-white px-8 py-4 font-semibold mb-4 ">Expense Tracker</h1>
      <div className="grid grid-cols-3 gap-4 p-4">
        <div className="col-span-2">
        <div className="bg-white p-8 rounded-lg">
            <h2 className="text-xl font-semibold ">Total Expenses: ₹{totalExpenses.toFixed(2)}</h2>
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
                    {editingId === expense.id ? (
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
                <td className="w-40 text-center">
                    {editingId === expense.id ? (
                        <input
                            type="text"
                            className="border w-36 rounded text-center"
                            value={editingAmount}
                            onChange={(e) => setEditingAmount(e.target.value)}
                            placeholder={expense.amount}
                        />
                        ) : (
                            expense.amount
                    )}
                </td>
                <td className="w-40 text-center">
                    {editingId === expense.id ? (
                        <input
                            type="text"
                            className="border w-36 rounded text-center"
                            value={editingCategory}
                            onChange={(e) => setEditingCategory(e.target.value)}
                            placeholder={expense.category}
                        />
                        ) : (
                            expense.category
                    )}
                </td>
                <td className="w-48 text-center">{moment(expense.time).format('MMM D, hh:mm A ')}</td>
                <td className="p-2 w-24 text-center">
                    {editingId === expense.id ? (
                        <div className="px-2">
                            <button onClick={() => updateExpense(expense.id)}>
                                <img width="20px" style={{color: "red"}} src={SaveIcon} alt="SaveIcon" />
                            </button>
                            <button onClick={() => setEditingId(null)}>
                                <img width="20px" style={{color: "red"}} src={CancelIcon} alt="CancelIcon" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={() => toggleEdit(expense.id)}>
                            <img width="20px" style={{color: "red"}} src={EditIcon} alt="EditIcon" />
                        </button>
                    )}
                </td>
                <td className="w-24 p-2 text-center">
                  <button onClick={() => deleteExpense(expense.id)}>
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
      <h2 className="text-xl font-semibold mb-4">Add Expense</h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Name"
          className="w-full p-2 border rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <input
          type="number"
          placeholder="Amount"
          className="w-full p-2 border rounded"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Category"
          className="w-full p-2 border rounded"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <button
        onClick={addExpense}
        className="bg-teal-500 w-full text-white px-3 py-2 font-semibold rounded hover:bg-teal-600"
      >
        Add
      </button>
      </div>
      </div>
    </div>
  );
}

export default Report;