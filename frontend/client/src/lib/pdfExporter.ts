import { jsPDF } from 'jspdf';
// Import the plugin and attach it to jsPDF globally
import 'jspdf-autotable';

interface ExpenseItem {
  id: string | number;
  amount: string;
  category: string;
  description?: string | null;
  date: Date;
  currency: string;
  isOffline?: boolean;
  type?: string; // 'debit' or 'credit'
}

// Export all expenses
export const exportExpensesToPDF = (expenses: ExpenseItem[], fileName: string = 'expense-report.pdf') => {
  const doc = new jsPDF();

  // Calculate totals
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount);
    return isNaN(amount) ? sum : sum + amount;
  }, 0);
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(29, 78, 216); // Blue color
  doc.text('EXPENSE REPORT', 20, 20);
  
  // Add expense type
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Gray-700
  doc.text('General Expenses', 20, 35);
  
  // Add prominent total expense summary
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38); // Red color for emphasis
  doc.text(`TOTAL: ${expenses[0]?.currency || '$'}${totalAmount.toFixed(2)}`, 20, 50);
  doc.setTextColor(0, 0, 0); // Reset to black
  
  // Add metadata
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 65);
  doc.text(`Total Records: ${totalExpenses}`, 20, 75);

  addExpensesTable(doc, expenses);
  
  // Save the PDF
  doc.save(fileName);
};

// Export cash expenses only
export const exportCashExpensesToPDF = (expenses: ExpenseItem[], fileName: string = 'cash-expenses-report.pdf') => {
  const doc = new jsPDF();

  // Calculate totals
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount);
    return isNaN(amount) ? sum : sum + amount;
  }, 0);
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(29, 78, 216); // Blue color
  doc.text('EXPENSE REPORT', 20, 20);
  
  // Add expense type
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Gray-700
  doc.text('Cash Expenses', 20, 35);
  
  // Add prominent total expense summary
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38); // Red color for emphasis
  doc.text(`TOTAL: ${expenses[0]?.currency || '$'}${totalAmount.toFixed(2)}`, 20, 50);
  doc.setTextColor(0, 0, 0); // Reset to black
  
  // Add metadata
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 65);
  doc.text(`Total Records: ${totalExpenses}`, 20, 75);

  addExpensesTable(doc, expenses);
  
  // Save the PDF
  doc.save(fileName);
};

// Export monthly expenses only
export const exportMonthlyExpensesToPDF = (expenses: ExpenseItem[], fileName: string = 'monthly-expenses-report.pdf') => {
  const doc = new jsPDF();

  // Calculate totals
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount);
    return isNaN(amount) ? sum : sum + amount;
  }, 0);
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(29, 78, 216); // Blue color
  doc.text('EXPENSE REPORT', 20, 20);
  
  // Add expense type
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Gray-700
  doc.text('Monthly Expenses', 20, 35);
  
  // Add prominent total expense summary
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38); // Red color for emphasis
  doc.text(`TOTAL: ${expenses[0]?.currency || '$'}${totalAmount.toFixed(2)}`, 20, 50);
  doc.setTextColor(0, 0, 0); // Reset to black
  
  // Add metadata
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 65);
  doc.text(`Total Records: ${totalExpenses}`, 20, 75);

  addExpensesTable(doc, expenses);
  
  // Save the PDF
  doc.save(fileName);
};

// Export loan expenses only
export const exportLoanExpensesToPDF = (expenses: ExpenseItem[], fileName: string = 'loan-expenses-report.pdf') => {
  const doc = new jsPDF();

  // Calculate totals
  const totalExpenses = expenses.length;
  const totalAmount = expenses.reduce((sum, expense) => {
    const amount = parseFloat(expense.amount);
    return isNaN(amount) ? sum : sum + amount;
  }, 0);
  
  // Add title
  doc.setFontSize(24);
  doc.setTextColor(29, 78, 216); // Blue color
  doc.text('EXPENSE REPORT', 20, 20);
  
  // Add expense type
  doc.setFontSize(16);
  doc.setTextColor(31, 41, 55); // Gray-700
  doc.text('Loan Expenses', 20, 35);
  
  // Add prominent total expense summary
  doc.setFontSize(18);
  doc.setTextColor(220, 38, 38); // Red color for emphasis
  doc.text(`TOTAL: ${expenses[0]?.currency || '$'}${totalAmount.toFixed(2)}`, 20, 50);
  doc.setTextColor(0, 0, 0); // Reset to black
  
  // Add metadata
  doc.setFontSize(11);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 65);
  doc.text(`Total Records: ${totalExpenses}`, 20, 75);

  addExpensesTable(doc, expenses);
  
  // Save the PDF
  doc.save(fileName);
};

// Helper function to add expenses table to PDF
const addExpensesTable = (doc: any, expenses: ExpenseItem[]) => {
  // Prepare table data
  const tableColumn = ["#", "Description", "Amount", "Date", "Category"];
  const tableRows: any[][] = [];

  expenses.forEach((expense, index) => {
    const description = (expense.description || expense.category || 'N/A').toString();
    const dateStr = new Date(expense.date).toLocaleDateString();
    const amountStr = `${expense.currency || '$'}${expense.amount}`;
    const category = expense.category || 'Uncategorized';
    
    const rowData = [
      index + 1,
      description,
      amountStr,
      dateStr,
      category
    ];
    
    tableRows.push(rowData);
  });

  // Add table - check if autoTable is available before using it
  if (typeof doc.autoTable !== 'function') {
    console.error('autoTable is not available. Make sure jspdf-autotable is properly imported.');
    return;
  }

  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: 85, // Adjusted to account for the new header layout
    styles: {
      fontSize: 10,
    },
    headStyles: {
      fillColor: [29, 78, 216], // Tailwind's blue-600
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251] // Tailwind's gray-50
    }
  });

  // Add summary section
  const finalY = (doc as any).lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.text('Summary', 20, finalY + 10);

  const onlineExpenses = expenses.filter(e => !e.isOffline && e.type !== 'credit').length;
  const cashExpenses = expenses.filter(e => e.isOffline).length;

  doc.setFontSize(12);
  doc.text(`Online Expenses: ${onlineExpenses}`, 20, finalY + 20);
  doc.text(`Cash Expenses: ${cashExpenses}`, 20, finalY + 30);
};

export default exportExpensesToPDF;