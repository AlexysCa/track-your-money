// this variable should hold the db connection
let db;

// establish connection to indexedDB database 
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    const db = event.target.result;

    db.createObjectStore('new_transaction', { autoIncrement: true });
};

// on success
request.onsuccess = function(event) {
    db = event.target.result;

    if (navigator.onLine) {
        // need to create uploadBudget();
    }
};

request.onerror = function(event) {
    console.log(event.target.errorCode);
};

// function to be started if there is no internet connection and we try to submit new transaction
function saveRecord(record) {

    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_transaction');
    // this will add the record to the object store
    budgetObjectStore.add(record);
}

function uploadTransaction() {
    
    const transaction = db.transaction(['new_transaction'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_transaction');
    // gets and sets all records to the variable getRecords
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function() {
        // if theres something in the indexeddbs store it should be sent to api server
        if (getAll.result.length > 0) {
            fetch('/api/transaction', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message) {
                    throw new Error(serverResponse);
                }
            const transaction = db.transaction(['new_transaction'], 'readwrite');
            const budgetObjectStore = transaction.objectStore('new_transaction');
            // will clear all items in the store
            budgetObjectStore.clear();
            alert('All your saved transactions have been sent');
            })
            .catch(err => {
                console.log(err);
            });
        }
    }
}

window.addEventListener('online', uploadTransaction);