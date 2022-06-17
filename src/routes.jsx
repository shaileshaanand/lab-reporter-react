import ProtectedRoute from "./components/routing/ProtectedRoute";
import UnprotectedRoute from "./components/routing/UnprotectedRoute";
import PatientForm from "./pages/forms/PatientForm";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Patients from "./pages/Patients";

const routes = {
  "/": () => <ProtectedRoute element={<Home />} />,
  "/login": () => <UnprotectedRoute element={<Login />} />,
  "/patients": () => <ProtectedRoute element={<Patients />} />,
  "/patients/new": () => <ProtectedRoute element={<PatientForm />} />,
  "/patients/:id/edit": ({ id }) => (
    <ProtectedRoute element={<PatientForm id={id} />} />
  ),
};

export default routes;
