import ProtectedRoute from "./components/routing/ProtectedRoute";
import UnprotectedRoute from "./components/routing/UnprotectedRoute";
import Doctors from "./pages/Doctors";
import DoctorForm from "./pages/forms/DoctorForm";
import PatientForm from "./pages/forms/PatientForm";
import ReportForm from "./pages/forms/ReportForm";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Patients from "./pages/Patients";
import Reports from "./pages/Reports";

const routes = {
  "/": () => <ProtectedRoute element={<Home />} />,
  "/login": () => <UnprotectedRoute element={<Login />} />,
  "/patients": () => <ProtectedRoute element={<Patients />} />,
  "/patients/new": () => <ProtectedRoute element={<PatientForm />} />,
  "/patients/:id/edit": ({ id }) => (
    <ProtectedRoute element={<PatientForm id={id} />} />
  ),
  "/doctors": () => <ProtectedRoute element={<Doctors />} />,
  "/doctors/new": () => <ProtectedRoute element={<DoctorForm />} />,
  "/doctors/:id/edit": ({ id }) => (
    <ProtectedRoute element={<DoctorForm id={id} />} />
  ),
  "/reports": () => <ProtectedRoute element={<Reports />} />,
  "/reports/new": () => <ProtectedRoute element={<ReportForm />} />,
};

export default routes;
