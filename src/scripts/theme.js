(function () {
  var params = new URLSearchParams(window.location.search);
  var c = params.get("thm");
  var chains = {
    8453: {
      "--stats": "#d9dff5",
      "--text": "#ffffff",
      "--stat-text": "#ffffff",
      "--accent": "#1e40ff",
      "--accent-tertiary": "#9ab3ff",
      "--accent-secondary": "#4a6fff",
      "--icon": "#365eff",
      "--heatmap-min": "#a8c5ff",
      "--heatmap-max": "#ff4b00",
    },

    42220: {
      "--stats": "#37381F",
      "--text": "#FFFFFF",
      "--stat-text": "#ffffff",
      "--accent": "#FCFF52",
      "--accent-secondary": "#FFF799",
      "--accent-tertiary": "#D4E831",
      "--heatmap-min": "#1A1C20",
      "--heatmap-max": "#FCFF52",
      "--icon": "#E8A800",
      "--chart-low": "#A0A23A",
      "--chart-high": "#E5E85B",
    },
    42161: {
      "--stats": "#213147",
      "--text": "#FFFFFF",
      "--stat-text": "#ffffff",
      "--accent": "#12AAFF",
      "--accent-secondary": "#9DCCED",
      "--accent-tertiary": "#E5E5E5",
      "--heatmap-min": "#213147",
      "--heatmap-max": "#12AAFF",
      "--icon": "#9DCCED",
      "--chart-low": "#213147",
      "--chart-high": "#12AAFF",
    },
    10: {
      "--stats": "#fff5f5",
      "--text-primary": "#111111",
      "--accent": "#ff0420",
      "--icon": "#e00000",
    },
  };

  if (c && chains[c]) {
    var vars = chains[c];
    for (var key in vars) {
      document.documentElement.style.setProperty(key, vars[key]);
    }
  }
})();
