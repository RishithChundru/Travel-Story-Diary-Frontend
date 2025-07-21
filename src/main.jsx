import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { store } from './app/store'; // If using Redux
import { Provider } from 'react-redux'; // If using Redux

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <Provider store={store}> {/* Wrap with Provider */}
            <App />
        </Provider>
    </React.StrictMode>
);