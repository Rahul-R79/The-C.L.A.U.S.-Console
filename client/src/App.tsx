import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserHome from './pages/user/UserHome';
import ScannerPage from './pages/user/ScannerPage';
import ScanResultPage from './pages/user/ScanResultPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import ApprovedWishesPage from './pages/user/ApprovedWishesPage';

import SantaLoginPage from './pages/santa/SantaLoginPage';
import SantaDashboard from './pages/santa/SantaDashboard';
import SantaRoute from './components/SantaRoute';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					{/* User Routes */}
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

					{/* Santa Admin Routes */}
					<Route path="/santa/login" element={<SantaLoginPage />} />
					<Route path="/santa/dashboard" element={
						<SantaRoute>
							<SantaDashboard />
						</SantaRoute>
					} />
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App;
