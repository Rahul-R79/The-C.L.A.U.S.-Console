import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ParentHome from './pages/parent/ParentHome';

function App() {
	return (
		<Router>
			<Routes>
				<Route path="/" element={<ParentHome />} />
				<Route path="/scanner" element={<div>Scanner Page (Coming Soon)</div>} />
			</Routes>
		</Router>
	)
}

export default App
