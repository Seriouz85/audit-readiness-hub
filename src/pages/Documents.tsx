import { Routes, Route, Navigate } from "react-router-dom";
import LinkedDocuments from "@/components/documents/LinkedDocuments";
import MissingEvidence from "@/components/documents/MissingEvidence";
import DocumentGenerator from "@/components/documents/DocumentGenerator";

const Documents = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="linked" replace />} />
      <Route path="/linked" element={<LinkedDocuments />} />
      <Route path="/missing" element={<MissingEvidence />} />
      <Route path="/generator" element={<DocumentGenerator apiKey="AIzaSyBpWcf9aFOeRozeLHZBOg0taSa4CKcvxrg" />} />
    </Routes>
  );
};

export default Documents; 