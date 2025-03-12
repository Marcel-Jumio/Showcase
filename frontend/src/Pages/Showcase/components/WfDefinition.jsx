import React, { useState } from "react";
import { Grid, TextField, Typography, Paper, Divider } from "@mui/material";

export default function ConfigurablePayload() {
  // Start with the absolute minimum JSON payload.
  const [formData, setFormData] = useState({
    customerInternalReference: "myOrganization",
    workflowDefinition: {
      key: 10011,
    },
  });

  // Generic dynamic updater for nested state (objects only)
  const handleChange = (path, value) => {
    const keys = path.split(".");
    setFormData((prev) => {
      const updateNested = (obj, keys, value) => {
        if (keys.length === 1) return { ...obj, [keys[0]]: value };
        const key = keys[0];
        // If key doesn't exist or is not an object, initialize it as an object.
        const nextObj = (obj[key] && typeof obj[key] === "object") ? obj[key] : {};
        return { ...obj, [key]: updateNested(nextObj, keys.slice(1), value) };
      };
      return updateNested(prev, keys, value);
    });
  };

  // Helper for updating the first (primary) credential inside workflowDefinition.credentials.
  // If credentials array is missing, it will be created.
  const handleCredentialChange = (field, value) => {
    setFormData((prev) => {
      const workflowDefinition = prev.workflowDefinition || {};
      let credentials = workflowDefinition.credentials;
      if (!Array.isArray(credentials) || credentials.length === 0) {
        credentials = [{}];
      }
      credentials[0] = { ...credentials[0], [field]: value };
      return {
        ...prev,
        workflowDefinition: {
          ...workflowDefinition,
          credentials,
        },
      };
    });
  };

  return (
    <Grid container spacing={3}>
      {/* Left Column: All Input Fields */}
      <Grid item xs={12} md={4}>
        <Typography variant="h6" gutterBottom>
          Configuration
        </Typography>
        
        {/* Identifiers */}
        <Typography variant="subtitle1" gutterBottom>
          Identifiers
        </Typography>
        <TextField
          label="User Reference"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.userReference || ""}
          onChange={(e) => handleChange("userReference", e.target.value)}
        />
        <TextField
          label="Customer Internal Reference"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.customerInternalReference || ""}
          onChange={(e) => handleChange("customerInternalReference", e.target.value)}
        />
        <TextField
          label="Reporting Criteria"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.reportingCriteria || ""}
          onChange={(e) => handleChange("reportingCriteria", e.target.value)}
        />
        <Divider sx={{ my: 2 }} />
        
        {/* Workflow Definition */}
        <Typography variant="subtitle1" gutterBottom>
          Workflow Definition
        </Typography>
        <TextField
          label="Workflow Key"
          variant="outlined"
          fullWidth
          margin="normal"
          value={(formData.workflowDefinition && formData.workflowDefinition.key) || ""}
          onChange={(e) => handleChange("workflowDefinition.key", e.target.value)}
        />
        <Divider sx={{ my: 2 }} />
        
        {/* Workflow Capabilities */}
        <Typography variant="subtitle1" gutterBottom>
          Workflow Capabilities
        </Typography>
        <TextField
          label="Watchlist Screening Search Type"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            (formData.workflowDefinition &&
              formData.workflowDefinition.capabilities &&
              formData.workflowDefinition.capabilities.watchlistScreening &&
              formData.workflowDefinition.capabilities.watchlistScreening.searchType) ||
            ""
          }
          onChange={(e) =>
            handleChange(
              "workflowDefinition.capabilities.watchlistScreening.searchType",
              e.target.value
            )
          }
        />
        <TextField
          label="Decision Label Ruleset ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            (formData.workflowDefinition &&
              formData.workflowDefinition.capabilities &&
              formData.workflowDefinition.capabilities.workflowDecision &&
              formData.workflowDefinition.capabilities.workflowDecision.decisionLabelRulesetId) ||
            ""
          }
          onChange={(e) =>
            handleChange(
              "workflowDefinition.capabilities.workflowDecision.decisionLabelRulesetId",
              e.target.value
            )
          }
        />
        <TextField
          label="Risk Score Ruleset ID"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            (formData.workflowDefinition &&
              formData.workflowDefinition.capabilities &&
              formData.workflowDefinition.capabilities.workflowDecision &&
              formData.workflowDefinition.capabilities.workflowDecision.riskScoreRulesetId) ||
            ""
          }
          onChange={(e) =>
            handleChange(
              "workflowDefinition.capabilities.workflowDecision.riskScoreRulesetId",
              e.target.value
            )
          }
        />
        <TextField
          label="eKYC Check Search Type"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            (formData.workflowDefinition &&
              formData.workflowDefinition.capabilities &&
              formData.workflowDefinition.capabilities.ekycCheck &&
              formData.workflowDefinition.capabilities.ekycCheck.searchType) ||
            ""
          }
          onChange={(e) =>
            handleChange(
              "workflowDefinition.capabilities.ekycCheck.searchType",
              e.target.value
            )
          }
        />
        <Divider sx={{ my: 2 }} />
        
        {/* Credential (Primary) – Optional */}
        <Typography variant="subtitle1" gutterBottom>
          Credential (Primary) [Optional]
        </Typography>
        <TextField
          label="Category"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            formData.workflowDefinition &&
            formData.workflowDefinition.credentials &&
            formData.workflowDefinition.credentials[0] &&
            formData.workflowDefinition.credentials[0].category
              ? formData.workflowDefinition.credentials[0].category
              : ""
          }
          onChange={(e) => handleCredentialChange("category", e.target.value)}
        />
        <TextField
          label="Label"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            formData.workflowDefinition &&
            formData.workflowDefinition.credentials &&
            formData.workflowDefinition.credentials[0] &&
            formData.workflowDefinition.credentials[0].label
              ? formData.workflowDefinition.credentials[0].label
              : ""
          }
          onChange={(e) => handleCredentialChange("label", e.target.value)}
        />
        <TextField
          label="Country Predefined Type"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            formData.workflowDefinition &&
            formData.workflowDefinition.credentials &&
            formData.workflowDefinition.credentials[0] &&
            formData.workflowDefinition.credentials[0].country &&
            formData.workflowDefinition.credentials[0].country.predefinedType
              ? formData.workflowDefinition.credentials[0].country.predefinedType
              : ""
          }
          onChange={(e) => {
            setFormData((prev) => {
              const workflowDefinition = prev.workflowDefinition || {};
              let credentials = workflowDefinition.credentials;
              if (!Array.isArray(credentials) || credentials.length === 0) {
                credentials = [{}];
              }
              const cred = credentials[0] || {};
              cred.country = { ...cred.country, predefinedType: e.target.value };
              credentials[0] = cred;
              return {
                ...prev,
                workflowDefinition: {
                  ...workflowDefinition,
                  credentials,
                },
              };
            });
          }}
        />
        <TextField
          label="Country Values (comma separated)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            formData.workflowDefinition &&
            formData.workflowDefinition.credentials &&
            formData.workflowDefinition.credentials[0] &&
            formData.workflowDefinition.credentials[0].country &&
            formData.workflowDefinition.credentials[0].country.values
              ? formData.workflowDefinition.credentials[0].country.values.join(", ")
              : ""
          }
          onChange={(e) => {
            const values = e.target.value.split(",").map((v) => v.trim());
            setFormData((prev) => {
              const workflowDefinition = prev.workflowDefinition || {};
              let credentials = workflowDefinition.credentials;
              if (!Array.isArray(credentials) || credentials.length === 0) {
                credentials = [{}];
              }
              const cred = credentials[0] || {};
              cred.country = { ...cred.country, values };
              credentials[0] = cred;
              return {
                ...prev,
                workflowDefinition: {
                  ...workflowDefinition,
                  credentials,
                },
              };
            });
          }}
        />
        <TextField
          label="Type Predefined Type"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            formData.workflowDefinition &&
            formData.workflowDefinition.credentials &&
            formData.workflowDefinition.credentials[0] &&
            formData.workflowDefinition.credentials[0].type &&
            formData.workflowDefinition.credentials[0].type.predefinedType
              ? formData.workflowDefinition.credentials[0].type.predefinedType
              : ""
          }
          onChange={(e) => {
            setFormData((prev) => {
              const workflowDefinition = prev.workflowDefinition || {};
              let credentials = workflowDefinition.credentials;
              if (!Array.isArray(credentials) || credentials.length === 0) {
                credentials = [{}];
              }
              const cred = credentials[0] || {};
              cred.type = { ...cred.type, predefinedType: e.target.value };
              credentials[0] = cred;
              return {
                ...prev,
                workflowDefinition: {
                  ...workflowDefinition,
                  credentials,
                },
              };
            });
          }}
        />
        <TextField
          label="Type Values (comma separated)"
          variant="outlined"
          fullWidth
          margin="normal"
          value={
            formData.workflowDefinition &&
            formData.workflowDefinition.credentials &&
            formData.workflowDefinition.credentials[0] &&
            formData.workflowDefinition.credentials[0].type &&
            formData.workflowDefinition.credentials[0].type.values
              ? formData.workflowDefinition.credentials[0].type.values.join(", ")
              : ""
          }
          onChange={(e) => {
            const values = e.target.value.split(",").map((v) => v.trim());
            setFormData((prev) => {
              const workflowDefinition = prev.workflowDefinition || {};
              let credentials = workflowDefinition.credentials;
              if (!Array.isArray(credentials) || credentials.length === 0) {
                credentials = [{}];
              }
              const cred = credentials[0] || {};
              cred.type = { ...cred.type, values };
              credentials[0] = cred;
              return {
                ...prev,
                workflowDefinition: {
                  ...workflowDefinition,
                  credentials,
                },
              };
            });
          }}
        />
        <Divider sx={{ my: 2 }} />

        {/* User Consent */}
        <Typography variant="subtitle1" gutterBottom>
          User Consent
        </Typography>
        <TextField
          label="User IP"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.userConsent?.userIp || ""}
          onChange={(e) => handleChange("userConsent.userIp", e.target.value)}
        />
        <TextField
          label="User Location Country"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.userConsent?.userLocation?.country || ""}
          onChange={(e) => handleChange("userConsent.userLocation.country", e.target.value)}
        />
        <TextField
          label="User Location State"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.userConsent?.userLocation?.state || ""}
          onChange={(e) => handleChange("userConsent.userLocation.state", e.target.value)}
        />
        <TextField
          label="Consent Obtained"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.userConsent?.consent?.obtained || ""}
          onChange={(e) => handleChange("userConsent.consent.obtained", e.target.value)}
        />
        <TextField
          label="Consent Obtained At"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.userConsent?.consent?.obtainedAt || ""}
          onChange={(e) => handleChange("userConsent.consent.obtainedAt", e.target.value)}
        />
        <Divider sx={{ my: 2 }} />

        {/* Acquisition Settings */}
        <Typography variant="subtitle1" gutterBottom>
          Acquisition Settings
        </Typography>
        <TextField
          label="Callback URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.callbackUrl || ""}
          onChange={(e) => handleChange("callbackUrl", e.target.value)}
        />
        <TextField
          label="Token Lifetime"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.tokenLifetime || ""}
          onChange={(e) => handleChange("tokenLifetime", e.target.value)}
        />
        <Divider sx={{ my: 2 }} />

        {/* Web Settings */}
        <Typography variant="subtitle1" gutterBottom>
          Web Settings
        </Typography>
        <TextField
          label="Success URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.web?.successUrl || ""}
          onChange={(e) => handleChange("web.successUrl", e.target.value)}
        />
        <TextField
          label="Error URL"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.web?.errorUrl || ""}
          onChange={(e) => handleChange("web.errorUrl", e.target.value)}
        />
        <TextField
          label="Locale"
          variant="outlined"
          fullWidth
          margin="normal"
          value={formData.web?.locale || ""}
          onChange={(e) => handleChange("web.locale", e.target.value)}
        />
      </Grid>

      {/* Right Column: JSON Preview */}
      <Grid item xs={12} md={8}>
        <Typography variant="h6" gutterBottom>
          JSON Structure
        </Typography>
        <Paper elevation={3} sx={{ p: 2, bgcolor: "#f5f5f5", minHeight: "800px" }}>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
              fontFamily: "monospace",
            }}
          >
            {JSON.stringify(formData, null, 2)}
          </pre>
        </Paper>
      </Grid>
    </Grid>
  );
}
