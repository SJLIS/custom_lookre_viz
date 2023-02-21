looker.plugins.visualizations.add({
  options: {
    html_freeform: {
      type: "string",
      label: "Freeform HTML. Use strings like ~1, ~2, or ~3 to access data inside the html",
      display: "text",
      default: "<div>Your custom HTML</div>"
    },
    
    styles_freeform: {
      type: "string",
      label: "Freeform Styles",
      display: "text",
      default: `@font-face {
        font-family: Open Sans;
        src: url( https://fonts.gstatic.com/s/opensans/v17/mem8YaGs126MiZpBA-UFVZ0b.woff2 );
      }
      div {
        background-color: white;
        text-align: center;
      }`
    },
      js_freeform: {
      type: "string",
      label: "Freeform JavaScript",
      display: "text",
      default: "console.log('Hello World')"
    },
  },

  create: function(element, config) {
    element.innerHTML = "<div class='html_freeform'>Rendering...</div>";
  },

  updateAsync: function(data, element, config, queryResponse, details, doneRendering) {
    element.innerHTML = '';
    const jsCode = config.js_freeform;
    try {
      eval(jsCode);
    } catch (error) {
      document.getElementById("js-output").innerHTML = "Error executing JavaScript code: " + error.message;
    }
    

    let measure_fields = queryResponse.fields.measure_like.map((field) => {
      return field.name
    });

    let dimension_fields = queryResponse.fields.dimension_like.map((field) => {
      return field.name
    });

    let fields = dimension_fields.concat(measure_fields);

    let existingStyleRef = document.getElementById("freeformStyle");
    if (existingStyleRef) existingStyleRef.remove();

    var styleEl = document.createElement('style');
    styleEl.setAttribute('type', "text/css");
    styleEl.setAttribute('id', "freeformStyle");
    styleEl.innerHTML = config.styles_freeform;

    document.head.appendChild(styleEl);

    let html_with_data = config.html_freeform || '';
    fields.forEach((field,i) => {
      html_with_data = html_with_data.replace(`~${i+1}`, data[0][field]["value"])
    });

    element.innerHTML = html_with_data;
    doneRendering();
  }
});
