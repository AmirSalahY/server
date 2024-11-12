// index.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const cors = require("cors");

const app = express();
const PORT = 3001;

// Enable CORS for all routes
app.use(cors());

// Serve static files from the 'public' directory
app.use(express.static("public"));
app.use("/locales", express.static(path.join(__dirname, "locales")));

// Dynamic route to get white-label configuration based on company ID
app.get("/company/:companyId/config", (req, res) => {
  const { companyId } = req.params;

  const configData = {
    name: companyId === "UR-STORE" ? "UR Store" : "Example Company",
    fontLink: `http://localhost:${PORT}/font.ttf`,
    fontName: "Montserrat",
    logo: `http://localhost:${PORT}/logo.png`,
    favicon: `http://localhost:${PORT}/favicon.ico`,

    // Color Scheme
    primaryColor: "#008060", // Main brand color for headers, prominent buttons, etc.
    secondaryColor: "#252B5E", // Secondary brand color for headers, footers, and accents
    footerColor: "#6C8097", // Background color for the footer
    highlightedText: "#F5F5F5", // Color for highlighted or active text
    normalColor: "#C7C7C7", // Default text color
    borderColor: "#ECECEC", // Border color for buttons and cards
    logo: `http://localhost:${PORT}/logo.png`, // Client's logo
    buttonStyles: {
      shape: "rounded", // Button shape
      borderColor: "#ECECEC", // Border color
      borderThickness: "1px", // Border thickness
      shadow: "0 2px 5px rgba(0, 0, 0, 0.1)", // Shadow effect
    },
    functionalToggles: {
      signInMethods: {
        apple: true,
        google: true,
        facebook: false,
        phone: true,
        email: true,
      },
      sectionVisibility: {
        promotionalBanner: true,
      },
    },
    languageOptions: [
      { code: "de", name: "Deutsch" },
      { code: "en", name: "English" },
    ],
    linksAndTerms: {
      terms: "http://example.com/terms",
      privacyPolicy: "http://example.com/privacy",
      imprint: "http://example.com/imprint",
    },
  };
  res.json(configData);
});

// Add this endpoint to serve translations
app.get("/locales/:lng/:ns", (req, res) => {
  const { lng, ns } = req.params;

  try {
    const translationsPath = path.join(__dirname, "locales", lng, `${ns}`);
    console.log(`Attempting to load translations from: ${translationsPath}`);

    if (!fs.existsSync(translationsPath)) {
      console.log(`Translation file not found: ${translationsPath}`);
      return res.status(404).json({
        error: "Translations not found",
        path: translationsPath,
      });
    }

    const translations = JSON.parse(fs.readFileSync(translationsPath, "utf8"));
    console.log(`Successfully loaded translations for ${lng}/${ns}`);
    res.json(translations);
  } catch (error) {
    console.error("Error serving translations:", error);
    res.status(500).json({
      error: "Error loading translations",
      details: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`Translations path: ${path.join(__dirname, "locales")}`);
});
