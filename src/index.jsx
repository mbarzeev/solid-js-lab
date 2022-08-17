/* @refresh reload */
import 'solid-devtools';
import {render} from 'solid-js/web';
import {useLocatorPlugin} from 'solid-devtools';
import {DEV} from 'solid-js';
import {isServer} from 'solid-js/web';
import './index.css';
import App from './App';

if (DEV && !isServer) {
    console.log('In DEV mode');
    useLocatorPlugin({
        targetIDE: 'vscode',
    });
}

render(() => <App />, document.getElementById('root'));
