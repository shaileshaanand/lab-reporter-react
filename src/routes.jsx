import ProtectedRoute from "./components/routing/ProtectedRoute";
import UnprotectedRoute from "./components/routing/UnprotectedRoute";
import Analytics from "./pages/Analytics";
import Doctors from "./pages/Doctors";
import DoctorForm from "./pages/forms/DoctorForm";
import PatientForm from "./pages/forms/PatientForm";
import ReportForm from "./pages/forms/ReportForm";
import TemplateForm from "./pages/forms/TemplateForm";
import Home from "./pages/Home";
import Login from "./pages/Login";
import OauthCallback from "./pages/OauthCallback";
import Patients from "./pages/Patients";
import Report from "./pages/Report";
import Reports from "./pages/Reports";
import Templates from "./pages/Templates";

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
  "/reports/:id": ({ id }) => <ProtectedRoute element={<Report id={id} />} />,
  "/reports/:id/edit": ({ id }) => (
    <ProtectedRoute element={<ReportForm id={id} />} />
  ),
  "/templates": () => <ProtectedRoute element={<Templates />} />,
  "/templates/new": () => <ProtectedRoute element={<TemplateForm />} />,
  "/templates/:id/edit": ({ id }) => (
    <ProtectedRoute element={<TemplateForm id={id} />} />
  ),
  "/analytics": () => <ProtectedRoute element={<Analytics />} />,
  "/oauth-callback": () => <ProtectedRoute element={<OauthCallback />} />,
};

export default routes;
