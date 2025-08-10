// src/utils/ProtectedRoutesWrapper.jsx
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

const ProtectedRoutesWrapper = ({ children }) => {
  return (
    <Routes>
      {React.Children.map(children, (child) => (
        <Route
          {...child.props}
          element={<ProtectedRoute>{child.props.element}</ProtectedRoute>}
        />
      ))}
    </Routes>
  );
};

export default ProtectedRoutesWrapper;