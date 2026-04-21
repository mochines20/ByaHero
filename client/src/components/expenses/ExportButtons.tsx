import Papa from "papaparse";
import jsPDF from "jspdf";
import { Button } from "../ui/Button";

export function ExportButtons({ trips }: { trips: any[] }) {
  const exportCsv = () => {
    const csv = Papa.unparse(trips);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "byahero-trips.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportPdf = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("ByaHero Expense Report", 14, 18);
    let y = 28;
    trips.forEach((t, i) => {
      doc.setFontSize(10);
      doc.text(`${i + 1}. ${t.origin} -> ${t.destination} | ${t.transportType} | PHP ${t.fare}`, 14, y);
      y += 6;
      if (y > 280) {
        doc.addPage();
        y = 20;
      }
    });
    doc.save("byahero-expenses.pdf");
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button className="secondary" onClick={exportPdf} type="button">Export PDF</Button>
      <Button className="secondary" onClick={exportCsv} type="button">Export CSV</Button>
    </div>
  );
}
