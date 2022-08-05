import Pagination from './components/Pagination/Pagination';
import styles from './App.module.css';

function App() {
    return (
        <div class={styles.App}>
            <Pagination
                totalPages={10}
                pagesBuffer={5}
                onChange={(newCursor) => console.log('newCursor :>> ', newCursor)}
            />
        </div>
    );
}

export default App;
