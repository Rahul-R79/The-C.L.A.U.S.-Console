import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserHome from './pages/user/UserHome';
import ScannerPage from './pages/user/ScannerPage';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

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
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App
