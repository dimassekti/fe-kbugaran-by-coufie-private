import jsPDF from "jspdf";

function formatDate(dateStr) {
  if (!dateStr) return "Not specified";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function exportCheckupToPDF(participantData, checkupData) {
  try {
    // Create new PDF document
    const doc = new jsPDF();

    // Set initial position
    let y = 20;
    const lineHeight = 7;
    const sectionSpacing = 10;

    // Helper function to add text with automatic line wrapping
    const addText = (text, x = 20, fontSize = 12, isBold = false) => {
      doc.setFontSize(fontSize);
      if (isBold) {
        doc.setFont(undefined, "bold");
      } else {
        doc.setFont(undefined, "normal");
      }

      // Simple text wrapping for long content
      const maxWidth = 170;
      const lines = doc.splitTextToSize(text, maxWidth);

      lines.forEach((line) => {
        if (y > 280) {
          // Check if we need a new page
          doc.addPage();
          y = 20;
        }
        doc.text(line, x, y);
        y += lineHeight;
      });

      return y;
    };

    // Header
    y = addText("MEDICAL CHECKUP REPORT", 20, 18, true);
    y += sectionSpacing;

    // Export date
    const exportDate = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    y = addText(`Generated on: ${exportDate}`, 20, 10);
    y += sectionSpacing;

    // Participant Information Section
    y = addText("PARTICIPANT INFORMATION", 20, 14, true);
    y += 3;

    y = addText(
      `Name: ${
        participantData.fullname || participantData.name || "Not specified"
      }`
    );
    y = addText(`Username: ${participantData.username || "Not specified"}`);
    y = addText(
      `Participant Code: ${participantData.participant_code || "Not specified"}`
    );
    y = addText(`Event: ${participantData.event_name || "Not specified"}`);
    y = addText(`Event Date: ${formatDate(participantData.event_date)}`);
    y = addText(
      `Registration Date: ${formatDate(participantData.registration_date)}`
    );
    y += sectionSpacing;

    // Medical Checkup Information Section
    y = addText("MEDICAL CHECKUP DETAILS", 20, 14, true);
    y += 3;

    if (checkupData) {
      // Checkup date and medical staff
      y = addText(
        `Checkup Date: ${formatDate(checkupData.checkup_date)} ${formatTime(
          checkupData.checkup_date
        )}`
      );
      y = addText(`Checked By: ${checkupData.checked_by || "Not specified"}`);
      y += 5;

      // Vital Signs
      y = addText("VITAL SIGNS", 20, 12, true);
      y = addText(
        `Blood Pressure: ${checkupData.blood_pressure_systolic || "N/A"}/${
          checkupData.blood_pressure_diastolic || "N/A"
        } mmHg`
      );
      y = addText(`Heart Rate: ${checkupData.heart_rate || "N/A"} bpm`);
      y = addText(`Weight: ${checkupData.weight || "N/A"} kg`);
      y = addText(`Height: ${checkupData.height || "N/A"} cm`);

      // Calculate BMI if both weight and height are available
      if (checkupData.weight && checkupData.height) {
        const weight = parseFloat(checkupData.weight);
        const heightInMeters = parseFloat(checkupData.height) / 100;
        const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);

        let bmiCategory = "";
        if (bmi < 18.5) bmiCategory = "Underweight";
        else if (bmi < 25) bmiCategory = "Normal weight";
        else if (bmi < 30) bmiCategory = "Overweight";
        else bmiCategory = "Obese";

        y = addText(`BMI: ${bmi} (${bmiCategory})`);
      }

      y += 5;

      // Fitness Level
      if (checkupData.fitness_level) {
        y = addText("FITNESS LEVEL", 20, 12, true);
        const fitnessLevel =
          checkupData.fitness_level.charAt(0).toUpperCase() +
          checkupData.fitness_level.slice(1);
        y = addText(`Fitness Level: ${fitnessLevel}`);
        y += 5;
      }

      // Medical Conditions
      y = addText("MEDICAL HISTORY", 20, 12, true);
      const medicalConditions =
        checkupData.medical_conditions || "None reported";
      y = addText(`Medical Conditions: ${medicalConditions}`);
      y += 3;

      const medications = checkupData.medications || "None reported";
      y = addText(`Current Medications: ${medications}`);
      y += sectionSpacing;
    } else {
      y = addText("No medical checkup data available for this participant.");
      y += sectionSpacing;
    }

    // Footer
    y += 10;
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(8);
    doc.setFont(undefined, "italic");
    doc.text(
      "This report is generated automatically and contains medical information.",
      20,
      y
    );
    doc.text("Please keep this document confidential and secure.", 20, y + 5);

    // Generate filename
    const participantName = (
      participantData.fullname ||
      participantData.name ||
      "Unknown"
    ).replace(/[^a-zA-Z0-9]/g, "_");
    const dateStr = new Date().toISOString().split("T")[0];
    const filename = `Medical_Checkup_${participantName}_${dateStr}.pdf`;

    // Download the PDF
    doc.save(filename);

    return { success: true, filename };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return {
      success: false,
      error: "Failed to generate PDF. Please try again.",
    };
  }
}
