import { DatabaseProvider } from '@/hooks/useDatabase';
import { PosDataPage } from '@/features/pos-data/PosDataPage';

function App() {
  return (
    <DatabaseProvider>
      <PosDataPage />
    </DatabaseProvider>
  );
}

export default App
