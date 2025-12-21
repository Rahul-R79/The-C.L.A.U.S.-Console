import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ParentHome from './pages/user/UserHome';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
	return (
		<AuthProvider>
			<Router>
				<Routes>
					<Route path="/" element={<ParentHome />} />
					<Route path="/scanner" element={
						<ProtectedRoute>
							<div>Scanner Page (Coming Soon)</div>
						</ProtectedRoute>
					} />
				</Routes>
			</Router>
		</AuthProvider>
	)
}

export default App
