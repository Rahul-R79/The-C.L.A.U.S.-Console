import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserHome from './pages/user/UserHome';
import ScannerPage from './pages/user/ScannerPage';
import ScanResultPage from './pages/user/ScanResultPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import ApprovedWishesPage from './pages/user/ApprovedWishesPage';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<UserHome />} />
					<Route path="/scanner" element={
						<ProtectedRoute>
							<ScannerPage />
						</ProtectedRoute>
					} />
					<Route path="/result" element={
						<ProtectedRoute>
							<ScanResultPage />
						</ProtectedRoute>
					} />
					<Route path="/wishes" element={
						<ProtectedRoute>
							<ApprovedWishesPage />
						</ProtectedRoute>
					} />
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App;
