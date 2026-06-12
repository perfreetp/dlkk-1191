import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Layout from "@/components/Layout";
import ReviewsPage from "@/pages/reviews";
import ReviewDetailPage from "@/pages/review-detail";
import RadarPage from "@/pages/radar";
import RulesPage from "@/pages/rules";
import RecordsPage from "@/pages/records";

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/reviews" replace />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/reviews/:id" element={<ReviewDetailPage />} />
          <Route path="/radar" element={<RadarPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="/records" element={<RecordsPage />} />
          <Route path="*" element={<Navigate to="/reviews" replace />} />
        </Routes>
      </Layout>
    </Router>
  );
}
