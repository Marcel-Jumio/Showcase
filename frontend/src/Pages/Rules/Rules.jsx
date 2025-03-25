import React, { useState, useEffect } from 'react';
import { Button, Divider, Typography } from '@mui/material';
import RuleSelection from './components/RuleSelection';
import RulesDataTable from './components/RulesDataTable';

function Rules() {
  // State for all rules, filtered rules, and the current selections
  const [rules, setRules] = useState([]);
  const [filteredRules, setFilteredRules] = useState([]);
  const [selections, setSelections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch all rules from the backend
  const fetchRules = () => {
    setLoading(true);
    fetch("http://localhost:5000/rules")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(data => {
        setRules(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  // Helper function to filter rules based on selections
  const applyFilter = (rulesData, selections) => {
    if (!selections || selections.length === 0) return [];
    
    return rulesData.filter(rule => {
      if (selections.includes("ID") && rule.credential === "ID") {
        return true;
      }
      if (selections.includes("IV") && (rule.credential === "SELFIE" || rule.credential === "FACEMAP")) {
        return true;
      }
      if (selections.includes("DocP") && rule.credential === "DOCUMENT") {
        return true;
      }
      if (selections.includes("Compare (DocP)") && rule.credential === "DOCUMENT" && rule.rule_name.includes("POA")) {
        return true;
      }
      if (selections.includes("Compare (ID)") && rule.credential === "ID" && rule.rule_name.startsWith("Mismatch")) {
        return true;
      }
      return false;
    });
  };

  // Callback to receive updated selections from the RuleSelection component
  const handleSelectionChange = (newSelections) => {
    setSelections(newSelections);
  };

  // Recompute filteredRules whenever rules or selections change
  useEffect(() => {
    setFilteredRules(applyFilter(rules, selections));
  }, [rules, selections]);

  return (
    <div>
      <Typography variant="h4" gutterBottom>
        Rules Page
      </Typography>
      
      {/* RuleSelection now sends its current selections up to this component */}
      <RuleSelection onSelectionChange={handleSelectionChange} />

      {/* Button to trigger fetching of rules */}
      <Button 
        variant="contained" 
        color="primary" 
        onClick={fetchRules} 
        style={{ marginTop: '20px' }}
      >
        Ready Steady Go
      </Button>

      {/* Button that collects all the selected rules */}
      <Button 
        variant="contained" 
        color="secondary" 
        onClick={() => {
          const selectedRules = filteredRules.map(rule => ({
            id: rule.id,
            score: rule.score
          }));
          console.log("Exporting selected rules:", selectedRules);
          
          fetch("http://localhost:5000/export-csv", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ rules: selectedRules })
          })
            .then(response => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.blob();  // Expecting the CSV as a Blob
            })
            .then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url;
              a.download = "exported_rules.csv";
              document.body.appendChild(a);
              a.click();
              a.remove();
              window.URL.revokeObjectURL(url);
            })
            .catch(error => {
              console.error("Export error:", error);
            });
        }}
        style={{ marginTop: '20px' }}
      >
        Export Selected
      </Button>

      <Divider style={{ margin: "20px 0" }} />
      <Typography variant="h6" gutterBottom>
        Here are all your relevant rules:
      </Typography>

      {loading && <Typography>Loading rules...</Typography>}
      {error && <Typography color="error">Error: {error.message}</Typography>}

      {/* Pass both rules and setRules to the child component */}
      {!loading && !error && (
        <RulesDataTable rules={filteredRules} setRules={setRules} />
      )}

      {!loading && !error && filteredRules.length === 0 && (
        <Typography>No rules to display. Please click "Ready Steady Go".</Typography>
      )}
    </div>
  );
}

export default Rules;
