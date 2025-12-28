import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserHome from './pages/user/UserHome';
import ScannerPage from './pages/user/ScannerPage';
import ScanResultPage from './pages/user/ScanResultPage';
import ProtectedRoute from './components/ProtectedRoute';

import ApprovedWishesPage from './pages/user/ApprovedWishesPage';
import SingleWishPage from './pages/user/SingleWishPage';

import SantaLoginPage from './pages/santa/SantaLoginPage';
import SantaDashboard from './pages/santa/SantaDashboard';
import SantaQueuePage from './pages/santa/SantaQueuePage';
import SantaCommsPage from './pages/santa/SantaCommsPage';
import SantaRoute from './components/SantaRoute';

function App() {
	return (
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
				<Route path="/wishes/:id" element={
					<ProtectedRoute>
						<SingleWishPage />
					</ProtectedRoute>
				} />


				{/* Santa Admin Routes */}
				<Route path="/santa/login" element={<SantaLoginPage />} />
				<Route path="/santa/dashboard" element={
					<SantaRoute>
						<SantaDashboard />
					</SantaRoute>
				} />
				<Route path="/santa/queue" element={
					<SantaRoute>
						<SantaQueuePage />
					</SantaRoute>
				} />
				<Route path="/santa/comms" element={
					<SantaRoute>
						<SantaCommsPage />
					</SantaRoute>
				} />
			</Routes>
		</Router>
	)
}

export default App;
