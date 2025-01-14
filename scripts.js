const form = document.querySelector('form');
const amount = document.getElementById('amount');
const expense = document.getElementById('expense');
const category = document.getElementById('category');

const expenseList =  document.querySelector('ul');
const expenseQuantity = document.querySelector('aside header p span');
const totalExpense = document.querySelector('aside header h2');

amount.oninput = () => {
    let value = amount.value.replace(/\D/g, '');

    value = Number(value) / 100;

    amount.value = formatCurrencyBRL(value); 
};

function formatCurrencyBRL(value) {
    return value.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    });
}

form.onsubmit = (event) => {
    event.preventDefault();

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text, 
        amount: amount.value,
        created_at: new Date()
    }

    addExpense(newExpense);
}

function addExpense(newExpense) {
    try {
       const expenseItem = document.createElement('li');
       expenseItem.classList.add('expense'); 

       const expenseIcon = document.createElement('img');
       expenseIcon.src = `img/${newExpense.category_id}.svg`;
       expenseIcon.setAttribute('alt', newExpense.category_name);

       const expenseInfo = document.createElement('div');
       expenseInfo.classList.add('expense-info');

       const expenseName = document.createElement('strong');
       expenseName.textContent = newExpense.expense;

       const expenseCategory = document.createElement('span');
       expenseCategory.textContent = newExpense.category_name;

       expenseInfo.append(expenseName, expenseCategory);

       const expenseAmount = document.createElement('span');
       expenseAmount.classList.add('expense-amount');
       expenseAmount.innerHTML = `<small>R$</small>${newExpense
        .amount
        .toUpperCase()
        .replace('R$', '')}`;

        const removeIcon = document.createElement('img');
        removeIcon.classList.add('remove-icon');
        removeIcon.setAttribute('src', 'img/remove.svg');
        removeIcon.setAttribute('alt', 'remover');

       expenseItem.append(expenseIcon, expenseInfo, expenseAmount, removeIcon);
       expenseList.append(expenseItem);

       updateTotals();
       clearForm();

    } catch (error) {
        console.error(error);       
    }
}

function updateTotals() {
    try {
        const items = expenseList.children;
        expenseQuantity.textContent = `${items.length} ${items.length === 1 
            ? 'despesa'
            : 'despesas'
        }`;

        let total = 0;

        for (const element of items) {
            const itemAmount = element.querySelector('.expense-amount');

            let value = itemAmount
                .textContent
                .replace(/[^\d,]/g, '')
                .replace(',', '.');  

            value = parseFloat(value);

            if (isNaN(value)) {
                return alert('Não foi possível calcular o total. O valor não é um número válido.');
            }

            total += value;
        }

        totalExpense.innerHTML = `<small>R$</small>${formatCurrencyBRL(total).replace('R$', '')}`;
    } catch (error) {
        console.error('Error when updating total value: ', error);      
    }
}

expenseList.addEventListener('click', (event) => {
    if (event.target.classList.contains('remove-icon')) {
        const item = event.target.closest('.expense');

        item.remove();
    }
    updateTotals();
});

function clearForm() {
    amount.value = '';
    expense.value = '';
    category.value = '';

    expense.focus();
}